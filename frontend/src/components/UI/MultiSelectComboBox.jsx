import Select from "react-select";

export default function MultiSelectComboBox({
  options = [],
  value = [],
  onChange,
  placeholder = "Выберите...",
  className = "",
}) {
  return (
    <Select
      isMulti
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected) => onChange(selected.map((s) => s.value))}
      placeholder={placeholder}
      className={className}
      classNamePrefix="select"
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-border)",
          borderWidth: "1px",
          borderRadius: "0.75rem",
          backgroundColor: "var(--color-block)",
          boxShadow: state.isFocused ? "0 0 0 2px var(--color-primary)" : "none",
          fontFamily: "Roboto",
          fontSize: "0.875rem",
          padding: "2px",
          minHeight: "38px",
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "var(--color-primary)"
            : isFocused
            ? "var(--color-secondary)"
            : "white",
          color: isSelected || isFocused ? "white" : "var(--color-primary)",
          fontFamily: "Roboto",
          fontSize: "0.875rem",
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "var(--color-secondary)",
          color: "white",
          borderRadius: "0.5rem",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "white",
          fontWeight: 500,
          padding: "0 4px",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "white",
          ":hover": {
            backgroundColor: "var(--color-primary)",
            color: "white",
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--color-muted)",
          fontFamily: "Roboto",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "var(--color-primary)",
          ":hover": { color: "var(--color-secondary)" },
        }),
        indicatorSeparator: () => ({ display: "none" }),
      }}
    />
  );
}
