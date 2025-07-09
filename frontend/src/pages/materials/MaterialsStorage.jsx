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
      {/* Принятые материалы */}
      <GroupBox title="Принятые материалы" bordered>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <ComboBox placeholder="Группа материалов" options={[]} />
          <ComboBox placeholder="Единицы измерения" options={[]} />
          <ComboBox placeholder="Наименование материала" options={[]} />
          <div className="flex items-end gap-2">
            <label className="text-xs text-[--color-primary] mb-1 block">Дата поступления</label>
            <Input type="date" />
          </div>
        </div>
      </GroupBox>

      {/* Расход на объект */}
      <GroupBox title="Расход на объект" bordered>
        <div className="grid grid-cols-4 gap-4 items-end mb-4">
          <ComboBox placeholder="Объект" options={[]} />
          <Input placeholder="Бригада" />
          <Input placeholder="Количество" />
          <Button onClick={handleAddUsage}>Добавить</Button>
        </div>
      </GroupBox>

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