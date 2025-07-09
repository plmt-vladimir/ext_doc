import { useState, useMemo } from "react";
import clsx from "clsx";

export default function Table({
  headers = [],
  rows = [],
  onRowClick,
  striped = false,
  centered = true,
  className = "",
  tableWidth = "w-full",
  pageSize,
}) {
  const normalizedHeaders = headers.map((h, i) =>
    typeof h === "string" ? { label: h, accessor: i } : h
  );

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessor);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    const sortFn = (a, b) => {
      const aVal = Array.isArray(a) ? a[sortBy] : a[sortBy];
      const bVal = Array.isArray(b) ? b[sortBy] : b[sortBy];
      if (aVal == null || bVal == null) return 0;
      const valA = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const valB = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    };
    return [...rows].sort(sortFn);
  }, [rows, sortBy, sortDirection]);

  const paginatedRows = useMemo(() => {
    if (!pageSize) return sortedRows;
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  const totalPages = pageSize ? Math.ceil(sortedRows.length / pageSize) : 1;

  return (
    <div className="overflow-x-auto max-w-full">
      <table
        className={clsx(
          "min-w-full table-auto border border-[--color-border] rounded-xl overflow-hidden shadow-sm",
          tableWidth,
          className
        )}
      >
        <thead>
          <tr>
            {normalizedHeaders.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(col.accessor)}
                className={clsx(
                  "bg-[rgb(var(--color-primary-rgb),0.08)] text-[rgb(var(--color-primary-rgb))] font-medium px-4 py-2 text-sm cursor-pointer select-none transition",
                  "border-x border-[--color-border] shadow-sm",
                  centered && "text-center",
                  index === 0 && "first:rounded-tl-xl",
                  index === normalizedHeaders.length - 1 && "last:rounded-tr-xl"
                )}
              >
                <div className="flex items-center justify-center gap-1">
                  {col.label}
                  {sortBy === col.accessor && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[--color-block]">
          {paginatedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={clsx(
                "transition cursor-pointer",
                striped && rowIndex % 2 === 1 && "bg-[--color-background]",
                "hover:bg-[rgb(var(--color-secondary-rgb),0.5)]"
              )}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              {normalizedHeaders.map((col, colIndex) => {
                const cell = Array.isArray(row)
                  ? row[col.accessor]
                  : row[col.accessor];
                return (
                  <td
                    key={colIndex}
                    className={clsx(
                      "text-[--color-text] text-sm px-4 py-2 border-t border-x border-[--color-border]",
                      centered && "text-center",
                      "break-words max-w-xs whitespace-pre-line"
                    )}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {pageSize && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-3 text-[--color-primary] text-sm">
          <button
            className="px-3 py-1 rounded hover:bg-[--color-secondary]/10 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button
            className="px-3 py-1 rounded hover:bg-[--color-secondary]/10 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
} 
