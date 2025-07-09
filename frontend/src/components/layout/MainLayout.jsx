import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const isNearTop = e.clientY <= 60;
      setShowHeader(isNearTop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[--color-background] text-[--color-text]">
      <aside className="relative group transition-all duration-300 w-16 hover:w-64 border-r border-[--color-border] flex flex-col bg-[--color-background_menu]">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col relative">
        {/* Появление при наведении в верхнюю область */}
        <div
          className={`transition-all duration-300 z-50 ${showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
            }`}
        >
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6 mt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


