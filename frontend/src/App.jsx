import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "./pages/home/HomePage";
import ObjectRegistrationPage from "./pages/documentation/ObjectRegistrationPages/ObjectRegistrationPage";
import IGSList from "./pages/documentation/IGSList";
import LabTestsList from "./pages/documentation/LabTestsList";
import AOSRList from "./pages/documentation/AOSRList";
import AOOKList from "./pages/documentation/AOOKList";
import AOSRCreatePage from "./pages/documentation/AOSRCreatePages/AOSRCreatePage";
import AOOKCreate from "./pages/documentation/AOOKCreatePages/AOOKCreate";
import IDInvoiceList from "./pages/documentation/IDInvoiceList";
import IDInvoiceCreate from "./pages/documentation/IDInvoiceCreatePages/IDInvoiceCreate";
import MaterialsJournal from "./pages/materials/MaterialsJournal";
import MaterialsStorage from "./pages/materials/MaterialsStorage";
import UserProfile from "./pages/profile/UserProfile";
import UsersPage from "./pages/profile/UsersPage";
import Organisations from "./pages/references/Organisations";
import SPList from "./pages/references/SPList";
import MaterialTypes from "./pages/references/MaterialTypes";
import CommonRegistry from "./pages/references/CommonRegistry";
import LoginPage from "./pages/users/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/autorisation" element={<LoginPage />} />

      {/* все, что внутри  только для авторизованных */}
      <Route
        path="/"
        element={
          //<ProtectedRoute>
            <MainLayout />
          //</ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="register" element={<ObjectRegistrationPage />} />
        <Route path="igslist" element={<IGSList />} />
        <Route path="lab-tests" element={<LabTestsList />} />
        <Route path="aosrlist" element={<AOSRList />} />
        <Route path="aooklist" element={<AOOKList />} />
        <Route path="aosrlist/create" element={<AOSRCreatePage />} />
        <Route path="aooklist/create" element={<AOOKCreate />} />
        <Route path="idinvoice" element={<IDInvoiceList />} />
        <Route path="idinvoice/create" element={<IDInvoiceCreate />} />
        <Route path="materialsjournal" element={<MaterialsJournal />} />
        <Route path="materialsstorage" element={<MaterialsStorage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/users" element={<UsersPage />} />
        <Route path="organisations" element={<Organisations />} />
        <Route path="splist" element={<SPList />} />
        <Route path="materialtypes" element={<MaterialTypes />} />
        <Route path="commonregistry" element={<CommonRegistry />} />
      </Route>
    </Routes>
  );
}
