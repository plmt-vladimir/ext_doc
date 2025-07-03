import clsx from "clsx";

export default function Card({
  title,
  icon,
  children,
  footer,
  onClick,
  className = "",
  variant = "default", // default | white | outline
  width = "w-[250px]",
  height = "h-[300px]",
}) {
  const variants = {
    default: "bg-[--color-primary] text-white hover:bg-[--color-secondary]",
    white: "bg-white text-black border border-[--color-border] hover:shadow-md",
    outline: "bg-transparent text-[--color-primary] border border-[--color-border] hover:bg-[--color-primary] hover:text-white",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        width,
        height,
        "rounded-2xl p-4 shadow-lg transition cursor-pointer flex flex-col justify-between",
        variants[variant],
        className
      )}
    >
      {/* Иконка и заголовок */}
      <div className="flex flex-col items-center text-center mb-4">
        {icon && <div className="mb-2 text-3xl">{icon}</div>}
        {title && <h3 className="font-bold text-lg">{title}</h3>}
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>

      {/* Нижняя часть — футер */}
      {footer && <div className="mt-4 text-sm text-center">{footer}</div>}
    </div>
  );
}