import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import { Trash2 } from "lucide-react";
import GroupBox from "@/components/UI/GroupBox";

export default function MaterialsStorage() {
  const [acceptedMaterials, setAcceptedMaterials] = useState([]);
  const [usedMaterials, setUsedMaterials] = useState([]);

  const handleAddUsage = () => {};
  const handleDeleteUsage = (id) => {
    setUsedMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageWrapper title="Оприходование поступивших материалов">
      {/* Расход по объектам */}
      <GroupBox title="Расход по объектам" bordered>
        <Table
          headers={["Объект", "Бригада", "Количество", ""]}
          rows={usedMaterials.map((item) => [
            item.object,
            item.team,
            item.quantity,
            <div className="flex justify-center text-[--color-primary]">
              <Trash2
                className="cursor-pointer text-red-600"
                onClick={() => handleDeleteUsage(item.id)}
              />
            </div>
          ])}
        />
      </GroupBox>

      <div className="flex justify-end">
        <Button>Сохранить</Button>
      </div>
    </PageWrapper>
  );
}