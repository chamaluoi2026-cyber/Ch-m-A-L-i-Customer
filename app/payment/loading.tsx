export default function PaymentLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-stone-50 animate-pulse">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6 text-center">
        <div className="size-16 bg-stone-200 rounded-full mx-auto" />
        <div className="h-6 w-48 bg-stone-200 rounded mx-auto" />
        <div className="h-4 w-32 bg-stone-100 rounded mx-auto" />
        <div className="size-52 bg-stone-200 rounded-2xl mx-auto" />
        <div className="h-10 bg-stone-200 rounded-xl w-full" />
      </div>
    </div>
  );
}
