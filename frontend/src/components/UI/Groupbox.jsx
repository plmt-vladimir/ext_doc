import clsx from "clsx";

export default function GroupBox({
  title,
  icon,
  children,
  variant = "default", // default | white | transparent
  bordered = false,
  className = "",
}) {
  const variants = {
    default: "bg-[--color-background]",
    white: "bg-white text-black",
    transparent: "bg-transparent",
  };

  return (
    <div
      className={clsx(
        "group-box",
        variants[variant],
        bordered && "border border-[--color-border]",
        className
      )}
    >
      {title && (
        <h4 className="group-box-title">
          {icon && <span className="mr-2 text-xl">{icon}</span>}
          {title}
        </h4>
      )}

      <div>{children}</div>
    </div>
  );
}
