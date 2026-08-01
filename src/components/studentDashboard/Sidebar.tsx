import { NavLink } from "react-router-dom";
type IconName = "grid" | "trend" | "users" | "orders" | "folder" | "list" | "clock" | "gear";
import React from "react";
interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
    trend: (
      <>
        <path d="M3 12l7-8 4 4.5L21 3" />
        <path d="M14 3h7v7" />
      </>
    ),
    users: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
      </>
    ),
    orders: (
      <>
        <path d="M3 7h18M6 7v13h12V7M9 11v5M15 11v5" />
        <path d="M8 7l1.5-4h5L16 7" />
      </>
    ),
    folder: (
      <>
        <path d="M9 3h6l1 3h4v13H4V6h4l1-3z" />
        <path d="M9 12h6M9 16h4" />
      </>
    ),
    list: <path d="M4 5h16M4 12h16M4 19h10" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M4.5 12a7.5 7.5 0 0113.6-4.3M19.5 12a7.5 7.5 0 01-13.6 4.3" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-[19px] h-[19px] shrink-0"
    >
      {paths[name]}
    </svg>
  );
}
// ... (Keep your Icon component exactly the same) ...

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isSubmitted: boolean; // <-- ADD THIS PROP
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, isSubmitted }: SidebarProps) {
  
  // Build the navigation dynamically based on the isSubmitted status
  const navItems: NavItem[] = [
    { to: "/candidate", label: "Dashboard", end: true, icon: "grid" },
  ];

  // Only add the Application tab if the form is NOT submitted
  if (!isSubmitted) {
    navItems.push({ to: "/candidate/application", label: "Application", icon: "trend" as IconName });
  }

  const NAV_SECTIONS: NavSection[] = [
    {
      label: "General",
      items: navItems,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-30 bg-slate-400/60 transition-opacity duration-200 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen flex-col overflow-hidden bg-[#0076b6] text-white
        transition-all duration-300 ease-in-out
        ${collapsed ? "md:w-[76px]" : "md:w-64"}
        w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0076b6] font-mono text-sm font-semibold">
            CP
          </div>
          <span
            className={`whitespace-nowrap font-display text-[16.5px] font-semibold transition-opacity ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            Candidate Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `relative mb-0.5 flex items-center gap-3.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    ${collapsed ? "md:justify-center" : ""}
                    ${
                      isActive
                        ? "bg-white/30 text-white before:absolute before:-left-3 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-[#0076b6] before:content-['']"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon name={item.icon} />
                  <span className={collapsed ? "md:hidden" : ""}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-auto rounded-full bg-[#0076b6] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${
                        collapsed ? "md:hidden" : ""
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
}