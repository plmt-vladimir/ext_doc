import { useState } from "react";

export default function CheckableTable({ headers, rows, selected, onToggle, onToggleAll }) {
  const allSelected = selected.length === rows.length && rows.length > 0;

  return (
    <table className="w-full text-sm border border-[--color-border] bg-white">
      <thead className="bg-[--color-background]">
        <tr>
          <th className="p-2 border-b border-[--color-border] w-10">
            <input type="checkbox" checked={allSelected} onChange={onToggleAll} />
          </th>
          {headers.map((header, idx) => (
            <th key={idx} className="p-2 border-b border-[--color-border] text-left text-[--color-primary]">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="p-2 border-b border-[--color-border]">
              <input
                type="checkbox"
                checked={selected.includes(row.id)}
                onChange={() => onToggle(row.id)}
              />
            </td>
            {headers.map((headerKey, idx) => (
              <td key={idx} className="p-2 border-b border-[--color-border] text-[--color-primary]">
                {row[headerKey.toLowerCase()]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}