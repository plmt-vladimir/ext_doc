import { useState, useEffect } from "react";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterableTable from "@/components/widgets/FilterableTable";
import Table from "@/components/widgets/Table";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { Pencil, Trash2 } from "lucide-react";
import ModalMessage from "@/components/UI/ModalMessage";

// Преобразование org из API > форму на фронте
function mapOrgToForm(org) {
  return {
    id: org.id,
    name: org.name,
    ogrn: org.ogrn,
    inn: org.inn,
    address: org.address,
    phone: org.phone,
    certName: org.license_name,
    certNumber: org.license_number,
    certDate: org.license_date,
    sroName: org.sro_name,
    sroNumber: org.sro_number,
    sroOgrn: org.sro_ogrn,
    sroInn: org.sro_inn,
  };
}
// Преобразование формы - API 
function mapFormToApiOrg(form) {
  return {
    name: form.name,
    ogrn: form.ogrn,
    inn: form.inn,
    address: form.address,
    phone: form.phone,
    license_name: form.certName,
    license_number: form.certNumber,
    license_date: form.certDate,
    sro_name: form.sroName,
    sro_number: form.sroNumber,
    sro_ogrn: form.sroOgrn,
    sro_inn: form.sroInn,
  };
}
// Сотрудник из API → форма фронта
function mapEmpToForm(emp) {
  return {
    id: emp.id,
    name: emp.full_name,
    position: emp.position || "",
    role: emp.ins || "",
    order: emp.decree_number || "",
    date: emp.decree_date || "",
  };
}
// Форма → API сотрудника
function mapFormToApiEmp(form) {
  return {
    full_name: form.name,
    position: form.position,
    ins: form.role,
    decree_number: form.order,
    decree_date: form.date,
  };
}

export default function Contractors() {
  const [modal, setModal] = useState({
    open: false,
    mode: "notification",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [employees, setEmployees] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddOrgForm, setShowAddOrgForm] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: "",
    ogrn: "",
    inn: "",
    address: "",
    phone: "",
    certName: "",
    certNumber: "",
    certDate: "",
    sroName: "",
    sroNumber: "",
    sroOgrn: "",
    sroInn: ""
  });
  // 1. Получение организаций с бэка
  useEffect(() => {
    api.get("/organizations/")
      .then(res => {
        setOrganizations(res.data.map(mapOrgToForm));
        if (res.data.length) setSelectedOrgId(res.data[0].id);
      });
  }, []);
  // 2. Получение сотрудников при выборе организации
  useEffect(() => {
    if (!selectedOrgId) return;
    api.get(`/organizations/${selectedOrgId}/employees`)
      .then(res => {
        setEmployees(prev => ({
          ...prev,
          [selectedOrgId]: res.data.map(mapEmpToForm)
        }));
      });
  }, [selectedOrgId]);
  // 3. Выбор организации
  const handleOrgSelect = (org) => setSelectedOrgId(org.id);
  // 4. Добавление организации
  const handleAddOrganization = async () => {
    const payload = mapFormToApiOrg(newOrg);
    const res = await api.post("/organizations/", payload);
    const addedOrg = mapOrgToForm(res.data);
    setOrganizations(prev => [...prev, addedOrg]);
    setSelectedOrgId(addedOrg.id);
    setShowAddOrgForm(false);
    setNewOrg({
      name: "",
      ogrn: "",
      inn: "",
      address: "",
      phone: "",
      certName: "",
      certNumber: "",
      certDate: "",
      sroName: "",
      sroNumber: "",
      sroOgrn: "",
      sroInn: ""
    });
  };
  // 5. Удаление организации 
  const doDeleteOrg = async (id) => {
    try {
      await api.delete(`/organizations/${id}`);
      setOrganizations(prev => {
        const filtered = prev.filter(org => org.id !== id);
        if (selectedOrgId === id) {
          setSelectedOrgId(filtered[0]?.id || null);
        }
        return filtered;
      });
      setEmployees(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setModal({
        open: true,
        mode: "notification",
        title: "Успех",
        message: "Организация удалена",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    } catch {
      setModal({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message: "Не удалось удалить организацию.",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    }
  };
  const handleDeleteOrganization = (id) => {
    const org = organizations.find(o => o.id === id);
    setModal({
      open: true,
      mode: "confirmation",
      title: "Удаление организации",
      message: `Удалить организацию "${org?.name}"? Все сотрудники будут удалены!`,
      onConfirm: () => {
        setModal(m => ({ ...m, open: false }));
        doDeleteOrg(id);
      },
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };
  // 6. Удаление сотрудника 
  const doDeleteEmployee = async (id) => {
    try {
      await api.delete(`/organizations/${selectedOrgId}/employees/${id}`);
      setEmployees((prev) => ({
        ...prev,
        [selectedOrgId]: prev[selectedOrgId].filter((e) => e.id !== id)
      }));
      setEditingEmployee(null); // <-- сброс
      setModal({
        open: true,
        mode: "notification",
        title: "Успех",
        message: "Сотрудник удалён.",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    } catch {
      setModal({
        open: true,
        mode: "notification",
        title: "Ошибка",
        message: "Не удалось удалить сотрудника.",
        onCancel: () => setModal(m => ({ ...m, open: false })),
      });
    }
  };
  const handleDeleteEmployee = (id) => {
    const emp = (employees[selectedOrgId] || []).find(e => e.id === id);
    setModal({
      open: true,
      mode: "confirmation",
      title: "Удаление сотрудника",
      message: `Удалить сотрудника "${emp?.name}"?`,
      onConfirm: () => {
        setModal(m => ({ ...m, open: false }));
        doDeleteEmployee(id);
      },
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };
  // 7. Сотрудники: редактирование
  const handleEditEmployee = (emp) => setEditingEmployee(emp);

  const handleAddEmployee = () => {
    setEditingEmployee({ id: null, name: "", position: "", role: "", order: "", date: "" });
  };

  // 8. Сотрудники: сохранить (создать или обновить)
  const handleSave = async () => {
    const empPayload = mapFormToApiEmp(editingEmployee);
    let res;
    if (editingEmployee.id) {
      res = await api.patch(
        `/organizations/${selectedOrgId}/employees/${editingEmployee.id}`,
        empPayload
      );
      const updatedEmp = mapEmpToForm(res.data);
      setEmployees(prev => ({
        ...prev,
        [selectedOrgId]: prev[selectedOrgId].map(e => e.id === updatedEmp.id ? updatedEmp : e)
      }));
    } else {
      res = await api.post(
        `/organizations/${selectedOrgId}/employees`,
        empPayload
      );
      const newEmp = mapEmpToForm(res.data);
      setEmployees(prev => ({
        ...prev,
        [selectedOrgId]: [...(prev[selectedOrgId] || []), newEmp]
      }));
    }
    setEditingEmployee(null);
  };
  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
  return (
    <PageWrapper title="Справочник организаций и сотрудников">
      <div className="flex flex-col gap-6">
        <div className="group-box border border-[--color-border] p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="group-box-title mb-0 text-[--color-primary]">Организации</h3>
            <Button onClick={() => setShowAddOrgForm(true)}>Добавить организацию</Button>
          </div>
          <FilterableTable
            columns={[
              { header: "Наименование", accessor: "name", filterType: "text" },
              { header: "ОГРН", accessor: "ogrn", filterType: "text" },
              { header: "ИНН", accessor: "inn", filterType: "text" },
              { header: "Адрес", accessor: "address", filterType: "text" },
              { header: "Тел/факс", accessor: "phone", filterType: "text" },
              { header: "Свидетельство", accessor: "certName", filterType: "text" },
              { header: "№ Свид.", accessor: "certNumber", filterType: "text" },
              { header: "Дата выдачи", accessor: "certDate", filterType: "text" },
              { header: "СРО", accessor: "sroName", filterType: "text" },
              {
                header: "",
                accessor: "actions",
                render: (_, row) => (
                  <div className="flex gap-2 justify-center">
                    <Trash2
                      className="cursor-pointer text-red-600"
                      title="Удалить организацию"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteOrganization(row.id);
                      }}
                    />
                  </div>
                ),
                noFilter: true
              },
            ]}
            data={organizations}
            pageSize={10}
            onRowClick={handleOrgSelect}
          />
          {showAddOrgForm && (
            <div className="mt-6 border border-[--color-border] rounded p-4 bg-white shadow">
              <h4 className="text-[--color-primary] font-semibold mb-4">Добавление организации</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input placeholder="Наименование" value={newOrg.name} onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })} />
                <Input placeholder="ОГРН" value={newOrg.ogrn} onChange={(e) => setNewOrg({ ...newOrg, ogrn: e.target.value })} />
                <Input placeholder="ИНН" value={newOrg.inn} onChange={(e) => setNewOrg({ ...newOrg, inn: e.target.value })} />
                <Input placeholder="Адрес" value={newOrg.address} onChange={(e) => setNewOrg({ ...newOrg, address: e.target.value })} />
                <Input placeholder="Тел/факс" value={newOrg.phone} onChange={(e) => setNewOrg({ ...newOrg, phone: e.target.value })} />
                <Input placeholder="Наименование свидетельства" value={newOrg.certName} onChange={(e) => setNewOrg({ ...newOrg, certName: e.target.value })} />
                <Input placeholder="Номер свидетельства" value={newOrg.certNumber} onChange={(e) => setNewOrg({ ...newOrg, certNumber: e.target.value })} />
                <Input type="date" placeholder="Дата выдачи" value={newOrg.certDate} onChange={(e) => setNewOrg({ ...newOrg, certDate: e.target.value })} />
                <Input placeholder="СРО (название)" value={newOrg.sroName} onChange={(e) => setNewOrg({ ...newOrg, sroName: e.target.value })} />
                <Input placeholder="СРО (номер)" value={newOrg.sroNumber} onChange={(e) => setNewOrg({ ...newOrg, sroNumber: e.target.value })} />
                <Input placeholder="СРО ОГРН" value={newOrg.sroOgrn} onChange={(e) => setNewOrg({ ...newOrg, sroOgrn: e.target.value })} />
                <Input placeholder="СРО ИНН" value={newOrg.sroInn} onChange={(e) => setNewOrg({ ...newOrg, sroInn: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowAddOrgForm(false)}>Отмена</Button>
                <Button onClick={handleAddOrganization}>Сохранить</Button>
              </div>
            </div>
          )}
        </div>

        <div className="group-box border border-[--color-border] p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="group-box-title mb-0 text-[--color-primary]">
              Сотрудники организации: {selectedOrg?.name}
            </h3>
            <Button onClick={handleAddEmployee}>Добавить</Button>
          </div>
          <Table
            headers={["ФИО", "Должность", "Роль", "Номер приказа", "Дата приказа", ""]}
            rows={(employees[selectedOrgId] || []).map((emp) => [
              emp.name,
              emp.position,
              emp.role,
              emp.order,
              emp.date,
              <div className="flex justify-center gap-2 text-[--color-primary]">
                <Pencil className="cursor-pointer" onClick={() => handleEditEmployee(emp)} />
                <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDeleteEmployee(emp.id)} />
              </div>
            ])}
          />
          {editingEmployee && (
            <div className="mt-6 border border-[--color-border] rounded p-4 bg-white shadow">
              <h4 className="text-[--color-primary] font-semibold mb-4">
                {editingEmployee.id ? "Редактирование сотрудника" : "Добавление сотрудника"}
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input placeholder="ФИО" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} />
                <Input placeholder="Должность" value={editingEmployee.position} onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })} />
                <Input placeholder="Роль" value={editingEmployee.role} onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })} />
                <Input placeholder="Номер приказа" value={editingEmployee.order} onChange={(e) => setEditingEmployee({ ...editingEmployee, order: e.target.value })} />
                <Input type="date" placeholder="Дата приказа" value={editingEmployee.date} onChange={(e) => setEditingEmployee({ ...editingEmployee, date: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setEditingEmployee(null)}>Отмена</Button>
                <Button onClick={handleSave}>Сохранить</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalMessage
        open={modal.open}
        mode={modal.mode}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </PageWrapper>
  );
}



