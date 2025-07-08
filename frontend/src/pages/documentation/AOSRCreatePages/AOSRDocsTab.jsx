import { useEffect, useState } from "react";
import api from "@/api/axios";
import GroupBox from "@/components/UI/Groupbox";
import Textarea from "@/components/UI/Textarea";
import Button from "@/components/UI/Button";
import FilterableTable from "@/components/widgets/FilterableTable";
import Table from "@/components/widgets/Table";
import { Trash2, Plus } from "lucide-react";
import { useAOSRCreate } from "./AOSRCreateContext";

export default function AOSRDocsTab() {
  const { docs, setDocs, common } = useAOSRCreate();
  const { geodesyDocs, labDocs, presentationGeo, presentationLab } = docs;
  const [igsDocs, setIgsDocs] = useState([]);
  const [labDocsList, setLabDocsList] = useState([]);

  const columns = (handleAdd) => [
    { header: "Наименование", accessor: "name", filterType: "text" },
    { header: "Номер", accessor: "number", filterType: "text" },
    { header: "Дата", accessor: "date", filterType: "date" },
    {
      header: "", accessor: "actions", filterType: null,
      render: (_, row) => (
        <button onClick={() => handleAdd(row)} className="text-green-600 hover:text-green-800">
          <Plus size={16} />
        </button>
      )
    }
  ];

  const tableRows = (data, handleDelete) =>
    data.map((item, idx) => [
      item.name,
      item.number,
      item.date,
      <button onClick={() => handleDelete(idx)} className="text-red-600 hover:text-red-800">
        <Trash2 size={16} />
      </button>
    ]);
  useEffect(() => {
    if (!common?.construction) {
      setIgsDocs([]);
      setLabDocsList([]);
      return;
    }
    const params = { site_id: common.construction };
    if (common.object) params.object_id = common.object;
    if (common.section) params.zone_id = common.section;
    api.get("/igs", { params }).then(res => setIgsDocs(res.data));
    api.get("/labtests", { params }).then(res => setLabDocsList(res.data));
  }, [common.construction, common.object, common.section]);

  const igsColumns = [
    { header: "Название", accessor: "title", filterType: "text" },
    { header: "Оси", accessor: "axes", filterType: "text" },
    { header: "Отметки", accessor: "marks", filterType: "text" },
    { header: "Дата", accessor: "date", filterType: "date" },
    {
      header: "Файл", accessor: "file_url", filterType: null,
      render: (_, row) => (
        <a
          href={`${import.meta.env.VITE_REACT_APP_API_URL}${row.file_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.file_url.split("/").pop()}
        </a>
      )
    },
    {
      header: "", accessor: "actions", filterType: null,
      render: (_, row) => (
        <button onClick={() => handleAddDoc("geodesy", row)} className="text-green-600 hover:text-green-800">
          <Plus size={16} />
        </button>
      )
    }
  ];

  const labColumns = [
    { header: "Название", accessor: "title", filterType: "text" },
    { header: "Оси", accessor: "axes", filterType: "text" },
    { header: "Отметки", accessor: "marks", filterType: "text" },
    { header: "Дата", accessor: "date", filterType: "date" },
    {
      header: "Файл", accessor: "file_url", filterType: null,
      render: (_, row) => (
        <a
          href={`${import.meta.env.VITE_REACT_APP_API_URL}${row.file_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.file_url.split("/").pop()}
        </a>
      )
    },
    {
      header: "", accessor: "actions", filterType: null,
      render: (_, row) => (
        <button onClick={() => handleAddDoc("lab", row)} className="text-green-600 hover:text-green-800">
          <Plus size={16} />
        </button>
      )
    }
  ];
  const handleAddDoc = (type, doc) => {
    setDocs(prev => {
      const key = type === "geodesy" ? "geodesyDocs" : "labDocs";
      const list = prev[key];
      if (!list.some((d) => d.name === doc.name)) {
        return { ...prev, [key]: [...list, doc] };
      }
      return prev;
    });
  };

  const handleDeleteDoc = (type, index) => {
    setDocs(prev => {
      const key = type === "geodesy" ? "geodesyDocs" : "labDocs";
      const list = [...prev[key]];
      list.splice(index, 1);
      return { ...prev, [key]: list };
    });
  };

  const igsTableRows = geodesyDocs.map((item, idx) => [
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
    <button onClick={() => handleDeleteDoc("geodesy", idx)} className="text-red-600 hover:text-red-800">
      <Trash2 size={16} />
    </button>
  ]);

  const labTableRows = labDocs.map((item, idx) => [
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
    <button onClick={() => handleDeleteDoc("lab", idx)} className="text-red-600 hover:text-red-800">
      <Trash2 size={16} />
    </button>
  ]);

  return (
    <div className="flex flex-col gap-6">
      <GroupBox title="а) Исполнительные геодезические схемы положения конструкций" bordered>
        <FilterableTable
          columns={igsColumns}
          data={igsDocs}
        />
        <div className="mt-4">
          <Table
            headers={["Название", "Оси", "Отметки", "Дата", "Файл", ""]}
            rows={igsTableRows}
          />
        </div>
      </GroupBox>

      <GroupBox title="б) Результаты экспертиз, обследований, лабораторных и иных испытаний" bordered>
        <FilterableTable
          columns={labColumns}
          data={labDocsList}
        />
        <div className="mt-4">
          <Table
            headers={["Название", "Оси", "Отметки", "Дата", "Файл", ""]}
            rows={labTableRows}
          />
        </div>
      </GroupBox>

      <div className="flex justify-end gap-4">
        <Button onClick={() => setDocs({
          geodesyDocs: [],
          labDocs: [],
          presentationGeo: "",
          presentationLab: "",
        })}>Очистить</Button>
      </div>
    </div>
  );
}