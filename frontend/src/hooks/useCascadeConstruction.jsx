import { useEffect, useState } from "react";
import api from "@/api/axios"; // ← вот здесь исправлено

export default function useCascadeConstruction({ siteId, objectId }) {
  const [sites, setSites] = useState([]);
  const [objects, setObjects] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    api.get("/construction/sites").then((res) => {
      setSites(
        res.data.map((site) => ({
          value: site.id,
          label: site.short_name,
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (!siteId) {
      setObjects([]);
      setZones([]);
      return;
    }

    api.get(`/construction/objects/${siteId}`).then((res) => {
      setObjects(
        res.data.map((obj) => ({
          value: obj.id,
          label: obj.short_name,
        }))
      );
    });
  }, [siteId]);

  useEffect(() => {
    if (!objectId) {
      setZones([]);
      return;
    }

    api.get(`/construction/zones/${objectId}`).then((res) => {
      setZones(
        res.data.map((zone) => ({
          value: zone.id,
          label: zone.name,
        }))
      );
    });
  }, [objectId]);

  return { sites, objects, zones };
}



