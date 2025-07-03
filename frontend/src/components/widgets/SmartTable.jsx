// src/components/widgets/SmartTable.jsx

import React, { useState, useMemo } from "react"; // хуки React
import { DataGrid } from "react-data-grid"; // таблица
import clsx from "clsx"; // условные классы
import Button from "@/components/UI/Button"; // кнопки интерфейса
import Input from "@/components/UI/Input"; // инпуты-фильтры

import "react-data-grid/lib/styles.css"; // стили для таблицы

export default function SmartTable({ columns, rows, className = "" }) {
  const [filters, setFilters] = useState({}); // состояние фильтров

  // обработчик изменения фильтра
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // фильтрация строк на основе фильтров
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [filters, rows]);

  // добавление стилизации и фильтров к колонкам
  const styledColumns = columns.map((col) => {
    return {
      ...col,
      headerCellClass: "bg-[--color-primary] text-white font-bold text-sm tracking-wide border border-[--color-border]", // стиль шапки
      cellClass: "text-sm text-[--color-primary] border border-[--color-border]", // стиль ячеек
      headerRenderer: () => (
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold">{col.name}</span> {/* название столбца */}
          {col.key !== "actions" && (
            <Input
              value={filters[col.key] || ""} // текущее значение фильтра
              onChange={(e) => handleFilterChange(col.key, e.target.value)} // изменение фильтра
              placeholder="Фильтр..."
              className="text-black text-sm w-full" // стиль фильтра-инпута
            />
          )}
        </div>
      )
    };
  });

  // настройки высоты строки и заголовка
  const rowHeight = 36;
  const headerHeight = 42;
  const autoHeight = Math.min(filteredRows.length * rowHeight + headerHeight, 500); // вычисление общей высоты

  return (
    <div
      className={clsx(
        "rdg-wrapper border border-[--color-primary] rounded overflow-hidden shadow-sm", // оформление контейнера таблицы
        className
      )}
      style={{ height: autoHeight }} // авто-высота
    >
      <DataGrid
        columns={styledColumns} // колонки с фильтрами
        rows={filteredRows} // отфильтрованные строки
        className="rdg fill-grid text-sm font-[Roboto]" // кастомный шрифт и размер
        rowHeight={rowHeight} // высота строки
        headerRowHeight={headerHeight} // высота заголовка
        style={{
          '--rdg-header-background-color': 'var(--color-primary)', // фон заголовка
          '--rdg-row-background-color': 'var(--color-background)', // фон строк
          '--rdg-row-hover-background-color':'var(--color-secondary)' , // фон строки при наведении
          '--rdg-color': 'var(--color-primary)', // цвет текста строк
          '--rdg-border-color': 'var(--color-border)' // цвет границ
        }}
      />
      {/* Панель управления снизу */}
      <div className="flex justify-end p-2 gap-2 bg-[--color-background] border border-[--color-border]">
        <Button onClick={() => setFilters({})}>Очистить фильтры</Button> {/* сброс фильтров */}
        <Button variant="primary">Экспорт</Button> {/* кнопка экспорт */}
      </div>
    </div>
  );
}