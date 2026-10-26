import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getFriendlyAuthErrorMessage } from '../contexts/AuthContext';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const {
    user,
    isFirebaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signInAsGuest,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasCompletedOnboarding = Boolean(profile?.name?.trim()) && localStorage.getItem('fitgenx-onboarding-complete') === 'true';

  // If already logged in, redirect inside an effect
  useEffect(() => {
    if (user) {
      navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [user, hasCompletedOnboarding, navigate]);

  if (user) {
    return null;
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
      } else if (mode === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
        navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your email address to receive a password reset link.');
          setLoading(false);
          return;
        }
        await sendPasswordReset(email);
        setSuccessMessage('Password reset link sent! Please check your email inbox.');
      }
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await signInWithGoogle();
      navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (isFirebaseConfigured) {
        await signInAsGuest();
      }
      navigate('/onboarding');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center px-6 py-10 selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 vitality-gradient opacity-15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm z-10 flex flex-col">
        {/* Logo & Headline */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 vitality-gradient rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
            <span className="material-symbols-outlined text-white text-3xl">bolt</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-1">FitGenX</h1>
          <p className="text-secondary dark:text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-bold">Your Future in Fitness</p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' ? (
          <div className="flex bg-surface-container-low dark:bg-zinc-900 p-1 rounded-2xl mb-6 border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Sign In
            </button>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Reset Password</span>
          </div>
        )}

        {/* Configuration Notice if not configured */}
        {!isFirebaseConfigured && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">info</span>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Firebase credentials required. Update <code className="font-mono bg-amber-500/20 px-1 rounded">.env</code> with your Firebase Web App configuration.
            </p>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-sm mt-0.5">check_circle</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Walker"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@fitgenx.app"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-outline block">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-bold text-secondary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-lg pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-10 pr-10 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Form Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Google & Alternative Options */}
        {isFirebaseConfigured && (
          <>
            <div className="my-6 flex items-center justify-center gap-4 w-full">
              <div className="h-px bg-outline-variant/30 flex-1"></div>
              <span className="text-[0.6875rem] font-bold font-label uppercase tracking-widest text-on-surface-variant">
                or
              </span>
              <div className="h-px bg-outline-variant/30 flex-1"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 rounded-2xl py-3.5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">
                Continue with Google
              </span>
            </button>
          </>
        )}

        {/* Guest Mode */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          className="mt-4 w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm hover:bg-surface-container disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-zinc-500 text-lg">person</span>
          <span className="font-bold text-xs text-zinc-600 dark:text-zinc-400">Continue as Guest</span>
        </button>

        <p className="text-center text-[10px] text-zinc-400 mt-6 leading-relaxed">
          By continuing, you agree to FitGenX's<br />
          <span className="text-zinc-500 font-semibold">Terms of Service</span> &{' '}
          <span className="text-zinc-500 font-semibold">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
