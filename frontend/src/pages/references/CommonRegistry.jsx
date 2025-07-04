import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import EditableTable from "@/components/widgets/EditableTable";
import ModalMessage from "@/components/UI/ModalMessage";
import api from "@/api/axios";

export default function CommonRegistry() {
  const [construction, setConstruction] = useState(null);
  const [object, setObject] = useState(null);
  const [project, setProject] = useState(null);
  const [workRegistry, setWorkRegistry] = useState([]);
  const [projectSections, setProjectSections] = useState([]);

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
    }
  }, [construction]);

  useEffect(() => {
    if (object?.value) {
      // === 1. Загружаем work registry ===
      api
        .get(`/dictionaries/work-registry`, {
          params: { object_id: object.value },
        })
        .then((res) => setWorkRegistry(res.data))
        .catch((err) => {
          console.error("Ошибка при загрузке work-registry", err);
          setWorkRegistry([]);
        });

      // === 2. Загружаем проект и разделы ===
      api.get(`/projects/by-object/${object.value}`).then(async (res) => {
        let loadedProject = res.data.project;
        let sections = res.data.sections;

        // === если проекта нет — создаём ===
        if (!loadedProject) {
          try {
            const newProjectResp = await api.post("/projects", {
              object_id: object.value,
              name: "Новый проект"
            });
            loadedProject = newProjectResp.data;
            sections = [];
          } catch (err) {
            console.error("Ошибка при создании проекта", err);
          }
        }

        setProject(loadedProject);
        setProjectSections(sections);
      }).catch((err) => {
        console.error("Ошибка при загрузке project-sections", err);
        setProject(null);
        setProjectSections([]);
      });
    }
  }, [object]);

  const handleSaveAll = async () => {
    try {
      // === Сохраняем workRegistry ===
      for (const row of workRegistry) {
        if (!row.code || !row.title) continue;

        if (row.id) {
          await api.put(`/api/dictionaries/work-registry/${row.id}`, row);
        } else {
          await api.post(`/api/dictionaries/work-registry`, {
            ...row,
            object_id: object.value,
          });
        }
      }

      // === Сохраняем projectSections ===
      for (const row of projectSections) {
        if (!row.section_code || !row.section_name) continue;

        const payload = {
          ...row,
          object_id: object.value,
          project_id: project?.id,
        };

        if (row.id) {
          await api.put(`/api/project-sections/${row.id}`, payload);
        } else {
          await api.post(`/api/project-sections`, payload);
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
      {/* === Блок выбора стройки и объекта === */}
      <div className="group-box border border-[--color-border] p-4 mb-4">
        <h3 className="group-box-title mb-4 text-[--color-primary]">Объект</h3>
        <div className="grid grid-cols-6 gap-4">
          <ComboBox
            placeholder="Стройка"
            options={sites}
            value={construction}
            onChange={(val) => {
              setConstruction(val);
              setObject(null);
            }}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Объект"
            options={objects}
            value={object}
            onChange={(val) => setObject(val)}
            className="col-span-2"
          />
        </div>
      </div>

      {/* === Реестр работ и разделы === */}
      {object?.value && (
        <>
          <div className="group-box border border-[--color-border] p-4 mb-4">
            <h3 className="group-box-title mb-4 text-[--color-primary]">
              Реестр работ
            </h3>
            <EditableTable
              data={workRegistry}
              onChange={setWorkRegistry}
              columns={[
                { key: "code", label: "Код" },
                { key: "title", label: "Наименование" },
              ]}
            />
          </div>

          <div className="group-box border border-[--color-border] p-4 mb-4">
            <h3 className="group-box-title mb-4 text-[--color-primary]">
              Разделы проекта
            </h3>
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
          </div>

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
