import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterableTable from "@/components/widgets/FilterableTable";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import api from "@/api/axios";
import ModalMessage from "@/components/UI/ModalMessage";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState({
    open: false,
    mode: "notification",
    title: "",
    message: "",
    onCancel: () => setModalMsg(m => ({ ...m, open: false })),
  });

  const roleOptions = [
    { label: "Администратор", value: "Администратор" },
    { label: "Руководитель проекта", value: "Руководитель проекта" },
    { label: "Инженер ПТО", value: "Инженер ПТО" },
    { label: "Начальник участка", value: "Начальник участка" }
  ];

  //Загрузка пользователей
  useEffect(() => {
    setLoading(true);
    api.get("/users/")
      .then(res => setUsers(res.data))
      .catch(() => setModalMsg({
        open: true, title: "Ошибка", message: "Не удалось загрузить пользователей",
        onCancel: () => setModalMsg(m => ({ ...m, open: false }))
      }))
      .finally(() => setLoading(false));
  }, []);

  //Добавление пользователя
  const handleSaveUser = async () => {
    try {
      setLoading(true);
      const res = await api.post("/users/", newUser);
      setUsers(prev => [...prev, res.data]);
      setShowModal(false);
      setNewUser({ name: "", email: "", role: "", password: "" });
    } catch (e) {
      setModalMsg({
        open: true,
        title: "Ошибка",
        message: e?.response?.data?.detail || "Ошибка при добавлении пользователя",
        onCancel: () => setModalMsg(m => ({ ...m, open: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  //Изменение роли пользователя
  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      const res = await api.patch(`/users/${userId}`, { role: newRole });
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, role: res.data.role } : user))
      );
    } catch (e) {
      setModalMsg({
        open: true,
        title: "Ошибка",
        message: e?.response?.data?.detail || "Ошибка смены роли пользователя",
        onCancel: () => setModalMsg(m => ({ ...m, open: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  //Сброс пароля
const handleResetPassword = async (user) => {
  setLoading(true);
  try {
    await api.post(`/users/${user.id}/reset-password`);
    setModalMsg({
      open: true,
      mode: "notification",
      title: "Пароль сброшен",
      message: `Пароль для пользователя "${user.name}" теперь "Password" (попросите сменить на свой).`,
      onCancel: () => setModalMsg(m => ({ ...m, open: false })),
    });
  } catch (e) {
    setModalMsg({
      open: true,
      mode: "notification",
      title: "Ошибка",
      message: e?.response?.data?.detail || "Не удалось сбросить пароль.",
      onCancel: () => setModalMsg(m => ({ ...m, open: false })),
    });
  }
  setLoading(false);
};


  return (
    <PageWrapper title="Управление пользователями">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowModal(true)}>Добавить пользователя</Button>
      </div>

      <FilterableTable
        columns={[
          { header: "Имя", accessor: "name", filterType: "text" },
          { header: "Email", accessor: "email", filterType: "text" },
          {
            header: "Роль",
            accessor: "role",
            filterType: "select",
            options: roleOptions,
            render: (val, row) => (
              <select
                value={val}
                onChange={(e) => handleRoleChange(row.id, e.target.value)}
                className="border border-[--color-border] rounded px-2 py-1 text-sm"
                disabled={loading}
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            )
          },
          {
            header: "Действия",
            accessor: "actions",
            noFilter: true,
            render: (_, row) => (
              <Button
                className="text-sm px-3 py-1 bg-[--color-primary] text-white rounded hover:bg-[--color-secondary]"
                onClick={() => handleResetPassword(row)}
              >
                Сбросить пароль
              </Button>
            )
          }
        ]}
        data={users}
        pageSize={10}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Добавить пользователя"
      >
        <div className="grid gap-4">
          <Input
            placeholder="Имя"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <ComboBox
            placeholder="Роль"
            options={roleOptions}
            value={newUser.role}
            onChange={(val) => setNewUser({ ...newUser, role: val })}
          />
          <Input
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            type="password"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveUser} disabled={loading}>Сохранить</Button>
        </div>
      </Modal>

      <ModalMessage
        open={modalMsg.open}
        mode={modalMsg.mode}
        title={modalMsg.title}
        message={modalMsg.message}
        onCancel={modalMsg.onCancel}
      />
    </PageWrapper>
  );
}
