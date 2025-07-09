import { useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Trash2 } from "lucide-react";
import { useObjectRegistration } from "./ObjectRegistrationContext";
import api from "@/api/axios";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

export default function CustomerCard() {
  const {
    customerCard,
    setCustomerCard,
    organizationOptions,
  } = useObjectRegistration();

  const {
    selectedOrganization,
    orgFullName,
    ogrn,
    inn,
    address,
    telFax,
    certificateName,
    certificateNumber,
    issueDate,
    sroName,
    sroNumber,
    sroOgrn,
    sroInn,
    position,
    orderOrgNumber,
    orderDate,
    employees,
    full_name,
    ins,
    decree_number,
    decree_date,
    selectedEmployeeIdx,
  } = customerCard;

  const updateField = (field, value) =>
    setCustomerCard((prev) => ({ ...prev, [field]: value }));

  const handleAddEmployee = () => {
    setCustomerCard((prev) => ({
      ...prev,
      employees: [
        ...prev.employees,
        { full_name, position, ins, decree_number, decree_date },
      ],
      full_name: "",
      position: "",
      ins: "",
      decree_number: "",
      decree_date: "",
    }));
  };

  const handleSelectEmployee = (idx) => {
    setCustomerCard(prev => ({
      ...prev,
      selectedEmployeeIdx: idx,
    }));
  };

  const handleDeleteEmployee = (row, idx) => {
    setCustomerCard(prev => {
      const newEmployees = prev.employees.filter((_, i) => i !== idx);
      let newSelected = prev.selectedEmployeeIdx;
      if (prev.selectedEmployeeIdx === idx) {
        newSelected = null;
      } else if (prev.selectedEmployeeIdx > idx) {
        newSelected = prev.selectedEmployeeIdx - 1;
      }
      return {
        ...prev,
        employees: newEmployees,
        selectedEmployeeIdx: newSelected,
      };
    });
  };

  const handleOrganizationSelect = async (selected) => {
    updateField("selectedOrganization", selected?.value || "");

    const selectedOrg = organizationOptions.find((org) => org.value === selected?.value);
    if (selectedOrg) {
      const full = selectedOrg.full;
      setCustomerCard((prev) => ({
        ...prev,
        orgFullName: full.name || "",
        ogrn: full.ogrn || "",
        inn: full.inn || "",
        address: full.address || "",
        telFax: full.phone || "",
        certificateName: full.license_name || "",
        certificateNumber: full.license_number || "",
        issueDate: full.license_date || "",
        sroName: full.sro_name || "",
        sroNumber: full.sro_number || "",
        sroOgrn: full.sro_ogrn || "",
        sroInn: full.sro_inn || "",
      }));

      try {
        const empRes = await api.get(`/organizations/${selected.value}/employees`);
        setCustomerCard((prev) => ({
          ...prev,
          employees: empRes.data || [],
        }));
      } catch (err) {
        console.error("Ошибка при загрузке сотрудников", err);
        setCustomerCard((prev) => ({
          ...prev,
          employees: [],
        }));
      }
    }
  };

  const employeeColumns = [
    {
      header: "",
      accessor: "selected",
      noFilter: true,
      render: (_, __, idx) => (
        <input
          type="checkbox"
          checked={selectedEmployeeIdx === idx}
          onChange={() => handleSelectEmployee(idx)}
        />
      ),
    },
    { header: "Ф.И.О.", accessor: "full_name", filterType: "text" },
    { header: "Должность", accessor: "position", filterType: "text" },
    { header: "ИНС", accessor: "ins", filterType: "text" },
    { header: "Приказ №", accessor: "decree_number", filterType: "text" },
    { header: "Дата приказа", accessor: "decree_date", filterType: "date" },
    {
      header: "",
      accessor: "actions",
      noFilter: true,
      render: (_, __, idx) => (
        <Trash2
          className="cursor-pointer text-red-600 mx-auto"
          onClick={e => {
            e.stopPropagation();
            handleDeleteEmployee(null, idx);
          }}
        />
      ),
    },
  ];

  return (
    <PageWrapper>
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-3">
          <ComboBox
            options={organizationOptions}
            placeholder="Выберите организацию"
            value={selectedOrganization}
            onChange={handleOrganizationSelect}
          />
        </div>
        <div className="col-span-4" />
        <GroupBox className="col-span-2" title="Организация" bordered>
          <div className="flex flex-col gap-3 mb-4">
            {[
              { id: "orgFullName", label: "Наименование", value: orgFullName },
              { id: "ogrn", label: "ОГРН", value: ogrn },
              { id: "inn", label: "ИНН", value: inn },
              { id: "address", label: "Адрес", value: address },
              { id: "telFax", label: "Тел/факс", value: telFax },
              { id: "certificateName", label: "Наименование свидетельства", value: certificateName },
              { id: "certificateNumber", label: "Номер свидетельства", value: certificateNumber },
              { id: "issueDate", label: "Дата выдачи", value: issueDate, type: "date" },
              { id: "sroName", label: "Наименование СРО", value: sroName },
              { id: "sroNumber", label: "Номер СРО", value: sroNumber },
              { id: "sroOgrn", label: "СРО ОГРН", value: sroOgrn },
              { id: "sroInn", label: "СРО ИНН", value: sroInn },
            ].map(({ id, label, value, type }) => (
              <div key={id} className="flex items-center gap-4">
                <Label htmlFor={id} className="w-1/4 text-sm text-[--color-primary]">
                  {label}
                </Label>
                <div className="w-3/4">
                  <Input
                    id={id}
                    type={type || "text"}
                    placeholder={label}
                    value={value}
                    onChange={(e) => updateField(id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </GroupBox>
        <GroupBox className="col-span-5" title="Ответственное лицо" bordered>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Ф.И.О. */}
            <div className="flex flex-col">
              <Label htmlFor="full_name" className="text-[--color-primary]">Ф.И.О.</Label>
              <Input
                id="full_name"
                placeholder="Ф.И.О."
                value={full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
              />
            </div>

            {/* ИНС */}
            <div className="flex flex-col">
              <Label htmlFor="ins" className="text-[--color-primary]">ИНС</Label>
              <Input
                id="ins"
                placeholder="ИНС"
                value={ins}
                onChange={(e) => updateField("ins", e.target.value)}
              />
            </div>

            {/* Должность */}
            <div className="flex flex-col">
              <Label htmlFor="position" className="text-[--color-primary]">Должность</Label>
              <Input
                id="position"
                placeholder="Должность"
                value={position}
                onChange={(e) => updateField("position", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 items-end">
            {/* Приказ № */}
            <div className="flex flex-col">
              <Label htmlFor="decree_number" className="text-[--color-primary]">Приказ №</Label>
              <Input
                id="decree_number"
                placeholder="Приказ №"
                value={decree_number}
                onChange={(e) => updateField("decree_number", e.target.value)}
              />
            </div>

            {/* Дата приказа */}
            <div className="flex flex-col">
              <Label htmlFor="decree_date" className="text-[--color-primary]">Дата приказа</Label>
              <Input
                id="decree_date"
                type="date"
                placeholder="Дата приказа"
                value={decree_date}
                onChange={(e) => updateField("decree_date", e.target.value)}
              />
            </div>

            {/* Кнопка */}
            <div className="flex flex-col">
              <Button onClick={handleAddEmployee}>Добавить</Button>
            </div>
          </div>

          <FilterableTable
            columns={employeeColumns}
            data={customerCard.employees}
          />
        </GroupBox>

      </div>
    </PageWrapper>
  );
}




