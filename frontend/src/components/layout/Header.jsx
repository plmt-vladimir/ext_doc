import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[--color-background_menu] border-b border-[--color-border] text-[--color-primary] px-4 py-3 shadow-sm">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold whitespace-nowrap">
            Пользователь: {user?.name || "—"}
          </span>
          <span className="italic text-xs whitespace-nowrap">
            Роль: {user?.role || "—"}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1 rounded-md border border-[--color-primary] text-[--color-primary] text-xs hover:bg-[--color-secondary]/10 transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    </header>
  );
}




