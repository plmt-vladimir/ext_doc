import React, { createContext, useContext, useState } from "react";

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

const defaultEmployeeOptions = {
  customer: [],
  generalContractor: [],
  contractor: [],
  projectOrg: [],
  constructionControl: [],
  inyeLitsa: []
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
  id: "",
  name: "",
  order: "",
  date: "",
  position: "",
  organization: "",
};

const defaultResponsible = {
  customer: { ...initialPerson },
  generalContractor: { ...initialPerson },
  contractor: { ...initialPerson },
  projectOrg: { ...initialPerson },
  constructionControl: { ...initialPerson },
  inyeLitsa: { ...initialPerson },
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
  const [employeeOptions, setEmployeeOptions] = useState(defaultEmployeeOptions);

  return (
    <AOSRCreateContext.Provider value={{
      common, setCommon,
      description, setDescription,
      norm, setNorm,
      materials, setMaterials,
      docs, setDocs,
      responsible, setResponsible,
      employeeOptions, setEmployeeOptions,
    }}>
      {children}
    </AOSRCreateContext.Provider>
  );
}

export function useAOSRCreate() {
  return useContext(AOSRCreateContext);
}
