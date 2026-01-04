
export function LogSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex gap-4 py-1 px-2 -mx-2 rounded">
          {/* Timestamp skeleton */}
          <div className="h-4 w-20 bg-gray-700/30 rounded shrink-0 animate-pulse" />
          
          {/* Level skeleton */}
          <div className="h-4 w-16 bg-gray-700/30 rounded shrink-0 animate-pulse" />
          
          {/* Message skeleton */}
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-700/30 rounded animate-pulse" />
            {index % 3 === 0 && (
              <div className="h-4 w-3/4 bg-gray-700/30 rounded animate-pulse" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}