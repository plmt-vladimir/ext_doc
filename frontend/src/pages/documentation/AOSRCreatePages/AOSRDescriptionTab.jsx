import React, { useEffect } from "react";
import Input from "@/components/UI/Input";
import Textarea from "@/components/UI/Textarea";
import FormField from "@/components/UI/FormField";
import ComboBox from "@/components/UI/ComboBox";
import { useAOSRCreate } from "./AOSRCreateContext";

const defaultDescription = {
  startDate: "",
  endDate: "",
  signDate: "",
  codeSection: "",
  axes: "",
  marks: "",
  insertCodeSection: false,
  insertAxes: false,
  insertMarks: false,
  additionalInfo: "",
  worksText: "",
  nextWorksText: "",
  registryCode: "",
  selectors: [
    { enabled: true, value: "" },
    { enabled: true, value: "" },
    { enabled: true, value: "" },
  ],
};

export default function AOSRDescriptionTab() {
  const { description, setDescription } = useAOSRCreate();

  useEffect(() => {
    if (!description.selectors) {
      setDescription((d) => ({
        ...d,
        selectors: [
          { enabled: true, value: "" },
          { enabled: true, value: "" },
          { enabled: true, value: "" },
        ],
      }));
    }
  }, [description.selectors, setDescription]);

  return (
    <div className="flex flex-col gap-6">
      {/* Даты */}
      <div className="grid grid-cols-6 gap-4">
        <div className="flex flex-col col-span-2">
          <label className="text-sm text-[--color-primary]">Дата начала работ:</label>
          <Input
            type="date"
            value={description.startDate}
            onChange={(e) => setDescription((d) => ({ ...d, startDate: e.target.value }))}
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label className="text-sm text-[--color-primary]">Дата окончания работ:</label>
          <Input
            type="date"
            value={description.endDate}
            onChange={(e) => setDescription((d) => ({ ...d, endDate: e.target.value }))}
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label className="text-sm text-[--color-primary]">Дата подписания:</label>
          <Input
            type="date"
            value={description.signDate}
            onChange={(e) => setDescription((d) => ({ ...d, signDate: e.target.value }))}
          />
        </div>
      </div>

      {/* Основной блок: левая и правая колонки */}
      <div className="grid grid-cols-5 gap-4">
        {/* Левая колонка */}
        <div className="col-span-2 flex flex-col gap-3">
          {/* Код участка */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Код участка"
              value={description.codeSection}
              onChange={(e) => setDescription((d) => ({ ...d, codeSection: e.target.value }))}
              className="w-full"
            />
            <FormField
              type="checkbox"
              label="Вставить в название"
              checked={description.insertCodeSection}
              onChange={(e) =>
                setDescription((d) => ({ ...d, insertCodeSection: e.target.checked }))
              }
            />
          </div>

          {/* Оси */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Оси в которых выполнена конструкция"
              value={description.axes}
              onChange={(e) => setDescription((d) => ({ ...d, axes: e.target.value }))}
              className="w-full"
            />
            <FormField
              type="checkbox"
              label="Вставить в название"
              checked={description.insertAxes}
              onChange={(e) =>
                setDescription((d) => ({ ...d, insertAxes: e.target.checked }))
              }
            />
          </div>

          {/* Отметки */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Отметки"
              value={description.marks}
              onChange={(e) => setDescription((d) => ({ ...d, marks: e.target.value }))}
              className="w-full"
            />
            <FormField
              type="checkbox"
              label="Вставить в название"
              checked={description.insertMarks}
              onChange={(e) =>
                setDescription((d) => ({ ...d, insertMarks: e.target.checked }))
              }
            />
          </div>

          {/* Код в АООК + Код реестра */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Код в АООК"
              value={description.selectors?.[2]?.value || ""}
              onChange={(e) =>
                setDescription((d) => ({
                  ...d,
                  selectors: d.selectors.map((s, i) =>
                    i === 2 ? { ...s, value: e.target.value } : s
                  ),
                }))
              }
            />
            <ComboBox
              placeholder="Код реестра"
              options={[
                { label: "РПП-1", value: "РПП-1" },
                { label: "РПП-2", value: "РПП-2" },
                { label: "РПП-3", value: "РПП-3" },
              ]}
              value={description.registryCode}
              onChange={(val) => setDescription((d) => ({ ...d, registryCode: val }))}
            />
          </div>
        </div>

        {/* Правая колонка */}
        <div className="col-span-3">
          <Textarea
            placeholder="Дополнительные сведения"
            value={description.additionalInfo}
            onChange={(e) => setDescription((d) => ({ ...d, additionalInfo: e.target.value }))}
            className="h-full"
          />
        </div>
      </div>

      {/* === Новый блок: две TextArea на всю ширину === */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[--color-primary]">
            К освидетельствованию предъявлены следующие работы:
          </label>
          <Textarea
            placeholder="Опишите предъявляемые работы"
            value={description.worksText}
            onChange={(e) =>
              setDescription((d) => ({ ...d, worksText: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[--color-primary]">Последующие работы:</label>
          <Textarea
            placeholder="Опишите последующие работы"
            value={description.nextWorksText}
            onChange={(e) =>
              setDescription((d) => ({ ...d, nextWorksText: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
}
