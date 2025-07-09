import clsx from "clsx";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
  variant = "default",
  error = false,
  disabled = false,
  icon = null,
}) {
  return (
    <div className={clsx("relative w-full", className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[--color-muted] pointer-events-none">
          {icon}
        </div>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full py-2 px-3 rounded-xl border text-[--color-text] font-[Roboto] shadow-sm transition duration-200 placeholder-[--color-muted]",
          icon && "pl-10",
          disabled && "opacity-50 cursor-not-allowed",
          variant === "default" && "bg-[--color-block] border-[--color-border]",
          variant === "white" && "bg-white border-[--color-border]",
          error
            ? "border-[--color-error] ring-1 ring-[--color-error]"
            : "focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary]",
          inputClassName
        )}
      />
    </div>
  );
}




