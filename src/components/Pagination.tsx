interface PaginationProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  disabled,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginación de partidos">
      <button
        type="button"
        disabled={disabled || page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ← Anterior
      </button>
      <span>
        Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        disabled={disabled || page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente →
      </button>
    </nav>
  );
}
