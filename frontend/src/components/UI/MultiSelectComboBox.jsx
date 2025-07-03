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
        control: (base) => ({
          ...base,
          borderColor: "var(--color-border)",
          borderRadius: "0.5rem",
          backgroundColor: "white",
          fontFamily: "Roboto",
          fontSize: "0.875rem",
        }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "var(--color-secondary)" : "white",
          color: isFocused ? "white" : "var(--color-primary)",
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "var(--color-secondary)",
          color: "white",
        }),
      }}
    />
  );
}