import { Trash2, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function EditableTable({ columns, data, onChange }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const addedInitialEmptyRow = useRef(false);

  useEffect(() => {
    if (!addedInitialEmptyRow.current && Array.isArray(data)) {
      const lastRow = data[data.length - 1];
      const isEmptyRow = row => columns.every(col => !row?.[col.key]);

      if (!lastRow || !isEmptyRow(lastRow)) {
        const emptyRow = {};
        columns.forEach(col => {
          emptyRow[col.key] = "";
        });
        onChange([...data, emptyRow]);
        addedInitialEmptyRow.current = true;
      }
    }
  }, [columns, data, onChange]);

  const handleUpdate = (rowIndex, key, value) => {
    const updated = [...data];
    updated[rowIndex][key] = value;
    onChange(updated);
  };

  const handleDelete = (rowIndex) => {
    const updated = [...data];
    updated.splice(rowIndex, 1);
    onChange(updated);
    if (selectedRowIndex === rowIndex) setSelectedRowIndex(null);
  };

  const handleInsert = () => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col.key] = "";
    });
    const updated = [...data];
    const insertIndex = selectedRowIndex !== null ? selectedRowIndex + 1 : data.length;
    updated.splice(insertIndex, 0, newRow);
    onChange(updated);
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          className="px-3 py-1 bg-[--color-primary] text-white rounded text-sm"
          onClick={handleInsert}
        >
          + Добавить строку
        </button>
      </div>
      <table className="w-full text-sm border border-[--color-border] bg-white">
        <thead className="bg-[--color-background]">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="p-2 border-b border-[--color-border] text-left text-[--color-primary]"
              >
                {col.label}
              </th>
            ))}
            <th className="p-2 border-b border-[--color-border] text-center text-[--color-primary]">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-100 cursor-pointer ${
                selectedRowIndex === rowIndex ? "bg-[--color-secondary]" : ""
              }`}
              onClick={() => setSelectedRowIndex(rowIndex)}
            >
              {columns.map(col => (
                <td key={col.key} className="p-2 border-b border-[--color-border]">
                  {col.editable !== false ? (
                    <input
                      type="text"
                      value={row[col.key] || ""}
                      onChange={(e) => handleUpdate(rowIndex, col.key, e.target.value)}
                      className="w-full border border-[--color-border] px-2 py-1 rounded text-sm text-[--color-primary]"
                    />
                  ) : (
                    <span className="text-[--color-primary]">{row[col.key]}</span>
                  )}
                </td>
              ))}
              <td className="p-2 border-b border-[--color-border] text-center text-[--color-primary]">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRowIndex(rowIndex);
                      handleInsert();
                    }}
                    title="Добавить строку после"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(rowIndex)}
                    title="Удалить строку"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


