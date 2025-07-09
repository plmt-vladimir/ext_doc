import GroupBox from "@/components/UI/Groupbox";
import FilterableTable from "@/components/widgets/FilterableTable";
import Button from "@/components/UI/Button";
import { useIDInvoice } from "./IDInvoiceContext";

export default function IDInvoiceRegistryTab() {
  const { registryData, setRegistryData } = useIDInvoice();

  const handleToggle = (index) => {
    setRegistryData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  return (
    <GroupBox title="Реестр исполнительной документации"  bordered className="mb-4">
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
          { header: "Дата подписания", accessor: "date", filterType: "text" },
          { header: "Организация", accessor: "organization", filterType: "text" },
          { header: "Кол-во листов", accessor: "pages", filterType: "text" },
          { header: "Кол-во экз.", accessor: "copies", filterType: "text" }
        ]}
        data={registryData}
        pageSize={10}
      />

      <div className="flex justify-end gap-4 mt-4">
        <Button>Сохранить</Button>
        <Button>Сформировать</Button>
      </div>
    </GroupBox>
  );
}
