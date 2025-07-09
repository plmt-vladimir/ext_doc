import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function Textarea({ value, onChange, placeholder, className = "", rows }) {
  const textareaRef = useRef();

  useEffect(() => {
    if (!rows && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value, rows]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={clsx(
        "w-full px-3 py-2 rounded-xl border font-[Roboto] shadow-sm transition duration-200",
        "text-[--color-text] bg-[--color-block] border-[--color-border]",
        "focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary]",
        rows ? "" : "min-h-[6rem] max-h-[20vh]",
        className
      )}
    />
  );
}
