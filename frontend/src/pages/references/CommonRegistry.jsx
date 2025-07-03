import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import TreeView from "@/components/widgets/TreeView";

export default function CommonRegistry() {
  const [selectedObject, setSelectedObject] = useState(null);

  const objects = [
    { label: "Объект 1", value: 1 },
    { label: "Объект 2", value: 2 }
  ];

  const registryData = [
    {
      id: 1,
      label: "Раздел 1",
      children: [
        {
          id: 2,
          label: "Подраздел 1.1"
        },
        {
          id: 3,
          label: "Подраздел 1.2"
        }
      ]
    },
    {
      id: 4,
      label: "Раздел 2",
      children: [
        {
          id: 5,
          label: "Подраздел 2.1"
        }
      ]
    }
  ];

  return (
    <PageWrapper title="Общий реестр (по объектам)">
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Выбор объекта</h3>
        <div className="grid grid-cols-3 gap-4">
          <ComboBox
            placeholder="Выберите объект"
            value={selectedObject}
            onChange={setSelectedObject}
            options={objects}
            className="col-span-1"
          />
        </div>
      </div>

      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Реестр</h3>
        <TreeView data={registryData} />
      </div>
    </PageWrapper>
  );
}