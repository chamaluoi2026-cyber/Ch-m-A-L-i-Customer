export default function PlacesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-8 animate-pulse">
      {/* Title & subtitle skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="h-4 w-32 bg-stone-200 rounded-full" />
        <div className="h-9 w-3/4 bg-stone-200 rounded-2xl" />
        <div className="h-4 w-full bg-stone-200 rounded-lg" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-stone-200 rounded-xl flex-shrink-0" />
        ))}
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm space-y-4 pb-4">
            <div className="h-52 bg-stone-200 w-full" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-stone-200 rounded-full" />
                <div className="h-4 w-12 bg-stone-200 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-stone-200 rounded-lg" />
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 rounded" />
              <div className="pt-2 flex justify-between items-center border-t border-stone-100">
                <div className="h-5 w-24 bg-stone-200 rounded" />
                <div className="h-8 w-20 bg-stone-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
