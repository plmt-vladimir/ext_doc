import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Tabs from "@/components/UI/Tabs";
import MaterialsJournalList from "./MaterialsJournalPages/MaterialsJournalList";
import MaterialsReceipt from "./MaterialsJournalPages/MaterialsReceipt";
import { MaterialsJournalProvider, useMaterialsJournal } from "./MaterialsJournalPages/MaterialsJournalContext";
import useCascadeConstruction from "@/hooks/useCascadeConstruction";

function MaterialsJournalContent() {
  const { construction, setConstruction, object, setObject, section, setSection } = useMaterialsJournal();
  const siteId = construction?.value, objectId = object?.value;
  const { sites, objects, zones } = useCascadeConstruction({ siteId, objectId });
  const tabs = [
    { label: "Поступления материалов", component: <MaterialsJournalList /> },
    { label: "Новое поступление", component: <MaterialsReceipt /> }
  ];

  return (
    <PageWrapper title="Журнал входного контроля материалов">
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Объект</h3>
        <div className="grid grid-cols-6 gap-4">
          <ComboBox placeholder="Стройка" options={sites} value={construction}
            onChange={val => { setConstruction(val); setObject(null); setSection(null); }} className="col-span-2" />
          <ComboBox placeholder="Объект" options={objects} value={object}
            onChange={val => { setObject(val); setSection(null); }} className="col-span-2" />
          <ComboBox placeholder="Участок" options={zones} value={section}
            onChange={setSection} className="col-span-2" />
        </div>
      </div>
      <Tabs tabs={tabs} />
    </PageWrapper>
  );
}

export default function MaterialsJournal() {
  return (
    <MaterialsJournalProvider>
      <MaterialsJournalContent />
    </MaterialsJournalProvider>
  );
}



