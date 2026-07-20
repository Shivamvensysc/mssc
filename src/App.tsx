import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Index";
import RegistrationForm from "./pages/Registration";
import { LoginPage, ForgotPasswordPage } from "./pages/Login";
import ApplicationForm from "./pages/Application";
import { HomePage } from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Default route (/) */}
          <Route index element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm/>} />

          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="application" element={<ApplicationForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;