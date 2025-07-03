import clsx from "clsx";

export default function FormField({
  type = "text",
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  error = false,
  className = "",
  id,
  children,
}) {
  const isCheckbox = type === "checkbox";
  const isRadio = type === "radio";

  const sharedProps = {
    name,
    value,
    checked,
    onChange,
    disabled,
    id,
    type,
    className: clsx(
      isCheckbox && "form-checkbox-custom",
      isRadio && "form-radio",
      error && "ring-1 ring-red-500",
    ),
  };

  return (
    <label
      className={clsx(
        "flex items-center gap-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <input {...sharedProps} />
          {label && (
            <span className="text-sm text-[--color-primary] font-[Roboto]">
              {label}
            </span>
          )}
        </>
      )}
    </label>
  );
}