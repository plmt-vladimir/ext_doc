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
  pageSize, // ← новый проп для включения пагинации
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
    setPage(1); // сброс при сортировке
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
          "min-w-full table-auto border border-[--color-primary] rounded overflow-hidden shadow-md",
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
                  "bg-[--color-primary] text-white font-bold border border-[--color-primary] px-4 py-2 cursor-pointer select-none",
                  centered && "text-center"
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
        <tbody>
          {paginatedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={clsx(
                "border-b border-[--color-primary] transition cursor-pointer",
                striped && rowIndex % 2 === 1 && "bg-[--color-background]",
                "hover:bg-[--color-secondary]"
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
                      "border border-[--color-primary] text-[--color-primary] px-4 py-2",
                      centered && "text-center",
                      "break-words max-w-xs  whitespace-pre-line"
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

      {/* Пагинация (если включена) */}
      {pageSize && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-2 text-[--color-primary] text-sm">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ←
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            →
          </button>
        </div>
      )}
    </div>
  );
}


