import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Pencil, Copy, Trash2 } from "lucide-react";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

export default function IDInvoiceList() {
  const [construction, setConstruction] = useState("");
  const [object, setObject] = useState("");
  const [section, setSection] = useState("");

  const [invoices, setInvoices] = useState([
    { id: 1, name: "Накладная №001", type: "Накладная", status: "Черновик" },
    { id: 2, name: "Реестр №002", type: "Реестр", status: "Подписан" }
  ]);

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/idinvoice/create");
  };

  const handleEdit = (item) => {
    navigate(`/idinvoice/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    setInvoices((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleCopy = (item) => {
    const copy = { ...item, id: Date.now(), name: `${item.name} (копия)` };
    setInvoices((prev) => [...prev, copy]);
  };

  const handleStatusChange = (id, value) => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  return (
    <PageWrapper title="Накладные и реестры исполнительной документации">
      <GroupBox title="Список документов" bordered>
        {/* Фильтры: Стройка / Объект / Участок */}
        <div className="grid grid-cols-12 gap-4 items-center mb-4">
          {/* Стройка */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Стройка</Label>
            <ComboBox
              placeholder="Стройка"
              options={[]}
              value={construction}
              onChange={setConstruction}
              className="w-full"
            />
          </div>

          {/* Объект */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Объект</Label>
            <ComboBox
              placeholder="Объект"
              options={[]}
              value={object}
              onChange={setObject}
              className="w-full"
            />
          </div>

          {/* Участок */}
          <div className="col-span-4 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Участок</Label>
            <ComboBox
              placeholder="Участок"
              options={[]}
              value={section}
              onChange={setSection}
              className="w-full"
            />
          </div>
        </div>

        {/* Таблица */}
        <FilterableTable
          columns={[
            { header: "№ Документа", accessor: "id", filterType: "text" },
            { header: "Наименование документа", accessor: "name", filterType: "text" },
            {
              header: "Тип документа",
              accessor: "type",
              filterType: "select",
              options: [
                { label: "Накладная", value: "Накладная" },
                { label: "Реестр", value: "Реестр" }
              ]
            },
            {
              header: "Статус",
              accessor: "status",
              filterType: "select",
              options: [
                { label: "Черновик", value: "Черновик" },
                { label: "Подписан", value: "Подписан" }
              ],
              render: (val, row) => (
                <select
                  className="border border-[--color-border] rounded px-2 py-1 text-sm"
                  value={val}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                >
                  <option value="Черновик">Черновик</option>
                  <option value="Подписан">Подписан</option>
                </select>
              )
            },
            {
              header: "Действия",
              accessor: "actions",
              noFilter: true,
              render: (_, row) => (
                <div className="flex justify-center gap-2 text-[--color-primary]">
                  <Pencil size={18} className="cursor-pointer" onClick={() => handleEdit(row)} />
                  <Copy size={18} className="cursor-pointer" onClick={() => handleCopy(row)} />
                  <Trash2 size={18} className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
                </div>
              )
            }
          ]}
          data={invoices}
        />

        <div className="flex justify-end mt-4">
          <Button onClick={handleAdd}>Добавить</Button>
        </div>
      </GroupBox>

    </PageWrapper>
  );
}