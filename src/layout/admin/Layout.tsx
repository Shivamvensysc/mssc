import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  // Sidebar starts closed on mobile (off-canvas) and open/expanded on desktop.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Runs once on mount, after window is available (safe for SSR too)
    const isDesktop = window.innerWidth >= 1024;
    setIsSidebarOpen(isDesktop);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8">
          {/* React Router injects the child components here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}