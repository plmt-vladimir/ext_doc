import { useState } from "react";

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
            className={`px-4 py-2 rounded-t text-sm font-semibold transition-colors duration-200 ${
              active === index
                ? "bg-[--color-secondary] text-white"
                : "bg-[--color-background_menu] text-[--color-primary] hover:bg-[--color-secondary]/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент текущей вкладки */}
      <div className="mt-4 w-full">
        {tabs[active]?.component}
      </div>
    </div>
  );
}