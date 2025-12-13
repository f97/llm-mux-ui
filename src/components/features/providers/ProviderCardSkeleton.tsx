export function ProviderCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-(--border-color) bg-(--bg-card) p-5">
      {/* 1. Header: Logo + Name + Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Logo Skeleton */}
          <div className="h-10 w-10 rounded-lg bg-(--bg-hover) animate-pulse" />
          
          <div className="space-y-2">
            {/* Name Skeleton */}
            <div className="h-4 w-32 bg-(--bg-hover) rounded animate-pulse" />
            {/* Email/Label Skeleton */}
            <div className="h-3 w-24 bg-(--bg-hover) rounded animate-pulse" />
          </div>
        </div>

        {/* Badge Skeleton */}
        <div className="h-6 w-20 rounded-full bg-(--bg-hover) animate-pulse" />
      </div>

      {/* 2. HERO STATS */}
      <div className="mb-6 grid grid-cols-2 gap-8 border-l-2 border-(--border-color) pl-6 ml-2">
        <div>
          <div className="h-3 w-16 bg-(--bg-hover) rounded animate-pulse mb-2" />
          <div className="h-8 w-20 bg-(--bg-hover) rounded animate-pulse" />
        </div>
        <div>
          <div className="h-3 w-16 bg-(--bg-hover) rounded animate-pulse mb-2" />
          <div className="h-8 w-20 bg-(--bg-hover) rounded animate-pulse" />
        </div>
      </div>

      {/* 3. Footer Meta */}
      <div className="mt-auto flex items-center gap-4 border-t border-(--border-color)/50 pt-4">
        <div className="h-3 w-24 bg-(--bg-hover) rounded animate-pulse" />
        <div className="h-3 w-px bg-(--border-color)" />
        <div className="h-3 w-24 bg-(--bg-hover) rounded animate-pulse" />
      </div>

      {/* 4. Action Bar */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex-1 h-9 bg-(--bg-hover) rounded-md animate-pulse" />
        <div className="flex items-center gap-2 pl-2 border-l border-(--border-color)">
          <div className="h-5 w-9 rounded-full bg-(--bg-hover) animate-pulse" />
          <div className="h-8 w-8 rounded bg-(--bg-hover) animate-pulse" />
        </div>
      </div>
    </div>
  )
}
