export default function AccountLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 space-y-6 animate-pulse">
      <div className="h-28 bg-stone-200 rounded-3xl w-full" />
      <div className="h-10 w-64 bg-stone-200 rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-stone-100 p-4" />
        ))}
      </div>
    </div>
  );
}
