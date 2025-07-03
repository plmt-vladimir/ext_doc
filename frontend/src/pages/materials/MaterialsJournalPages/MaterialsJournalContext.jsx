import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MaterialsJournalContext = createContext();

export const MaterialsJournalProvider = ({ children }) => {
  //1. Фильтры для журналов
  const [construction, setConstruction] = useState(null);
  const [object, setObject] = useState(null);
  const [section, setSection] = useState(null);

  // 2. Журнал поступлений
  const [entries, setEntries] = useState([]);

  //3. Поставленные материалы
  const [materials, setMaterials] = useState([]);

  //4. Форма добавления одного материала
  const [addForm, setAddForm] = useState({
    group: "",
    unit: "",
    qty: "",
    name: "",
  });

  //5. Документы для текущего материала
  const [selectedQualityDocs, setSelectedQualityDocs] = useState([]);

  //6. Форма поставщика
  const [supplierForm, setSupplierForm] = useState({
    organization: "",
    supplyType: "",
    recordNumber: "",
    recordDate: "",
    invoiceNumber: "",
    invoiceDate: "",
    note: "",
    fileName: "",
  });

  //7. Все документы о качестве
  const [qualityDocuments, setQualityDocuments] = useState([]);

  // 8. Справочник материалов
  const [materialReferences, setMaterialReferences] = useState([]);

  //9. Поставщики 
  const [suppliers, setSuppliers] = useState([]);

  //10. Типы документов о качестве
  const [docTypes, setDocTypes] = useState([]);

  //Загрузка справочника материалов 
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("/api/deliveries/material-references");
        setMaterialReferences(response.data);
      } catch (error) {
        console.error("Ошибка загрузки материалов:", error);
      }
    };
    fetchMaterials();
  }, []);

  //Загрузка типов документов о качестве
  useEffect(() => {
    axios.get("/api/dictionaries/quality-doc-types").then(res => setDocTypes(res.data));
  }, []);

  //Загрузка всех документов о качестве
  const fetchQualityDocuments = async () => {
    try {
      const response = await axios.get("/api/deliveries/quality-documents");
      setQualityDocuments(response.data);
    } catch (error) {
      console.error("Ошибка загрузки документов о качестве:", error);
    }
  };
  useEffect(() => {
    fetchQualityDocuments();
  }, []);

  // Загрузка поставщиков по выбранной стройке 
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const params = construction?.value ? { site_id: construction.value } : {};
        const res = await axios.get("/api/deliveries/suppliers", { params });
        setSuppliers(res.data.map(name => ({ value: name, label: name })));
      } catch {
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, [construction]);

  // ДОБАВЛЕНИЕ документа о качестве /Возвращает: { doc, error }
  const addQualityDocument = async ({ file, docType, docNumber, issueDate, expiryDate }) => {
    if (!docType || !docNumber || !issueDate || !expiryDate || !file) {
      return { error: "Заполните все поля документа и выберите файл!" };
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);
      formData.append("number", docNumber);
      formData.append("issue_date", issueDate);
      formData.append("expiry_date", expiryDate);

      const res = await axios.post("/api/deliveries/upload-quality-doc", formData);
      await fetchQualityDocuments(); 
      return { doc: res.data };
    } catch (err) {
      return { error: "Ошибка при добавлении документа" };
    }
  };

  return (
    <MaterialsJournalContext.Provider value={{
      //Фильтры 
      construction, setConstruction,
      object, setObject,
      section, setSection,
      //  Журнал поступлений
      entries, setEntries,
      // Поставленные материалы
      materials, setMaterials,
      // Форма добавления материала
      addForm, setAddForm,
      // Документы для текущего материала 
      selectedQualityDocs, setSelectedQualityDocs,
      // Форма поставщика 
      supplierForm, setSupplierForm,
      // Все документы о качестве
      qualityDocuments,
      //Справочник материалов
      materialReferences,
      // Поставщики
      suppliers,
      // Типы документов о качестве 
      docTypes,
      // Методы
      fetchQualityDocuments,   
      addQualityDocument,     
      setQualityDocuments,     
      setMaterialReferences,   
    }}>
      {children}
    </MaterialsJournalContext.Provider>
  );
};

export const useMaterialsJournal = () => useContext(MaterialsJournalContext);


