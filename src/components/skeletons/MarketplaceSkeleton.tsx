import React from 'react';

/**
 * Product Card Skeleton Loader
 * Accurately replicates the dimensions, hierarchy, and UI elements of Envato store cards.
 */
export const MarketplaceProductCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  return (
    <div
      className="bg-white dark:bg-[#0B0F19] rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 p-4.5 flex flex-col justify-between relative overflow-hidden shadow-sm animate-skeleton-pulse"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top Image & Badge Placeholder */}
      <div className="relative w-full h-48 rounded-[18px] bg-slate-100 dark:bg-slate-850/80 skeleton-shimmer overflow-hidden mb-4">
        {/* Top Badges Skeleton */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700/80 rounded-full" />
          <div className="h-5 w-12 bg-slate-200/80 dark:bg-slate-700/60 rounded-full" />
        </div>
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-200/90 dark:bg-slate-700/80" />
      </div>

      {/* Product Content Details */}
      <div className="space-y-3 flex-1 text-left">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-md skeleton-shimmer" />
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-750" />
            <div className="h-3.5 w-8 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Title Lines */}
        <div className="space-y-1.5">
          <div className="h-5 w-11/12 bg-slate-200 dark:bg-slate-800 rounded-lg skeleton-shimmer" />
          <div className="h-5 w-3/4 bg-slate-150 dark:bg-slate-850 rounded-lg skeleton-shimmer" />
        </div>

        {/* Short Description */}
        <div className="space-y-1 pt-0.5">
          <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-850 rounded skeleton-shimmer" />
          <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-slate-850 rounded skeleton-shimmer" />
        </div>

        {/* Feature Pills Placeholder */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800/80 rounded-md skeleton-shimmer" />
          <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800/80 rounded-md skeleton-shimmer" />
          <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800/80 rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Bottom Pricing & Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Price Tag */}
        <div className="space-y-1">
          <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-750 rounded-md skeleton-shimmer" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
          <div className="h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-750 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of Product Card Skeletons
 */
export const MarketplaceGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MarketplaceProductCardSkeleton key={`mkt-card-skel-${index}`} index={index} />
      ))}
    </div>
  );
};

/**
 * Category Hero Banner Skeleton
 */
export const MarketplaceHeroSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden">
      <div className="p-8 md:p-12 rounded-[32px] bg-slate-900/90 border border-slate-800 text-left space-y-4 relative overflow-hidden skeleton-shimmer">
        <div className="flex items-center gap-2">
          <div className="h-5 w-36 bg-slate-800 rounded-full" />
          <div className="h-5 w-20 bg-slate-800 rounded-full" />
        </div>
        <div className="h-10 sm:h-12 w-3/4 max-w-xl bg-slate-800/90 rounded-2xl" />
        <div className="space-y-2 max-w-2xl">
          <div className="h-4 w-full bg-slate-800/60 rounded" />
          <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Sidebar Filters Console Skeleton
 */
export const MarketplaceFiltersSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 text-left animate-skeleton-pulse">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>

      {/* Categories List Skeleton */}
      <div className="space-y-2.5">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`cat-skel-${i}`} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded skeleton-shimmer" />
            </div>
            <div className="h-4 w-6 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>

      {/* Price Range Slider Skeleton */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Badge Filters Skeleton */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`badge-skel-${i}`} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Full Marketplace Skeleton Screen
 */
export const MarketplaceFullSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen pb-16">
      {/* Category Hero Banner */}
      <MarketplaceHeroSkeleton />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="col-span-1 lg:col-span-3 hidden lg:block">
          <MarketplaceFiltersSkeleton />
        </div>

        {/* Right Product Grid Column */}
        <div className="col-span-1 lg:col-span-9 space-y-6">
          {/* Top Search & Toolbar Skeleton */}
          <div className="p-4 bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-14 w-full rounded-[14px] bg-slate-100 dark:bg-[#111827] skeleton-shimmer" />
              <div className="h-14 w-full md:w-56 rounded-[14px] bg-slate-100 dark:bg-[#111827] skeleton-shimmer shrink-0" />
            </div>
          </div>

          {/* Cards Grid */}
          <MarketplaceGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
};
