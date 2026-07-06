export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true" aria-label="Carregando dispositivos">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-3 w-2/3 rounded mt-3" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
