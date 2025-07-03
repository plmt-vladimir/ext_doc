import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const isNearTop = e.clientY <= 60; // если мышь в пределах 40px от верха
      setShowHeader(isNearTop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[--color-background] text-[--color-text]">
      <aside className="w-64 border-r border-[--color-border] flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col relative">
        {/* Появление при наведении в верхнюю область */}
        <div
          className={`transition-all duration-300 z-50 ${
            showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
          }`}
        >
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6 mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


