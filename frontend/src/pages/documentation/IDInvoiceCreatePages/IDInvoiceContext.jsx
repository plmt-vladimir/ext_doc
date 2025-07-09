import { createContext, useContext, useState } from "react";

const IDInvoiceContext = createContext();

export const IDInvoiceProvider = ({ children }) => {
  const [construction, setConstruction] = useState("");
  const [object, setObject] = useState("");
  const [section, setSection] = useState("");
  const [registerPoints, setRegisterPoints] = useState([]);
  const [selectedAooks, setSelectedAooks] = useState([]);
  const [status, setStatus] = useState("");
  const [includeIGS, setIncludeIGS] = useState(false);
  const [includeQualityDocs, setIncludeQualityDocs] = useState(false);

  const [deliveryData, setDeliveryData] = useState([
    {
      id: 1,
      index: "1",
      actNumber: "АОСР-001",
      actName: "АОСР скрытых работ",
      location: "Ось А-Г, Отм. +0.000",
      period: "01.03.2025 – 05.03.2025",
      note: "",
      checked: false
    },
    {
      id: 2,
      index: "2",
      actNumber: "ИГС-002",
      actName: "Испытания сварных соединений",
      location: "Секция 2",
      period: "06.03.2025",
      note: "Протокол №45",
      checked: false
    }
  ]);

  const [registryData, setRegistryData] = useState([
    {
      id: 1,
      index: "1",
      actNumber: "АОСР-001",
      actName: "АОСР скрытых работ",
      date: "01.03.2025",
      organization: "ООО СтройИнвест",
      pages: "5",
      copies: "2",
      checked: false
    },
    {
      id: 2,
      index: "2",
      actNumber: "ИГС-002",
      actName: "Испытания сварных соединений",
      date: "06.03.2025",
      organization: "АО ГеоТест",
      pages: "3",
      copies: "1",
      checked: false
    }
  ]);

  return (
    <IDInvoiceContext.Provider value={{
      construction, setConstruction,
      object, setObject,
      section, setSection,
      registerPoints, setRegisterPoints,
      selectedAooks, setSelectedAooks,
      status, setStatus,
      includeIGS, setIncludeIGS,
      includeQualityDocs, setIncludeQualityDocs,
      deliveryData, setDeliveryData,
      registryData, setRegistryData,
    }}>
      {children}
    </IDInvoiceContext.Provider>
  );
};

export const useIDInvoice = () => useContext(IDInvoiceContext);

