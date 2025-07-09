import Input from "@/components/UI/Input";
import Textarea from "@/components/UI/Textarea";
import FormField from "@/components/UI/FormField";
import Button from "@/components/UI/Button";
import GroupBox from "@/components/UI/Groupbox";
import ComboBox from "@/components/UI/ComboBox";
import Select from "react-select";
import { useEffect, useMemo } from "react";
import { useAOSRCreate } from "./AOSRCreateContext";

function buildPresentation(data) {
  let rowStr = [data.section, data.code, data.sheets].filter(Boolean).join(", ");
  let lines = [];
  if (rowStr) lines.push(rowStr);
  if (data.fullName) lines.push(data.fullName);
  if (data.org) lines.push([rowStr, data.org].filter(Boolean).join(", "));
  return lines.join("\n");
}

function buildPresentationWithNorms(data) {
  const normsStr = (data.norms && data.norms.length)
    ? data.norms.map(n => n.label).join("; ") + " "
    : "";
  const pres = buildPresentation(data);
  return normsStr + pres;
}

export default function AOSRNormTab({ projectSections, spOptions }) {
  const { norm, setNorm } = useAOSRCreate();
  const { main, aux } = norm;

  useEffect(() => {
    setNorm((prev) => ({
      ...prev,
      main: {
        ...prev.main,
        presentation: buildPresentation(prev.main),
        presentationWithNorms: buildPresentationWithNorms(prev.main)
      }
    }));
  }, [main.section, main.code, main.sheets, main.fullName, main.org, main.norms, setNorm]);

  useEffect(() => {
    setNorm((prev) => ({
      ...prev,
      aux: {
        ...prev.aux,
        presentation: buildPresentation(prev.aux),
        presentationWithNorms: buildPresentationWithNorms(prev.aux)
      }
    }));
  }, [aux.section, aux.code, aux.sheets, aux.fullName, aux.org, aux.norms, setNorm]);

  const combinedPresentation = useMemo(() =>
    [norm.main.presentation, norm.aux.presentation].filter(Boolean).join("\n\n"), [norm]
  );
  const combinedPresentationWithNorms = useMemo(() =>
    [norm.main.presentationWithNorms, norm.aux.presentationWithNorms].filter(Boolean).join("\n\n"), [norm]
  );

  const handleClear = () => {
    setNorm({
      main: {
        section: "",
        code: "",
        sheets: "",
        fullName: "",
        org: "",
        norms: [],
        exec: false,
        presentation: "",
        presentationWithNorms: "",
      },
      aux: {
        section: "",
        code: "",
        sheets: "",
        fullName: "",
        org: "",
        norms: [],
        exec: false,
        presentation: "",
        presentationWithNorms: "",
      }
    });
  };

  const renderDocSection = (title, data, sectionKey) => (
    <GroupBox bordered className="w-full" title={title}>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <ComboBox
          placeholder="Раздел проекта"
          options={projectSections}
          value={data.section ? projectSections.find(s => s.data.section_code === data.section) : null}
          onChange={(selected) => {
            setNorm(prev => ({
              ...prev,
              [sectionKey]: {
                ...prev[sectionKey],
                section: selected?.data.section_code || "",
                code: selected?.data.section_name || "",
                sheets: selected?.data.sheet_info || "",
                fullName: selected?.data.discipline || "",
                org: selected?.data.designer || ""
              }
            }));
          }}
        />
        <Input
          placeholder="Шифр раздела"
          value={data.code}
          onChange={e => setNorm(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], code: e.target.value }
          }))}
        />
        <Input
          placeholder="Листы"
          value={data.sheets}
          onChange={e => setNorm(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], sheets: e.target.value }
          }))}
        />
      </div>
      <Textarea
        placeholder="Полное название"
        value={data.fullName}
        onChange={e => setNorm(prev => ({
          ...prev,
          [sectionKey]: { ...prev[sectionKey], fullName: e.target.value }
        }))}
        className="mb-2"
      />
      <Input
        placeholder="Проектная организация"
        value={data.org}
        onChange={e => setNorm(prev => ({
          ...prev,
          [sectionKey]: { ...prev[sectionKey], org: e.target.value }
        }))}
        className="mb-2"
      />
      <Textarea
        placeholder="Представление в документе"
        value={data.presentation}
        readOnly
        className="mb-2"
      />
      <div className="flex gap-2 items-center mb-2">
        <Select
          options={spOptions}
          isMulti
          placeholder="Нормативные документы и СП"
          value={data.norms}
          onChange={v => setNorm(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], norms: v }
          }))}
          className="text-sm text-black w-full"
          classNamePrefix="react-select"
        />
        <FormField
          type="checkbox"
          label="Исполнительный реестр"
          checked={data.exec}
          onChange={e => setNorm(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], exec: e.target.checked }
          }))}
        />
      </div>
      <Textarea
        placeholder="Представление в документе с указанием СП"
        value={data.presentationWithNorms}
        readOnly
      />
    </GroupBox>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        {renderDocSection("Основной раздел проекта", norm.main, "main")}
        {renderDocSection("Вспомогательный раздел проекта", norm.aux, "aux")}
      </div>

      <Textarea
        placeholder="Представление в документе"
        className="h-24"
        value={combinedPresentation}
        readOnly
      />
      <Textarea
        placeholder="Представление в документе с указанием СП"
        className="h-24"
        value={combinedPresentationWithNorms}
        readOnly
      />

      <div className="flex justify-end gap-4">
        <Button onClick={handleClear}>Очистить</Button>
      </div>
    </div>
  );
}


