import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

export default function ComboBox({
  options,
  label,
  onChange,
  placeholder = "Выберите...",
  className = "",
  size = "md",
  value,
  allowFreeText = false
}) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef();

  const sizeClasses = {
    sm: "text-sm py-1 px-2",
    md: "text-base py-2 px-3"
  };

  const optionSizeClass = size === "sm" ? "text-sm py-1" : "py-2";

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightIndex(0);
  }, [inputValue, options]);

  useEffect(() => {
    if (!value) {
      setInputValue("");
      return;
    }
    if (typeof value === "object" && "label" in value) {
      setInputValue(value.label);
    } else {
      const matched = options.find(opt => opt.value === value);
      setInputValue(matched?.label || "");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (
          allowFreeText &&
          inputValue &&
          (!value || (typeof value === "object" && value.label !== inputValue))
        ) {
          onChange?.({ value: inputValue, label: inputValue });
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, onChange, allowFreeText, value]);

  const handleSelect = (option) => {
    setInputValue(option.label);
    onChange?.(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightIndex]) {
        handleSelect(filteredOptions[highlightIndex]);
      } else if (allowFreeText && inputValue) {
        onChange?.({ value: inputValue, label: inputValue });
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      {label && <label className="text-[--color-primary] mb-1 block">{label}</label>}

      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className={clsx(
          "w-full rounded-xl border border-[--color-border] text-[--color-primary] bg-white font-[Roboto] shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary]",
          sizeClasses[size]
        )}
        onBlur={() => {
          setTimeout(() => {
            if (
              allowFreeText &&
              inputValue &&
              (!value || (typeof value === "object" && value.label !== inputValue))
            ) {
              onChange?.({ value: inputValue, label: inputValue });
            }
            setIsOpen(false);
          }, 150);
        }}
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded border border-[--color-border] bg-white shadow">
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-400 text-sm">Ничего не найдено</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value ?? index}
                className={clsx(
                  "px-3 cursor-pointer text-[--color-primary]",
                  optionSizeClass,
                  index === highlightIndex
                    ? "bg-[--color-secondary]/20"
                    : "hover:bg-[--color-secondary]/10"
                )}
                onMouseDown={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

