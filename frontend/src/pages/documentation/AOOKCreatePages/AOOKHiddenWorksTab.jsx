import { useAOOK } from "./AOOKContext";
import FilterableTable from "@/components/widgets/FilterableTable";
import Table from "@/components/widgets/Table";
import Textarea from "@/components/UI/Textarea";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

// Демоданные для allAosr (лучше поместить в initialState контекста, если нужно)
const DEFAULT_ALL_AOSR = [
  {
    id: 1,
    name: "АОСР №1-КЖ1",
    date: "2024-01-01",
    object: "Объект 1",
    section: "Участок A"
  },
  {
    id: 2,
    name: "АОСР №2-КЖ1",
    date: "2024-01-05",
    object: "Объект 1",
    section: "Участок B"
  },
  {
    id: 3,
    name: "АОСР №3-КЖ2",
    date: "2024-02-01",
    object: "Объект 2",
    section: "Участок C"
  }
];

export default function AOOKHiddenWorksTab() {
  const { state, updateField } = useAOOK();
  const hiddenWorks = state.hiddenWorks;

  // Если в контексте пусто — используем дефолт
  const allAosr = hiddenWorks.allAosr?.length
    ? hiddenWorks.allAosr
    : DEFAULT_ALL_AOSR;
  const selectedAosr = hiddenWorks.selectedAosr || [];

  // Добавление в выбранные
  const handleAdd = (item) => {
    if (!selectedAosr.some((el) => el.id === item.id)) {
      updateField("hiddenWorks", {
        selectedAosr: [...selectedAosr, item],
        allAosr
      });
    }
  };

  // Удаление из выбранных
  const handleRemove = (item) => {
    updateField("hiddenWorks", {
      selectedAosr: selectedAosr.filter((el) => el.id !== item.id),
      allAosr
    });
  };

  // Сводка для документа (можно хранить вычисляемо, но если хочешь — можно сохранить в контексте тоже)
  const summaryText = useMemo(
    () => selectedAosr.map((item) => item.name).join("; "),
    [selectedAosr]
  );

  return (
    <div className="flex flex-col gap-4 text-sm text-[--color-primary]">
      {/* Проведённые скрытые работы */}
      <div className="group-box border border-[--color-border]">
        <h3 className="group-box-title mb-4">Проведённые скрытые работы</h3>
        <FilterableTable
          columns={[
            { header: "Наименование АОСР", accessor: "name", filterType: "text" },
            { header: "Дата", accessor: "date", filterType: "date" },
            { header: "Объект", accessor: "object", filterType: "text" },
            { header: "Участок", accessor: "section", filterType: "text" },
            {
              header: "",
              accessor: "actions",
              noFilter: true,
              render: (_, row) => (
                <Plus
                  className="cursor-pointer text-[--color-secondary] hover:text-[--color-primary]"
                  size={18}
                  onClick={() => handleAdd(row)}
                />
              )
            }
          ]}
          data={allAosr}
          pageSize={10}
        />
      </div>

      {/* Работы, оказывающие влияние на безопасность конструкции */}
      <div className="group-box border border-[--color-border]">
        <h3 className="group-box-title mb-4">Работы, оказывающие влияние на безопасность конструкции</h3>
        <Table
          headers={["Наименование АОСР", "Дата", "Объект", "Участок", ""]}
          rows={selectedAosr.map((item) => [
            item.name,
            item.date,
            item.object,
            item.section,
            <Trash2
              size={18}
              className="cursor-pointer text-red-600"
              onClick={() => handleRemove(item)}
            />
          ])}
          pageSize={10}
        />
      </div>

      {/* Итоговое представление */}
      <div>
        <label className="text-sm block mb-2">Представление в документе:</label>
        <Textarea value={summaryText} readOnly rows={4} className="w-full" />
      </div>
    </div>
  );
}
