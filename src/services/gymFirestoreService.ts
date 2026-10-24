import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAppStore, type UserProfile, type WorkoutHistoryEntry, type UserStats } from '../store/useAppStore';

export interface UserFirestoreData {
  stats?: UserStats;
  goal?: string | null;
  workoutHistory?: WorkoutHistoryEntry[];
  profile?: UserProfile | null;
  weeklySchedule?: string[];
  aiChatHistory?: Array<{ role: 'user' | 'model'; content: string }>;
  migratedFromLocalStorage?: boolean;
  updatedAt?: any;
}

/**
 * Get the current authenticated user's UID safely.
 */
export function getCurrentUid(): string | null {
  return auth?.currentUser?.uid || null;
}

/**
 * Migrate localStorage data to Firestore on first login, or load from Firestore.
 * Keeps localStorage as an offline cache.
 */
export async function syncUserData(uid: string): Promise<void> {
  if (!db || !uid) return;

  const userRef = doc(db, 'users', uid);

  try {
    const snap = await getDoc(userRef);

    if (!snap.exists() || !snap.data()?.migratedFromLocalStorage) {
      // First login / unmigrated: read existing localStorage key 'fitgenx-app-state'
      let appState: any = {};

      try {
        const savedApp = localStorage.getItem('fitgenx-app-state');
        if (savedApp) appState = JSON.parse(savedApp);
      } catch (e) {
        console.warn('Failed to parse fitgenx-app-state', e);
      }

      const initialData: UserFirestoreData = {
        stats: appState.stats || { calories: 0, steps: 0, activeMinutes: 0 },
        goal: appState.goal || null,
        workoutHistory: appState.workoutHistory || [],
        profile: appState.profile || null,
        weeklySchedule: appState.weeklySchedule || [
          'push-day',
          'pull-day',
          'leg-day',
          'upper-body-power',
          'full-body-strength',
          'hiit-blast',
          'core-crusher',
        ],
        migratedFromLocalStorage: true,
        updatedAt: serverTimestamp(),
      };

      // If document exists, merge with it; otherwise create
      await setDoc(userRef, initialData, { merge: true });

      // Apply to store
      applyDataToStores(initialData);
    } else {
      // Document exists in Firestore -> Firestore is the source of truth
      const data = snap.data() as UserFirestoreData;
      applyDataToStores(data);

      // Update offline localStorage cache
      updateLocalCache(data);
    }
  } catch (error) {
    console.error('Failed to sync user data with Firestore:', error);
  }
}

/**
 * Apply remote Firestore data to in-memory Zustand store.
 */
function applyDataToStores(data: UserFirestoreData) {
  if (data.stats || data.profile || data.workoutHistory || data.weeklySchedule || data.goal !== undefined) {
    useAppStore.setState((prev) => ({
      stats: data.stats || prev.stats,
      profile: data.profile || prev.profile,
      goal: data.goal !== undefined ? data.goal : prev.goal,
      workoutHistory: data.workoutHistory || prev.workoutHistory,
      weeklySchedule: data.weeklySchedule || prev.weeklySchedule,
    }));
  }
}

/**
 * Refresh local storage cache from Firestore data.
 */
function updateLocalCache(data: UserFirestoreData) {
  try {
    if (data.stats || data.profile || data.workoutHistory || data.weeklySchedule || data.goal !== undefined) {
      localStorage.setItem(
        'fitgenx-app-state',
        JSON.stringify({
          stats: data.stats,
          goal: data.goal,
          workoutHistory: data.workoutHistory,
          profile: data.profile,
          weeklySchedule: data.weeklySchedule,
        })
      );
    }
  } catch (e) {
    // Ignore cache errors
  }
}

/**
 * Save partial updates to Firestore for the authenticated user.
 */
export async function syncFieldToFirestore(fields: Partial<UserFirestoreData>): Promise<void> {
  const uid = getCurrentUid();
  if (!db || !uid) return;

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...fields, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error('Failed to update Firestore field:', error);
  }
}

/**
 * Persist AI Chat history in Firestore, capped at 20 messages.
 */
export async function persistAIChatHistory(
  messages: Array<{ role: 'user' | 'model'; content: string }>
): Promise<void> {
  const uid = getCurrentUid();
  if (!db || !uid) return;

  const capped = messages.slice(-20);
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { aiChatHistory: capped, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error('Failed to persist AI chat history:', error);
  }
}

/**
 * Fetch AI Chat history from Firestore for the current user.
 */
export async function fetchAIChatHistory(): Promise<Array<{ role: 'user' | 'model'; content: string }>> {
  const uid = getCurrentUid();
  if (!db || !uid) return [];

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && Array.isArray(snap.data()?.aiChatHistory)) {
      return snap.data().aiChatHistory;
    }
  } catch (error) {
    console.error('Failed to fetch AI chat history:', error);
  }
  return [];
}

export interface UserExportData {
  exportedAt: string;
  source: 'firestore' | 'localStorage_fallback';
  uid: string;
  profile: UserProfile | null;
  workoutHistory: WorkoutHistoryEntry[];
  weeklySchedule: string[];
  measurements: any;
  hydration: any;
  stats?: UserStats;
}

/**
 * Export user data from Firestore or localStorage fallback.
 * Guaranteed never to return an empty object if user has local or cloud data.
 */
export async function getUserExportData(uid: string): Promise<UserExportData> {
  let firestoreData: UserFirestoreData | null = null;
  if (db && uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        firestoreData = snap.data() as UserFirestoreData;
      }
    } catch (e) {
      console.warn('Error reading Firestore for data export, falling back to local storage:', e);
    }
  }

  const currentStore = useAppStore.getState();
  let localState: any = {};
  try {
    const saved = localStorage.getItem('fitgenx-app-state');
    if (saved) localState = JSON.parse(saved);
  } catch {}

  let measurements: any = (firestoreData as any)?.measurements ?? null;
  if (!measurements) {
    try {
      const localM = localStorage.getItem('fitgenx-measurements');
      if (localM) measurements = JSON.parse(localM);
    } catch {}
  }

  let hydration: any = (firestoreData as any)?.hydration ?? null;
  if (!hydration) {
    try {
      const localH = localStorage.getItem('fitgenx-hydration');
      if (localH) hydration = JSON.parse(localH);
    } catch {}
  }

  const source: 'firestore' | 'localStorage_fallback' = firestoreData ? 'firestore' : 'localStorage_fallback';

  return {
    exportedAt: new Date().toISOString(),
    source,
    uid,
    profile: firestoreData?.profile || currentStore.profile || localState.profile || null,
    workoutHistory: firestoreData?.workoutHistory || currentStore.workoutHistory || localState.workoutHistory || [],
    weeklySchedule: firestoreData?.weeklySchedule || currentStore.weeklySchedule || localState.weeklySchedule || [],
    measurements,
    hydration,
    stats: firestoreData?.stats || currentStore.stats || localState.stats,
  };
}

/**
 * Delete user's Firestore document and associated subcollections.
 */
export async function deleteUserFirestoreData(uid: string): Promise<void> {
  if (!db || !uid) return;
  try {
    // Delete any subcollection docs if present
    const subcollections = ['aiCoach', 'chats', 'workouts', 'logs'];
    for (const sub of subcollections) {
      try {
        const subColRef = collection(db, 'users', uid, sub);
        const snap = await getDocs(subColRef);
        for (const docSnap of snap.docs) {
          await deleteDoc(docSnap.ref);
        }
      } catch {
        // Continue if subcollection does not exist
      }
    }

    // Delete primary user document
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Failed to delete user Firestore data:', error);
    throw error;
  }
}
