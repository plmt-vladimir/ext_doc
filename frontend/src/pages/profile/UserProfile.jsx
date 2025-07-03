import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import ModalMessage from "@/components/UI/ModalMessage";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

function PasswordModal({ isOpen, onClose, onSubmit, loading }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Все поля обязательны для заполнения.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Новый пароль и подтверждение не совпадают.");
      return;
    }
    onSubmit(oldPassword, newPassword, setError);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[--color-primary]">Сменить пароль</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">Старый пароль</label>
            <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">Новый пароль</label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-[--color-primary] mb-1">Подтвердите новый пароль</label>
            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Отмена</Button>
          <Button onClick={handleSave} disabled={loading}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState({
    open: false,
    mode: "notification",
    title: "",
    message: "",
    onCancel: () => setModalMsg(m => ({ ...m, open: false })),
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleChangePassword = async (oldPass, newPass, setFormError) => {
    setLoading(true);
    try {
      await api.post("/users/change-password", {
        old_password: oldPass,
        new_password: newPass,
      });
      setShowModal(false);
      setModalMsg({
        open: true,
        mode: "notification",
        title: "Успешно",
        message: "Пароль успешно изменён.",
        onCancel: () => setModalMsg(m => ({ ...m, open: false })),
      });
    } catch (error) {
      setShowModal(false);
      setModalMsg({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message:
          error?.response?.data?.detail ||
          "Ошибка смены пароля. Проверьте старый пароль.",
        onCancel: () => setModalMsg(m => ({ ...m, open: false })),
      });
    }
    setLoading(false);
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <PageWrapper title="Личный кабинет">
      <div className="group-box border border-[--color-border] p-6 max-w-3xl">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Информация о пользователе</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[--color-primary]">ФИО</label>
            <div className="bg-white text-black px-4 py-2 rounded border border-[--color-border]">{user.name}</div>
          </div>
          <div>
            <label className="text-xs text-[--color-primary]">Роль</label>
            <div className="bg-white text-black px-4 py-2 rounded border border-[--color-border]">{user.role}</div>
          </div>
          <div>
            <label className="text-xs text-[--color-primary]">Email</label>
            <div className="bg-white text-black px-4 py-2 rounded border border-[--color-border]">{user.email}</div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowModal(true)}>Сменить пароль</Button>
        </div>
      </div>
      <PasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleChangePassword}
        loading={loading}
      />
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

