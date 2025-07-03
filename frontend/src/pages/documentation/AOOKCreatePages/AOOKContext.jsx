import React, { createContext, useContext, useState } from "react";

const initialState = {
  // Верхние поля
  construction: "",
  object: "",
  section: "",
  actNumber: "",
  actName: "",
  actStatus: "Черновик",

  // Описание конструкций 
  description: {
    includeSection: false,
    includeAxes: false,
    includeMarks: false,
    includeProject: false,
    projectSection: "",
    sectionCode: "",
    axes: "",
    marks: "",
    dateStart: "",
    dateEnd: "",
    dateSign: "",
    constructionsAccepted: "",
    constructionItems: "",
    fullName: "",
    extraInfo: "",
    nextWorks: "",
  },

  // Скрытые работы 
  hiddenWorks: {
    allAosr: [],
    selectedAosr: [],
    summaryText: "",
  },

  // Проект 
  project: {
    normDocs: [],
    projectDocs: [],
    normText: "",
    projectText: "",
    otherDocs: "",
    summary: "",
  },

  // Материалы 
  materials: {
    materials: [],
    certificates: [],
    representation: "",
    attachments: "",
  },

  // Исполнительная документация 
  docs: {
    geoSchemes: [],
    inspections: [],
    geoText: "",
    inspText: "",
  },

  // Испытания 
  testing: {
    text: "",
  },

  // Выводы комиссии 
  commission: {
    textA: "",
    loadPercent: "",
    textC: "",
    textD: "",
  },

  // Ответственные лица 
  responsible: {
    zakazchik: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
    stroitel: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
    stroitelKontrol: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
    proektirovshik: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
    raboty: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
    inyeLitsa: {
      name: "",
      order: "",
      date: "",
      position: "",
      organization: "",
    },
  },
};

const AOOKContext = createContext();

export const useAOOK = () => useContext(AOOKContext);

export function AOOKProvider({ children }) {
  const [state, setState] = useState(initialState);


  const setSimpleField = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const updateField = (section, value) => {
    setState((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...value },
    }));
  };

  const updateDeepField = (section, key, value) => {
    setState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: { ...prev[section][key], ...value },
      },
    }));
  };

  // Сброс всей формы (опционально)
  const resetAll = () => setState(initialState);

  return (
    <AOOKContext.Provider
      value={{
        state,
        setState,
        setSimpleField,
        updateField,
        updateDeepField,
        resetAll,
      }}
    >
      {children}
    </AOOKContext.Provider>
  );
}
