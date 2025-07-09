import { useState, useMemo } from "react";
import Input from "@/components/UI/Input";
import ComboBox from "@/components/UI/ComboBox";
import clsx from "clsx";

export default function FilterableTable({
  columns,
  data,
  className = "",
  tableWidth = "w-full",
  pageSize = 50,
  onRowClick,
}) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleFilterChange = (accessor, value) => {
    setFilters((prev) => ({ ...prev, [accessor]: value }));
    setPage(1);
  };

  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessor);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((col) => {
        if (col.noFilter) return true;
        const filter = filters[col.accessor];
        if (!filter || filter === "") return true;

        const value = row[col.accessor];
        if (value == null) return false;

        if (col.filterType === "select") {
          return String(value).toLowerCase().includes(String(filter).toLowerCase());
        }

        if (col.filterType === "date") {
          const rowDate = new Date(value);
          const filterDate = new Date(filter);
          return col.filterMode === "before"
            ? rowDate <= filterDate
            : rowDate >= filterDate;
        }

        return String(value).toLowerCase().includes(String(filter).toLowerCase());
      })
    );
  }, [filters, data, columns]);

  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal == null || bVal == null) return 0;
      const valA = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const valB = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  return (
    <div className={clsx("overflow-x-auto max-w-full", tableWidth, className)}>
      <table className="min-w-full table-auto border border-[--color-border] rounded-xl overflow-hidden shadow-sm">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(col.accessor)}
                className={clsx(
                  "bg-[rgb(var(--color-primary-rgb),0.08)] text-[rgb(var(--color-primary-rgb))] font-medium px-4 py-2 text-sm cursor-pointer select-none transition",
                  "border-x border-[--color-border] shadow-sm text-center",
                  index === 0 && "first:rounded-tl-xl",
                  index === columns.length - 1 && "last:rounded-tr-xl"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-1">
                    {col.header}
                    {sortBy === col.accessor && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>

                  {/* Фильтры */}
                  {!col.noFilter && col.filterType === "select" && (
                    <ComboBox
                      placeholder="Все"
                      options={[{ label: "Все", value: "" }, ...(col.options || [])]}
                      value={filters[col.accessor] || ""}
                      onChange={(val) => handleFilterChange(col.accessor, val?.value ?? val)}
                      className="w-full"
                      size="sm"
                    />
                  )}

                  {!col.noFilter && col.filterType === "date" && (
                    <Input
                      type="date"
                      value={filters[col.accessor] || ""}
                      onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                      className="w-full text-[--color-text]"
                    />
                  )}

                  {!col.noFilter &&
                    (col.filterType === "text" || col.filterType === undefined) && (
                      <input
                        type="text"
                        placeholder="Фильтр..."
                        value={filters[col.accessor] || ""}
                        onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                        className="p-1 rounded text-sm w-full text-[--color-text] border border-[--color-border] bg-white"
                      />
                    )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-[--color-block]">
          {paginatedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="transition cursor-pointer hover:bg-[rgb(var(--color-secondary-rgb),0.5)]"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className="border-t border-x border-[--color-border] text-[--color-text] text-sm px-4 py-2 text-center break-words max-w-xs whitespace-pre-line"
                >
                  {typeof col.render === "function"
                    ? col.render(row[col.accessor], row, rowIdx)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      {totalPages > 1 && (
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

