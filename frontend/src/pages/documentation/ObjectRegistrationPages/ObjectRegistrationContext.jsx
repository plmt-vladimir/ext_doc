import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios"; // Поправить в булущем

const ObjectRegistrationContext = createContext();

const defaultCard = {
  selectedOrganization: "",
  orgFullName: "",
  ogrn: "",
  inn: "",
  address: "",
  telFax: "",
  certificateName: "",
  certificateNumber: "",
  issueDate: "",
  sroName: "",
  sroNumber: "",
  sroOgrn: "",
  sroInn: "",
  position: "",
  orderOrgNumber: "",
  orderDate: "",
  employees: [],
  full_name: "",
  ins: "",
  decree_number: "",
  decree_date: "",
  selectedEmployeeIdx: null,
};

export const ObjectRegistrationProvider = ({ children }) => {
  const [objectParameters, setObjectParameters] = useState({
    constructionName: "",
    constructionShort: "",
    constructionAddress: "",
    objects: [],
    newObject: { name: "", shotname: "", address: "" },
    sections: [],
    newSection: { object: "", name: "", address: "", code: ""},
  });

  const [customerCard, setCustomerCard] = useState({ ...defaultCard });
  const [contractorCard, setContractorCard] = useState({ ...defaultCard });
  const [projectOrgCard, setProjectOrgCard] = useState({ ...defaultCard });
  const [constructionControlCard, setConstructionControlCard] = useState({ ...defaultCard });
  const [generalContractorCard, setGeneralContractorCard] = useState({ ...defaultCard });

  //  Общий список организаций для всех карточек
  const [organizationOptions, setOrganizationOptions] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await api.get("/organizations");
        const options = res.data.map(org => ({
          value: org.id,
          label: org.name,
          full: org, // сохраняем полную организацию
        }));
        setOrganizationOptions(options);
      } catch (error) {
        console.error("Ошибка при загрузке организаций:", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <ObjectRegistrationContext.Provider
      value={{
        objectParameters, setObjectParameters,
        customerCard, setCustomerCard,
        contractorCard, setContractorCard,
        projectOrgCard, setProjectOrgCard,
        constructionControlCard, setConstructionControlCard,
        generalContractorCard, setGeneralContractorCard,
        organizationOptions, // добавляем в контекст
      }}
    >
      {children}
    </ObjectRegistrationContext.Provider>
  );
};

export const useObjectRegistration = () => useContext(ObjectRegistrationContext);

