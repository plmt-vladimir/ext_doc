import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import GroupBox from "@/components/UI/Groupbox";
import Label from "@/components/UI/Label";
import Tabs from "@/components/UI/Tabs";
import MultiSelectComboBox from "@/components/UI/MultiSelectComboBox";
import { IDInvoiceProvider, useIDInvoice } from "./IDInvoiceContext";
import IDInvoiceDeliveryTab from "./IDInvoiceDeliveryTab";
import IDInvoiceRegistryTab from "./IDInvoiceRegistryTab";

function IDInvoiceCreateContent() {
  const {
    construction, setConstruction,
    object, setObject,
    section, setSection,
    registerPoints, setRegisterPoints,
    selectedAooks, setSelectedAooks,
    status, setStatus,
    includeIGS, setIncludeIGS,
    includeQualityDocs, setIncludeQualityDocs
  } = useIDInvoice();

  const tabs = [
    { label: "Формирование накладной на передачу ИД", component: <IDInvoiceDeliveryTab /> },
    { label: "Формирование реестра ИД", component: <IDInvoiceRegistryTab /> },
  ];

  return (
    <PageWrapper title="Создание накладной на передачу ИД заказчику">
<GroupBox title="Настройка формирования" bordered className="mb-4">
  {/* Первая строка */}
  <div className="grid grid-cols-12 gap-x-2 gap-y-4 mb-4">
    <Label className="col-span-1 text-sm text-[--color-primary] text-right self-center">Стройка</Label>
    <ComboBox
      className="col-span-3"
      placeholder="Стройка"
      options={[]}
      value={construction}
      onChange={setConstruction}
    />

    <Label className="col-span-1 text-sm text-[--color-primary] text-right self-center">Объект</Label>
    <ComboBox
      className="col-span-3"
      placeholder="Объект"
      options={[]}
      value={object}
      onChange={setObject}
    />

    <Label className="col-span-1 text-sm text-[--color-primary] text-right self-center">Участок</Label>
    <ComboBox
      className="col-span-3"
      placeholder="Участок"
      options={[]}
      value={section}
      onChange={setSection}
    />
  </div>

  {/* Вторая строка */}
  <div className="grid grid-cols-12 gap-x-2 gap-y-4 items-center">
    <Label className="col-span-1 text-sm text-right text-[--color-primary]">Пункт(ы) реестра</Label>
    <MultiSelectComboBox
      className="col-span-3"
      placeholder="Пункт(ы) реестра"
      options={[
        { label: "Пункт 1", value: "Пункт 1" },
        { label: "Пункт 2", value: "Пункт 2" },
        { label: "Пункт 3", value: "Пункт 3" }
      ]}
      value={registerPoints}
      onChange={setRegisterPoints}
    />

    <Label className="col-span-1 text-sm text-right text-[--color-primary]">АООК</Label>
    <MultiSelectComboBox
      className="col-span-3"
      placeholder="АООК"
      options={[
        { label: "АООК №1", value: "АООК №1" },
        { label: "АООК №2", value: "АООК №2" },
        { label: "АООК №3", value: "АООК №3" }
      ]}
      value={selectedAooks}
      onChange={setSelectedAooks}
    />

    <div className="col-span-4 flex gap-6">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="include-igs"
          checked={includeIGS}
          onChange={() => setIncludeIGS(!includeIGS)}
        />
        <Label htmlFor="include-igs" className="text-sm text-[--color-primary]">
          ИГС и испытания
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="include-quality"
          checked={includeQualityDocs}
          onChange={() => setIncludeQualityDocs(!includeQualityDocs)}
        />
        <Label htmlFor="include-quality" className="text-sm text-[--color-primary]">
          Документы качества
        </Label>
      </div>
    </div>
  </div>
</GroupBox>




      <Tabs tabs={tabs} />
    </PageWrapper>

  );
}

// Оборачиваем в провайдер
export default function IDInvoiceCreate() {
  return (
    <IDInvoiceProvider>
      <IDInvoiceCreateContent />
    </IDInvoiceProvider>
  );
}
