// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./layout/Index";
// import RegistrationForm from "./pages/Registration";
// import { LoginPage, ForgotPasswordPage } from "./pages/Login";
// import ApplicationForm from "./pages/Application";
// import { HomePage } from "./pages/HomePage";
// import AdminLoginPage from "./components/admin/adminlogin";
// import "./App.css";

// import CandidateLayout from './layout/Layout'
// import CandidateDashboard from './pages/CandidateDashboard'

// import AdminLayout from './layout/admin/Layout';
// import Dashboard from "./pages/Dashboard";
// import UserDetails from "./pages/UserDetails";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Layout wrapper */}
//         <Route path="/" element={<Layout />}>
//           {/* Default route (/) */}
//           <Route index element={<HomePage />} />
//           <Route path="/register" element={<RegistrationForm/>} />
//           <Route path="/admin-login" element={<AdminLoginPage />} />

//           <Route path="login" element={<LoginPage />} />
//           <Route path="forgot-password" element={<ForgotPasswordPage />} />
//         </Route>

        
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="candidate/:id" element={<UserDetails />} />
//         </Route>

//         <Route path="/candidate" element={<CandidateLayout/>}>
//         <Route index element={<CandidateDashboard />} />
//           <Route path="application" element={<ApplicationForm />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// 1. Lazy load components with default exports
const Layout = lazy(() => import("./layout/Index"));
const RegistrationForm = lazy(() => import("./pages/Registration"));
const ApplicationForm = lazy(() => import("./pages/Application"));
const AdminLoginPage = lazy(() => import("./components/admin/adminlogin"));
const CandidateLayout = lazy(() => import('./layout/Layout'));
const CandidateDashboard = lazy(() => import('./pages/CandidateDashboard'));
const AdminLayout = lazy(() => import('./layout/admin/Layout'));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserDetails = lazy(() => import("./pages/UserDetails"));

// 2. Lazy load components with NAMED exports using .then()
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("./pages/Login").then(module => ({ default: module.LoginPage })));
const ForgotPasswordPage = lazy(() => import("./pages/Login").then(module => ({ default: module.ForgotPasswordPage })));

// 3. Create a fallback UI to show while the chunk is downloading
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0076b6] border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* 4. Wrap Routes in Suspense */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Layout wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Default route (/) */}
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="candidate/:id" element={<UserDetails />} />
          </Route>

          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="application" element={<ApplicationForm />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;