import { useState, useEffect, useRef } from "react";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterableTable from "@/components/widgets/FilterableTable";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { Pencil, Trash2, Upload } from "lucide-react";
import ModalMessage from "@/components/UI/ModalMessage"; 

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[--color-primary]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function SPList() {
  const [standards, setStandards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ code: "", name: "", pdf_url: "" });
  const [uploading, setUploading] = useState(false);

  // Состояния для уведомлений
  const [modalMessage, setModalMessage] = useState({
    open: false,
    mode: "notification",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const fileInput = useRef(null);

  useEffect(() => {
    api.get("/sp/").then(res => setStandards(res.data));
  }, []);

  const handleOpen = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { code: "", name: "", pdf_url: "" });
    setShowModal(true);
  };

  // Сохранить (добавить или обновить)
  const handleSave = async () => {
    try {
      if (editingItem) {
        const res = await api.patch(`/sp/${editingItem.id}`, {
          code: formData.code,
          name: formData.name,
          pdf_url: formData.pdf_url
        });
        setStandards(prev => prev.map(sp => sp.id === res.data.id ? res.data : sp));
      } else {
        const res = await api.post("/sp/", {
          code: formData.code,
          name: formData.name,
          pdf_url: formData.pdf_url
        });
        setStandards(prev => [...prev, res.data]);
      }
      setShowModal(false);
      setModalMessage({
        open: true,
        mode: "notification",
        title: "Успешно",
        message: "Запись сохранена.",
        onCancel: () => setModalMessage(m => ({ ...m, open: false })),
      });
    } catch (e) {
      setModalMessage({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message: "Ошибка при сохранении СП",
        onCancel: () => setModalMessage(m => ({ ...m, open: false })),
      });
    }
  };

  // Удалить СП через подтверждение
  const handleDelete = (item) => {
    setModalMessage({
      open: true,
      mode: "confirmation",
      title: "Удаление СП",
      message: `Удалить СП "${item.code}"?`,
      onConfirm: async () => {
        try {
          await api.delete(`/sp/${item.id}`);
          setStandards(prev => prev.filter(sp => sp.id !== item.id));
          setModalMessage({
            open: true,
            mode: "notification",
            title: "Удалено",
            message: "Запись удалена.",
            onCancel: () => setModalMessage(m => ({ ...m, open: false })),
          });
        } catch {
          setModalMessage({
            open: true,
            mode: "notification",
            title: "Ошибка",
            message: "Ошибка при удалении.",
            onCancel: () => setModalMessage(m => ({ ...m, open: false })),
          });
        }
      },
      onCancel: () => setModalMessage(m => ({ ...m, open: false })),
    });
  };

  // Загрузка PDF-файла
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await api.post("/sp/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(f => ({ ...f, pdf_url: res.data.file_url }));
      setModalMessage({
        open: true,
        mode: "notification",
        title: "Файл загружен",
        message: "PDF успешно загружен.",
        onCancel: () => setModalMessage(m => ({ ...m, open: false })),
      });
    } catch {
      setModalMessage({
        open: true,
        mode: "notification",
        title: "Ошибка загрузки",
        message: "Ошибка загрузки файла.",
        onCancel: () => setModalMessage(m => ({ ...m, open: false })),
      });
    }
    setUploading(false);
  };

  const columns = [
    { header: "Шифр СП", accessor: "code", filterType: "text" },
    { header: "Наименование СП", accessor: "name", filterType: "text" },
    {
      header: "Файл СП",
      accessor: "pdf_url",
      filterType: "text",
      render: (val) => (
        val
          ? (
            <a
              href={`${import.meta.env.VITE_REACT_APP_API_URL}${val}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[--color-primary] underline"
            >{val.split("/").pop()}</a>
          ) : <span className="text-gray-400">Нет файла</span>
      )
    },
    {
      header: "",
      accessor: "actions",
      noFilter: true,
      render: (_, row) => (
        <div className="flex justify-center gap-2 text-[--color-primary]">
          <Pencil className="cursor-pointer" onClick={() => handleOpen(row)} />
          <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
        </div>
      )
    }
  ];

  return (
    <PageWrapper title="Справочник СП">
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Свод правил (СП)</h3>
        <FilterableTable columns={columns} data={standards} />
        <div className="flex justify-end mt-4">
          <Button onClick={() => handleOpen()}>Добавить СП</Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? "Редактировать СП" : "Добавить СП"}
      >
        <div className="grid gap-4">
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">Шифр СП</label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">Наименование СП</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">PDF-файл</label>
            <div className="flex gap-2 items-center">
              <Input
                value={formData.pdf_url ? formData.pdf_url.split("/").pop() : ""}
                readOnly
                className="w-full"
                placeholder="Файл не выбран"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                ref={fileInput}
                style={{ display: "none" }}
              />
              <Button
                onClick={() => fileInput.current.click()}
                disabled={uploading}
                leftIcon={<Upload size={16} />}
                type="button"
              >
                {uploading ? "Загрузка..." : "Загрузить"}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={!formData.code || !formData.name}>Сохранить</Button>
        </div>
      </Modal>

      <ModalMessage
        open={modalMessage.open}
        mode={modalMessage.mode}
        title={modalMessage.title}
        message={modalMessage.message}
        onConfirm={modalMessage.onConfirm}
        onCancel={modalMessage.onCancel}
      />
    </PageWrapper>
  );
}
