import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Tabs from "@/components/UI/Tabs";
import AOSRDescriptionTab from "./AOSRDescriptionTab";
import AOSRNormTab from "./AOSRNormTab";
import AOSRMaterialsTab from "./AOSRMaterialsTab";
import AOSRDocsTab from "./AOSRDocsTab";
import AOSRResponsibleTab from "./AOSRResponsibleTab";
import { useAOSRCreate } from "./AOSRCreateContext";
import api from "@/api/axios";

export default function AOSRCreate() {
  const { common, setCommon } = useAOSRCreate();

  // Локальные стейты для списков
  const [sites, setSites] = useState([]);
  const [objects, setObjects] = useState([]);
  const [zones, setZones] = useState([]);

  // Загружаем стройки
  useEffect(() => {
    api.get("/construction/sites").then(res =>
      setSites(
        res.data.map(site => ({
          value: site.id,
          label: site.short_name || site.name
        }))
      )
    );
  }, []);

  // Загружаем объекты при выборе стройки
  useEffect(() => {
    if (!common.construction) {
      setObjects([]);
      setZones([]);
      setCommon(c => ({ ...c, object: "", section: "" }));
      return;
    }
    api.get(`/construction/objects/${common.construction}`).then(res =>
      setObjects(
        res.data.map(obj => ({
          value: obj.id,
          label: obj.short_name || obj.name
        }))
      )
    );
    setZones([]);
    setCommon(c => ({ ...c, object: "", section: "" }));
    // eslint-disable-next-line
  }, [common.construction]);

  // Загружаем участки при выборе объекта
  useEffect(() => {
    if (!common.object) {
      setZones([]);
      setCommon(c => ({ ...c, section: "" }));
      return;
    }
    api.get(`/construction/zones/${common.object}`).then(res =>
      setZones(
        res.data.map(zone => ({
          value: zone.id,
          label: zone.name
        }))
      )
    );
    setCommon(c => ({ ...c, section: "" }));
    // eslint-disable-next-line
  }, [common.object]);

  const tabs = [
    { label: "Описание работ", component: <AOSRDescriptionTab /> },
    { label: "Нормативная документация", component: <AOSRNormTab /> },
    { label: "Материалы", component: <AOSRMaterialsTab /> },
    { label: "Исполнительная документация", component: <AOSRDocsTab /> },
    { label: "Ответственные лица", component: <AOSRResponsibleTab /> },
  ];

  return (
    <PageWrapper title="Создание акта освидетельствования">
      <div className="group-box border border-[--color-border] mb-4">
        <h3 className="group-box-title mb-4">Объект</h3>
        {/* Первая строка: стройка, объект, участок */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          <ComboBox
            placeholder="Стройка"
            options={sites}
            value={common.construction}        
            onChange={option => setCommon(c => ({ ...c, construction: option?.value || "" }))}
            className="col-span-2"
          />
          <ComboBox
            placeholder="Объект"
            options={objects}
            value={common.object}
            onChange={option => setCommon(c => ({ ...c, object: option?.value || "" }))}
            className="col-span-2"
            disabled={!common.construction}
          />
          <ComboBox
            placeholder="Участок"
            options={zones}
            value={common.section}
            onChange={option => setCommon(c => ({ ...c, section: option?.value || "" }))}
            className="col-span-2"
            disabled={!common.object}
          />
        </div>

        {/* Вторая строка: № акта, наименование, статус акта */}
        <div className="grid grid-cols-6 gap-4">
          <Input
            placeholder="№ Акта"
            value={common.actNumber}
            onChange={e => setCommon(c => ({ ...c, actNumber: e.target.value }))}
            className="col-span-1"
          />
          <Input
            placeholder="Полное наименование акта"
            value={common.actName}
            onChange={e => setCommon(c => ({ ...c, actName: e.target.value }))}
            className="col-span-4"
          />
          <select
            className="w-full p-2 rounded border border-[--color-border] text-[--color-primary]"
            value={common.status || ""}
            onChange={e => setCommon(c => ({ ...c, status: e.target.value }))}
          >
            <option value="">Статус акта</option>
            <option value="Черновик">Черновик</option>
            <option value="Подписан">Подписан</option>
            <option value="Отклонён">Отклонён</option>
          </select>
        </div>
      </div>

      <Tabs tabs={tabs} />

      <div className="flex justify-end mt-6">
        <Button>Сформировать АОСР</Button>
      </div>
    </PageWrapper>
  );
}

