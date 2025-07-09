import { useState } from "react";
import clsx from "clsx";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Панель вкладок */}
      <div className="flex flex-wrap gap-2 border-b border-[--color-border]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={clsx(
              "px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200",
              active === index
                ? "bg-[--color-secondary] text-white shadow-sm"
                : "bg-[--color-background_menu] text-[--color-primary] hover:bg-[--color-secondary]/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент текущей вкладки */}
      <div className="w-full">
        {tabs[active]?.component}
      </div>
    </div>
  );
}
