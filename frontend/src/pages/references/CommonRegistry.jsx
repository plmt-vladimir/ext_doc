import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import EditableTable from "@/components/widgets/EditableTable";
import ModalMessage from "@/components/UI/ModalMessage";
import api from "@/api/axios";
import GroupBox from "@/components/UI/Groupbox";
import Label from "@/components/UI/Label";

export default function CommonRegistry() {
  const [construction, setConstruction] = useState(null);
  const [object, setObject] = useState(null);
  const [project, setProject] = useState(null);
  const [workRegistry, setWorkRegistry] = useState([]);
  const [projectSections, setProjectSections] = useState([]);

  const [initialWorkRegistry, setInitialWorkRegistry] = useState([]);
  const [initialProjectSections, setInitialProjectSections] = useState([]);

  const [objects, setObjects] = useState([]);
  const [sites, setSites] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    api.get("/construction/sites").then(res =>
      setSites(res.data.map(site => ({
        value: site.id,
        label: site.short_name
      })))
    );
  }, []);

  useEffect(() => {
    if (construction?.value) {
      api.get(`/construction/objects/${construction.value}`).then(res =>
        setObjects(res.data.map(obj => ({
          value: obj.id,
          label: obj.short_name
        })))
      );
      setObject(null);
      setProject(null);
      setProjectSections([]);
      setWorkRegistry([]);
      setInitialWorkRegistry([]);
      setInitialProjectSections([]);
    }
  }, [construction]);

  useEffect(() => {
    if (object?.value) {
      api.get(`/dictionaries/work-registry`, {
        params: { object_id: object.value },
      }).then((res) => {
        setWorkRegistry(res.data);
        setInitialWorkRegistry(res.data);
      });

      api.get(`/projects/by-object/${object.value}`).then(async (res) => {
        let loadedProject = res.data.project;
        let sections = res.data.sections;

        if (!loadedProject) {
          const newProjectResp = await api.post("/projects", {
            object_id: object.value,
            name: "Новый проект"
          });
          loadedProject = newProjectResp.data;
          sections = [];
        }

        setProject(loadedProject);
        setProjectSections(sections);
        setInitialProjectSections(sections);
      }).catch(() => {
        setProject(null);
        setProjectSections([]);
        setInitialProjectSections([]);
      });
    }
  }, [object]);

  const handleSaveAll = async () => {
    try {
      // Удаляем workRegistry
      const deletedWorks = initialWorkRegistry.filter(
        oldRow => !workRegistry.some(row => row.id === oldRow.id)
      );
      for (const row of deletedWorks) {
        await api.delete(`/dictionaries/work-registry/${row.id}`);
      }

      // Удаляем projectSections
      const deletedSections = initialProjectSections.filter(
        oldRow => !projectSections.some(row => row.id === oldRow.id)
      );
      for (const row of deletedSections) {
        await api.delete(`/projects/sections/${row.id}`);
      }

      // Сохраняем workRegistry
      for (const row of workRegistry) {
        if (!row.code || !row.title) continue;
        if (row.id) {
          await api.put(`/dictionaries/work-registry/${row.id}`, row);
        } else {
          await api.post(`/dictionaries/work-registry`, {
            ...row,
            object_id: object.value,
          });
        }
      }

      // Сохраняем projectSections
      for (const row of projectSections) {
        if (!row.section_code || !row.section_name) continue;
        const payload = {
          ...row,
          object_id: object.value,
          project_id: project?.id,
        };

        if (row.id) {
          await api.put(`/projects/sections/${row.id}`, payload);
        } else {
          await api.post(`/projects/sections`, payload);
        }
      }

      setModalMessage("Изменения успешно сохранены.");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setModalMessage("Произошла ошибка при сохранении.");
    } finally {
      setModalOpen(true);
    }
  };

  return (
    <PageWrapper title="Общий реестр (по объектам)">
      <GroupBox bordered className="border border-[--color-border] p-4 mb-4" title="Объект">
        <div className="grid grid-cols-6 gap-x-4 items-center">
          {/* Стройка */}
          <div className="col-span-3 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Стройка</Label>
            <ComboBox
              placeholder="Стройка"
              options={sites}
              value={construction}
              onChange={(val) => {
                setConstruction(val);
                setObject(null);
              }}
              className="w-full"
            />
          </div>

          {/* Объект */}
          <div className="col-span-3 flex items-center gap-2">
            <Label className="whitespace-nowrap mb-0">Объект</Label>
            <ComboBox
              placeholder="Объект"
              options={objects}
              value={object}
              onChange={(val) => setObject(val)}
              className="w-full"
            />
          </div>
        </div>
      </GroupBox>

      {object?.value && (
        <>
          <GroupBox bordered className="border border-[--color-border] p-4 mb-4" title="Реестр работ">
            <EditableTable
              data={workRegistry}
              onChange={setWorkRegistry}
              columns={[
                { key: "code", label: "Код" },
                { key: "title", label: "Наименование" },
              ]}
            />
          </GroupBox>

          <GroupBox bordered className="border border-[--color-border] p-4 mb-4" title="Разделы проекта">
            <EditableTable
              data={projectSections}
              onChange={setProjectSections}
              columns={[
                { key: "section_code", label: "Шифр" },
                { key: "discipline", label: "Раздел проекта" },
                { key: "section_name", label: "Название" },
                { key: "designer", label: "Проектная организация" },
                { key: "sheet_info", label: "Листы" },
              ]}
            />
          </GroupBox>

          <div className="flex justify-end mb-6">
            <button
              className="px-6 py-2 rounded-xl bg-[--color-secondary] text-white hover:bg-[--color-primary] shadow"
              onClick={handleSaveAll}
            >
              Сохранить
            </button>
          </div>
        </>
      )}

      <ModalMessage
        open={modalOpen}
        title="Результат сохранения"
        message={modalMessage}
        onCancel={() => setModalOpen(false)}
      />
    </PageWrapper>
  );
}


