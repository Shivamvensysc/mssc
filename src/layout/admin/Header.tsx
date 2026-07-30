import React, { useState, useEffect, useRef } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 1. Create a ref to track the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Add useEffect to handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0076b6]"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* User Profile Area */}
      {/* 3. Attach the ref to the parent div containing the button and dropdown */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {/* Only the Profile Icon is shown initially */}
          <div className="w-8 h-8 rounded-full bg-[#0076b6] text-white flex items-center justify-center font-bold">
            A
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown Menu (Shows only on click) */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 transition-all z-50 flex flex-col overflow-hidden">
            {/* Email and Name are always shown inside the dropdown now */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@mssc.com</p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
              <UserIcon className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-slate-100">
              <LogoutIcon className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const MenuIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const ChevronDownIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><polyline points="6 9 12 15 18 9"/></svg>;
const LogoutIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const UserIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;