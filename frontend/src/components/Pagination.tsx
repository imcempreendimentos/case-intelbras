interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagina,
  totalPaginas,
  onPageChange,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const pages = getVisiblePages(pagina, totalPaginas);

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-6"
      aria-label="Paginação"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(pagina - 1)}
        disabled={pagina === 1}
        className="px-3 py-2 text-sm rounded-card border border-light-gray
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-medium-gray">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 text-sm rounded-card border transition-colors ${
              p === pagina
                ? "bg-primary text-white border-primary font-bold"
                : "border-light-gray hover:bg-gray-50 text-dark-gray"
            }`}
            aria-label={`Página ${p}`}
            aria-current={p === pagina ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(pagina + 1)}
        disabled={pagina === totalPaginas}
        className="px-3 py-2 text-sm rounded-card border border-light-gray
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </nav>
  );
}

function getVisiblePages(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}
