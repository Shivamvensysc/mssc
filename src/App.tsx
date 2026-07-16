import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Registration';
import { LoginPage, ForgotPasswordPage } from './pages/Login';
import RegSuccess from './pages/RegSuccess';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Added the route for your success page below */}
        <Route path="/success" element={<RegSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;