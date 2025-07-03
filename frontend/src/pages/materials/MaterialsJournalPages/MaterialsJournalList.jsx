import { useState, useEffect } from "react";
import api from "@/api/axios";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Pencil, Trash2, Copy } from "lucide-react";
import { useMaterialsJournal } from "./MaterialsJournalContext";
import ModalMessage from "@/components/UI/ModalMessage";

export default function MaterialsJournalList() {
  const {
    construction, object, section,
    entries, setEntries
  } = useMaterialsJournal();

  const [modal, setModal] = useState({ open: false, message: "", onConfirm: null });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!construction?.value) {
        setEntries([]);
        return;
      }

      const params = { site_id: construction.value };
      if (object?.value) params.object_id = object.value;
      if (section?.value) params.zone_id = section.value;

      try {
        const res = await api.get("/deliveries", { params });
        const data = res.data.map(delivery => ({
          id: delivery.id,
          supplier: delivery.supplier,
          supplyType: delivery.supply_type,
          recordDate: delivery.record_date,
          recordNumber: delivery.record_number,
          invoiceNumber: delivery.invoice_number,
          invoiceDate: delivery.invoice_date,
          note: delivery.note,
          invoiceFileUrl: delivery.invoice_file_url
        }));

        setEntries(data);
      } catch (err) {
        console.error("Ошибка загрузки deliveries:", err);
      }
    };

    fetchDeliveries();
  }, [construction, object, section]);

  const handleEdit = (row) => {
    // TODO: реализовать редактирование
  };

  const handleDelete = (row) => {
    setModal({
      open: true,
      message: "Вы уверены, что хотите удалить эту поставку?",
      onConfirm: () => confirmDelete(row),
    });
  };

  const confirmDelete = async (row) => {
    setModal({ open: false, message: "", onConfirm: null });
    try {
      await api.delete(`/deliveries/${row.id}`);
      setEntries((prev) => prev.filter((item) => item.id !== row.id));
    } catch (err) {
      setErrorModal({ open: true, message: "Ошибка удаления поставки!" });
    }
  };

  const handleCopy = (row) => {
    const copy = {
      ...row,
      id: Date.now(),
      recordNumber: row.recordNumber + " (копия)"
    };
    setEntries((prev) => [...prev, copy]);
  };

  return (
    <>
      <FilterableTable
        columns={[
          { header: "Поставщик", accessor: "supplier", filterType: "text" },
          { header: "Тип поставки", accessor: "supplyType", filterType: "text" },
          { header: "Дата поставки", accessor: "recordDate", filterType: "date" },
          { header: "Номер поставки", accessor: "recordNumber", filterType: "text" },
          {
            header: "Накладная", accessor: "invoiceNumber", filterType: "text",
            render: (_, row) => (
              row.invoiceFileUrl ? (
                <a href={`${import.meta.env.VITE_REACT_APP_API_URL}${row.invoiceFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {row.invoiceNumber}
                </a>
              ) : row.invoiceNumber
            )
          },
          { header: "Дата накладной", accessor: "invoiceDate", filterType: "date" },
          { header: "Примечание", accessor: "note", filterType: "text" },
          {
            header: "Действия", accessor: "actions", noFilter: true, render: (_, row) => (
              <div className="flex justify-center gap-2 text-[--color-primary]">
                <Pencil className="cursor-pointer" onClick={() => handleEdit(row)} />
                <Copy className="cursor-pointer" onClick={() => handleCopy(row)} />
                <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
              </div>
            )
          }
        ]}
        data={entries}
      />

      {/*  подтверждение */}
      <ModalMessage
        open={modal.open}
        title="Подтверждение удаления"
        message={modal.message}
        mode="confirmation"
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ open: false, message: "", onConfirm: null })}
      />

      {/* ошибка */}
      <ModalMessage
        open={errorModal.open}
        title="Ошибка"
        message={errorModal.message}
        mode="notification"
        onCancel={() => setErrorModal({ open: false, message: "" })}
      />
    </>
  );
}


