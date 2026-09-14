export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-8 animate-pulse">
      <div className="space-y-3 max-w-xl">
        <div className="h-4 w-28 bg-stone-200 rounded-full" />
        <div className="h-9 w-2/3 bg-stone-200 rounded-2xl" />
      </div>

      {/* Featured post skeleton */}
      <div className="h-80 bg-stone-200 rounded-3xl w-full" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100 space-y-3 pb-4">
            <div className="h-44 bg-stone-200 w-full" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-24 bg-stone-200 rounded" />
              <div className="h-5 w-full bg-stone-200 rounded" />
              <div className="h-4 w-4/5 bg-stone-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
