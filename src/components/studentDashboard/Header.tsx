import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


interface HeaderProps {
  onToggleSidebar: () => void;
  userData?: { name: string; email: string ; photoUrl?: string }; 
}

export default function Header({ onToggleSidebar, userData = { name: "Candidate", email: "",photoUrl: "" } }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // <-- ADDED: Calculate initials dynamically from the prop
  const initials = userData.name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3.5 border-b border-slate-200 bg-white px-4 md:px-5">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:border-[#0076b6] hover:bg-[#0076b6]/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[19px] w-[19px]">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      <div className="min-w-0">
        <div className="whitespace-nowrap font-display text-base font-semibold md:text-lg">Overview</div>
        <div className="hidden text-xs text-slate-500 sm:block">Saturday, 1 August</div>
      </div>

      <div className="relative ml-2 hidden max-w-[380px] flex-1 sm:block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.6" y2="16.6" />
        </svg>
        <input
          type="text"
          placeholder="Search orders, customers…"
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3.5 text-sm outline-none transition-colors focus:border-[#0076b6] focus:bg-white"
        />
      </div>

      {/* Profile Avatar Dropdown Area */}
      <div className="ml-auto flex items-center gap-2.5 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-full bg-[#0076b6] font-mono text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0076b6] focus:ring-offset-2 border border-slate-200"
        >
          {/* <-- CHANGED: Conditional rendering for Image vs Initials */}
          {userData.photoUrl ? (
            <img 
              src={userData.photoUrl} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {userData.email}
              </p>
            </div>
            
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}