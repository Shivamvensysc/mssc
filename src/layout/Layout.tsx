// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/studentDashboard/Sidebar";
// import Header from "../components/studentDashboard/Header";

// const MOBILE_BREAKPOINT = 768;

// export default function Layout() {
//   const [collapsed, setCollapsed] = useState<boolean>(false);
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(
//     typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
//   );

//   // Track viewport width and auto-hide the sidebar whenever we're on a small screen
//   useEffect(() => {
//     function handleResize() {
//       const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
//       setIsMobile(mobile);
//       setMobileOpen(false); // always close the drawer/collapse state on breakpoint change
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   function handleToggleSidebar(): void {
//     if (isMobile) {
//       setMobileOpen((open) => !open);
//     } else {
//       setCollapsed((c) => !c);
//     }
//   }

//   function closeMobile(): void {
//     setMobileOpen(false);
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={closeMobile} />

//       <div
//         className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
//           collapsed ? "md:ml-[76px]" : "md:ml-64"
//         }`}
//       >
//         <Header onToggleSidebar={handleToggleSidebar} />
//         <main className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/studentDashboard/Sidebar";
// import Header from "../components/studentDashboard/Header";
// import api from "../api/interceptor"; // <-- ADDED: Import your API instance

// const MOBILE_BREAKPOINT = 768;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/'; // <-- ADDED: Ensure BASE_URL is available

// export default function Layout() {
//   const [collapsed, setCollapsed] = useState<boolean>(false);
//   const [mobileOpen, setMobileOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(
//     typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
//   );

//   // <-- ADDED: New state to track if the application is submitted
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//   // Track viewport width and auto-hide the sidebar whenever we're on a small screen
//   useEffect(() => {
//     function handleResize() {
//       const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
//       setIsMobile(mobile);
//       setMobileOpen(false); // always close the drawer/collapse state on breakpoint change
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // <-- ADDED: Fetch application status when the layout loads
//   useEffect(() => {
//     const fetchApplicationStatus = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
//         if (!token) return;

//         const response = await api.get(`${BASE_URL}/application/steps/all`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data.success) {
//           const data = response.data.data;
//           // Set to true if the application is fully submitted
//           if (data.isSubmitted === true && data.status === 'submitted') {
//             setIsSubmitted(true);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to fetch status for sidebar:', error);
//       }
//     };

//     fetchApplicationStatus();
//   }, []);

//   function handleToggleSidebar(): void {
//     if (isMobile) {
//       setMobileOpen((open) => !open);
//     } else {
//       setCollapsed((c) => !c);
//     }
//   }

//   function closeMobile(): void {
//     setMobileOpen(false);
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* <-- ADDED: Pass the new isSubmitted state to the Sidebar */}
//       <Sidebar 
//         collapsed={collapsed} 
//         mobileOpen={mobileOpen} 
//         onCloseMobile={closeMobile} 
//         isSubmitted={isSubmitted} 
//       />

//       <div
//         className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
//           collapsed ? "md:ml-[76px]" : "md:ml-64"
//         }`}
//       >
//         <Header onToggleSidebar={handleToggleSidebar} />
//         <main className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/studentDashboard/Sidebar";
import Header from "../components/studentDashboard/Header";
import api from "../api/interceptor"; 

const MOBILE_BREAKPOINT = 768;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // <-- ADDED: State to hold candidate details for the Header
  const [candidateInfo, setCandidateInfo] = useState({ name: "Candidate", email: "" });

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setMobileOpen(false); 
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await api.get(`${BASE_URL}/application/steps/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          
          if (data.isSubmitted === true && data.status === 'submitted') {
            setIsSubmitted(true);
          }

          // <-- ADDED: Extract Name and Email from the /all API response
          const name = data.steps?.step0?.fullName || data.steps?.step1?.personalInfo?.name || "Candidate";
          const email = data.steps?.step0?.emailId || data.steps?.step1?.personalInfo?.email || "";
          
          setCandidateInfo({ name, email });
        }
      } catch (error) {
        console.error('Failed to fetch status for sidebar:', error);
      }
    };

    fetchApplicationStatus();
  }, []);

  function handleToggleSidebar(): void {
    if (isMobile) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((c) => !c);
    }
  }

  function closeMobile(): void {
    setMobileOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        collapsed={collapsed} 
        mobileOpen={mobileOpen} 
        onCloseMobile={closeMobile} 
        isSubmitted={isSubmitted} 
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          collapsed ? "md:ml-[76px]" : "md:ml-64"
        }`}
      >
        {/* <-- ADDED: Pass candidateInfo to the Header */}
        <Header 
          onToggleSidebar={handleToggleSidebar} 
          userData={candidateInfo} 
        />
        
        <main className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}