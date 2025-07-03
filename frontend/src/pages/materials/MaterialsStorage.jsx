import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import { Trash2 } from "lucide-react";

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
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">
          Принятые материалы
        </h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <ComboBox placeholder="Группа материалов" options={[]} />
          <ComboBox placeholder="Единицы измерения" options={[]} />
          <ComboBox placeholder="Наименование материала" options={[]} />
          <div className="flex items-end gap-2">
            <label className="text-xs text-[--color-primary] mb-1 block">Дата поступления</label>
            <Input type="date" />
          </div>
        </div>
      </div>

      {/* Расход на объект */}
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">
          Расход на объект
        </h3>
        <div className="grid grid-cols-4 gap-4 items-end mb-4">
          <ComboBox placeholder="Объект" options={[]} />
          <Input placeholder="Бригада" />
          <Input placeholder="Количество" />
          <Button onClick={handleAddUsage}>Добавить</Button>
        </div>
      </div>

      {/* Расход по объектам */}
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">
          Расход по объектам
        </h3>
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
      </div>

      <div className="flex justify-end">
        <Button>Сохранить</Button>
      </div>
    </PageWrapper>
  );
}