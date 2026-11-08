import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Resilient lazy loader that automatically retries dynamic module imports
 * if network fluctuations, Vite dev server recompilations, or container delays occur.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  maxRetries = 3
): LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (retriesLeft: number) => {
        factory()
          .then(resolve)
          .catch((error: any) => {
            const isModuleFetchError =
              error?.message?.includes('dynamically imported module') ||
              error?.message?.includes('Failed to fetch') ||
              error?.name === 'ChunkLoadError';

            console.warn(
              `[lazyWithRetry] Module import failed (${retriesLeft} retries remaining):`,
              error?.message || error
            );

            if (retriesLeft <= 1) {
              // Final failure - hand over to ErrorBoundary
              reject(error);
              return;
            }

            const delay = (maxRetries - retriesLeft + 1) * 600;
            setTimeout(() => {
              attempt(retriesLeft - 1);
            }, delay);
          });
      };

      attempt(maxRetries);
    })
  );
}
