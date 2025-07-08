import { useEffect, useState } from "react";
import GroupBox from "@/components/UI/Groupbox";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import Table from "@/components/widgets/Table";
import { Trash2, Plus } from "lucide-react";
import { useAOSRCreate } from "./AOSRCreateContext";
import api from "@/api/axios";

export default function AOSRMaterialsTab() {
  const { materials, setMaterials, common } = useAOSRCreate();
  const { materials: usedMaterials, qtyState, documentRepresentation } = materials;
  const [allMaterials, setAllMaterials] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchMaterials = async () => {
      if (!common.construction) return setAllMaterials([]);
      setLoading(true);

      try {
        const params = {
          site_id: common.construction,
        };
        if (common.object) params.object_id = common.object;
        if (common.section) params.zone_id = common.section;

        const res = await api.get("/deliveries/available", { params });

        setAllMaterials(
          res.data.map((item) => ({
            id: item.id,
            name: item.material.name,
            type: item.material.type,
            unit: item.material.unit,
            availableQty: item.quantity,
            deliveredMaterialId: item.id,
            deliveryId: item.delivery.id,
            certificates: item.quality_documents.map(doc => ({
              id: doc.id,
              number: doc.number,
              type: doc.type,
              issue_date: doc.issue_date,
              expiry_date: doc.expiry_date,
              file_url: doc.file_url,
            })),
          }))
        );
      } catch (e) {
        setAllMaterials([]);
      }
      setLoading(false);
    };

    fetchMaterials();
    // eslint-disable-next-line
  }, [common.construction, common.object, common.section]);

  function formatDate(date) {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}.${m}.${y}`;
  }

  const isInUsedList = (row) =>
    usedMaterials.some(
      (m) =>
        m.deliveredMaterialId === row.deliveredMaterialId &&
        m.docId === row.docId
    );

  const handleAddFromTable = (row) => {
    const key = row.deliveredMaterialId + ":" + row.docId;
    const qty = qtyState[key];
    if (
      !qty ||
      isNaN(Number(qty)) ||
      Number(qty) <= 0 ||
      Number(qty) > row.availableQty
    )
      return;
    if (isInUsedList(row)) return;

    setMaterials((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          deliveredMaterialId: row.deliveredMaterialId,
          material: row.name,
          qualityDoc: row.certificate,
          qualityDocType: row.quality_doc_type,
          docId: row.docId,
          dateIssued: row.dateIssued,
          qty: qty,
          availableQty: row.availableQty,
          unit: row.unit,
        },
      ],
      qtyState: {
        ...prev.qtyState,
        [key]: "",
      },
    }));
  };

  const handleDelete = (index) => {
    setMaterials((prev) => {
      const newList = [...prev.materials];
      newList.splice(index, 1);
      return { ...prev, materials: newList };
    });
  };

  useEffect(() => {
    setMaterials((prev) => ({
      ...prev,
      documentRepresentation: prev.materials.length
        ? prev.materials
          .map(
            (m) =>
              `${m.material} ${m.qualityDocType} от ${formatDate(m.dateIssued)} (${m.qty} ${m.unit})`
          )
          .join("; ")
        : "",
    }));
  }, [usedMaterials, setMaterials]);

  return (
    <div className="flex flex-col gap-6">
      <GroupBox title="Выбор материалов из списка" bordered>
        <FilterableTable
          loading={loading}
          columns={[
            { header: "Наименование", accessor: "name", filterType: "text" },
            { header: "Тип", accessor: "type", filterType: "text" },
            { header: "Ед.", accessor: "unit", filterType: null },
            {
              header: "Сертификаты",
              accessor: "certificates",
              filterType: null,
              render: (_, row) =>
                row.certificates && row.certificates.length > 0
                  ? (
                    <ul className="space-y-1">
                      {row.certificates.map(doc => (
                        <li key={doc.id}>
                          <a
                            href={`${import.meta.env.VITE_REACT_APP_API_URL}${doc.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-700 hover:text-blue-900 font-medium"
                            title="Открыть документ"
                          >
                            {doc.type} №{doc.number}
                          </a>
                          {" "}от {formatDate(doc.issue_date)}
                          {doc.expiry_date && ` (Годен до ${formatDate(doc.expiry_date)})`}
                        </li>
                      ))}
                    </ul>
                  ) : "—"
            },
            {
              header: "Всего",
              accessor: "availableQty",
              filterType: null,
              render: (_, row) => row.availableQty,
            },
            {
              header: "Количество",
              accessor: "qty",
              filterType: null,
              render: (_, row) => {
                const key = row.deliveredMaterialId + ":" + row.docId;
                return (
                  <input
                    type="number"
                    min="0"
                    max={row.availableQty}
                    step="any"
                    className="border rounded px-2 py-1 w-24"
                    value={qtyState[key] || ""}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val && Number(val) > row.availableQty) val = row.availableQty;
                      setMaterials((prev) => ({
                        ...prev,
                        qtyState: {
                          ...prev.qtyState,
                          [key]: val,
                        },
                      }));
                    }}
                    disabled={isInUsedList(row)}
                    placeholder="Введите"
                  />
                );
              },
            },
            {
              header: "",
              accessor: "actions",
              filterType: null,
              render: (_, row) => {
                const key = row.deliveredMaterialId + ":" + row.docId;
                const qty = qtyState[key];
                const isDisabled =
                  isInUsedList(row) ||
                  !qty ||
                  isNaN(Number(qty)) ||
                  Number(qty) <= 0 ||
                  Number(qty) > row.availableQty;
                return (
                  <button
                    onClick={() => handleAddFromTable(row)}
                    className={`text-[--color-primary] hover:text-[--color-secondary] ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
                    title="Добавить в список"
                    disabled={isDisabled}
                  >
                    <Plus size={16} />
                  </button>
                );
              },
            },
          ]}
          data={allMaterials}
        />
      </GroupBox>

      <GroupBox title="Список применённых материалов" bordered>
        <Table
          headers={["Материал", "Количество", "Ед.", ""]}
          rows={usedMaterials.map((item, idx) => [
            item.material,
            item.qty,
            item.unit,
            <button
              onClick={() => handleDelete(idx)}
              className="text-red-600 hover:text-red-800"
              title="Удалить"
            >
              <Trash2 size={16} />
            </button>,
          ])}
        />
      </GroupBox>
      <div className="flex justify-end gap-4">
        <Button
          onClick={() =>
            setMaterials({
              materials: [],
              qtyState: {},
              documentRepresentation: "",
            })
          }
        >
          Очистить
        </Button>
        <Button>Применить</Button>
      </div>
    </div>
  );
}