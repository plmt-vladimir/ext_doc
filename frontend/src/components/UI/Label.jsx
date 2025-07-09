export default function Label({ htmlFor, children, className = "", weight = "normal" }) {
  const weightClass = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  }[weight] || "font-normal";

  return (
    <label
      htmlFor={htmlFor}
      className={`label block mb-1 text-[--color-primary] text-base ${weightClass} font-[Onest] tracking-wide ${className}`}
    >
      {children}
    </label>
  );
}
