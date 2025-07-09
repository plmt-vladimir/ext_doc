import { useState, useEffect } from "react";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import ModalMessage from "@/components/UI/ModalMessage";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import { Upload, Trash2, Pencil } from "lucide-react";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

export default function IgsList() {
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
  const [igsList, setIgsList] = useState([]);

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
      fetchIgs();
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
      fetchIgs();
    }
  }, [object]);

  useEffect(() => {
    if (section || object || construction) {
      fetchIgs();
    }
  }, [section]);

  const fetchIgs = async () => {
    if (!construction?.value) return;
    const params = { site_id: construction.value };
    if (object?.value) params.object_id = object.value;
    if (section?.value) params.zone_id = section.value;
    const res = await api.get("/igs", { params });
    setIgsList(res.data);
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
      const response = await api.post("/igs/upload", formData);
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
      await api.put(`/igs/${editId}`, payload);
    } else {
      await api.post("/igs", payload);
    }

    fetchIgs();
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
    const item = igsList[idx];

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
    const id = igsList[idx].id;
    await api.delete(`/igs/${id}`);
    fetchIgs();
    resetForm();
  };

  const headers = [
    "ID стройки", "ID объекта", "ID участка", "Название", "Оси", "Отметки", "Дата", "Файл", ""
  ];

  const rows = igsList.map((item, idx) => [
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
    <PageWrapper title="Загрузка ИГС">
      <div className="grid grid-cols-5 gap-4">
        {/* Блок выбора объекта */}
        <GroupBox className="col-span-2" title="Объект" bordered>
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col">
              <Label className="text-sm text-[--color-primary]">Строительство</Label>
              <ComboBox placeholder="Строительство" options={constructions} value={construction} onChange={setConstruction} />
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
        <GroupBox className="col-span-3" title="Загрузка ИГС" bordered>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="col-span-3 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Имя документа</Label>
              <Input placeholder="Имя документа" value={docName} onChange={(e) => setDocName(e.target.value)} />
            </div>

            <div className="col-span-3 flex flex-col">
              <Label className="text-sm text-[--color-primary]">Файл</Label>
              <div className="flex gap-2 items-center">
                <input id="file-upload" type="file" onChange={handleUpload} className="hidden" />
                <Button type="button" onClick={() => document.getElementById("file-upload")?.click()} className="flex items-center gap-2">
                  <Upload className="w-4 h-4 rotate-180" /> Загрузить
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

      <GroupBox className="mt-4" title="Загруженные ИГС" bordered>
        <Table headers={headers} rows={rows} pageSize={10} />
      </GroupBox>

      <ModalMessage
        open={showModal}
        mode="notification"
        title="Ошибка"
        message="Пожалуйста, заполните все обязательные поля: Стройка, Название, Оси, Отметки, Дата, Файл"
        onCancel={() => setShowModal(false)}
      />
    </PageWrapper>
  );
}
