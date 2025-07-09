import FilterableTable from "@/components/widgets/FilterableTable";
import Button from "@/components/UI/Button";
import { useIDInvoice } from "./IDInvoiceContext";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

export default function IDInvoiceDeliveryTab() {
  const { deliveryData, setDeliveryData } = useIDInvoice();

  const handleToggle = (index) => {
    setDeliveryData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  return (
    <GroupBox title="Накладная на передачу ИД"  bordered className="mb-4">
      <FilterableTable
        columns={[
          {
            header: "✓",
            accessor: "checked",
            noFilter: true,
            render: (_, row, i) => (
              <input
                type="checkbox"
                checked={row.checked || false}
                onChange={() => handleToggle(i)}
              />
            )
          },
          { header: "№ п/п", accessor: "index", filterType: "text" },
          { header: "№ Акта", accessor: "actNumber", filterType: "text" },
          {
            header: "Наименование актов освидетельствования",
            accessor: "actName",
            filterType: "text"
          },
          {
            header: "Место освидетельствования",
            accessor: "location",
            filterType: "text"
          },
          {
            header: "Время (период)",
            accessor: "period",
            filterType: "text"
          },
          { header: "Примечание", accessor: "note", filterType: "text" }
        ]}
        data={deliveryData}
        pageSize={30}
      />

      <div className="flex justify-end gap-4 mt-4">
        <Button>Сохранить</Button>
        <Button>Сформировать</Button>
      </div>
    </GroupBox>
  );
}
