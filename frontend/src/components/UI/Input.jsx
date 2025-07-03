import clsx from "clsx";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",       // применяется к внешнему div
  inputClassName = "",  // применяется к самому input
  variant = "default",
  error = false,
  disabled = false,
  icon = null,
}) {
  return (
    <div className={clsx("relative w-full", className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
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
          "w-full pl-3 pr-3 py-2 rounded border font-[Roboto] transition",
          {
            "bg-[--color-primary] text-white border-[--color-border]": variant === "default",
            "bg-white text-black border-[--color-border]": variant === "white",
            "pl-10": icon,
            "opacity-50 cursor-not-allowed": disabled,
            "border-red-500 ring-1 ring-red-500": error,
          },
          inputClassName
        )}
      />
    </div>
  );
}
