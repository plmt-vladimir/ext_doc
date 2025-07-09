import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Tabs from "@/components/UI/Tabs";
import MaterialsJournalList from "./MaterialsJournalPages/MaterialsJournalList";
import MaterialsReceipt from "./MaterialsJournalPages/MaterialsReceipt";
import { MaterialsJournalProvider, useMaterialsJournal } from "./MaterialsJournalPages/MaterialsJournalContext";
import useCascadeConstruction from "@/hooks/useCascadeConstruction";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

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
      <GroupBox title="Объект" bordered>
        <div className="grid grid-cols-12 gap-x-4 items-center">
          {/* Стройка */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Стройка</Label>
            <ComboBox
              placeholder="Стройка"
              options={sites}
              value={construction}
              onChange={(val) => {
                setConstruction(val);
                setObject(null);
                setSection(null);
              }}
              className="w-full"
            />
          </div>
          {/* Объект */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Объект</Label>
            <ComboBox
              placeholder="Объект"
              options={objects}
              value={object}
              onChange={(val) => {
                setObject(val);
                setSection(null);
              }}
              className="w-full"
            />
          </div>
          {/* Участок */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Участок</Label>
            <ComboBox
              placeholder="Участок"
              options={zones}
              value={section}
              onChange={setSection}
              className="w-full"
            />
          </div>
        </div>
      </GroupBox>
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



