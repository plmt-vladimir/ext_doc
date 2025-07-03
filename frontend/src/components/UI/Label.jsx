export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`label block mb-1 text-[--color-primary] text-base font-[Onest] tracking-wide ${className}`}
    >
      {children}
    </label>
  );
}