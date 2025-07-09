import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Tabs from "@/components/UI/Tabs";
import GroupBox from "@/components/UI/Groupbox";
import { useAOOK } from "./AOOKContext";
// Вкладки
import AOOKDescriptionTab from "./AOOKDescriptionTab";
import AOOKHiddenWorksTab from "./AOOKHiddenWorksTab";
import AOOKMaterialsTab from "./AOOKMaterialsTab";
import AOOKDocsTab from "./AOOKDocsTab";
import AOOKTestingTab from "./AOOKTestingTab";
import AOOKCommissionTab from "./AOOKCommissionTab";
import AOOKResponsibleTab from "./AOOKResponsibleTab";
import AOOKProjectTab from "./AOOKProjectTab";

export default function AOOKCreateContent() {
  const { state, setSimpleField } = useAOOK();

  const tabs = [
    { label: "Описание конструкций", component: <AOOKDescriptionTab /> },
    { label: "Скрытые работы", component: <AOOKHiddenWorksTab /> },
    { label: "Проект", component: <AOOKProjectTab /> },
    { label: "Материалы", component: <AOOKMaterialsTab /> },
    { label: "Исполнительная документация", component: <AOOKDocsTab /> },
    { label: "Испытания", component: <AOOKTestingTab /> },
    { label: "Выводы комиссии", component: <AOOKCommissionTab /> },
    { label: "Ответственные лица", component: <AOOKResponsibleTab /> },
  ];

  return (
    <PageWrapper title="Создание акта АООК">
      <GroupBox bordered className="border border-[--color-border] mb-4" title="Объект">
        {/* Первая строка */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          <ComboBox
            placeholder="Стройка"
            options={[]}
            value={state.construction}
            onChange={val => setSimpleField("construction", val)}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Объект"
            options={[]}
            value={state.object}
            onChange={val => setSimpleField("object", val)}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Участок"
            options={[]}
            value={state.section}
            onChange={val => setSimpleField("section", val)}
            className="col-span-2"
          />
        </div>

        {/* Вторая строка */}
        <div className="grid grid-cols-6 gap-4">
          <Input
            placeholder="№ Акта"
            value={state.actNumber}
            onChange={e => setSimpleField("actNumber", e.target.value)}
            className="col-span-1"
          />
          <Input
            placeholder="Полное наименование акта"
            value={state.actName}
            onChange={e => setSimpleField("actName", e.target.value)}
            className="col-span-4"
          />
          <select
            className="w-full p-2 rounded border border-[--color-border] text-[--color-primary]"
            value={state.actStatus}
            onChange={e => setSimpleField("actStatus", e.target.value)}
          >
            <option value="Черновик">Черновик</option>
            <option value="Подписан">Подписан</option>
            <option value="Отклонён">Отклонён</option>
          </select>
        </div>
      </GroupBox>

      <Tabs tabs={tabs} />

      <div className="flex justify-end mt-6">
        <Button>Сформировать АООК</Button>
      </div>
    </PageWrapper>
  );
}
