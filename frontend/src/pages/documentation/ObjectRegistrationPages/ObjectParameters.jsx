import PageWrapper from "@/components/layout/PageWrapper";
import ComboBox from "@/components/UI/ComboBox";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Table from "@/components/widgets/Table";
import { Trash2 } from "lucide-react";
import { useObjectRegistration } from "./ObjectRegistrationContext";
import { useState } from "react";
import ModalMessage from "@/components/UI/ModalMessage";

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
      newSection: { object: '', name: '', address: '', code: ''},
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
    <PageWrapper title="Регистрация объекта">
      <ModalMessage
        open={modalOpen}
        mode="notification"
        title={modalTitle}
        message={modalMessage}
        onCancel={() => setModalOpen(false)}
      />
      <div className="grid grid-cols-4 gap-5">
        {/* Параметры объекта */}
        <div className="group-box border border-[--color-border] col-span-4">
          <h3 className="group-box-title mb-4">Стройка</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-3">
              <Input
                placeholder="Полное наименование объекта"
                value={objectParameters.constructionName}
                onChange={(e) =>
                  setObjectParameters({ ...objectParameters, constructionName: e.target.value })
                }
              />
            </div>
            <div className="col-span-1">
              <Input
                placeholder="Краткое наименование"
                value={objectParameters.constructionShort}
                onChange={(e) =>
                  setObjectParameters({ ...objectParameters, constructionShort: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Адрес"
                value={objectParameters.constructionAddress}
                onChange={(e) =>
                  setObjectParameters({ ...objectParameters, constructionAddress: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Объекты */}
        <div className="group-box border border-[--color-border] col-span-2">
          <h3 className="group-box-title mb-4">Объекты</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-3">
              <Input
                placeholder="Полное наименование"
                value={objectParameters.newObject.name}
                onChange={(e) =>
                  setObjectParameters({
                    ...objectParameters,
                    newObject: { ...objectParameters.newObject, name: e.target.value },
                  })
                }
              />
            </div>
            <div className="col-span-1">
              <Input
                placeholder="Краткое наименование"
                value={objectParameters.newObject.shotname}
                onChange={(e) =>
                  setObjectParameters({
                    ...objectParameters,
                    newObject: { ...objectParameters.newObject, shotname: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-3">
              <Input placeholder="Адрес" value={objectParameters.newObject.address}
                onChange={(e) => setObjectParameters({ ...objectParameters, newObject: { ...objectParameters.newObject, address: e.target.value }, })}
              />
            </div>
            <div className="col-span-1">
              <Button onClick={addObject}>Добавить</Button>
            </div>
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
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteObject(idx);
                }}
              />,
            ])}
          />
        </div>

        {/* Участки */}
        <div className="group-box border border-[--color-border] col-span-2">
          <h3 className="group-box-title mb-4">Участки</h3>

          {/* Строка 1: Объект, Код, Кнопка */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-2">
              <ComboBox
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
            <div className="col-span-1">
              <Input
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
            <div className="col-span-1">
              <Button onClick={addSection}>Добавить</Button>
            </div>
          </div>

          {/* Строка 2: Название участка */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input
              placeholder="Название участка"
              value={objectParameters.newSection.name}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newSection: { ...objectParameters.newSection, name: e.target.value },
                })
              }
            />
          </div>

          {/* Строка 3: Адрес */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input
              placeholder="Адрес"
              value={objectParameters.newSection.address}
              onChange={(e) =>
                setObjectParameters({
                  ...objectParameters,
                  newSection: { ...objectParameters.newSection, address: e.target.value },
                })
              }
            />
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
        </div>
      </div>
    </PageWrapper>
  );
}
