import React, { ReactNode, ErrorInfo } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  autoRetried: boolean;
}

// Typed Component base for React 19 without explicit @types/react package
const BaseComponent = (React.Component || class {}) as unknown as new (props: Props) => {
  props: Props;
  state: State;
  setState(updater: Partial<State> | ((prevState: State) => Partial<State>), callback?: () => void): void;
};

export default class ErrorBoundary extends BaseComponent {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      autoRetried: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, autoRetried: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);

    // If it's a dynamic module import failure, attempt one immediate auto-recovery
    const isChunkError = 
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to fetch') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError && !this.state.autoRetried) {
      this.setState({ autoRetried: true }, () => {
        setTimeout(() => {
          this.handleRetry();
        }, 800);
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const isDynamicImport = this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Failed to fetch');

      return (
        <div className="w-full min-h-[320px] flex items-center justify-center p-6 my-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0B1020] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-lg transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              {this.props.fallbackTitle || 'Component Load Notice'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {isDynamicImport 
                ? 'The requested section is updating or taking longer than usual to load. Please click retry to reconnect.' 
                : 'A temporary display issue occurred while rendering this section.'}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Retry Loading
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition cursor-pointer"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
