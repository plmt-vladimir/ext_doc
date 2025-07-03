import { useAOOK } from "./AOOKContext";
import ComboBox from "@/components/UI/ComboBox";
import Textarea from "@/components/UI/Textarea";
import Input from "@/components/UI/Input";
import FormField from "@/components/UI/FormField";

export default function AOOKDescriptionTab() {
  const { state, updateField } = useAOOK();
  const description = state.description;

  // Обработчик для чекбоксов и комбобоксов
  const handleChange = (field, value) => {
    updateField("description", { [field]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-sm text-[--color-primary]">
      <div className="grid grid-cols-3 gap-4">
        <Input
          type="date"
          placeholder="Дата начала работ"
          value={description.dateStart}
          onChange={e => handleChange("dateStart", e.target.value)}
        />
        <Input
          type="date"
          placeholder="Дата окончания работ"
          value={description.dateEnd}
          onChange={e => handleChange("dateEnd", e.target.value)}
        />
        <Input
          type="date"
          placeholder="Дата подписания"
          value={description.dateSign}
          onChange={e => handleChange("dateSign", e.target.value)}
        />
      </div>
      <Input
        placeholder="Конструкции принятые к освидетельствованию"
        value={description.constructionsAccepted}
        onChange={e => handleChange("constructionsAccepted", e.target.value)}
      />
      <div className="grid grid-cols-7 gap-4">
        <div className="group-box border border-[--color-border] col-span-2">
          <h3 className="group-box-title mb-4">Проектные данные</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FormField
                type="checkbox"
                label="Вставить в название"
                checked={description.includeProject}
                onChange={e => handleChange("includeProject", e.target.checked)}
              />
              <ComboBox
                placeholder="Основной раздел проекта"
                options={[
                  { label: "КЖ1", value: "КЖ1" },
                  { label: "КЖ2", value: "КЖ2" }
                ]}
                size="sm"
                value={description.projectSection}
                onChange={val => handleChange("projectSection", val)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <FormField
                type="checkbox"
                label="Вставить в название"
                checked={description.includeSection}
                onChange={e => handleChange("includeSection", e.target.checked)}
              />
              <ComboBox
                placeholder="Код участка"
                options={[]}
                size="sm"
                value={description.sectionCode}
                onChange={val => handleChange("sectionCode", val)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <FormField
                type="checkbox"
                label="Вставить в название"
                checked={description.includeAxes}
                onChange={e => handleChange("includeAxes", e.target.checked)}
              />
              <ComboBox
                placeholder="Оси"
                options={[]}
                size="sm"
                value={description.axes}
                onChange={val => handleChange("axes", val)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <FormField
                type="checkbox"
                label="Вставить в название"
                checked={description.includeMarks}
                onChange={e => handleChange("includeMarks", e.target.checked)}
              />
              <ComboBox
                placeholder="Отметки"
                options={[]}
                size="sm"
                value={description.marks}
                onChange={val => handleChange("marks", val)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="group-box border border-[--color-border] col-span-5">
          <h3 className="group-box-title mb-4">Представление</h3>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="К освидетельствованию предъявлены следующие конструкции"
              rows={2}
              className="w-full"
              value={description.constructionItems}
              onChange={e => handleChange("constructionItems", e.target.value)}
            />
            <Textarea
              placeholder="Полное наименование конструкций"
              rows={2}
              className="w-full"
              value={description.fullName}
              onChange={e => handleChange("fullName", e.target.value)}
            />
            <Textarea
              placeholder="Дополнительные сведения"
              rows={2}
              className="w-full"
              value={description.extraInfo}
              onChange={e => handleChange("extraInfo", e.target.value)}
            />
            <Textarea
              placeholder="Последующие работы"
              rows={2}
              className="w-full"
              value={description.nextWorks}
              onChange={e => handleChange("nextWorks", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
