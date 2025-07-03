import { useAOOK } from "./AOOKContext";
import GroupBox from "@/components/UI/Groupbox";
import Textarea from "@/components/UI/Textarea";
import Button from "@/components/UI/Button";

const DEFAULT_GEO_SCHEMES = [
  { name: "Геосхема 1", checked: true },
  { name: "Геосхема 2", checked: false },
  { name: "Геосхема 3", checked: true },
];

const DEFAULT_INSPECTIONS = [
  { name: "Экспертиза 1", checked: true },
  { name: "Испытание 1", checked: false },
  { name: "Лабораторное исследование 1", checked: false },
];

export default function AOOKDocsTab() {
  const { state, updateField } = useAOOK();
  const docs = state.docs || {};

  // fallback: если пусто — подставить тестовые данные
  const geoSchemes = (docs.geoSchemes && docs.geoSchemes.length > 0) ? docs.geoSchemes : DEFAULT_GEO_SCHEMES;
  const inspections = (docs.inspections && docs.inspections.length > 0) ? docs.inspections : DEFAULT_INSPECTIONS;
  const geoText = docs.geoText || "";
  const inspText = docs.inspText || "";

  const handleToggle = (field, index) => {
    const arr = field === "geoSchemes" ? geoSchemes : inspections;
    const updatedList = arr.map((item, idx) =>
      idx === index ? { ...item, checked: !item.checked } : item
    );
    updateField("docs", { [field]: updatedList });
  };

  const handleClear = (field) => {
    const arr = field === "geoSchemes" ? geoSchemes : inspections;
    const updatedList = arr.map(item => ({ ...item, checked: false }));
    updateField("docs", { [field]: updatedList });
  };

  const handleSelectAll = (field) => {
    const arr = field === "geoSchemes" ? geoSchemes : inspections;
    const updatedList = arr.map(item => ({ ...item, checked: true }));
    updateField("docs", { [field]: updatedList });
  };

  const handleTextChange = (field, value) => {
    updateField("docs", { [field]: value });
  };

  return (
    <div className="flex flex-col text-sm text-[--color-primary]">
      <p className="font-bold mb-6">
        5. Предъявлены документы, подтверждающие соответствие конструкций предъявнным к ним требованиям в том числе:
      </p>
      <div className="grid grid-cols-2 gap-4">
        <GroupBox
          title="а) Исполнительные геодезические схемы положения конструкций"
          className="group-box border border-[--color-border] h-full"
        >
          <div className="h-60 overflow-y-auto border border-[--color-border] rounded mb-2">
            <table className="w-full table-auto">
              <tbody>
                {geoSchemes.map((doc, i) => (
                  <tr key={i} className="border-b border-[--color-border]">
                    <td className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={doc.checked}
                        onChange={() => handleToggle("geoSchemes", i)}
                      />
                    </td>
                    <td className="px-2 py-1">{doc.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Textarea
            placeholder="Представление в документе"
            value={geoText}
            onChange={e => handleTextChange("geoText", e.target.value)}
            rows={4}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button onClick={() => handleClear("geoSchemes")}>Очистить</Button>
            <Button onClick={() => handleSelectAll("geoSchemes")}>Выбрать</Button>
          </div>
        </GroupBox>

        <GroupBox
          title="б) Результаты экспертиз, обследований, лабораторных и иных испытаний..."
          className="group-box border border-[--color-border] h-full"
        >
          <div className="h-60 overflow-y-auto border border-[--color-border] rounded mb-2">
            <table className="w-full table-auto">
              <tbody>
                {inspections.map((doc, i) => (
                  <tr key={i} className="border-b border-[--color-border]">
                    <td className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={doc.checked}
                        onChange={() => handleToggle("inspections", i)}
                      />
                    </td>
                    <td className="px-2 py-1">{doc.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Textarea
            placeholder="Представление в документе"
            value={inspText}
            onChange={e => handleTextChange("inspText", e.target.value)}
            rows={4}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button onClick={() => handleClear("inspections")}>Очистить</Button>
            <Button onClick={() => handleSelectAll("inspections")}>Выбрать</Button>
          </div>
        </GroupBox>
      </div>
    </div>
  );
}


