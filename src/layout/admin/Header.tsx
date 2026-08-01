import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Ref to track the dropdown container to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate("/admin-login");
  };

  // Handle Profile Click
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // You can also add navigation to profile here if needed:
    // navigate("/admin/profile");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-8 shrink-0 z-10 relative">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0076b6]"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* User Profile Area */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#0076b6] text-white flex items-center justify-center font-bold shrink-0">
            A
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 max-w-[calc(100vw-1.5rem)] bg-white rounded-lg shadow-lg border border-slate-100 transition-all z-50 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@mssc.com</p>
            </div>

            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-slate-100"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}