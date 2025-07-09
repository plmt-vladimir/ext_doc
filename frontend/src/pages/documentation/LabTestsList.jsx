import { useState, useEffect } from "react";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import ModalMessage from "@/components/UI/ModalMessage";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import GroupBox from "@/components/UI/GroupBox";
import { Upload, Trash2, Pencil } from "lucide-react";
import Label from "@/components/UI/Label";

export default function LabTestList() {
  const [constructions, setConstructions] = useState([]);
  const [objects, setObjects] = useState([]);
  const [sections, setSections] = useState([]);

  const [construction, setConstruction] = useState(null);
  const [object, setObject] = useState(null);
  const [section, setSection] = useState(null);

  const [docName, setDocName] = useState("");
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [axes, setAxes] = useState("");
  const [marks, setMarks] = useState("");
  const [date, setDate] = useState("");
  const [tests, setTests] = useState([]);

  const [editIdx, setEditIdx] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/construction/sites").then(res =>
      setConstructions(res.data.map(site => ({
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
      setSections([]);
      setSection(null);
      fetchLabTests();
    }
  }, [construction]);

  useEffect(() => {
    if (object?.value) {
      api.get(`/construction/zones/${object.value}`).then(res =>
        setSections(res.data.map(zone => ({
          value: zone.id,
          label: zone.name
        })))
      );
      setSection(null);
      fetchLabTests();
    }
  }, [object]);

  useEffect(() => {
    if (section || object || construction) {
      fetchLabTests();
    }
  }, [section]);

  const fetchLabTests = async () => {
    if (!construction?.value) return;
    const params = { site_id: construction.value };
    if (object?.value) params.object_id = object.value;
    if (section?.value) params.zone_id = section.value;
    const res = await api.get("/labtests", { params });
    setTests(res.data);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilePath(file);
    setFileName(file.name);
  };

  const handleSave = async () => {
    if (!construction?.value || !docName || !filePath || !axes || !marks || !date) {
      setShowModal(true);
      return;
    }

    let uploadedFileUrl = "";

    if (filePath instanceof File) {
      const formData = new FormData();
      formData.append("file", filePath);
      const response = await api.post("/labtests/upload", formData);
      uploadedFileUrl = response.data.file_url;
    } else {
      uploadedFileUrl = filePath;
    }

    const payload = {
      title: docName,
      file_url: uploadedFileUrl,
      axes,
      marks,
      date,
      site_id: construction.value,
      object_id: object?.value || null,
      zone_id: section?.value || null
    };

    if (editId !== null) {
      await api.put(`/labtests/${editId}`, payload);
    } else {
      await api.post("/labtests", payload);
    }

    fetchLabTests();
    resetForm();
  };

  const resetForm = () => {
    setConstruction(null);
    setObject(null);
    setSection(null);
    setDocName("");
    setFileName("");
    setFilePath("");
    setAxes("");
    setMarks("");
    setDate("");
    setEditIdx(null);
    setEditId(null);
  };

  const handleEdit = (idx) => {
    const item = tests[idx];

    const site = constructions.find(c => c.value === item.site_id);
    const obj = objects.find(o => o.value === item.object_id);
    const zone = sections.find(z => z.value === item.zone_id);

    setConstruction(site || null);
    setObject(obj || null);
    setSection(zone || null);

    setDocName(item.title);
    setAxes(item.axes);
    setMarks(item.marks);
    setDate(item.date);
    setFileName(item.file_url.split("/").pop());
    setFilePath(item.file_url);
    setEditIdx(idx);
    setEditId(item.id);
  };

  const handleDelete = async (idx) => {
    const id = tests[idx].id;
    await api.delete(`/labtests/${id}`);
    fetchLabTests();
    resetForm();
  };

  const headers = [
    "ID стройки", "ID объекта", "ID участка", "Протокол", "В осях", "Отметки", "Дата", "Файл", ""
  ];

  const rows = tests.map((item, idx) => [
    item.site_id,
    item.object_id || "-",
    item.zone_id || "-",
    item.title,
    item.axes,
    item.marks,
    item.date,
    <a
      href={`${import.meta.env.VITE_REACT_APP_API_URL}${item.file_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {item.file_url.split("/").pop()}
    </a>,
    <div key={idx} className="flex gap-2 justify-center">
      <Pencil
        className="cursor-pointer hover:text-blue-700"
        title="Редактировать"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(idx);
        }}
      />
      <Trash2
        className="cursor-pointer text-red-600 hover:text-red-800"
        title="Удалить"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(idx);
        }}
      />
    </div>
  ]);

  return (
    <PageWrapper title="Лабораторные испытания">
      <div className="grid grid-cols-5 gap-4">
        {/* Блок выбора объекта */}
        <GroupBox className="col-span-2" title="Объект" bordered>
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col">
              <Label className="text-sm text-[--color-primary]">Стройка</Label>
              <ComboBox placeholder="Стройка" options={constructions} value={construction} onChange={setConstruction} />
            </div>
            <div className="flex flex-col">
              <Label className="text-sm text-[--color-primary]">Объект</Label>
              <ComboBox placeholder="Объект" options={objects} value={object} onChange={setObject} />
            </div>
            <div className="flex flex-col">
              <Label className="text-sm text-[--color-primary]">Участок</Label>
              <ComboBox placeholder="Участок" options={sections} value={section} onChange={setSection} />
            </div>
          </div>
        </GroupBox>
  
        {/* Блок загрузки */}
        <GroupBox className="col-span-3" title="Загрузка лабораторных испытаний" bordered>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="col-span-3 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Протокол</Label>
              <Input placeholder="Протокол" value={docName} onChange={(e) => setDocName(e.target.value)} />
            </div>
  
            <div className="col-span-3 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Файл</Label>
              <div className="flex gap-2 items-center">
                <input id="file-upload" type="file" onChange={handleUpload} className="hidden" />
                <Button type="button" onClick={() => document.getElementById("file-upload")?.click()} className="flex items-center gap-2">
                  <Upload className="w-4 h-4 rotate-180" /> Загрузить файл
                </Button>
                <span className="text-sm text-gray-600 truncate">{fileName || "Файл не выбран"}</span>
              </div>
            </div>
  
            <div className="col-span-2 flex flex-col">
              <Label className="text-sm text-[--color-primary]">В осях</Label>
              <Input placeholder="В осях" value={axes} onChange={(e) => setAxes(e.target.value)} />
            </div>
  
            <div className="col-span-2 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Отметки</Label>
              <Input placeholder="Отметки" value={marks} onChange={(e) => setMarks(e.target.value)} />
            </div>
  
            <div className="col-span-2 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Дата</Label>
              <Input type="date" placeholder="Дата" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
  
            <div className="col-span-2 col-start-3 flex items-end">
              <Button onClick={handleSave} className="w-full" color={editIdx !== null ? "primary" : undefined}>
                {editIdx !== null ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </div>
        </GroupBox>
      </div>
  
      <GroupBox className="mt-4" title="Загруженные лабораторные испытания" bordered>
        <Table headers={headers} rows={rows} pageSize={10} />
      </GroupBox>
  
      <ModalMessage
        open={showModal}
        mode="notification"
        title="Ошибка"
        message="Пожалуйста, заполните все обязательные поля:\nСтройка, Название, Оси, Отметки, Дата, Файл"
        onCancel={() => setShowModal(false)}
      />
    </PageWrapper>
  );
  
}

