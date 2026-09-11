import React from 'react';

/**
 * Metric & Stat Cards Skeleton for Dashboard
 */
export const DashboardMetricsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-skeleton-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`metric-skel-${i}`}
          className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left relative overflow-hidden"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded skeleton-shimmer" />
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 skeleton-shimmer shrink-0" />
          </div>
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-750 rounded-lg skeleton-shimmer mt-2 mb-2" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/80 rounded" />
        </div>
      ))}
    </div>
  );
};

/**
 * Analytics & Revenue Graph Skeleton for Dashboard
 */
export const DashboardAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-6 animate-skeleton-pulse">
      {/* Header with Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-750 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-3.5 w-60 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <div className="h-8 w-16 bg-white dark:bg-slate-800 rounded-lg shadow-xs" />
          <div className="h-8 w-16 bg-transparent rounded-lg" />
          <div className="h-8 w-16 bg-transparent rounded-lg" />
        </div>
      </div>

      {/* Simulated Wave & Chart Graph Area */}
      <div className="h-64 sm:h-72 w-full bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 flex items-end justify-between gap-2 sm:gap-4 relative overflow-hidden skeleton-shimmer">
        {/* Animated Bar Column Skeletons */}
        {[45, 60, 30, 75, 50, 90, 65, 80, 40, 70, 85, 95].map((heightPct, idx) => (
          <div key={`chart-bar-skel-${idx}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div
              className="w-full max-w-[28px] bg-indigo-500/15 dark:bg-cyan-500/15 rounded-t-lg transition-all"
              style={{ height: `${heightPct}%` }}
            />
            <div className="h-2.5 w-full max-w-[20px] bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Footer Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`chart-foot-${i}`} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-750 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Recent Orders Table Skeleton for Dashboard
 */
export const DashboardOrdersTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-5 animate-skeleton-pulse">
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-750 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-3.5 w-52 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>

        {/* Action button skeletons */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
          <div className="h-9 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
          <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-750 skeleton-shimmer" />
        </div>
      </div>

      {/* Filter and Search Bar Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-2">
        <div className="md:col-span-6 h-12 rounded-[14px] bg-slate-100 dark:bg-[#111827] skeleton-shimmer" />
        <div className="md:col-span-3 h-12 rounded-[14px] bg-slate-100 dark:bg-[#111827] skeleton-shimmer" />
        <div className="md:col-span-3 h-12 rounded-[14px] bg-slate-100 dark:bg-[#111827] skeleton-shimmer" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`ord-skel-${i}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 gap-4"
          >
            {/* Invoice & Avatar info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 skeleton-shimmer" />
              <div className="space-y-1.5 min-w-0">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-750 rounded skeleton-shimmer" />
                <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>

            {/* Price Pill & Status Badge */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-750 rounded skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full bg-slate-200/80 dark:bg-slate-800 skeleton-shimmer" />
              <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Active Services & Project Solutions Skeleton
 */
export const DashboardServicesSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-4 animate-skeleton-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-750 rounded-lg skeleton-shimmer" />
        </div>
        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`srv-skel-${i}`} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4.5 w-36 bg-slate-200 dark:bg-slate-750 rounded skeleton-shimmer" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            {/* Progress bar placeholder */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Recent Activity Log Skeleton
 */
export const DashboardRecentActivitySkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-4 animate-skeleton-pulse">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-750 rounded-lg skeleton-shimmer" />
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`act-skel-${i}`} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1 min-w-0">
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-750 rounded skeleton-shimmer" />
                <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Full Dashboard Overview Skeleton Screen
 */
export const DashboardOverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner / User Welcome Skeleton */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 skeleton-shimmer">
        <div className="space-y-2 text-left w-full md:w-auto">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-800/70 rounded" />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="h-10 w-28 bg-slate-800 rounded-xl" />
          <div className="h-10 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* 2. Top Metrics Grid Skeleton */}
      <DashboardMetricsSkeleton count={6} />

      {/* 3. Analytics Chart Skeleton */}
      <DashboardAnalyticsSkeleton />

      {/* 4. Recent Orders Table Skeleton */}
      <DashboardOrdersTableSkeleton rows={4} />

      {/* 5. Services and Activity Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardServicesSkeleton />
        <DashboardRecentActivitySkeleton />
      </div>
    </div>
  );
};
