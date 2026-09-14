export default function PlaceDetailLoading() {
  return (
    <div className="pt-24 min-h-screen bg-stone-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-stone-200 rounded" />

        {/* Hero Banner skeleton */}
        <div className="h-[420px] bg-stone-200 rounded-3xl w-full" />

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-2/3 bg-stone-200 rounded-xl" />
            <div className="h-4 w-full bg-stone-200 rounded" />
            <div className="h-4 w-full bg-stone-200 rounded" />
            <div className="h-4 w-3/4 bg-stone-200 rounded" />

            <div className="h-48 bg-stone-200 rounded-2xl" />
            <div className="h-48 bg-stone-200 rounded-2xl" />
          </div>

          {/* Sidebar Booking Form skeleton */}
          <div className="h-96 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4">
            <div className="h-6 w-1/2 bg-stone-200 rounded" />
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-10 bg-stone-100 rounded-xl" />
            <div className="h-12 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
