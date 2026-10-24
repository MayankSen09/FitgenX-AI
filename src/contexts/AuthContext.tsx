import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isConfigured } from '../lib/firebase';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access is temporarily disabled; try again later.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Console.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by browser. Please allow popups.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error?.message || 'Authentication failed. Please check your details and try again.';
  }
}

/**
 * Defines the authentication state and methods available globally
 * through the application context.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isConfigured); // Only loading if Firebase is configured

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        import('../services/gymFirestoreService')
          .then(({ syncUserData }) => syncUserData(firebaseUser.uid))
          .catch((err) => console.warn('Error syncing user data on auth change:', err));
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const ensureAuth = () => {
    if (!auth || !isConfigured) {
      throw new Error('Firebase is not configured. Add valid VITE_FIREBASE_* variables to your .env file.');
    }
    return auth;
  };

  const signInWithGoogle = async () => {
    const authInstance = ensureAuth();
    if (!googleProvider) {
      throw new Error('Google Auth Provider is not initialized.');
    }
    try {
      await signInWithPopup(authInstance, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const authInstance = ensureAuth();
    try {
      await signInWithEmailAndPassword(authInstance, email.trim(), password);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const authInstance = ensureAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(authInstance, email.trim(), password);
      if (displayName?.trim() && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
        setUser({ ...userCredential.user, displayName: displayName.trim() } as User);
      }
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    const authInstance = ensureAuth();
    try {
      await sendPasswordResetEmail(authInstance, email.trim());
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    const authInstance = ensureAuth();
    try {
      await signInAnonymously(authInstance);
    } catch (error) {
      console.error('Guest sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  if (loading) {
    // Show a minimal loading screen while Firebase initializes
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm font-semibold">Initializing FitGenX...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured: isConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signInAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
