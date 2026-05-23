export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-48 skeleton rounded-xl mb-2" />
      <div className="h-4 w-24 skeleton rounded-lg mb-8" />
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-56 shrink-0 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 skeleton rounded-lg" style={{ width: `${60 + (i % 3) * 15}%` }} />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="aspect-square skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-16 skeleton rounded" />
                <div className="h-4 skeleton rounded" />
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-5 w-24 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
