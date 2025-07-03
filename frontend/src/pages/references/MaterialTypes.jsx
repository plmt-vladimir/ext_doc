import { useEffect, useState } from "react";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterableTable from "@/components/widgets/FilterableTable";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { Pencil, Trash2 } from "lucide-react";
import ModalMessage from "@/components/UI/ModalMessage";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[--color-primary]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function MaterialTypes() {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", unit: "" });
  const [modal, setModal] = useState({
    open: false,
    mode: "notification",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/deliveries/material-references");
      setMaterials(res.data);
    } catch (e) {
      setModal({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message: "Не удалось загрузить материалы",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    }
  };

  // Открыть модалку добавления/редактирования
  const handleOpen = async (item = null) => {
    if (item && item.id) {
      // Проверить usage, если редактируем
      try {
        const usage = await api.get(`/deliveries/material-references/${item.id}/usage`);
        if (usage.data.used) {
          setModal({
            open: true,
            mode: "confirmation",
            title: "Материал используется",
            message: "Этот материал уже используется в поставках. Изменения могут повлиять на связанные записи. Продолжить редактирование?",
            onConfirm: () => {
              setEditingItem(item);
              setFormData(item);
              setShowModal(true);
              setModal(m => ({ ...m, open: false }));
            },
            onCancel: () => setModal(m => ({ ...m, open: false })),
          });
          return;
        }
      } catch {}
    }
    setEditingItem(item);
    setFormData(item || { name: "", type: "", unit: "" });
    setShowModal(true);
  };

  // Сохранить (POST/PATCH)
  const handleSave = async () => {
    if (!formData.name || !formData.type || !formData.unit) {
      setModal({
        open: true,
        mode: "notification",
        title: "Внимание",
        message: "Заполните все поля!",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
      return;
    }
    try {
      if (editingItem) {
        // PATCH
        const res = await api.patch(`/deliveries/material-references/${editingItem.id}`, formData);
        setMaterials(prev =>
          prev.map(m => (m.id === editingItem.id ? res.data : m))
        );
      } else {
        // POST
        const res = await api.post("/deliveries/material-references", formData);
        setMaterials(prev => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (e) {
      setModal({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message: "Не удалось сохранить материал",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    }
  };

  // Удалить материал
 const handleDelete = async (item) => {
  try {
    // Проверяем usage
    const usage = await api.get(`/deliveries/material-references/${item.id}/usage`);
    if (usage.data.used) {
      setModal({
        open: true,
        mode: "notification",
        title: "Нельзя удалить",
        message: "Материал задействован в поставках или других актах. Удаление невозможно.",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
      return;
    }
  } catch (e) {
    setModal({
      open: true,
      mode: "notification",
      title: "Ошибка",
      message: "Не удалось проверить использование материала",
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
    return;
  }
  // Если материал не используется, показываем подтверждение удаления
  setModal({
    open: true,
    mode: "confirmation",
    title: "Удаление материала",
    message: `Удалить материал "${item.name}"?`,
    onConfirm: async () => {
      try {
        await api.delete(`/deliveries/material-references/${item.id}`);
        setMaterials(prev => prev.filter(m => m.id !== item.id));
        setModal(m => ({ ...m, open: false }));
      } catch (e) {
        let errMsg = "Не удалось удалить материал";
        if (e?.response?.data?.detail) {
          errMsg = e.response.data.detail;
        }
        setModal({
          open: true,
          mode: "notification",
          title: "Ошибка",
          message: errMsg,
          onCancel: () => setModal(m => ({ ...m, open: false })),
        });
      }
    },
    onCancel: () => setModal(m => ({ ...m, open: false })),
  });
};


  return (
    <PageWrapper title="Справочник материалов">
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Материалы</h3>
        <FilterableTable
          columns={[
            { header: "Наименование", accessor: "name", filterType: "text" },
            { header: "Тип", accessor: "type", filterType: "text" },
            { header: "Ед. измерения", accessor: "unit", filterType: "text" },
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
          ]}
          data={materials}
        />
        <div className="flex justify-end mt-4">
          <Button onClick={() => handleOpen()}>Добавить материал</Button>
        </div>
      </div>

      {/* Модалка добавления/редактирования */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingItem ? "Редактировать материал" : "Добавить материал"}
        >
          <div className="grid gap-4">
            <Input
              placeholder="Введите наименование"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Введите тип"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <Input
              placeholder="Введите единицу измерения"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </Modal>
      )}
      <ModalMessage {...modal} />
    </PageWrapper>
  );
}
