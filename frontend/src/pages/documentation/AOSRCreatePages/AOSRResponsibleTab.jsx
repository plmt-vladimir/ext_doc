import { useEffect } from "react";
import GroupBox from "@/components/UI/Groupbox";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useAOSRCreate } from "./AOSRCreateContext";
import api from "@/api/axios";

const roleKeys = [
  "zakazchik",
  "stroitel",
  "stroitelKontrol",
  "proektirovshik",
  "raboty",
  "inyeLitsa"
];

const ROLE_ID_BY_KEY = {
  zakazchik: 1,
  stroitel: 3,
  stroitelKontrol: 5,
  proektirovshik: 4,
  raboty: 6,
  inyeLitsa: 7,
};

function ResponsiblePersonBlock({ title, value, onChange, options }) {
  return (
    <GroupBox title={<span className="text-sm font-semibold ">{title}</span>} bordered className="w-full">
      <div className="flex flex-col gap-3 pt-4">
        <ComboBox
          placeholder="Ф.И.О."
          options={options}
          value={value.id || ""}
          onChange={val => {
            const selected = options.find(opt => opt.value === val);
            if (selected && selected.employee) {
              onChange({
                id: selected.employee.id,
                name: selected.employee.full_name,
                order: selected.employee.decree_number || "",
                date: selected.employee.decree_date || "",
                position: selected.employee.position || "",
                organization: selected.employee.organization_name || "",
              });
            } else {
              onChange({ id: "", name: "", order: "", date: "", position: "", organization: "" });
            }
          }}
        />
        <Input
          placeholder="Номер приказа"
          value={value.order}
          onChange={e => onChange({ ...value, order: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Дата приказа"
          value={value.date}
          onChange={e => onChange({ ...value, date: e.target.value })}
        />
        <Input
          placeholder="Должность"
          value={value.position}
          onChange={e => onChange({ ...value, position: e.target.value })}
        />
        <Input
          placeholder="Организация"
          value={value.organization}
          onChange={e => onChange({ ...value, organization: e.target.value })}
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
        zakazchik: [],
        stroitel: [],
        stroitelKontrol: [],
        proektirovshik: [],
        raboty: [],
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
        const empsRes = await api.get(`/organizations/${orgId}/employees`);
        newOptions[roleKey] = empsRes.data.map(emp => ({
          label: emp.full_name,
          value: emp.id,
          employee: emp
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
      zakazchik: { name: "", order: "", date: "", position: "", organization: "" },
      stroitel: { name: "", order: "", date: "", position: "", organization: "" },
      stroitelKontrol: { name: "", order: "", date: "", position: "", organization: "" },
      proektirovshik: { name: "", order: "", date: "", position: "", organization: "" },
      raboty: { name: "", order: "", date: "", position: "", organization: "" },
      inyeLitsa: { name: "", order: "", date: "", position: "", organization: "" },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <ResponsiblePersonBlock
          title="Представитель заказчика или технического заказчика по вопросам строительного контроля"
          value={responsible.zakazchik}
          onChange={(val) => updateField("zakazchik", val)}
          options={employeeOptions.zakazchik}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство"
          value={responsible.stroitel}
          onChange={(val) => updateField("stroitel", val)}
          options={employeeOptions.stroitel}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего строительство, по вопросам строительного контроля"
          value={responsible.stroitelKontrol}
          onChange={(val) => updateField("stroitelKontrol", val)}
          options={employeeOptions.stroitelKontrol}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, осуществляющего подготовку проектной документации, в случаях, когда авторский надзор осуществляется"
          value={responsible.proektirovshik}
          onChange={(val) => updateField("proektirovshik", val)}
          options={employeeOptions.proektirovshik}
        />
        <ResponsiblePersonBlock
          title="Представитель лица, выполняющего работы, подлежащие освидетельствованию"
          value={responsible.raboty}
          onChange={(val) => updateField("raboty", val)}
          options={employeeOptions.raboty}
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
