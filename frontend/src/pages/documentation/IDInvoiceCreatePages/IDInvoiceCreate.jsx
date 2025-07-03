import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import Tabs from "@/components/UI/Tabs";
import MultiSelectComboBox from "@/components/UI/MultiSelectComboBox";
import { IDInvoiceProvider, useIDInvoice } from "./IDInvoiceContext";
import IDInvoiceDeliveryTab from "./IDInvoiceDeliveryTab";
import IDInvoiceRegistryTab from "./IDInvoiceRegistryTab";

// Вся логика и интерфейс формы
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
      <div className="group-box border border-[--color-border] mb-4">
        <h3 className="group-box-title mb-4">Настройка формирования</h3>
        <div className="grid grid-cols-8 gap-4 mb-4">
          <ComboBox
            placeholder="Стройка"
            options={[]}
            value={construction}
            onChange={setConstruction}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Объект"
            options={[]}
            value={object}
            onChange={setObject}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Участок"
            options={[]}
            value={section}
            onChange={setSection}
            className="col-span-2"
          />
          <MultiSelectComboBox
            placeholder="Пункт(ы) реестра"
            options={[
              { label: "Пункт 1", value: "Пункт 1" },
              { label: "Пункт 2", value: "Пункт 2" },
              { label: "Пункт 3", value: "Пункт 3" }
            ]}
            value={registerPoints}
            onChange={setRegisterPoints}
            className="col-span-2"
          />
        </div>
        <div className="grid grid-cols-10 gap-4 items-center">
          <label className="col-span-2 flex items-center gap-2 text-[--color-primary]">
            <input type="checkbox" checked={includeIGS} onChange={() => setIncludeIGS(!includeIGS)} />
            ИГС и лабораторные испытания
          </label>
          <label className="col-span-2 flex items-center gap-2 text-[--color-primary]">
            <input type="checkbox" checked={includeQualityDocs} onChange={() => setIncludeQualityDocs(!includeQualityDocs)} />
            Документы качества
          </label>
          <MultiSelectComboBox
            placeholder="АООК"
            options={[
              { label: "АООК №1", value: "АООК №1" },
              { label: "АООК №2", value: "АООК №2" },
              { label: "АООК №3", value: "АООК №3" }
            ]}
            value={selectedAooks}
            onChange={setSelectedAooks}
            className="col-span-3"
          />
          <ComboBox
            placeholder="Статус АОСР"
            options={[
              { label: "Черновик", value: "Черновик" },
              { label: "Подписан", value: "Подписан" },
              { label: "Отклонён", value: "Отклонён" }
            ]}
            value={status}
            onChange={setStatus}
            className="col-span-3"
          />
        </div>
      </div>
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
