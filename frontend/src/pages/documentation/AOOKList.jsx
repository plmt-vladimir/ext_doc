import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import { Pencil, Copy, Trash2 } from "lucide-react";
import useCascadeConstruction from "@/hooks/useCascadeConstruction";
import { useEffect, useState } from "react";

// Определи роли
const ROLES = [
  { key: "customer", label: "Заказчик" },
  { key: "generalContractor", label: "Генподрядчик" },
  { key: "supervisor", label: "Стройконтроль" },
  { key: "designer", label: "Проектировщик" },
  { key: "contractor", label: "Подрядчик" },
  { key: "subContractor", label: "Субподрядчик" }
];

// Маппинг API → строки для таблицы
function mapAookData(apiData) {
  return apiData.map(item => {
    const responsiblesByRole = {};
    ROLES.forEach(r => { responsiblesByRole[r.key] = ""; });
    item.responsibles?.forEach(responsible => {
      const foundRole = ROLES.find(r => r.label === responsible.role);
      if (foundRole) {
        responsiblesByRole[foundRole.key] = responsible.full_name;
      }
    });
    return {
      id: item.id,
      name: item.full_name,
      ...responsiblesByRole,
      status: item.status || ""
    };
  });
}

export default function AOOKList() {
  const {
    constructions,
    construction,
    setConstruction,
    objects,
    object,
    setObject,
    zones,
    zone,
    setZone,
  } = useCascadeConstruction();

  const [aookList, setAookList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!object && !zone) {
      setAookList([]);
      return;
    }

    const params = new URLSearchParams();
    if (object) params.append("object_id", object.toString());
    else if (zone) params.append("zone_id", zone.toString());

    fetch(`/api/aook/by-location?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        return res.json();
      })
      .then((data) => {
        setAookList(mapAookData(data));
      })
      .catch((error) => {
        console.error(error);
        setAookList([]);
      });
  }, [object, zone]);

  const handleAdd = () => {
    navigate("/aooklist/create");
  };
  const handleEdit = (item) => {
    navigate(`/aooklist/edit/${item.id}`);
  };
  const handleDelete = (item) => {
    fetch(`/api/aook/${item.id}`, { method: "DELETE" }).then(() => {
      setAookList((prev) => prev.filter((i) => i.id !== item.id));
    });
  };
  const handleCopy = (item) => {
    const copy = { ...item, id: Date.now(), name: `${item.name} (копия)` };
    setAookList((prev) => [...prev, copy]);
  };
  const handleStatusChange = (id, value) => {
    fetch(`/api/aook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    }).then(() => {
      setAookList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: value } : item))
      );
    });
  };

  // Формируем столбцы, роли идут по порядку, чтобы каждый был отдельной колонкой
  const columns = [
    { header: "Наименование", accessor: "name", filterType: "text" },
    ...ROLES.map(role => ({
      header: role.label,
      accessor: role.key,
      filterType: "text"
    })),
    {
      header: "Статус",
      accessor: "status",
      filterType: "select",
      options: [
        { label: "Черновик", value: "Черновик" },
        { label: "Подписан", value: "Подписан" },
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
      ),
    },
    {
      header: "Действия",
      accessor: "actions",
      noFilter: true,
      render: (_, row) => (
        <div className="flex justify-center gap-2 text-[--color-primary]">
          <Pencil
            size={18}
            className="cursor-pointer"
            onClick={() => handleEdit(row)}
          />
          <Copy
            size={18}
            className="cursor-pointer"
            onClick={() => handleCopy(row)}
          />
          <Trash2
            size={18}
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper title="Акты освидетельствования ответственных конструкций">
      <div className="group-box border border-[--color-border]">
        <h3 className="group-box-title mb-4">
          Акты освидетельствования ответственных конструкций
        </h3>
        {/* Фильтры */}
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
              disabled={!construction}
            />
          </div>
          <div className="col-span-4">
            <ComboBox
              placeholder="Участок"
              options={zones}
              value={zone}
              onChange={setZone}
              disabled={!object}
            />
          </div>
        </div>
        {/* Таблица */}
        <FilterableTable columns={columns} data={aookList} />
        <div className="flex justify-end mt-4">
          <Button onClick={handleAdd}>Добавить</Button>
        </div>
      </div>
    </PageWrapper>
  );
}


