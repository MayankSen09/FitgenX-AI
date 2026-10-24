import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureAppError } from '../../lib/sentry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    captureAppError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-[400px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">
                System Recovery
              </span>
              <h2 className="text-2xl font-black tracking-tight font-headline">
                Something went wrong
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                An unexpected interface anomaly occurred. You can attempt to reload the view or navigate back to safety.
              </p>
              {this.state.error?.message && (
                <div className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-left text-[11px] font-mono text-zinc-600 dark:text-zinc-300 overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoDashboard}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
