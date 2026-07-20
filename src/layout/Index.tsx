import React from 'react';
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col justify-between">
      {/* Persistent global header across application modules */}
      <Header />

      {/* Main page content area that changes based on active URL route */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Persistent global footer */}
      <Footer />
    </div>
  );
};

export default Layout;