import GroupBox from "@/components/UI/Groupbox";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useAOSRCreate } from "./AOSRCreateContext";

const personOptions = [
  { label: "Иванов И.И.", value: "Иванов И.И." },
  { label: "Петров П.П.", value: "Петров П.П." },
  { label: "Сидоров С.С.", value: "Сидоров С.С." },
];

function ResponsiblePersonBlock({ title, value, onChange }) {
  return (
    <GroupBox
      title={<span className="text-sm font-semibold ">{title}</span>}
      bordered
      className="w-full"
    >
      <div className="flex flex-col gap-3 pt-4">
        <ComboBox
          placeholder="Ф.И.О."
          options={personOptions}
          value={value.name}
          onChange={(val) => onChange({ ...value, name: val })}
        />
        <Input
          placeholder="Номер приказа"
          value={value.order}
          onChange={(e) => onChange({ ...value, order: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Дата приказа"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
        />
        <Input
          placeholder="Должность"
          value={value.position}
          onChange={(e) => onChange({ ...value, position: e.target.value })}
        />
        <Input
          placeholder="Организация"
          value={value.organization}
          onChange={(e) => onChange({ ...value, organization: e.target.value })}
        />
      </div>
    </GroupBox>
  );
}

export default function AOSRResponsibleTab() {
  const { responsible, setResponsible } = useAOSRCreate();

  const updateField = (key, value) => {
    setResponsible((prev) => ({ ...prev, [key]: value }));
  };

  // Кнопка "Очистить" — сбрасываем на начальные значения
  const handleClear = () => {
    setResponsible({
      zakazchik: { name: "", order: "", date: "", position: "", organization: "" },
      stroitel: { name: "", order: "", date: "", position: "", organization: "" },
      stroitelKontrol: { name: "", order: "", date: "", position: "", organization: "" },
      proektirovshik: { name: "", order: "", date: "", position: "", organization: "" },
      raboty: { name: "", order: "", date: "", position: "", organization: "" },
      inyeLitsa: { name: "", order: "", date: "", position: "", organization: "" },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <ResponsiblePersonBlock
          title="Представитель заказчика или технического заказчика по вопросам строительного контроля"
          value={responsible.zakazchik}
          onChange={(val) => updateField("zakazchik", val)}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство"
          value={responsible.stroitel}
          onChange={(val) => updateField("stroitel", val)}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство, по вопросам строительного контроля"
          value={responsible.stroitelKontrol}
          onChange={(val) => updateField("stroitelKontrol", val)}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего подготовку проектной документации, в случаях, когда авторский надзор осуществляется"
          value={responsible.proektirovshik}
          onChange={(val) => updateField("proektirovshik", val)}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, выполняющего работы, подлежащие освидетельствованию"
          value={responsible.raboty}
          onChange={(val) => updateField("raboty", val)}
        />
        <ResponsiblePersonBlock
          title="Представитель иных лиц, участвующих в освидетельствовании"
          value={responsible.inyeLitsa}
          onChange={(val) => updateField("inyeLitsa", val)}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={handleClear}>Очистить</Button>
        <Button>Применить</Button>
        <Button>Сформировать АОСР</Button>
      </div>
    </div>
  );
}
