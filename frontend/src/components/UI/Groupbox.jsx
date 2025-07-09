import clsx from "clsx";

export default function GroupBox({
  title,
  icon,
  children,
  variant = "default", 
  bordered = false,
  className = "",
  titleClassName = "",
  shadow = "shadow-sm", 
}) {
  const variants = {
    default: "bg-[--color-background]",
    white: "bg-white text-[--color-text]",
    transparent: "bg-transparent",
  };

  const titleBgByVariant = {
    default: "bg-[--color-background]",
    white: "bg-white",
    transparent: "bg-white/80",
  };

  return (
    <div
      className={clsx(
        "relative rounded-2xl p-6 mb-6 transition-colors",
        variants[variant],
        bordered && "border border-[--color-border]",
        shadow,
        className
      )}
    >
      {title && (
        <h4
          className={clsx(
            "absolute -top-3 left-4 z-[1] px-2 py-0.5 font-roboto font-bold text-base rounded-md leading-snug",
            titleBgByVariant[variant],
            "text-[--color-primary]",
            "shadow-sm",
            titleClassName
          )}
        >
          {icon && <span className="mr-2 text-xl align-middle">{icon}</span>}
          {title}
        </h4>
      )}

      <div>{children}</div>
    </div>
  );
}



