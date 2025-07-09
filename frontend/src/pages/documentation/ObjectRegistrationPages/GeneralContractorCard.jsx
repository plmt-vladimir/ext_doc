import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Trash2 } from "lucide-react";
import { useObjectRegistration } from "./ObjectRegistrationContext";
import api from "@/api/axios";
import GroupBox from "@/components/UI/GroupBox";

export default function GeneralContractorCard() {
  const {
    generalContractorCard,
    setGeneralContractorCard,
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
  } = generalContractorCard;

  const updateField = (field, value) =>
    setGeneralContractorCard((prev) => ({ ...prev, [field]: value }));

  const handleAddEmployee = () => {
    setGeneralContractorCard((prev) => ({
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
    setGeneralContractorCard((prev) => ({
      ...prev,
      selectedEmployeeIdx: idx,
    }));
  };

  const handleDeleteEmployee = (_, idx) => {
    setGeneralContractorCard((prev) => {
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
      setGeneralContractorCard((prev) => ({
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
        setGeneralContractorCard((prev) => ({
          ...prev,
          employees: empRes.data || [],
        }));
      } catch (err) {
        console.error("Ошибка при загрузке сотрудников", err);
        setGeneralContractorCard((prev) => ({
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
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEmployee(null, idx);
          }}
        />
      ),
    },
  ];

  return (
    <PageWrapper title="Карточка генподрядчика">
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
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input placeholder="Наименование" value={orgFullName} onChange={(e) => updateField("orgFullName", e.target.value)} />
            <Input placeholder="ОГРН" value={ogrn} onChange={(e) => updateField("ogrn", e.target.value)} />
            <Input placeholder="ИНН" value={inn} onChange={(e) => updateField("inn", e.target.value)} />
            <Input placeholder="Адрес" value={address} onChange={(e) => updateField("address", e.target.value)} />
            <Input placeholder="Тел/факс" value={telFax} onChange={(e) => updateField("telFax", e.target.value)} />
            <Input placeholder="Наименование свидетельства" value={certificateName} onChange={(e) => updateField("certificateName", e.target.value)} />
            <Input placeholder="Номер свидетельства" value={certificateNumber} onChange={(e) => updateField("certificateNumber", e.target.value)} />
            <Input placeholder="Дата выдачи" value={issueDate} onChange={(e) => updateField("issueDate", e.target.value)} type="date" />
            <Input placeholder="Наименование СРО" value={sroName} onChange={(e) => updateField("sroName", e.target.value)} />
            <Input placeholder="Номер СРО" value={sroNumber} onChange={(e) => updateField("sroNumber", e.target.value)} />
            <Input placeholder="СРО ОГРН" value={sroOgrn} onChange={(e) => updateField("sroOgrn", e.target.value)} />
            <Input placeholder="СРО ИНН" value={sroInn} onChange={(e) => updateField("sroInn", e.target.value)} />
          </div>
        </GroupBox>

        <GroupBox className="col-span-5" title="Ответственное лицо" bordered>
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
            data={generalContractorCard.employees}
          />
        </GroupBox>
      </div>
    </PageWrapper>
  );
}

