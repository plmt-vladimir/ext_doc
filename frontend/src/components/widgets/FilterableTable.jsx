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
  onRowClick
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

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className={clsx("rounded shadow-md overflow-auto", tableWidth, className)}>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="bg-[--color-primary] text-white font-bold border-y border-l last:border-r border-[--color-primary] px-4 py-2 text-center cursor-pointer select-none"
                onClick={() => handleSort(col.accessor)}
              >
                <div className="flex flex-col items-center w-full">
                  <span className="mb-1 flex items-center gap-1">
                    {col.header}
                    {sortBy === col.accessor && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>

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
                      className="text-black w-full"
                    />
                  )}

                  {!col.noFilter &&
                    (col.filterType === "text" || col.filterType === undefined) && (
                      <input
                        type="text"
                        placeholder="Фильтр..."
                        value={filters[col.accessor] || ""}
                        onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                        className="p-1 rounded text-sm w-full text-black"
                      />
                    )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="transition cursor-pointer hover:bg-[--color-secondary]"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className="border-y border-l last:border-r border-[--color-primary] text-[--color-primary] px-4 py-2 text-center break-words max-w-xs"
                >
                  {typeof col.render === "function"
                    ? col.render(row[col.accessor], row, rowIdx) // <-- теперь rowIdx доступен!
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-2 bg-[--color-background] border-t border-[--color-border] text-[--color-primary] text-sm">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2">←</button>
          <span>Страница {page} из {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2">→</button>
        </div>
      )}
    </div>
  );
}
