import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[--color-primary] text-white px-4 py-2 shadow">
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="font-semibold">Пользователь: {user?.name || "—"}</span>{" "}
          <span className="italic ml-2">Роль: {user?.role || "—"}</span>
        </div>

        <button
          onClick={logout}
          className="text-white border border-white rounded px-3 py-1 text-xs hover:bg-white hover:text-[--color-primary] transition"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}

