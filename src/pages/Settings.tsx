import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import BottomNav from '../components/layout/BottomNav';
import { useSettingsStore, QUICK_ACTION_OPTIONS } from '../stores/settingsStore';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { getUserExportData, deleteUserFirestoreData } from '../services/gymFirestoreService';

/**
 * Settings component allowing users to customize app preferences,
 * manage account controls, export user data, and delete account.
 */
export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useAppStore();
  const { quickActionPath, setQuickActionPath } = useSettingsStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Account Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleExportData = async () => {
    if (!user) {
      setExportNotice('No active session. Please sign in to export cloud data.');
      return;
    }

    setIsExporting(true);
    setExportNotice(null);

    try {
      const data = await getUserExportData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitgenx-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportNotice(
        data.source === 'firestore'
          ? 'Cloud data exported successfully as JSON.'
          : 'Data exported from local cache (cloud record was not found).'
      );
    } catch (err) {
      console.error('Failed to export user data:', err);
      setExportNotice('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim() !== 'DELETE' || !user) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // 1. Delete Firestore user document and subcollections
      await deleteUserFirestoreData(user.uid);

      // 2. Delete Firebase Auth user
      await deleteUser(user);

      // 3. Clear local storage cache
      localStorage.removeItem('fitgenx-app-state');

      // 4. Reset & Redirect
      setShowDeleteModal(false);
      navigate('/login');
    } catch (err: any) {
      // Secure logging without PII
      console.error('Account deletion error code:', err?.code || 'unknown');

      if (err?.code === 'auth/requires-recent-login') {
        setDeleteError(
          'Security timeout: Re-authentication required before account deletion. Please sign out, log back in, and try deleting your account again.'
        );
      } else {
        setDeleteError(
          'Failed to complete account deletion. Please check your connection or contact support.'
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-[430px] left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center gap-3 px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-300">arrow_back</span>
        </button>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">Settings</h1>
      </header>

      <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto space-y-8">
        
        {/* Quick Action Button Section */}
        <section className="space-y-4">
          <div>
            <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Quick Action Button</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Choose which page the floating button takes you to. This button appears on every screen for fast access.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTION_OPTIONS.map((option) => {
              const isSelected = quickActionPath === option.path;
              return (
                <button
                  key={option.path}
                  onClick={() => setQuickActionPath(option.path)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-md shadow-primary/10'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: isSelected ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      {option.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {option.label}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-lg ml-auto" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Rewards & Marketplace */}
        <section className="space-y-4">
          <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Rewards</h2>
          <button 
            onClick={() => navigate('/store')}
            className="w-full bg-zinc-900 dark:bg-white p-6 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center text-white dark:text-zinc-900">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-zinc-400">Momentum Store</p>
                <p className="text-sm font-bold text-white dark:text-zinc-900">Redeem Points & Discounts</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/30 dark:text-zinc-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </section>

        {/* Athlete Profile & University Details */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Athlete Profile</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Your university affiliation and fitness parameters.
              </p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:underline shrink-0"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Details
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="py-3 first:pt-0 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500 font-medium">College / University</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{profile?.college || 'Not specified'}</p>
              </div>
              <span className="material-symbols-outlined text-zinc-400 text-xl">school</span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Athlete Name</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{profile?.name || user?.displayName || 'Champion'}</p>
              </div>
              <span className="material-symbols-outlined text-zinc-400 text-xl">person</span>
            </div>

            <div className="py-3 last:pb-0 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Primary Focus</p>
                <p className="text-sm font-bold text-secondary mt-0.5">{profile?.focus || 'Gain muscle'}</p>
              </div>
              <span className="material-symbols-outlined text-zinc-400 text-xl">fitness_center</span>
            </div>
          </div>
        </section>

        {/* Account & Privacy Section */}
        <section className="space-y-4">
          <div>
            <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">Account & Privacy</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your session, personal data exports, and cloud account credentials.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
            {/* User Session Info */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {user?.displayName || user?.email || (user?.isAnonymous ? 'Guest Athlete' : 'Signed In')}
                  </p>
                  <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                    {user?.email || (user?.isAnonymous ? 'Anonymous Session' : 'Active Account')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </button>
            </div>

            {/* Export Notice Banner */}
            {exportNotice && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2 text-xs text-primary font-medium">
                <span className="material-symbols-outlined text-base">info</span>
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Export Data Action */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Export My Data</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Download workouts, profile, schedule, and metrics as JSON
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">download</span>
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>

            {/* Delete Account Action */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Delete My Account</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Permanently delete cloud records and authentication
                </p>
              </div>
              <button
                onClick={() => {
                  setDeleteConfirmationText('');
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-base">delete_forever</span>
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* App Info Section */}
        <section className="space-y-3">
          <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-50">About</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">App Version</span>
              <span className="text-sm text-zinc-500">1.0.1</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Build</span>
              <span className="text-sm text-zinc-500">Production</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">AI Backend</span>
              <span className="text-sm text-emerald-500 font-semibold">● Connected</span>
            </div>
          </div>
        </section>

      </main>

      {/* Two-Step Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-headline">
                Delete Account & Data
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                This action is permanent and cannot be undone. All workout history, custom routines,
                and cloud records will be permanently erased.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 leading-snug">
                {deleteError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                To confirm, type <span className="font-mono text-rose-500 font-bold">DELETE</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText.trim() !== 'DELETE' || isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:hover:bg-rose-600 shadow-md shadow-rose-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
