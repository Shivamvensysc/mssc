import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <>
      {/* Mobile Overlay - only ever shown on small screens when the sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container
          Mobile: fixed, off-canvas, full width w-64, slides in/out via translate-x
          Desktop (lg+): relative, always visible (translate-x-0), width toggles w-64 <-> w-20 */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-30 h-full shadow-xl
          bg-[#0076b6] text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen
            ? "translate-x-0 w-56"
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-20"}
        `}
      >
        <div className="flex items-center justify-center h-16 border-b border-blue-400/30 overflow-hidden px-4 shrink-0 bg-white">
          {isOpen ? (
            <img src="/mssc.png" alt="MSSC Logo" className="h-10 object-contain" />
          ) : (
            <img src="/mssc.png" alt="MSSC" className="h-8 w-8 object-cover rounded hidden lg:block" />
          )}
          {/* Show full logo on mobile even when the state is technically "closed" but the aside is only mounted visible when isOpen on mobile, so this branch is safe */}
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  // Auto-close the sidebar on mobile after navigating
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                title={item.name}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                } ${isOpen ? "" : "lg:justify-center"}`}
              >
                {item.icon}
                <span
                  className={`whitespace-nowrap transition-all duration-200 ${
                    isOpen ? "opacity-100" : "opacity-100 lg:opacity-0 lg:w-0 lg:overflow-hidden"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}