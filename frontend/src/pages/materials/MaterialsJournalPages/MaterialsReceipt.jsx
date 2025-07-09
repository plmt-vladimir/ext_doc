import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Textarea from "@/components/UI/Textarea";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import ModalMessage from "@/components/UI/ModalMessage";
import { Pencil, Copy, Trash2, Upload } from "lucide-react";
import { useMaterialsJournal } from "./MaterialsJournalContext";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import GroupBox from "@/components/UI/GroupBox";
import Label from "@/components/UI/Label";

const emptyForm = {
  group: "",
  unit: "",
  qty: "",
  name: "",
  docType: "",
  docNumber: "",
  date: "",
  validTill: "",
  fileName: "",
  qualityDoc: ""
};

export default function MaterialsReceipt() {
  const {
    materials, setMaterials,
    addForm, setAddForm,
    supplierForm, setSupplierForm,
    qualityDocuments,
    construction, object, section,
    materialReferences, suppliers,
    selectedQualityDocs, setSelectedQualityDocs,
    docTypes, addQualityDocument,
  } = useMaterialsJournal();

  const [modal, setModal] = useState({ open: false, message: "" });
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const invoiceFileRef = useRef(null);
  const certificateFileRef = useRef(null);


  const qualityDocOptions = useMemo(() => (
    qualityDocuments.map(doc => {
      const matList = Array.isArray(doc.materials) && doc.materials.length
        ? ` (${[...new Set(doc.materials)].join(', ')})`
        : "";
      return {
        value: doc.id,
        label: `${doc.type} №${doc.number} от ${new Date(doc.issue_date).toLocaleDateString("ru-RU")}${matList}`,
      };
    })
  ), [qualityDocuments]);


  const materialOptions = useMemo(() => (
    materialReferences.map(material => ({
      value: material.id,
      label: material.name
    }))
  ), [materialReferences]);

  // автозаполнение формы по выбранному документу
  useEffect(() => {
    const selectedDoc = qualityDocuments.find(doc => doc.id === addForm.qualityDoc);
    if (selectedDoc) {
      setAddForm(prev => ({
        ...prev,
        docType: selectedDoc.type,
        docNumber: selectedDoc.number,
        date: new Date(selectedDoc.issue_date.replace(/\./g, '-')).toISOString().split('T')[0],
        validTill: new Date(selectedDoc.expiry_date.replace(/\./g, '-')).toISOString().split('T')[0],
        fileName: selectedDoc.file_url || ""
      }));
    }
  }, [addForm.qualityDoc, qualityDocuments]);
  // заполнение данных материала
  useEffect(() => {
    const selectedMaterial = materialReferences.find(material => material.id === addForm.name);
    if (selectedMaterial) {
      setAddForm(prev => ({
        ...prev,
        group: selectedMaterial.type,
        unit: selectedMaterial.unit
      }));
    }
  }, [addForm.name, materialReferences]);
  // Загрузка файлов
  const handleInvoiceFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceFile(file || null);
    setSupplierForm(f => ({
      ...f,
      fileName: file ? file.name : ""
    }));
  };
  const handleCertificateFileChange = (e) => {
    const file = e.target.files[0];
    setCertificateFile(file || null);
    setAddForm(f => ({
      ...f,
      fileName: file ? file.name : ""
    }));
  };
  // Добавление материала в таблицу (validate поля + quality docs)
  const handleAdd = () => {
    if (!addForm.group || !addForm.name || !addForm.unit || !addForm.qty) {
      setModal({ open: true, message: "Заполните все поля материала!" });
      return;
    }
    if (!selectedQualityDocs.length) {
      setModal({ open: true, message: "Добавьте хотя бы один документ о качестве для материала!" });
      return;
    }
    setMaterials(prev => [
      ...prev,
      {
        ...addForm,
        id: Date.now(),
        qualityDocs: selectedQualityDocs,
        qualityDocIds: selectedQualityDocs.map(doc => doc.id)
      }
    ]);
    setAddForm({ ...emptyForm });
    setSelectedQualityDocs([]);
  };
  //Редактирование материала (заполнить форму данными материала)
  const handleEdit = (item) => {
    setAddForm({ ...item });
    setMaterials(prev => prev.filter(m => m.id !== item.id));
  };
  //Копирование материала 
  const handleCopy = (item) => {
    setMaterials(prev => [...prev, { ...item, id: Date.now(), name: item.name + " (копия)" }]);
  };
  //Уаление материала 
  const handleDelete = (item) => {
    setMaterials(prev => prev.filter(m => m.id !== item.id));
  };
  // Сохранением поставки: загрузить файлы, собрать данные, сделать POST /api/deliveries ---
  const handleSave = async () => {
    if (!construction?.value) {
      setModal({ open: true, message: "Пожалуйста, выберите стройку." });
      return;
    }
    if (!materials.length) {
      setModal({ open: true, message: "Добавьте хотя бы один материал в поставку." });
      return;
    }
    try {
      let invoiceFileUrl = null;
      if (invoiceFile) {
        const formData = new FormData();
        formData.append("file", invoiceFile);
        const res = await axios.post("/api/deliveries/upload-invoice", formData);
        invoiceFileUrl = res.data.file_url;
      }
      // Сбор данных поставки 
      const deliveryPayload = {
        site_id: construction?.value ?? construction,
        object_id: object?.value ?? object,
        zone_id: section?.value ?? section,
        supplier: supplierForm.organization,
        supply_type: supplierForm.supplyType,
        record_number: supplierForm.recordNumber,
        record_date: supplierForm.recordDate,
        invoice_number: supplierForm.invoiceNumber,
        invoice_date: supplierForm.invoiceDate,
        invoice_file_url: invoiceFileUrl,
        note: supplierForm.note,
        materials: materials.map(mat => ({
          material_id: mat.name,
          quantity: parseFloat(mat.qty),
          quality_doc_ids: mat.qualityDocIds
        }))
      };
      await axios.post("/api/deliveries", deliveryPayload);

      setModal({ open: true, message: "Поставка успешно сохранена!" });
      setMaterials([]);
      setInvoiceFile(null);
      setAddForm({ ...emptyForm });
      setSupplierForm({
        organization: "",
        supplyType: "",
        recordNumber: "",
        recordDate: "",
        invoiceNumber: "",
        invoiceDate: "",
        note: "",
        fileName: "",
      });
      setAddForm({ ...emptyForm });
      setSelectedQualityDocs([]);
      setCertificateFile(null);
    } catch (err) {
      setModal({ open: true, message: "Ошибка при сохранении поставки" });
    }
  };
  // --- Добавление документа о качестве через контекст
  async function handleAddQualityDoc() {
    const { docType, docNumber, date, validTill } = addForm;
    if (!docType || !docNumber || !date || !validTill || !certificateFile) {
      setModal({ open: true, message: "Заполните все поля документа и выберите файл!" });
      return;
    }
    const result = await addQualityDocument({
      file: certificateFile,
      docType,
      docNumber,
      issueDate: date,
      expiryDate: validTill,
    });
    if (result.error) {
      setModal({ open: true, message: result.error });
      return;
    }
    setSelectedQualityDocs(qds => [...qds, result.doc]);
    setAddForm({ ...emptyForm });
    setCertificateFile(null);
    setModal({ open: true, message: "Документ успешно добавлен!" });
  }


  return (
    <PageWrapper title="Новое поступление материала">
      {/* Поставщик */}
      <GroupBox title="Поставщик" bordered>
        <div className="grid grid-cols-8 gap-x-4 gap-y-2">
          {/* Строка 1: организация / № накладной */}
          <Label className="col-span-1 self-center">Организация</Label>
          <ComboBox
            className="col-span-3"
            allowFreeText
            placeholder="Организация"
            options={suppliers}
            value={suppliers.find(opt => opt.value === supplierForm.organization) ??
              (supplierForm.organization ? { value: supplierForm.organization, label: supplierForm.organization } : null)}
            onChange={val => setSupplierForm(f => ({ ...f, organization: val?.value ?? "" }))}
            displayField="label"
            valueField="value"
          />
          <Label className="col-span-1 self-center">№ накладной</Label>
          <Input
            className="col-span-3"
            placeholder="№ накладной"
            value={supplierForm.invoiceNumber}
            onChange={e => setSupplierForm(f => ({ ...f, invoiceNumber: e.target.value }))}
          />

          <Label className="col-span-1 self-center">Тип поставки</Label>
          <Input
            className="col-span-3"
            placeholder="Тип поставки"
            value={supplierForm.supplyType}
            onChange={e => setSupplierForm(f => ({ ...f, supplyType: e.target.value }))}
          />
          <Label className="col-span-1 self-center">Дата накладной</Label>
          <Input
            className="col-span-3"
            type="date"
            value={supplierForm.invoiceDate}
            onChange={e => setSupplierForm(f => ({ ...f, invoiceDate: e.target.value }))}
          />

          <Label className="col-span-1 self-center">№ записи</Label>
          <Input
            className="col-span-3"
            placeholder="№ записи"
            value={supplierForm.recordNumber}
            onChange={e => setSupplierForm(f => ({ ...f, recordNumber: e.target.value }))}
          />
          <Label className="col-span-1 self-center">Дата записи</Label>
          <Input
            className="col-span-3"
            type="date"
            value={supplierForm.recordDate}
            onChange={e => setSupplierForm(f => ({ ...f, recordDate: e.target.value }))}
          />

          <Label className="col-span-1 self-start">Примечание</Label>
          <Textarea
            className="col-span-7"
            rows={1}
            placeholder="Примечание"
            value={supplierForm.note}
            onChange={e => setSupplierForm(f => ({ ...f, note: e.target.value }))}
          />

          <Label className="col-span-1 self-center">Файл накладной</Label>
          <div className="col-span-6 flex gap-2 items-end">
            <Input
              className="w-full"
              placeholder="Имя файла"
              value={supplierForm.fileName}
              onChange={e => setSupplierForm(f => ({ ...f, fileName: e.target.value }))}
              readOnly
            />
            <Button onClick={() => invoiceFileRef.current?.click()}>
              <Upload className="w-4 h-4" /> Загрузить
            </Button>
            <input type="file" hidden ref={invoiceFileRef} onChange={handleInvoiceFileChange} accept=".pdf" />
          </div>
        </div>
      </GroupBox>

      {/* Добавление материала и документов */}
      <div className="grid grid-cols-2 gap-4">
        {/* Блок добавления материала */}
        <GroupBox title="Добавление материала" bordered>
          <div className="flex flex-col gap-4 mb-4">
            {/* Наименование материала */}
            <div className="grid grid-cols-5 items-center gap-2">
              <Label className="col-span-1">Наименование</Label>
              <ComboBox
                allowFreeText
                placeholder="Наименование материала"
                options={materialOptions}
                value={addForm.name}
                onChange={val => setAddForm(f => ({ ...f, name: val.value }))}
                displayField="name"
                valueField="value"
                className="col-span-4"
              />
            </div>

            {/* Группа материалов */}
            <div className="grid grid-cols-5 items-center gap-2">
              <Label className="col-span-1">Группа</Label>
              <Input
                placeholder="Группа материалов"
                value={addForm.group}
                onChange={e => setAddForm(f => ({ ...f, group: e.target.value }))}
                disabled={!!addForm.name}
                className="col-span-4"
              />
            </div>

            {/* Единицы измерения */}
            <div className="grid grid-cols-5 items-center gap-2">
              <Label className="col-span-1">Ед. изм.</Label>
              <Input
                placeholder="Единицы измерения"
                value={addForm.unit}
                onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                disabled={!!addForm.name}
                className="col-span-4"
              />
            </div>

            {/* Количество */}
            <div className="grid grid-cols-5 items-center gap-2">
              <Label className="col-span-1">Количество</Label>
              <Input
                placeholder="Количество"
                value={addForm.qty}
                onChange={e => setAddForm(f => ({ ...f, qty: e.target.value }))}
                className="col-span-4"
              />
            </div>
          </div>

          {/* Таблица выбранных документов */}
          <div className="mt-6">
            <h4 className="mb-2 font-medium text-[--color-primary]">Документы о качестве для материала</h4>
            <Table
              headers={["Тип", "Номер", "Дата", "Действует до", "Файл", ""]}
              rows={selectedQualityDocs.map((doc, idx) => [
                doc.type,
                doc.number,
                new Date(doc.issue_date).toLocaleDateString(),
                new Date(doc.expiry_date).toLocaleDateString(),
                <a
                  href={`${import.meta.env.VITE_REACT_APP_API_URL}${doc.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  Файл
                </a>,
                <Trash2
                  className="cursor-pointer text-red-600"
                  onClick={() => setSelectedQualityDocs(docs => docs.filter((_, i) => i !== idx))}
                />
              ])}
            />
          </div>

          <Button className="mt-4" onClick={handleAdd}>Добавить материал</Button>
        </GroupBox>

        {/* Блок управления документами */}
        <GroupBox title="Документы о качестве" bordered>
          {/* Выбор существующего документа */}
          <ComboBox
            placeholder="Выберите документ"
            options={qualityDocOptions}
            value={null}
            onChange={val => {
              const doc = qualityDocuments.find(d => d.id === val.value);
              if (doc && !selectedQualityDocs.some(qd => qd.id === doc.id)) {
                setSelectedQualityDocs(docs => [...docs, doc]);
              }
            }}
            displayField="label"
            valueField="value"
          />

          <div className="my-2 text-center text-sm text-[--color-primary]">или создать новый</div>

          {/* Форма нового документа */}
          <div className="flex flex-col gap-4 mb-2">
            {/* Тип документа */}
            <div className="grid grid-cols-6 items-center gap-2">
              <Label className="col-span-2">Тип документа</Label>
              <ComboBox
                className="col-span-4"
                allowFreeText
                placeholder="Тип документа"
                options={docTypes.map(t => ({ value: t.label, label: t.label, code: t.code, id: t.id }))}
                value={
                  docTypes.find(opt => opt.label === addForm.docType) ??
                  (addForm.docType ? { value: addForm.docType, label: addForm.docType } : null)
                }
                onChange={val => setAddForm(f => ({ ...f, docType: val?.value ?? "" }))}
                displayField="label"
                valueField="value"
              />
            </div>

            {/* Номер документа */}
            <div className="grid grid-cols-6 items-center gap-2">
              <Label className="col-span-2">Номер документа</Label>
              <Input
                className="col-span-4"
                placeholder="Номер документа"
                value={addForm.docNumber || ""}
                onChange={e => setAddForm(f => ({ ...f, docNumber: e.target.value }))}
              />
            </div>

            {/* Даты: выдачи и срок действия — в одной строке */}
            <div className="grid grid-cols-12 items-center gap-2">
              <Label className="col-span-2">Дата выдачи</Label>
              <Input
                type="date"
                className="col-span-4"
                placeholder="Дата выдачи"
                value={addForm.date || ""}
                onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))}
              />
              <Label className="col-span-2">Срок действия</Label>
              <Input
                type="date"
                className="col-span-4"
                placeholder="Срок действия"
                value={addForm.validTill || ""}
                onChange={e => setAddForm(f => ({ ...f, validTill: e.target.value }))}
              />
            </div>

            {/* Имя файла + кнопка загрузки в строку */}
            <div className="grid grid-cols-6 items-center gap-2">
              <Label className="col-span-2">Имя файла</Label>
              <div className="col-span-4 flex gap-2 items-end">
                <Input
                  className="w-full"
                  placeholder="Имя файла"
                  value={addForm.fileName || ""}
                  onChange={e => setAddForm(f => ({ ...f, fileName: e.target.value }))}
                />
                <Button onClick={() => certificateFileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Загрузить
                </Button>
                <input type="file" hidden ref={certificateFileRef} onChange={handleCertificateFileChange} accept=".pdf" />
              </div>
            </div>

            {/* Кнопка добавления */}
            <div className="flex justify-end mt-2">
              <Button onClick={handleAddQualityDoc}>Добавить документ</Button>
            </div>
          </div>
        </GroupBox>

      </div>

      {/* Поставленные материалы */}
      <GroupBox title="Поставленные материалы" bordered>
        <Table
          headers={["Группа", "Наименование", "Кол-во", "Ед. изм.", "Документы", "", ""]}
          rows={materials.map((item) => [
            item.group,
            item.name,
            item.qty,
            item.unit,
            (item.qualityDocs ?? []).map(doc =>
              <span key={doc.id} className="block">{doc.type} №{doc.number}</span>
            ),
            <Pencil className="cursor-pointer" onClick={() => handleEdit(item)} />,
            <div className="flex gap-2">
              <Copy className="cursor-pointer" onClick={() => handleCopy(item)} />
              <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(item)} />
            </div>
          ])}
        />
      </GroupBox>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
      <ModalMessage open={modal.open} message={modal.message} onCancel={() => setModal({ open: false, message: "" })} />
    </PageWrapper>
  );
}


