import React, { useEffect } from "react";
import Input from "@/components/UI/Input";
import Textarea from "@/components/UI/Textarea";
import FormField from "@/components/UI/FormField";
import ComboBox from "@/components/UI/ComboBox";
import { useAOSRCreate } from "./AOSRCreateContext";
import Label from "@/components/UI/Label";

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

export default function AOSRDescriptionTab({ registryOptions }) {
  const { common, description, setDescription } = useAOSRCreate();

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

  useEffect(() => {
    const { actName } = common;
    const { axes, marks } = description;

    if (!actName && !axes && !marks) return;

    const textParts = [];
    if (actName) textParts.push(`${actName}`);
    if (axes) textParts.push(`выполненные в осях ${axes}`);
    if (marks) textParts.push(`на отметках ${marks}`);

    const worksText = textParts.join(", ") + ".";

    setDescription(d => ({
      ...d,
      worksText
    }));
  }, [common.actName, description.axes, description.marks]);

  return (
    <div className="flex flex-col gap-6">
      {/* Блок дат */}
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

      {/* Блок ввода информации */}
      <div className="grid grid-cols-12 gap-4">
        {/* Левая часть: 7 колонок */}
        <div className="col-span-8 flex flex-col gap-3">
          {/* Код участка */}
          <div className="grid grid-cols-7 items-center gap-2">
            <Label className="col-span-1">Код участка</Label>
            <Input
              className="col-span-4"
              placeholder="Код участка"
              value={description.codeSection}
              onChange={(e) => setDescription((d) => ({ ...d, codeSection: e.target.value }))}
            />
            <FormField
              className="col-span-1"
              type="checkbox"
              label="Вставить в название"
              checked={description.insertCodeSection}
              onChange={(e) => setDescription((d) => ({ ...d, insertCodeSection: e.target.checked }))}
            />
          </div>

          {/* Оси */}
          <div className="grid grid-cols-7 items-center gap-2">
            <Label className="col-span-1">Оси</Label>
            <Input
              className="col-span-4"
              placeholder="Оси в которых выполнена конструкция"
              value={description.axes}
              onChange={(e) => setDescription((d) => ({ ...d, axes: e.target.value }))}
            />
            <FormField
              className="col-span-1"
              type="checkbox"
              label="Вставить в название"
              checked={description.insertAxes}
              onChange={(e) => setDescription((d) => ({ ...d, insertAxes: e.target.checked }))}
            />
          </div>

          {/* Отметки */}
          <div className="grid grid-cols-7 items-center gap-2">
            <Label className="col-span-1">Отметки</Label>
            <Input
              className="col-span-4"
              placeholder="Отметки"
              value={description.marks}
              onChange={(e) => setDescription((d) => ({ ...d, marks: e.target.value }))}
            />
            <FormField
              className="col-span-1"
              type="checkbox"
              label="Вставить в название"
              checked={description.insertMarks}
              onChange={(e) => setDescription((d) => ({ ...d, insertMarks: e.target.checked }))}
            />
          </div>

          {/* Код в АООК и Код реестра */}
          <div className="grid grid-cols-10 items-center gap-2">
            <Label className="col-span-1">Код в АООК</Label>
            <Input
              className="col-span-4"
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
            <Label className="col-span-1">Код реестра</Label>
            <ComboBox
              className="col-span-4"
              placeholder="Код реестра"
              options={registryOptions}
              value={description.registryCode}
              onChange={(val) => setDescription((d) => ({ ...d, registryCode: val }))}
            />
          </div>
        </div>

        <div className="col-span-4 flex flex-col h-full">
          <Label className="mb-1">Дополнительные сведения</Label>
          <Textarea
            className="h-full"
            placeholder="Дополнительные сведения"
            rows={4}
            value={description.additionalInfo}
            onChange={(e) => setDescription((d) => ({ ...d, additionalInfo: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>К освидетельствованию предъявлены следующие работы:</Label>
          <Textarea
            placeholder="..."
            value={description.worksText}
            onChange={(e) => setDescription((d) => ({ ...d, worksText: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Последующие работы:</Label>
          <Textarea
            placeholder="Опишите последующие работы"
            value={description.nextWorksText}
            onChange={(e) => setDescription((d) => ({ ...d, nextWorksText: e.target.value }))}
          />
        </div>
      </div>
    </div>

  );
}
