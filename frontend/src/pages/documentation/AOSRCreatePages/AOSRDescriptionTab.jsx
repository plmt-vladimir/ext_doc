import React, { useEffect } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import FormField from "@/components/UI/FormField";
import Textarea from "@/components/UI/Textarea";
import ComboBox from "@/components/UI/ComboBox";
import { useAOSRCreate } from "./AOSRCreateContext";

// Опции для каждого ComboBox
const comboOptions = [
  [
    { label: "Тип 1", value: "type1" },
    { label: "Тип 2", value: "type2" },
  ],
  [
    { label: "Участок 1", value: "section1" },
    { label: "Участок 2", value: "section2" },
  ],
  [
    { label: "Код в АООК 1", value: "aooc1" },
    { label: "Код в АООК 2", value: "aooc2" },
  ]
];
const comboPlaceholders = [
  "Тип работы",
  "Участок",
  "Код в АООК"
];
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
  works: [],
  nextWorks: [],
  registryCode: "",
  selectors: [
    { enabled: true, value: "" }, // Тип
    { enabled: true, value: "" }, // Участок
    { enabled: true, value: "" }, // Код в АООК
  ],
};

export default function AOSRDescriptionTab() {
  const { description, setDescription } = useAOSRCreate();

  // Гарантируем, что есть селекторы (важно для старых/пустых данных)
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
    // eslint-disable-next-line
  }, []);

  // Работа с чекбоксами около комбобоксов
  const handleSelectorCheckbox = (idx) => (e) => {
    setDescription((d) => ({
      ...d,
      selectors: d.selectors.map((s, i) =>
        i === idx ? { ...s, enabled: e.target.checked } : s
      ),
    }));
  };

  // Работа с ComboBox
  const handleSelectorCombo = (idx) => (val) => {
    setDescription((d) => ({
      ...d,
      selectors: d.selectors.map((s, i) =>
        i === idx ? { ...s, value: val } : s
      ),
    }));
  };

  // Очистка всех полей
  function handleClear() {
    setDescription({ ...defaultDescription });
  }

  return (
    <div className="flex flex-col gap-6">
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
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 flex flex-col gap-3">
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
              onChange={(e) => setDescription((d) => ({ ...d, insertCodeSection: e.target.checked }))}
            />
          </div>
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
              onChange={(e) => setDescription((d) => ({ ...d, insertAxes: e.target.checked }))}
            />
          </div>
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
              onChange={(e) => setDescription((d) => ({ ...d, insertMarks: e.target.checked }))}
            />
          </div>
        </div>
        <div className="col-span-3">
          <Textarea
            placeholder="Дополнительные сведения"
            value={description.additionalInfo}
            onChange={(e) => setDescription((d) => ({ ...d, additionalInfo: e.target.value }))}
            className="col-span-3 h-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[--color-primary] mb-1 block">
            К освидетельствованию предъявлены следующие работы:
          </label>
          <Table
            headers={["", "Наименование работы"]}
            rows={description.works.map((work) => [<input type="checkbox" key={work.id} />, work.name])}
          />
        </div>
        <div>
          <label className="text-sm text-[--color-primary] mb-1 block">
            Последующие работы:
          </label>
          <Table
            headers={["", "Наименование работы"]}
            rows={description.nextWorks.map((work) => [<input type="checkbox" key={work.id} />, work.name])}
          />
        </div>
      </div>

      {/* ---- Селектор работ: чекбокс + комбобокс ---- */}
      <div className="group-box border border-[--color-border]">
        <h3 className="group-box-title mb-2">Селектор работ</h3>
        <div className="grid grid-cols-6 gap-4 items-start">
          <div className="col-span-1 flex flex-col gap-2">
            <Input
              placeholder="Код реестра"
              value={description.registryCode}
              onChange={e => setDescription(d => ({ ...d, registryCode: e.target.value }))}
            />

            {description.selectors &&
              description.selectors.map((sel, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <FormField
                    type="checkbox"
                    checked={!!sel.enabled}
                    onChange={handleSelectorCheckbox(idx)}
                    className="h-4 w-4"
                  />
                  <ComboBox
                    options={comboOptions[idx]}
                    value={sel.value}
                    onChange={val => handleSelectorCombo(idx)(val)}
                    className="w-full"
                    placeholder={comboPlaceholders[idx]}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={handleClear}>
          Очистить
        </Button>
        <Button>Применить</Button>
      </div>
    </div>
  );
}




