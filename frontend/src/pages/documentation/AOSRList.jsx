import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Pencil, Copy, Trash2 } from "lucide-react";

export default function AOSRList() {
  // Каскадные фильтры
  const [constructions, setConstructions] = useState([]);
  const [objects, setObjects] = useState([]);
  const [sections, setSections] = useState([]);

  const [construction, setConstruction] = useState(null);
  const [object, setObject] = useState(null);
  const [section, setSection] = useState(null);

  const [aosrList, setAosrList] = useState([]);

  const navigate = useNavigate();

  // === Загрузка стройки ===
  useEffect(() => {
    api.get("/construction/sites").then(res =>
      setConstructions(res.data.map(site => ({
        value: site.id,
        label: site.short_name || site.full_name || `Стройка #${site.id}`,
      })))
    );
  }, []);

  // === Загрузка объектов по стройке ===
  useEffect(() => {
    if (construction?.value) {
      api.get(`/construction/objects/${construction.value}`).then(res =>
        setObjects(res.data.map(obj => ({
          value: obj.id,
          label: obj.short_name || obj.full_name || `Объект #${obj.id}`,
        })))
      );
      setObject(null);
      setSections([]);
      setSection(null);
      fetchAosrList(construction.value, null, null);
    } else {
      setObjects([]);
      setObject(null);
      setSections([]);
      setSection(null);
      setAosrList([]);
    }
  }, [construction]);

  // === Загрузка участков по объекту ===
  useEffect(() => {
    if (object?.value) {
      api.get(`/construction/zones/${object.value}`).then(res =>
        setSections(res.data.map(zone => ({
          value: zone.id,
          label: zone.name || `Участок #${zone.id}`,
        })))
      );
      setSection(null);
      fetchAosrList(construction?.value, object.value, null);
    } else {
      setSections([]);
      setSection(null);
      if (construction?.value) fetchAosrList(construction.value, null, null);
    }
  }, [object]);

  // === Загрузка по участку ===
  useEffect(() => {
    if (section?.value) {
      fetchAosrList(construction?.value, object?.value, section.value);
    } else if (object?.value) {
      fetchAosrList(construction?.value, object.value, null);
    } else if (construction?.value) {
      fetchAosrList(construction.value, null, null);
    }
  }, [section]);

  // === Получение АОСР из API ===
  const fetchAosrList = async (siteId, objectId, zoneId) => {
    if (!siteId) {
      setAosrList([]);
      return;
    }
    const params = { site_id: siteId };
    if (objectId) params.object_id = objectId;
    if (zoneId) params.zone_id = zoneId;
    try {
      const res = await api.get("/aosr", { params });
      setAosrList(res.data);
    } catch (err) {
      setAosrList([]);
    }
  };

  // === Обработчики CRUD ===
  const handleAdd = () => {
    navigate("/aosrlist/create");
  };

  const handleEdit = (item) => {
    navigate(`/aosrlist/edit/${item.id}`);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Удалить акт?")) return;
    await api.delete(`/aosr/${item.id}`);
    fetchAosrList(construction?.value, object?.value, section?.value);
  };

  // handleCopy пока просто локально (реального API на копирование нет)
  const handleCopy = (item) => {
    const copy = { ...item, id: Date.now(), full_name: `${item.full_name} (копия)` };
    setAosrList((prev) => [...prev, copy]);
  };

  const handleStatusChange = async (id, value) => {
    // Если у тебя на бэке PATCH для изменения статуса, раскомментируй:
    // await api.patch(`/aosr/${id}`, { status: value });
    setAosrList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  // === Колонки таблицы (адаптируй под схему Out) ===
  const columns = [
    { header: "Номер акта", accessor: "act_number", filterType: "text" },
    { header: "Наименование", accessor: "full_name", filterType: "text" },
    { header: "Дата начала", accessor: "start_date", filterType: "date" },
    { header: "Дата окончания", accessor: "end_date", filterType: "date" },
    { header: "Дата подписания", accessor: "sign_date", filterType: "date" },
    { header: "Статус", accessor: "status", filterType: "select",
      options: [
        { label: "Черновик", value: "Черновик" },
        { label: "Подписан", value: "Подписан" }
      ],
      render: (val, row) => (
        <select
          className="border border-[--color-border] rounded px-2 py-1 text-sm"
          value={val}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="Черновик">Черновик</option>
          <option value="Подписан">Подписан</option>
        </select>
      )
    },
    {
      header: "Действия", accessor: "actions", noFilter: true,
      render: (_, row) => (
        <div className="flex justify-center gap-2 text-[--color-primary]">
          <Pencil size={18} className="cursor-pointer" onClick={() => handleEdit(row)} />
          <Copy size={18} className="cursor-pointer" onClick={() => handleCopy(row)} />
          <Trash2 size={18} className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
        </div>
      )
    }
  ];

  return (
    <PageWrapper title="Акты освидетельствования скрытых работ">
      <div className="group-box border border-[--color-border]">
        <h3 className="group-box-title mb-4">Акты освидетельствования скрытых работ</h3>

        {/* Каскадные фильтры */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4">
            <ComboBox
              placeholder="Стройка"
              options={constructions}
              value={construction}
              onChange={setConstruction}
            />
          </div>
          <div className="col-span-4">
            <ComboBox
              placeholder="Объект"
              options={objects}
              value={object}
              onChange={setObject}
              isDisabled={!construction}
            />
          </div>
          <div className="col-span-4">
            <ComboBox
              placeholder="Участок"
              options={sections}
              value={section}
              onChange={setSection}
              isDisabled={!object}
            />
          </div>
        </div>

        {/* Таблица */}
        <FilterableTable
          columns={columns}
          data={aosrList}
        />

        <div className="flex justify-end mt-4">
          <Button onClick={handleAdd}>Добавить</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
