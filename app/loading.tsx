export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f4f0e8] px-6">
      <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
        <span className="size-2 animate-pulse rounded-full bg-orange-500" />
        On prépare la table…
      </div>
    </main>
  );
}
