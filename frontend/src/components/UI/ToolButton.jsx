import clsx from "clsx";

export default function ToolButton({
  icon,
  onClick,
  className = "",
  variant = "primary", // primary | white | outline | danger
  size = "md", // sm | md | lg
  tooltip,
  ariaLabel = "tool-button",
  rounded = true,
}) {
  const variantClasses = {
    primary: "bg-[--color-primary] text-white hover:bg-[--color-secondary]",
    white: "bg-white text-black hover:bg-gray-100 border border-[--color-border]",
    outline: "bg-transparent text-[--color-primary] border border-[--color-primary] hover:bg-[--color-primary] hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses = {
    sm: "p-1 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "transition flex items-center justify-center",
        variantClasses[variant],
        sizeClasses[size],
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
    >
      {typeof icon === "string" ? (
        <img src={icon} alt="icon" className="w-5 h-5" />
      ) : (
        icon
      )}
    </button>
  );
}