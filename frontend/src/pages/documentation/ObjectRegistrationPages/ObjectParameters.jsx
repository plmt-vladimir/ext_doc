import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import GroupBox from "@/components/UI/Groupbox";
import { Trash2 } from "lucide-react";
import { useObjectRegistration } from "./ObjectRegistrationContext";
import { useState } from "react";
import ModalMessage from "@/components/UI/ModalMessage";
import Label from "@/components/UI/Label";

export default function ObjectParameters() {
  const {
    objectParameters,
    setObjectParameters,
  } = useObjectRegistration();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const validateObjectFields = () => {
    const { name, shotname, address } = objectParameters.newObject;
    return name && shotname && address;
  };

  const validateSectionFields = () => {
    const { object, name, address, code } = objectParameters.newSection;
    return object && name && address && code;
  };

  const addObject = () => {
    if (!validateObjectFields()) {
      setModalTitle('Ошибка');
      setModalMessage('Заполните все поля объекта перед добавлением.');
      setModalOpen(true);
      return;
    }
    setObjectParameters({
      ...objectParameters,
      objects: [...objectParameters.objects, objectParameters.newObject],
      newObject: { name: '', address: '', shotname: '' },
    });
  };

  const addSection = () => {
    if (!validateSectionFields()) {
      setModalTitle('Ошибка');
      setModalMessage('Заполните все поля участка перед добавлением.');
      setModalOpen(true);
      return;
    }
    setObjectParameters({
      ...objectParameters,
      sections: [...objectParameters.sections, objectParameters.newSection],
      newSection: { object: '', name: '', address: '', code: '' },
    });
  };

  // Удалить объект
  const handleDeleteObject = (idx) => {
    setObjectParameters({
      ...objectParameters,
      objects: objectParameters.objects.filter((_, i) => i !== idx),
    });
  };

  // Удалить участок
  const handleDeleteSection = (idx) => {
    setObjectParameters({
      ...objectParameters,
      sections: objectParameters.sections.filter((_, i) => i !== idx),
    });
  };

  const objectHeaders = [
    "#",
    "Полное наименование",
    "Краткое наименование",
    "Адрес",
    "",
  ];

  // Таблица участков: №, объект, название, адрес, действие
  const sectionHeaders = [
    "#",
    "Объект",
    "Участок",
    "Код участка",
    "Адрес",
    "",
  ];

  return (
    <PageWrapper title="Заполнение данных о составе строительства">
      <ModalMessage
        open={modalOpen}
        mode="notification"
        title={modalTitle}
        message={modalMessage}
        onCancel={() => setModalOpen(false)}
      />
      <div className="grid grid-cols-4 gap-5">
        {/* Параметры объекта */}
        <GroupBox className="col-span-4" title="Стройка" bordered>
          <div className="grid grid-cols-6 gap-x-4 gap-y-3 mb-4 items-center">
            <Label htmlFor="constructionName" className="text-[--color-primary], col-span-1">Полное наименование объекта</Label>
            <Input
              id="constructionName"
              className="col-span-5"
              placeholder="Полное наименование объекта"
              value={objectParameters.constructionName}
              onChange={(e) => setObjectParameters({ ...objectParameters, constructionName: e.target.value })}
            />

            <Label htmlFor="constructionShort" className="text-[--color-primary]">Краткое наименование</Label>
            <Input
              id="constructionShort"
              className="col-span-5"
              placeholder="Краткое наименование"
              value={objectParameters.constructionShort}
              onChange={(e) => setObjectParameters({ ...objectParameters, constructionShort: e.target.value })}
            />

            <Label htmlFor="constructionAddress" className="text-[--color-primary]">Адрес</Label>
            <Input
              id="constructionAddress"
              className="col-span-5"
              placeholder="Адрес"
              value={objectParameters.constructionAddress}
              onChange={(e) => setObjectParameters({ ...objectParameters, constructionAddress: e.target.value })}
            />
          </div>
        </GroupBox>
        {/* Объекты */}
        <GroupBox className="col-span-2" title="Объекты" bordered>
          <div className="grid grid-cols-4 gap-x-4 gap-y-3 mb-4 items-center">
            <Label htmlFor="objectName" className="text-[--color-primary]">Полное наименование</Label>
            <Input
              id="objectName"
              className="col-span-3"
              placeholder="Полное наименование"
              value={objectParameters.newObject.name}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newObject: { ...objectParameters.newObject, name: e.target.value },
                })
              }
            />

            <Label htmlFor="objectShort" className="text-[--color-primary]">Краткое наименование</Label>
            <Input
              id="objectShort"
              className="col-span-3"
              placeholder="Краткое наименование"
              value={objectParameters.newObject.shotname}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newObject: { ...objectParameters.newObject, shotname: e.target.value },
                })
              }
            />

            <Label htmlFor="objectAddress" className="text-[--color-primary]">Адрес</Label>
            <Input
              id="objectAddress"
              className="col-span-3"
              placeholder="Адрес"
              value={objectParameters.newObject.address}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newObject: { ...objectParameters.newObject, address: e.target.value },
                })
              }
            />
            <Button onClick={addObject}>Добавить</Button>
          </div>

          <Table
            headers={objectHeaders}
            pageSize={10}
            rows={objectParameters.objects.map((obj, idx) => [
              idx + 1,
              obj.name,
              obj.shotname,
              obj.address,
              <Trash2
                key={idx}
                className="cursor-pointer text-red-600 mx-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteObject(idx);
                }}
              />,
            ])}
          />
        </GroupBox>

        {/* Участки */}
        <GroupBox className="col-span-2" title="Участки" bordered>
          <div className="grid grid-cols-4 gap-x-4 gap-y-3 mb-4 items-center">
            {/* Объект */}
            <Label htmlFor="sectionObject" className="text-[--color-primary]">Объект</Label>
            <div className="col-span-3">
              <ComboBox
                id="sectionObject"
                options={objectParameters.objects.map((obj) => ({
                  value: obj.shotname,
                  label: obj.shotname,
                }))}
                placeholder="Выберите объект"
                value={objectParameters.newSection.object}
                onChange={(selectedOption) =>
                  setObjectParameters({
                    ...objectParameters,
                    newSection: { ...objectParameters.newSection, object: selectedOption.label },
                  })
                }
              />
            </div>

            {/* Название участка */}
            <Label htmlFor="sectionName" className="text-[--color-primary]">Название участка</Label>
            <Input
              id="sectionName"
              className="col-span-3"
              placeholder="Название участка"
              value={objectParameters.newSection.name}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newSection: { ...objectParameters.newSection, name: e.target.value },
                })
              }
            />

            {/* Адрес */}
            <Label htmlFor="sectionAddress" className="text-[--color-primary]">Адрес</Label>
            <Input
              id="sectionAddress"
              className="col-span-3"
              placeholder="Адрес"
              value={objectParameters.newSection.address}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newSection: { ...objectParameters.newSection, address: e.target.value },
                })
              }
            />

            {/* Код + кнопка */}
            <Label htmlFor="sectionCode" className="text-[--color-primary]">Код участка</Label>
            <div className="col-span-2">
              <Input
                id="sectionCode"
                placeholder="Код участка"
                value={objectParameters.newSection.code}
                onChange={(e) =>
                  setObjectParameters({
                    ...objectParameters,
                    newSection: { ...objectParameters.newSection, code: e.target.value },
                  })
                }
              />
            </div>
            <div className="col-span-1 flex justify-end">
              <Button onClick={addSection}>Добавить</Button>
            </div>
          </div>

          {/* Таблица участков */}
          <Table
            headers={sectionHeaders}
            pageSize={10}
            rows={objectParameters.sections.map((section, idx) => [
              idx + 1,
              section.object,
              section.name,
              section.code,
              section.address,
              <Trash2
                key={idx}
                className="cursor-pointer text-red-600 mx-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection(idx);
                }}
              />,
            ])}
          />
        </GroupBox>

      </div>
    </PageWrapper>
  );
}
