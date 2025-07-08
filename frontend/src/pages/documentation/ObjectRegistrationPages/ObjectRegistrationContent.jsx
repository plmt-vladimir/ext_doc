import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Tabs from "@/components/UI/Tabs";
import Button from "@/components/UI/Button";
import ModalMessage from "@/components/UI/ModalMessage";
import ObjectParameters from "./ObjectParameters";
import CustomerCard from "./CustomerCard";
import ContractorCard from "./ContractorCard";
import ProjectOrganizationCard from "./ProjectOrganizationCard";
import ConstructionControlCard from "./ConstructionControlCard";
import GeneralContractorCard from "./GeneralContractorCard";


import { useObjectRegistration } from "./ObjectRegistrationContext";
import api from "@/api/axios";

const ROLE_IDS = {
  customer: 1,             // Заказчик
  generalContractor: 2,    // Генподрядчик
  contractor: 3,           // Подрядчик
  projectOrg: 4,           // Проектная организация
  constructionControl: 5,  // Стройконтроль
};

const formatDate = (dateString) => {
  if (!dateString) return "2000-01-01";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export default function ObjectRegistrationContent() {
  const {
    objectParameters,
    customerCard,
    contractorCard,
    projectOrgCard,
    constructionControlCard,
    generalContractorCard,
  } = useObjectRegistration();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("notification");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [pendingSave, setPendingSave] = useState(false);

  const tabs = [
    { label: "Параметры объекта", component: <ObjectParameters /> },
    { label: "Карточка заказчика", component: <CustomerCard /> },
    { label: "Карточка подрядчика", component: <ContractorCard /> },
    { label: "Карточка проектной организации", component: <ProjectOrganizationCard /> },
    { label: "Карточка стройконтроля", component: <ConstructionControlCard /> },
    { label: "Карточка генподрядчика", component: <GeneralContractorCard /> },
  ];
  function mapOrganizationCardToBackend(card) {
    return {
      name: card.orgFullName,
      ogrn: card.ogrn,
      inn: card.inn,
      address: card.address,
      phone: card.telFax,
      license_name: card.certificateName,
      license_number: card.certificateNumber,
      license_date: card.issueDate,
      sro_name: card.sroName,
      sro_number: card.sroNumber,
      sro_ogrn: card.sroOgrn,
      sro_inn: card.sroInn,
    };
  }
  function mapEmployeeToBackend(emp) {
    return {
      full_name: emp.full_name,                 
      position: emp.position,
      ins: emp.ins,
      decree_number: emp.decree_number,            
      decree_date: normalizeDate(emp.orderDate || emp.decree_date),
    };
  }
  
  const normalizeDate = (date) => {
    if (!date) return "";
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    if (typeof date === "string" && date.includes("T")) return date.split("T")[0];
    if (date instanceof Date) return date.toISOString().split("T")[0];
    try {
      const d = new Date(date);
      return isNaN(d) ? "" : d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };
  const handleSaveOrganization = async (organizationData, employees) => {
    let orgId = organizationData.id || organizationData.selectedOrganization;
  
    const payload = mapOrganizationCardToBackend(organizationData);
  
    if (orgId) {
      await api.patch(`/organizations/${orgId}`, payload);
    } else {
      const orgRes = await api.post('/organizations', payload);
      orgId = orgRes.data.id;
    }
  

    for (const emp of employees) {
      const normalizedEmp = mapEmployeeToBackend(emp);
      if (!emp.id) {
        await api.post(`/organizations/${orgId}/employees`, normalizedEmp);
      } else {
        await api.patch(`/organizations/${orgId}/employees/${emp.id}`, normalizedEmp);
      }
    }
  
    return orgId;
  };
  
  
  const assignOrganizationRole = async (orgId, roleId, siteId) => {
    try {
      await api.post('/organizations/role-assignments/', {
        organization_id: orgId,
        role_id: roleId,
        construction_site_id: siteId,
        construction_object_id: null, 
      });
    } catch (err) {
      console.warn('Ошибка назначения роли:', err);
    }
  };



  const handleGlobalSaveClick = () => {
    if (!objectParameters.constructionName || !objectParameters.constructionShort) {
      setModalTitle('Ошибка');
      setModalMessage('Не заполнено название или сокращённое название стройки.');
      setModalMode('notification');
      setModalOpen(true);
      return;
    }

    setModalTitle('Подтверждение');
    setModalMessage('Вы уверены, что хотите сохранить стройку, связанные карточки и организации?');
    setModalMode('confirmation');
    setModalOpen(true);
    setPendingSave(true);
  };

  const handleConfirmSave = async () => {
    setModalOpen(false);
    setPendingSave(false);
    try {
      // 1. Сохраняем стройку
      const siteRes = await api.post('/construction/sites', {
        full_name: objectParameters.constructionName,
        short_name: objectParameters.constructionShort,
        address: objectParameters.constructionAddress,
      });
      const siteId = siteRes.data.id;

      // 2. Сохраняем объекты
      const objectIdMap = {};
      for (const obj of objectParameters.objects) {
        const objRes = await api.post('/construction/objects', {
          site_id: siteId,
          full_name: obj.name,
          short_name: obj.shotname,
          address: obj.address,
        });
        objectIdMap[obj.name] = objRes.data.id;
      }

      // 3. Сохраняем участки
      for (const section of objectParameters.sections) {
        const parentObjectId = objectIdMap[section.object];
        if (parentObjectId) {
          await api.post('/construction/zones', {
            object_id: parentObjectId,
            name: section.name,
            address: section.address,
            code: section.code,
          });
        }
      }

      // 4. Сохраняем организации, сотрудников, назначаем роль
      const customerId = await handleSaveOrganization(customerCard, customerCard.employees);
      const contractorId = await handleSaveOrganization(contractorCard, contractorCard.employees);
      const projectOrgId = await handleSaveOrganization(projectOrgCard, projectOrgCard.employees);
      const constructionControlId = await handleSaveOrganization(constructionControlCard, constructionControlCard.employees);
      const generalContractorId = await handleSaveOrganization(generalContractorCard, generalContractorCard.employees);

      // 5. Назначаем роли организациям
      await assignOrganizationRole(customerId, ROLE_IDS.customer, siteId);
      await assignOrganizationRole(contractorId, ROLE_IDS.contractor, siteId);
      await assignOrganizationRole(projectOrgId, ROLE_IDS.projectOrg, siteId);
      await assignOrganizationRole(constructionControlId, ROLE_IDS.constructionControl, siteId);
      await assignOrganizationRole(generalContractorId, ROLE_IDS.generalContractor, siteId);

      setModalTitle('Успешно');
      setModalMessage('Данные стройки, объектов, участков, организаций и ролей успешно сохранены.');
      setModalMode('notification');
      setModalOpen(true);
    } catch (err) {
      setModalTitle('Ошибка');
      setModalMessage('Произошла ошибка при сохранении данных. Проверьте данные.');
      setModalMode('notification');
      setModalOpen(true);
    }
  };


  return (
    <PageWrapper title="Регистрация объекта">
      <Tabs tabs={tabs} />
      <div className="mt-6 flex justify-end">
        <Button onClick={handleGlobalSaveClick}>Сохранить</Button>
      </div>

      <ModalMessage
        open={modalOpen}
        mode={modalMode}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => {
          setModalOpen(false);
          setPendingSave(false);
        }}
        onConfirm={pendingSave ? handleConfirmSave : undefined}
      />
    </PageWrapper>
  );
}

