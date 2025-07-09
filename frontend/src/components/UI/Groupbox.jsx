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
        "relative rounded-2xl p-6 mb-6",
        variants[variant],
        bordered && "border border-[--color-border]",
        className
      )}
    >
      {title && (
        <h4
          className={clsx(
            "absolute top-[-0.75rem] left-4 z-[1] px-2 py-0.5 text-[--color-primary] font-roboto font-bold text-base rounded-md",
            "bg-[--color-background]",
          )}
        >
          {icon && <span className="mr-2 text-xl">{icon}</span>}
          {title}
        </h4>
      )}

      <div>{children}</div>
    </div>
  );
}

