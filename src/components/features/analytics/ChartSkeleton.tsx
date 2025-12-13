export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`${height} w-full flex items-end justify-between gap-2 px-4 pb-4`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-(--bg-hover) rounded-t animate-pulse"
          style={{
            height: `${Math.max(20, Math.random() * 100)}%`,
            opacity: 0.3 + (Math.random() * 0.4)
          }}
        />
      ))}
    </div>
  )
}

export function DonutSkeleton({ size = "h-48" }: { size?: string }) {
  return (
    <div className={`${size} w-full flex items-center justify-center`}>
      <div className="relative size-32 rounded-full border-8 border-(--bg-hover) animate-pulse opacity-50">
         <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-20 rounded-full bg-(--bg-card)" />
         </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 animate-pulse">
           <div className="flex items-center gap-3 w-1/3">
             <div className="size-8 rounded-lg bg-(--bg-hover)" />
             <div className="h-4 w-24 bg-(--bg-hover) rounded" />
           </div>
           <div className="h-4 w-16 bg-(--bg-hover) rounded" />
           <div className="h-4 w-12 bg-(--bg-hover) rounded" />
           <div className="h-4 w-8 bg-(--bg-hover) rounded" />
        </div>
      ))}
    </div>
  )
}
