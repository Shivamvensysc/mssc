import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Registration';
import { LoginPage, ForgotPasswordPage } from './pages/Login';

import ApplicationForm from './pages/Application';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/application" element={<ApplicationForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;