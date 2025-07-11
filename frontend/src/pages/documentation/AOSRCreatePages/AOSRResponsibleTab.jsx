import { useEffect } from "react";
import GroupBox from "@/components/UI/Groupbox";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useAOSRCreate } from "./AOSRCreateContext";
import api from "@/api/axios";

const roleKeys = [
  "customer",
  "generalContractor",
  "contractor",
  "projectOrg",
  "constructionControl",
  "inyeLitsa"
];

const ROLE_ID_BY_KEY = {
  customer: 1,
  generalContractor: 2,
  contractor: 3,
  projectOrg: 4,
  constructionControl: 5,
  inyeLitsa: 6
};

function ResponsiblePersonBlock({ title, value, onChange, options }) {
  const safeValue = value || {
    id: "",
    name: "",
    order: "",
    date: "",
    position: "",
    organization: ""
  };
  console.log("value = ", safeValue);
  console.log("options = ", options);
  return (
    <GroupBox title={<span className="text-sm font-semibold ">{title}</span>} bordered className="w-full">
      <div className="grid grid-cols-5 gap-3 pt-4 items-center">
        {/* Ф.И.О. */}
        <label className="col-span-1 text-sm text-[--color-primary]">Ф.И.О.</label>
        <ComboBox
          className="col-span-4"
          placeholder="Ф.И.О."
          options={options || []}
          value={safeValue.id}
          onChange={(option) => {
            if (option?.employee) {
              const emp = option.employee;
              onChange({
                id: emp.id,
                name: emp.full_name || "",
                order: emp.decree_number || "",
                date: emp.decree_date || "",
                position: emp.position || "",
                organization: emp.organization || ""
              });
            } else {
              onChange({ id: "", name: "", order: "", date: "", position: "", organization: "" });
            }
          }}
        />
        {/* Номер приказа */}
        <label className="col-span-1 text-sm text-[--color-primary]">Номер приказа</label>
        <Input
          className="col-span-4"
          placeholder="Номер приказа"
          disabled
          value={safeValue.order}
          onChange={e => onChange({ ...safeValue, order: e.target.value })}
        />
        {/* Дата приказа */}
        <label className="col-span-1 text-sm text-[--color-primary]">Дата приказа</label>
        <Input
          disabled
          type="date"
          className="col-span-4"
          placeholder="Дата приказа"
          value={safeValue.date}
          onChange={e => onChange({ ...safeValue, date: e.target.value })}
        />
        {/* Должность */}
        <label className="col-span-1 text-sm text-[--color-primary]">Должность</label>
        <Input
          disabled
          className="col-span-4"
          placeholder="Должность"
          value={safeValue.position}
          onChange={e => onChange({ ...safeValue, position: e.target.value })}
        />
        {/* Организация */}
        <label className="col-span-1 text-sm text-[--color-primary]">Организация</label>
        <Input
          disabled
          className="col-span-4"
          placeholder="Организация"
          value={safeValue.organization}
          onChange={e => onChange({ ...safeValue, organization: e.target.value })}
        />
      </div>
    </GroupBox>
  );
}



export default function AOSRResponsibleTab() {
  const { common, employeeOptions, setEmployeeOptions, responsible, setResponsible } = useAOSRCreate();

  useEffect(() => {
    if (!common.construction) {
      setEmployeeOptions({
        customer: [],
        generalContractor: [],
        contractor: [],
        projectOrg: [],
        constructionControl: [],
        inyeLitsa: [],
      });
      return;
    }

    const fetchEmployees = async () => {
      const roleAssignments = await api.get("/organizations/role-assignments/", {
        params: { construction_site_id: common.construction }
      });

      const roleOrgMap = {};
      for (const ra of roleAssignments.data) {
        roleOrgMap[ra.role_id] = ra.organization_id;
      }

      const newOptions = {};
      for (const roleKey of roleKeys) {
        const roleId = ROLE_ID_BY_KEY[roleKey];
        const orgId = roleOrgMap[roleId];
        if (!orgId) {
          newOptions[roleKey] = [];
          continue;
        }

        // Получаем название организации:
        const orgRes = await api.get(`/organizations/${orgId}`);
        const orgName = orgRes.data.name;

        // Загружаем сотрудников:
        const empsRes = await api.get(`/organizations/${orgId}/employees`);

        // Добавляем organization в каждый employee:
        newOptions[roleKey] = empsRes.data.map(emp => ({
          label: emp.full_name,
          value: emp.id,
          employee: {
            ...emp,
            organization: orgName,
          }
        }));
      }

      setEmployeeOptions(newOptions);
    };

    fetchEmployees();
  }, [common.construction, setEmployeeOptions]);

  const updateField = (key, value) => {
    setResponsible(prev => ({ ...prev, [key]: value }));
  };


  const handleClear = () => {
    setResponsible({
      customer: { name: "", order: "", date: "", position: "", organization: "" },
      generalContractor: { name: "", order: "", date: "", position: "", organization: "" },
      contractor: { name: "", order: "", date: "", position: "", organization: "" },
      projectOrg: { name: "", order: "", date: "", position: "", organization: "" },
      constructionControl: { name: "", order: "", date: "", position: "", organization: "" },
      inyeLitsa: { name: "", order: "", date: "", position: "", organization: "" },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <ResponsiblePersonBlock
          title="Представитель заказчика или технического заказчика по вопросам строительного контроля"
          value={responsible.customer}
          onChange={(val) => updateField("customer", val)}
          options={employeeOptions.customer}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство"
          value={responsible.generalContractor}
          onChange={(val) => updateField("generalContractor", val)}
          options={employeeOptions.generalContractor}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство, по вопросам строительного контроля"
          value={responsible.constructionControl}
          onChange={(val) => updateField("constructionControl", val)}
          options={employeeOptions.constructionControl}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего подготовку проектной документации, в случаях, когда авторский надзор осуществляется"
          value={responsible.projectOrg}
          onChange={(val) => updateField("projectOrg", val)}
          options={employeeOptions.projectOrg}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, выполняющего работы, подлежащие освидетельствованию"
          value={responsible.contractor}
          onChange={(val) => updateField("contractor", val)}
          options={employeeOptions.contractor}
        />
        <ResponsiblePersonBlock
          title="Представитель иных лиц, участвующих в освидетельствовании"
          value={responsible.inyeLitsa}
          onChange={(val) => updateField("inyeLitsa", val)}
          options={employeeOptions.inyeLitsa}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={handleClear}>Очистить</Button>
      </div>
    </div>
  );
}
