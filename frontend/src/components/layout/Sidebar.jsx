import { useAuth } from "@/context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  Home, Map, FlaskConical, FileSearch, ClipboardX, FilePlus,
  ClipboardList, Send, Building, Landmark, Boxes,
  List, User, ArrowLeft
} from "lucide-react";
import logo from "../../../resource/images/logo.png";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { label: "Регистрация объекта", path: "/register", icon: Home },
    { label: "Ведение реестра ИГС", path: "/igslist", icon: Map },
    { label: "Испытания", path: "/lab-tests", icon: FlaskConical },
    { label: "Входной контроль", path: "/materialsjournal", icon: FileSearch },
    { label: "Списание материалов", path: "/materialsstorage", icon: ClipboardX },
    { label: "Работа с АОСР", path: "/aosrlist", icon: FilePlus },
    { label: "Работа с АООК", path: "/aooklist", icon: ClipboardList },
    { label: "Передача ИД", path: "/idinvoice", icon: Send },
    { label: "Справочник организаций", path: "/organisations", icon: Building },
    { label: "Справочник СП", path: "/splist", icon: Landmark },
    { label: "Справочник Материалов", path: "/materialtypes", icon: Boxes },
    { label: "Реестры", path: "/commonregistry", icon: List },
    { label: "Личный кабинет", path: "/profile", icon: User },
  ];

  if (user?.role === "Администратор") {
    menuItems.push({ label: "Пользователи", path: "/profile/users", icon: User });
  }

  return (
<aside className="group w-16 hover:w-64 transition-all duration-300 ease-in-out bg-[--color-background_menu] border-r border-[--color-border] flex flex-col justify-between h-screen">
  <div className="relative h-[160px] flex items-center justify-center">
    <img
      src={logo}
      alt="PALMETTO"
      className="w-10 group-hover:w-36 transition-all duration-300"
    />
  </div>

  <div className="flex-1 overflow-auto px-2">
    <nav className="flex flex-col gap-2 pt-2">
      {menuItems.map(({ label, path, icon: Icon }, index) => (
        <NavLink
          key={index}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-1 rounded-md transition-all text-[--color-primary]
            hover:bg-[--color-secondary]
            ${isActive ? "bg-[--color-secondary] text-white font-semibold" : ""}
            group-hover:justify-start justify-center`
          }
          title={label}
        >
          <Icon size={24} className="min-w-[32px]" />
          <span className="hidden group-hover:inline text-sm whitespace-nowrap">{label}</span>
        </NavLink>
      ))}
    </nav>
  </div>
  <div className="p-4">
    <button
      className="flex items-center justify-center group-hover:justify-start gap-2 w-full px-2 py-1 rounded-md text-[--color-primary] hover:bg-[--color-secondary]/10"
    >
      <ArrowLeft size={24} />
      <span className="hidden group-hover:inline text-sm whitespace-nowrap">Назад</span>
    </button>
  </div>
</aside>
  );
}


