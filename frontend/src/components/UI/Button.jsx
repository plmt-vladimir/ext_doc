import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary", // primary | secondary | outline
  size = "md",         // sm | md | lg
  disabled = false,
  loading = false,
}) {
  const baseClasses = "rounded-2xl font-[Onest] border transition text-white";

  const variantClasses = {
    primary: "bg-[--color-primary] border-[--color-border] hover:bg-[--color-secondary]",
    secondary: "bg-[--color-secondary] border-[--color-border] hover:bg-[--color-primary]",
    outline: "bg-transparent border-[--color-primary] text-[--color-primary] hover:bg-[--color-primary] hover:text-white",
  };

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
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading ? "Загрузка..." : children}
    </button>
  );
}