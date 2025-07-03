import { useAOOK } from "./AOOKContext";
import GroupBox from "@/components/UI/Groupbox";
import Textarea from "@/components/UI/Textarea";
import Button from "@/components/UI/Button";

// Дефолтные значения (лучше в initialState контекста, но можно и тут)
const DEFAULT_NORM_DOCS = [
  { name: "СП 70.13330.2012", checked: true },
  { name: "ГОСТ 25100-2011", checked: false },
  { name: "СНиП 3.03.01-87", checked: true }
];

const DEFAULT_PROJECT_DOCS = [
  { name: "22К059-КЖ1", pages: "1-13", org: "ООО ПБ «Линия»", checked: true },
  { name: "22К059-КМ1", pages: "1-15", org: "ООО ПроектСтрой", checked: false },
  { name: "22К059-КМ2", pages: "1-10", org: "ООО Структура", checked: true }
];

export default function AOOKProjectTab() {
  const { state, updateField } = useAOOK();
  const project = state.project;

  const normDocs = project.normDocs?.length ? project.normDocs : DEFAULT_NORM_DOCS;
  const projectDocs = project.projectDocs?.length ? project.projectDocs : DEFAULT_PROJECT_DOCS;

  // Чекбокс для одного документа
  const toggleSingle = (field, list, idx) => {
    const updated = list.map((item, i) =>
      i === idx ? { ...item, checked: !item.checked } : item
    );
    updateField("project", { [field]: updated });
  };

  // Очистить/выбрать все
  const toggleAll = (field, list, value) => {
    const updated = list.map(item => ({ ...item, checked: value }));
    updateField("project", { [field]: updated });
  };

  // Текстовые поля
  const handleTextChange = (field, value) => {
    updateField("project", { [field]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-sm text-[--color-primary]">
      <div className="grid grid-cols-6 gap-4">
        {/* Нормативная документация */}
        <GroupBox title="Нормативная документация" className="col-span-2 group-box border border-[--color-border]">
          <div className="h-60 overflow-y-auto border border-[--color-border] rounded mb-2">
            <table className="w-full table-auto">
              <tbody>
                {normDocs.map((doc, i) => (
                  <tr key={i} className="border-b border-[--color-border]">
                    <td className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={doc.checked}
                        onChange={() => toggleSingle("normDocs", normDocs, i)}
                      />
                    </td>
                    <td className="px-2 py-1">{doc.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={() => toggleAll("normDocs", normDocs, true)}>Выбрать</Button>
            <Button size="sm" onClick={() => toggleAll("normDocs", normDocs, false)}>Очистить</Button>
          </div>
        </GroupBox>

        {/* Проектные документы */}
        <GroupBox title="Выполненные согласно разделам проекта" className="col-span-4 group-box border border-[--color-border]">
          <div className="h-60 overflow-y-auto border border-[--color-border] rounded mb-2">
            <table className="w-full table-auto">
              <thead className="bg-[--color-primary] text-white text-center">
                <tr>
                  <th className="px-2 py-1 w-8">✓</th>
                  <th className="px-2 py-1">Наименование</th>
                  <th className="px-2 py-1">Номера листов</th>
                  <th className="px-2 py-1">Организация</th>
                </tr>
              </thead>
              <tbody>
                {projectDocs.map((doc, i) => (
                  <tr key={i} className="border-b border-[--color-border] text-center">
                    <td>
                      <input
                        type="checkbox"
                        checked={doc.checked}
                        onChange={() => toggleSingle("projectDocs", projectDocs, i)}
                      />
                    </td>
                    <td className="px-2 py-1">{doc.name}</td>
                    <td className="px-2 py-1">{doc.pages}</td>
                    <td className="px-2 py-1">{doc.org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={() => toggleAll("projectDocs", projectDocs, true)}>Выбрать</Button>
            <Button size="sm" onClick={() => toggleAll("projectDocs", projectDocs, false)}>Очистить</Button>
          </div>
        </GroupBox>
      </div>

      {/* Три текстовых поля на одной строке */}
      <div className="grid grid-cols-3 gap-4">
        <Textarea
          placeholder="Ссылка на нормативные документы"
          rows={4}
          value={project.normText || ""}
          onChange={e => handleTextChange("normText", e.target.value)}
        />
        <Textarea
          placeholder="Ссылка на проектные документы"
          rows={4}
          value={project.projectText || ""}
          onChange={e => handleTextChange("projectText", e.target.value)}
        />
        <Textarea
          placeholder="Прочие документы"
          rows={4}
          value={project.otherDocs || ""}
          onChange={e => handleTextChange("otherDocs", e.target.value)}
        />
      </div>

      {/* Представление */}
      <div>
        <label className="text-sm mb-1 block">Представление в документе:</label>
        <Textarea
          placeholder="Представление в документе"
          value={project.summary || ""}
          onChange={e => handleTextChange("summary", e.target.value)}
          rows={4}
          className="w-full"
        />
      </div>
    </div>
  );
}
