import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  size = "md", // sm | md | lg
  disabled = false,
  loading = false,
}) {
  const baseClasses =
    "flex items-center justify-center gap-2 rounded-xl font-[Onest] font-semibold border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--color-primary]";

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        
        "bg-[--color-block] text-[--color-primary] border-[--color-primary] hover:bg-[rgb(var(--color-secondary-rgb),0.9)] shadow-sm",
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading ? "Загрузка..." : children}
    </button>
  );
}


