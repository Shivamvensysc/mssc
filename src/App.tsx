import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Index";
import RegistrationForm from "./pages/Registration";
import { LoginPage, ForgotPasswordPage } from "./pages/Login";
import ApplicationForm from "./pages/Application";
import { HomePage } from "./pages/HomePage";
import AdminLoginPage from "./components/admin/adminlogin";
import "./App.css";

import AdminLayout from './layout/admin/Layout';
import Dashboard from "./pages/Dashboard";
import UserDetails from "./pages/UserDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Default route (/) */}
          <Route index element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm/>} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="application" element={<ApplicationForm />} />
        </Route>

        
        <Route path="/admin" element={<AdminLayout />}>
        
          <Route index element={<Dashboard />} />
        
          <Route path="candidate/:id" element={<UserDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;