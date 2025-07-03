import { useAOOK } from "./AOOKContext";
import GroupBox from "@/components/UI/Groupbox";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";

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
          onChange={val => onChange({ ...value, name: val })}
        />
        <Input
          placeholder="Номер приказа"
          value={value.order}
          onChange={e => onChange({ ...value, order: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Дата приказа"
          value={value.date}
          onChange={e => onChange({ ...value, date: e.target.value })}
        />
        <Input
          placeholder="Должность"
          value={value.position}
          onChange={e => onChange({ ...value, position: e.target.value })}
        />
        <Input
          placeholder="Организация"
          value={value.organization}
          onChange={e => onChange({ ...value, organization: e.target.value })}
        />
      </div>
    </GroupBox>
  );
}

export default function AOOKResponsibleTab() {
  const { state, updateDeepField, resetAll } = useAOOK();
  const data = state.responsible;

  // Функция-обёртка для каждого поля
  const getChangeHandler = key => value => {
    updateDeepField("responsible", key, value);
  };

  // Кнопка "Очистить" — если нужно, очищай весь раздел
  const handleClear = () => {
    // Тут можно сбросить только ответственных, не весь state!
    Object.keys(data).forEach(key =>
      updateDeepField("responsible", key, {
        name: "",
        order: "",
        date: "",
        position: "",
        organization: "",
      })
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <ResponsiblePersonBlock
          title="Представитель заказчика или технического заказчика по вопросам строительного контроля"
          value={data.zakazchik}
          onChange={getChangeHandler("zakazchik")}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство"
          value={data.stroitel}
          onChange={getChangeHandler("stroitel")}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство, по вопросам строительного контроля"
          value={data.stroitelKontrol}
          onChange={getChangeHandler("stroitelKontrol")}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего подготовку проектной документации, в случаях, когда авторский надзор осуществляется"
          value={data.proektirovshik}
          onChange={getChangeHandler("proektirovshik")}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, выполняющего работы, подлежащие освидетельствованию"
          value={data.raboty}
          onChange={getChangeHandler("raboty")}
        />
        <ResponsiblePersonBlock
          title="Представитель иных лиц, участвующих в освидетельствовании"
          value={data.inyeLitsa}
          onChange={getChangeHandler("inyeLitsa")}
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
