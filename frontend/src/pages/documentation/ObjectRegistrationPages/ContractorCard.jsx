import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { useObjectRegistration } from "./ObjectRegistrationContext";
import api from "@/api/axios";
import { Trash2 } from "lucide-react";

export default function ContractorCard() {
  const {
    contractorCard,
    setContractorCard,
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
  } = contractorCard;

  const updateField = (field, value) =>
    setContractorCard((prev) => ({ ...prev, [field]: value }));

  const handleAddEmployee = () => {
    setContractorCard((prev) => ({
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
    setContractorCard(prev => ({
      ...prev,
      selectedEmployeeIdx: idx,
    }));
  };

  const handleDeleteEmployee = (row, idx) => {
    setContractorCard(prev => {
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

  const handleOrganizationSelect = async (selected) => {
    updateField("selectedOrganization", selected?.value || "");

    const selectedOrg = organizationOptions.find((org) => org.value === selected?.value);
    if (selectedOrg) {
      const full = selectedOrg.full;
      setContractorCard((prev) => ({
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
        setContractorCard((prev) => ({
          ...prev,
          employees: empRes.data || [],
        }));
      } catch (err) {
        console.error("Ошибка при загрузке сотрудников", err);
        setContractorCard((prev) => ({
          ...prev,
          employees: [],
        }));
      }
    }
  };

  return (
    <PageWrapper title="Карточка подрядчика">
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-3">
          <ComboBox
            options={organizationOptions}
            placeholder="Выберите организацию"
            value={selectedOrganization}
            onChange={handleOrganizationSelect}
          />
        </div>
        <div className="col-span-4"></div>

        <div className="group-box border border-[--color-border] col-span-2">
          <h3 className="group-box-title mb-4">Организация</h3>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input placeholder="Наименование" value={orgFullName} onChange={(e) => updateField("orgFullName", e.target.value)} />
            <Input placeholder="ОГРН" value={ogrn} onChange={(e) => updateField("ogrn", e.target.value)} />
            <Input placeholder="ИНН" value={inn} onChange={(e) => updateField("inn", e.target.value)} />
            <Input placeholder="Адрес" value={address} onChange={(e) => updateField("address", e.target.value)} />
            <Input placeholder="Тел/факс" value={telFax} onChange={(e) => updateField("telFax", e.target.value)} />
            <Input placeholder="Наименование свидетельства о допуске" value={certificateName} onChange={(e) => updateField("certificateName", e.target.value)} />
            <Input placeholder="Номер свидетельства о допуске" value={certificateNumber} onChange={(e) => updateField("certificateNumber", e.target.value)} />
            <Input placeholder="Дата выдачи" value={issueDate} onChange={(e) => updateField("issueDate", e.target.value)} type="date" />
            <Input placeholder="Наименование СРО" value={sroName} onChange={(e) => updateField("sroName", e.target.value)} />
            <Input placeholder="Номер СРО" value={sroNumber} onChange={(e) => updateField("sroNumber", e.target.value)} />
            <Input placeholder="СРО ОГРН" value={sroOgrn} onChange={(e) => updateField("sroOgrn", e.target.value)} />
            <Input placeholder="СРО ИНН" value={sroInn} onChange={(e) => updateField("sroInn", e.target.value)} />
          </div>
        </div>

        <div className="group-box border border-[--color-border] col-span-5">
          <h3 className="group-box-title mb-4">Ответственное лицо</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input placeholder="Ф.И.О." value={full_name} onChange={(e) => updateField("full_name", e.target.value)} />
            <Input placeholder="ИНС" value={ins} onChange={(e) => updateField("ins", e.target.value)} />
            <Input placeholder="Должность" value={position} onChange={(e) => updateField("position", e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input placeholder="Приказ №" value={decree_number} onChange={(e) => updateField("decree_number", e.target.value)} />
            <Input placeholder="Дата приказа" value={decree_date} onChange={(e) => updateField("decree_date", e.target.value)} type="date" />
            <Button onClick={handleAddEmployee}>Добавить</Button>
          </div>

          <FilterableTable
            columns={employeeColumns}
            data={contractorCard.employees}
          />
        </div>
      </div>
    </PageWrapper>
  );
}



