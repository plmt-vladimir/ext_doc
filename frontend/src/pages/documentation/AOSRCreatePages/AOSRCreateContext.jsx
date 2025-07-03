import React, { createContext, useContext, useState } from "react";

// Начальные структуры для каждого таба
const defaultDescription = {
  startDate: "",
  endDate: "",
  signDate: "",
  codeSection: "",
  axes: "",
  marks: "",
  insertCodeSection: false,
  insertAxes: false,
  insertMarks: false,
  additionalInfo: "",
  works: [],
  nextWorks: [],
  registryCode: "",
  treeData: [],
};

const defaultNorm = {
  main: {
    section: "",
    code: "",
    sheets: "",
    fullName: "",
    org: "",
    norms: [],
    exec: false,
    presentation: "",
    presentationWithNorms: "",
  },
  aux: {
    section: "",
    code: "",
    sheets: "",
    fullName: "",
    org: "",
    norms: [],
    exec: false,
    presentation: "",
    presentationWithNorms: "",
  }
};

const defaultMaterials = {
  materials: [],
  qtyState: {},
  documentRepresentation: "",
};

const defaultDocs = {
  geodesyDocs: [],
  labDocs: [],
  presentationGeo: "",
  presentationLab: "",
};

const initialPerson = {
  name: "",
  order: "",
  date: "",
  position: "",
  organization: "",
};

const defaultResponsible = {
  zakazchik: initialPerson,
  stroitel: initialPerson,
  stroitelKontrol: initialPerson,
  proektirovshik: initialPerson,
  raboty: initialPerson,
  inyeLitsa: initialPerson,
};

const defaultCommon = {
  construction: "",
  object: "",
  section: "",
  actNumber: "",
  actName: "",
  status: "",
};

const AOSRCreateContext = createContext();

export function AOSRCreateProvider({ children }) {
  const [common, setCommon] = useState(defaultCommon);
  const [description, setDescription] = useState(defaultDescription);
  const [norm, setNorm] = useState(defaultNorm);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [docs, setDocs] = useState(defaultDocs);
  const [responsible, setResponsible] = useState(defaultResponsible);

  return (
    <AOSRCreateContext.Provider value={{
      common, setCommon,
      description, setDescription,
      norm, setNorm,
      materials, setMaterials,
      docs, setDocs,
      responsible, setResponsible,
    }}>
      {children}
    </AOSRCreateContext.Provider>
  );
}

export function useAOSRCreate() {
  return useContext(AOSRCreateContext);
}
