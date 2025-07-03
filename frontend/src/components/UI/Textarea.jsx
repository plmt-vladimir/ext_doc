import { useEffect, useRef } from "react";

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
      className={`w-full p-2 rounded border border-[--color-border] bg-white text-[--color-primary] resize-y font-[Roboto] ${
        rows ? "" : "min-h-[6rem] max-h-[20vh]"
      } ${className}`}
    />
  );
}