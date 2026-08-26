// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export interface TableCandidate {
//   id: string;
//   name: string;
//   email: string;
//   applicationNumber: string;
//   phone: string;
//   status: string;
// }

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [candidates, setCandidates] = useState<TableCandidate[]>([]);
//   const [stats, setStats] = useState<any>(null);
  
//   const [totalRecords, setTotalRecords] = useState(0); 
//   const [isLoading, setIsLoading] = useState(true);

//   // Pagination state
//   const [pageNo, setPageNo] = useState(1);
//   const pageSize = 20; // Hardcoded to exactly 20 data records per page

<<<<<<< HEAD
=======
//   // Sorting state
//   const [sortConfig, setSortConfig] = useState<{ key: keyof TableCandidate; direction: 'asc' | 'desc' } | null>(null);

//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // Debounce effect to prevent API spam on every single keystroke
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setPageNo(1); // Reset to first page whenever a new search is performed
//     }, 500); // Wait 500ms after the user stops typing
//     return () => clearTimeout(handler);
//   }, [searchTerm]);

>>>>>>> origin/main
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
//         const headers = { 
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}` 
//         };

<<<<<<< HEAD
//         const [statsRes, candidatesRes] = await Promise.all([
//           fetch(`${BASE_URL}/admin/stats`, { headers }),
//           fetch(`${BASE_URL}/admin/candidates?page=${pageNo}&limit=${pageSize}`, { headers })
//         ]);

//         const statsData = await statsRes.json();
//         const candidatesData = await candidatesRes.json();

//         if (statsData.success) {
//           setStats(statsData.data);
//         }

//         if (candidatesData.success) {
=======
//         // Construct the dynamic API URL:
//         // {{baseUrl}}/api/v1/admin/candidates?search=...&isSubmitted=true&sortBy=...&sortOrder=...&page=...&limit=...
//         //
//         // NOTE: If VITE_API_BASE_URL already ends in "/api/v1", simply prepending
//         // "/api/v1" again causes a 404 (e.g. ".../api/v1/api/v1/admin/candidates").
//         // This normalizes it so it works either way, without touching how
//         // BASE_URL is used elsewhere (like the /admin/stats call below).
//         const API_V1_BASE = BASE_URL.replace(/\/+$/, "").endsWith("/api/v1")
//           ? BASE_URL.replace(/\/+$/, "")
//           : `${BASE_URL.replace(/\/+$/, "")}/api/v1`;

//         const candidatesParams = new URLSearchParams();

//         // Add Search & isSubmitted parameters if search is active
//         if (debouncedSearch) {
//           candidatesParams.append("search", debouncedSearch);
//           candidatesParams.append("isSubmitted", "true");
//         }

//         // Add Sorting if active
//         if (sortConfig) {
//           candidatesParams.append("sortBy", sortConfig.key);
//           candidatesParams.append("sortOrder", sortConfig.direction);
//         }

//         // Pagination (always present)
//         candidatesParams.append("page", String(pageNo));
//         candidatesParams.append("limit", String(pageSize));

//         const candidatesApiUrl = `${API_V1_BASE}/admin/candidates?${candidatesParams.toString()}`;

//         const [statsRes, candidatesRes] = await Promise.all([
//           fetch(`${BASE_URL}/admin/stats`, { headers }),
//           fetch(candidatesApiUrl, { headers })
//         ]);

//         if (!statsRes.ok) {
//           console.error(`Stats request failed: ${statsRes.status} ${statsRes.statusText} (${statsRes.url})`);
//         }
//         if (!candidatesRes.ok) {
//           console.error(`Candidates request failed: ${candidatesRes.status} ${candidatesRes.statusText} (${candidatesRes.url})`);
//         }

//         const statsData = statsRes.ok ? await statsRes.json() : null;
//         const candidatesData = candidatesRes.ok ? await candidatesRes.json() : null;

//         if (statsData?.success) {
//           setStats(statsData.data);
//         }

//         if (candidatesData?.success) {
>>>>>>> origin/main
//           const rawCandidates = Array.isArray(candidatesData.data)
//             ? candidatesData.data
//             : candidatesData.data?.candidates || candidatesData.data?.items || candidatesData.data?.rows || [];

//           const formattedCandidates = rawCandidates.map((c: any) => ({
//             id: c.id,
//             name: c.user?.fullName || "N/A",
//             email: c.user?.email || "N/A",
//             applicationNumber: c.application?.applicationReferenceNumber || c.registrationNumber || "N/A",
//             phone: c.mobileNumber || "N/A",
//             status: c.application?.status || "N/A"
//           }));
          
//           setCandidates(formattedCandidates);
          
//           if (candidatesData.pagination?.total) {
//             setTotalRecords(candidatesData.pagination.total);
<<<<<<< HEAD
//           } else if (statsData.data?.applications?.total) {
//             setTotalRecords(statsData.data.applications.total);
=======
//           } else if (statsData?.data?.applications?.total) {
//             setTotalRecords(statsData.data.applications.total);
//           } else {
//             // Fallback for search results if pagination data structure changes slightly during searches
//             setTotalRecords(formattedCandidates.length);
>>>>>>> origin/main
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
<<<<<<< HEAD
//   }, [pageNo]); // pageSize removed from dependencies as it is constant
=======
//   }, [pageNo, sortConfig, debouncedSearch]); // Added debouncedSearch to trigger re-fetch

//   // Sorting Logic
//   const sortedCandidates = useMemo(() => {
//     let sortableItems = [...candidates];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [candidates, sortConfig]);

//   const requestSort = (key: keyof TableCandidate) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key: keyof TableCandidate) => {
//     if (!sortConfig || sortConfig.key !== key) {
//       return <span className="ml-1 inline-block text-[#0076b6] opacity-30">↕</span>;
//     }
//     return sortConfig.direction === 'asc' ? (
//       <span className="ml-1 inline-block text-[#0076b6]">↑</span>
//     ) : (
//       <span className="ml-1 inline-block text-[#0076b6]">↓</span>
//     );
//   };

//   // --- NEW EXPORT FUNCTION ADDED HERE ---
//   const handleExport = () => {
//     if (!candidates || candidates.length === 0) return;

//     // Define CSV headers
//     const headers = ["Candidate Name", "Email", "Application Number", "Phone Number", "Status"];
    
//     // Map candidate data to match headers
//     const csvData = candidates.map(c => [
//       c.name,
//       c.email,
//       c.applicationNumber,
//       c.phone,
//       c.status
//     ]);

//     // Combine headers and data into CSV format
//     const csvContent = [
//       headers.join(","),
//       ...csvData.map(row => row.map(cell => `"${cell}"`).join(",")) // wrap cells in quotes to handle commas
//     ].join("\n");

//     // Create a Blob and trigger download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "candidates_export.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   // --------------------------------------
>>>>>>> origin/main

//   const handleRowClick = (candidateId: string) => {
//     navigate(`candidate/${candidateId}`);
//   };

//   // Helper for pagination math
//   const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
//   const startRecord = (pageNo - 1) * pageSize + 1;
//   const endRecord = Math.min(pageNo * pageSize, totalRecords);

//   // Generate page numbers to display (e.g., 1 2 3 ... 8)
//   const pageNumbers = useMemo(() => {
//     const nums: (number | "...")[] = [];
//     const windowSize = 1; // How many pages to show around the current page
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || Math.abs(i - pageNo) <= windowSize) {
//         nums.push(i);
//       } else if (nums[nums.length - 1] !== "...") {
//         nums.push("...");
//       }
//     }
//     return nums;
//   }, [pageNo, totalPages]);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      
//       {/* 4 CARDS SECTION */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//         <StatCard 
//           title="Total Registered Applications" 
//           value={stats?.applications?.total || 0} 
//           color="border-l-[#0076b6]" 
//         />
//         <StatCard 
//           title="Submitted" 
//           value={stats?.applications?.submitted || 0} 
//           color="border-l-emerald-500" 
//         />
//         <StatCard 
//           title="Draft / Pending" 
//           value={stats?.applications?.draft || 0} 
//           color="border-l-amber-500" 
//         />
<<<<<<< HEAD
//         {/* <StatCard 
//           title="Total Candidates" 
//           value={stats?.candidates?.total || 0} 
//           color="border-l-purple-500" 
//         /> */}
=======
>>>>>>> origin/main
//       </div>

//       {/* DYNAMIC EXAM CITY STATS SECTION */}
//       {stats?.examCityStats && stats.examCityStats.length > 0 && (
//         <div className="space-y-4 pt-2">
//           <h2 className="text-lg font-semibold text-slate-700">Exam Center Statistics</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//             {stats.examCityStats.map((cityStat: any, index: number) => {
//               const displayTitle = (!cityStat.examCity || cityStat.examCity === "Not Selected") 
//                 ? "No center selected" 
//                 : cityStat.examCity;
                
//               return (
//                 <StatCard 
//                   key={index}
//                   title={displayTitle}
//                   value={cityStat.count}
//                   color="border-l-indigo-400"
//                 />
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* SIMPLE TABLE SECTION */}
//       <div className="shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden">
<<<<<<< HEAD
//         {/* Table Header Area */}
=======
        
//         {/* Table Header Area WITH SEARCH BAR & EXPORT BUTTON */}
>>>>>>> origin/main
//         <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h3 className="text-base font-semibold text-slate-800">Candidate Data</h3>
//             <p className="mt-0.5 text-sm text-slate-500">Click on any candidate row to view full details.</p>
//           </div>
<<<<<<< HEAD
=======
          
//           {/* Actions Container */}
//           <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            
//             {/* NEW EXPORT BUTTON */}
//             <button
//               onClick={handleExport}
//               disabled={isLoading || candidates.length === 0}
//               className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0076b6] focus:border-[#0076b6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
//               </svg>
//               Export
//             </button>

//             {/* Search Bar */}
//             <div className="w-full sm:w-72">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, app number..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0076b6] focus:border-[#0076b6] transition-colors"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
>>>>>>> origin/main
//         </div>

//         {/* Responsive Table Wrapper */}
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[800px] text-left border-collapse">
//             <thead className="bg-[#f0f7fb] text-[#0076b6]">
//               <tr>
<<<<<<< HEAD
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Candidate Name</th>
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Email</th>
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Application Number</th>
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Phone Number</th>
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Status</th>
=======
//                 <th 
//                   onClick={() => requestSort('name')} 
//                   className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
//                 >
//                   <div className="flex items-center">Candidate Name {getSortIcon('name')}</div>
//                 </th>
//                 <th 
//                   onClick={() => requestSort('email')} 
//                   className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
//                 >
//                   <div className="flex items-center">Email {getSortIcon('email')}</div>
//                 </th>
//                 <th 
//                   onClick={() => requestSort('applicationNumber')} 
//                   className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
//                 >
//                   <div className="flex items-center">Application Number {getSortIcon('applicationNumber')}</div>
//                 </th>
//                 <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">
//                   <div className="flex items-center">Phone Number</div>
//                 </th>
//                 <th 
//                   onClick={() => requestSort('status')} 
//                   className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
//                 >
//                   <div className="flex items-center">Status {getSortIcon('status')}</div>
//                 </th>
>>>>>>> origin/main
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200 bg-white">
//               {isLoading ? (
//                 // Smooth Skeleton Loader
//                 Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
//                   <tr key={`skeleton-${i}`}>
//                     {Array.from({ length: 5 }).map((_, colIndex) => (
//                       <td key={colIndex} className="px-5 py-4">
//                         <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))
<<<<<<< HEAD
//               ) : candidates.length === 0 ? (
//                 // Empty State
//                 <tr>
//                   <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
//                     No candidates found.
=======
//               ) : sortedCandidates.length === 0 ? (
//                 // Empty State
//                 <tr>
//                   <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
//                     No candidates found matching your search.
>>>>>>> origin/main
//                   </td>
//                 </tr>
//               ) : (
//                 // Data Rows
<<<<<<< HEAD
//                 candidates.map((candidate) => (
=======
//                 sortedCandidates.map((candidate) => (
>>>>>>> origin/main
//                   <tr 
//                     key={candidate.id}
//                     onClick={() => handleRowClick(candidate.id)}
//                     className="hover:bg-slate-50 cursor-pointer transition-colors"
//                   >
//                     <td className="px-5 py-4 text-sm text-slate-800 font-medium">{candidate.name}</td>
//                     <td className="px-5 py-4 text-sm text-slate-600">{candidate.email}</td>
//                     <td className="px-5 py-4 text-sm text-slate-600">{candidate.applicationNumber}</td>
//                     <td className="px-5 py-4 text-sm text-slate-600">{candidate.phone}</td>
//                     <td className="px-5 py-4 text-sm">
//                       <StatusBadge status={candidate.status} />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Custom Pagination Footer */}
//         {!isLoading && totalRecords > 0 && (
//           <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
//             <div className="flex items-center gap-3 text-sm text-slate-500">
//               <span>
//                 Showing <span className="font-medium text-slate-700">{startRecord}</span> to <span className="font-medium text-slate-700">{endRecord}</span> of <span className="font-medium text-slate-700">{totalRecords}</span>
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 disabled={pageNo === 1}
//                 onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}
//                 className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Previous
//               </button>

//               {/* Dynamic Page Numbers */}
//               <div className="flex items-center gap-1 hidden sm:flex">
//                 {pageNumbers.map((p, i) =>
//                   p === "..." ? (
//                     <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
//                       ...
//                     </span>
//                   ) : (
//                     <button
//                       key={p}
//                       type="button"
//                       onClick={() => setPageNo(p as number)}
//                       className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
//                         p === pageNo
//                           ? "bg-[#0076b6] text-white"
//                           : "text-slate-600 hover:bg-slate-100"
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   )
//                 )}
//               </div>

//               <button
//                 type="button"
//                 disabled={pageNo >= totalPages}
//                 onClick={() => setPageNo((prev) => Math.min(totalPages, prev + 1))}
//                 className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Helper Components
// // ---------------------------------------------------------------------------

// function StatCard({ title, value, color }: { title: string; value: number | string; color: string }) {
//   return (
//     <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${color}`}>
//       <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
//       <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const s = status?.toLowerCase() || "";
//   let baseClass = "bg-slate-100 text-slate-600 border-slate-200";

//   if (s === "submitted" || s === "success" || s === "approved") {
//     baseClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
//   } else if (s === "draft" || s === "pending" || s === "review") {
//     baseClass = "bg-amber-50 text-amber-700 border-amber-200";
//   } else if (s === "failed" || s === "rejected" || s === "error") {
//     baseClass = "bg-rose-50 text-rose-700 border-rose-200";
//   }

//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${baseClass}`}>
//       {status?.toUpperCase() || "UNKNOWN"}
//     </span>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Download, 
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TableCandidate {
  id: string;
  name: string;
  email: string;
  applicationNumber: string;
  phone: string;
  status: string;
}

type SortDirection = "asc" | "desc";

export default function Dashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<TableCandidate[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [totalRecords, setTotalRecords] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State to handle export loading status
  const [isExporting, setIsExporting] = useState(false);

  // Pagination state
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 20; // Hardcoded to exactly 20 data records per page

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Export State
  const [exportFilter, setExportFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableCandidate; direction: SortDirection } | null>(null);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageNo(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableCandidate; direction: 'asc' | 'desc' } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect to prevent API spam on every single keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNo(1); // Reset to first page whenever a new search is performed
    }, 500); // Wait 500ms after the user stops typing
    return () => clearTimeout(handler);
>>>>>>> origin/main
  }, [searchTerm]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
        const headers = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        };

<<<<<<< HEAD
        // Construct candidates API URL with pagination and search
        let candidatesUrl = `${BASE_URL}/admin/candidates?page=${pageNo}&limit=${pageSize}`;
        if (debouncedSearchTerm) {
          candidatesUrl += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        const [statsRes, candidatesRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/stats`, { headers }),
          fetch(candidatesUrl, { headers })
=======
        // Construct the dynamic API URL:
        const API_V1_BASE = BASE_URL.replace(/\/+$/, "").endsWith("/api/v1")
          ? BASE_URL.replace(/\/+$/, "")
          : `${BASE_URL.replace(/\/+$/, "")}/api/v1`;

        const candidatesParams = new URLSearchParams();

        // Add Search & isSubmitted parameters if search is active
        if (debouncedSearch) {
          candidatesParams.append("search", debouncedSearch);
          candidatesParams.append("isSubmitted", "true");
        }

        // Add Sorting if active
        if (sortConfig) {
          candidatesParams.append("sortBy", sortConfig.key);
          candidatesParams.append("sortOrder", sortConfig.direction);
        }

        // Pagination (always present)
        candidatesParams.append("page", String(pageNo));
        candidatesParams.append("limit", String(pageSize));

        const candidatesApiUrl = `${API_V1_BASE}/admin/candidates?${candidatesParams.toString()}`;

        const [statsRes, candidatesRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/stats`, { headers }),
          fetch(candidatesApiUrl, { headers })
>>>>>>> origin/main
        ]);

        if (!statsRes.ok) {
          console.error(`Stats request failed: ${statsRes.status} ${statsRes.statusText} (${statsRes.url})`);
        }
        if (!candidatesRes.ok) {
          console.error(`Candidates request failed: ${candidatesRes.status} ${candidatesRes.statusText} (${candidatesRes.url})`);
        }

        const statsData = statsRes.ok ? await statsRes.json() : null;
        const candidatesData = candidatesRes.ok ? await candidatesRes.json() : null;

        if (statsData?.success) {
          setStats(statsData.data);
        }

        if (candidatesData?.success) {
          const rawCandidates = Array.isArray(candidatesData.data)
            ? candidatesData.data
            : candidatesData.data?.candidates || candidatesData.data?.items || candidatesData.data?.rows || [];

          const formattedCandidates = rawCandidates.map((c: any) => ({
            id: c.id,
            name: c.user?.fullName || "N/A",
            email: c.user?.email || "N/A",
            applicationNumber: c.application?.applicationReferenceNumber || c.registrationNumber || "N/A",
            phone: c.mobileNumber || "N/A",
            status: c.application?.status || "N/A"
          }));
          
          setCandidates(formattedCandidates);
          
          if (candidatesData.pagination?.total !== undefined) {
            setTotalRecords(candidatesData.pagination.total);
          } else if (statsData?.data?.applications?.total) {
            setTotalRecords(statsData.data.applications.total);
          } else {
            // Fallback for search results if pagination data structure changes slightly during searches
            setTotalRecords(formattedCandidates.length);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
<<<<<<< HEAD
  }, [pageNo, debouncedSearchTerm]); 
=======
  }, [pageNo, sortConfig, debouncedSearch]); 

  // Sorting Logic
  const sortedCandidates = useMemo(() => {
    let sortableItems = [...candidates];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  const requestSort = (key: keyof TableCandidate) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof TableCandidate) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="ml-1 inline-block text-[#0076b6] opacity-30">↕</span>;
    }
    return sortConfig.direction === 'asc' ? (
      <span className="ml-1 inline-block text-[#0076b6]">↑</span>
    ) : (
      <span className="ml-1 inline-block text-[#0076b6]">↓</span>
    );
  };

  // --- UPDATED EXPORT FUNCTION ---
  // Loops through pages to bypass backend hard limits on pagination
  const handleExport = async () => {
    if (totalRecords === 0) return;

    try {
      setIsExporting(true);
      const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
      const headers = { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      };

      const API_V1_BASE = BASE_URL.replace(/\/+$/, "").endsWith("/api/v1")
        ? BASE_URL.replace(/\/+$/, "")
        : `${BASE_URL.replace(/\/+$/, "")}/api/v1`;

      let allExportedCandidates: any[] = [];
      let currentPage = 1;
      let hasMoreData = true;
      const exportLimit = 50; // Fetch 50 at a time to reduce total API calls safely

      while (hasMoreData) {
        const exportParams = new URLSearchParams();

        if (debouncedSearch) {
          exportParams.append("search", debouncedSearch);
          exportParams.append("isSubmitted", "true");
        }
        if (sortConfig) {
          exportParams.append("sortBy", sortConfig.key);
          exportParams.append("sortOrder", sortConfig.direction);
        }

        exportParams.append("page", String(currentPage));
        exportParams.append("limit", String(exportLimit));

        const exportApiUrl = `${API_V1_BASE}/admin/candidates?${exportParams.toString()}`;
        const response = await fetch(exportApiUrl, { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data at page ${currentPage}`);
        }

        const data = await response.json();
        
        if (data?.success) {
          const rawCandidates = Array.isArray(data.data)
            ? data.data
            : data.data?.candidates || data.data?.items || data.data?.rows || [];

          // Add the newly fetched candidates to our master list
          if (rawCandidates.length > 0) {
            allExportedCandidates = [...allExportedCandidates, ...rawCandidates];
          }

          // If the backend returns fewer items than we asked for, we've hit the end.
          if (rawCandidates.length < exportLimit || rawCandidates.length === 0) {
            hasMoreData = false;
          } else {
            currentPage++; // Move to the next page for the next loop iteration
          }
        } else {
          hasMoreData = false; // Stop loop on failure
        }
      }

      // Check if we actually got data
      if (allExportedCandidates.length === 0) {
        alert("No data available to export.");
        return;
      }

      // Define CSV headers
      const csvHeaders = ["Candidate Name", "Email", "Application Number", "Phone Number", "Status"];
      
      // Map raw candidate data directly to match headers
      const csvData = allExportedCandidates.map((c: any) => [
        c.user?.fullName || "N/A",
        c.user?.email || "N/A",
        c.application?.applicationReferenceNumber || c.registrationNumber || "N/A",
        c.mobileNumber || "N/A",
        c.application?.status || "N/A"
      ]);

      // Combine headers and data into CSV format
      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(",")) // wrap cells in quotes
      ].join("\n");

      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `candidates_export_all.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export all candidates. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  // --------------------------------------
>>>>>>> origin/main

  const handleRowClick = (candidateId: string) => {
    navigate(`candidate/${candidateId}`);
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
      
      let exportUrl = `${BASE_URL}/admin/candidates/export/xlsx`;
      if (exportFilter !== "all") {
        exportUrl += `?paymentStatus=${exportFilter}`;
      }

      const response = await fetch(exportUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        // Create an invisible anchor tag to trigger the browser download
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", ""); // Let browser infer filename from headers
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Data exported successfully! Download starting...");
      } else {
        console.error("Export failed:", data.message);
        toast.error(`Export failed: ${data.message || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("An error occurred while attempting to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  // Sorting Handler
  const requestSort = (key: keyof TableCandidate) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply Sorting to Candidates
  const sortedCandidates = useMemo(() => {
    let sortableItems = [...candidates];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key].toString().toLowerCase();
        const valB = b[sortConfig.key].toString().toLowerCase();
        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  // Helper for rendering sorting icons
  const getSortIcon = (key: keyof TableCandidate) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="w-3.5 h-3.5 ml-1.5" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1.5" />;
  };

  // Helper for pagination math
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startRecord = (pageNo - 1) * pageSize + 1;
  const endRecord = Math.min(pageNo * pageSize, totalRecords);

  // Generate page numbers to display (e.g., 1 2 3 ... 8)
  const pageNumbers = useMemo(() => {
    const nums: (number | "...")[] = [];
    const windowSize = 1; // How many pages to show around the current page
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - pageNo) <= windowSize) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "...") {
        nums.push("...");
      }
    }
    return nums;
  }, [pageNo, totalPages]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 bg-[#f8f9fa] min-h-screen">
      
      {/* 4 CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-5">
        <StatCard 
          title="Total Applications" 
          value={stats?.applications?.total || 0} 
          icon={<FileText className="w-5 h-5 text-slate-700" />}
          iconBg="bg-slate-200/60"
        />
        <StatCard 
          title="Submitted" 
          value={stats?.applications?.submitted || 0} 
          icon={<CheckCircle className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-100/60"
        />
        <StatCard 
          title="Draft / Pending" 
          value={stats?.applications?.draft || 0} 
          icon={<Clock className="w-5 h-5 text-rose-700" />}
          iconBg="bg-rose-100/60"
        />
      </div>

      {/* DYNAMIC EXAM CITY STATS SECTION */}
      {stats?.examCityStats && stats.examCityStats.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-slate-800">Exam Center Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-5">
            {stats.examCityStats.map((cityStat: any, index: number) => {
              const displayTitle = (!cityStat.examCity || cityStat.examCity === "Not Selected") 
                ? "No Center Selected" 
                : cityStat.examCity;
                
              return (
                <StatCard 
                  key={index}
                  title={displayTitle}
                  value={cityStat.total} 
                  submitted={cityStat.submitted}
                  draft={cityStat.draft}
                  icon={<MapPin className="w-5 h-5 text-indigo-700" />}
                  iconBg="bg-indigo-100/60"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* SIMPLE TABLE SECTION */}
      <div className="shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden">
<<<<<<< HEAD
        {/* Table Header Area */}
        <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
=======
        
        {/* Table Header Area WITH SEARCH BAR & EXPORT BUTTON */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
>>>>>>> origin/main
          <div>
            <h3 className="text-base font-semibold text-slate-800">Candidate Data</h3>
            <p className="mt-0.5 text-sm text-slate-500">Click on any candidate row to view full details.</p>
          </div>
          
<<<<<<< HEAD
          {/* Action Area: Search + Filter + Export */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input with Debounce */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-[#0076b6] focus:border-[#0076b6] block w-full sm:w-64 p-2.5 pl-9 outline-none transition-colors"
              />
            </div>

            <select
              value={exportFilter}
              onChange={(e) => setExportFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-[#0076b6] focus:border-[#0076b6] block p-2.5 outline-none transition-colors cursor-pointer min-w-[120px]"
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
            
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 bg-[#0076b6] hover:bg-[#005f92] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Download className="w-4 h-4 shrink-0" />
              )}
              <span>{isExporting ? "Exporting..." : "Export Data"}</span>
            </button>
=======
          {/* Actions Container */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            
            {/* UPDATED EXPORT BUTTON (handles loading state) */}
            <button
              onClick={handleExport}
              disabled={isLoading || isExporting || totalRecords === 0}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0076b6] focus:border-[#0076b6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[110px]"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Export All
                </>
              )}
            </button>

            {/* Search Bar */}
            <div className="w-full sm:w-72">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, app number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0076b6] focus:border-[#0076b6] transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
>>>>>>> origin/main
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-[#f0f7fb] text-[#0076b6] select-none">
              <tr>
                <th 
<<<<<<< HEAD
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer group hover:bg-[#e4f1f8] transition-colors"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Candidate Name
                    {getSortIcon("name")}
                  </div>
                </th>
                <th 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer group hover:bg-[#e4f1f8] transition-colors"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </th>
                <th 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer group hover:bg-[#e4f1f8] transition-colors"
                  onClick={() => requestSort("applicationNumber")}
                >
                  <div className="flex items-center">
                    Application Number
                    {getSortIcon("applicationNumber")}
                  </div>
                </th>
                <th 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer group hover:bg-[#e4f1f8] transition-colors"
                  onClick={() => requestSort("phone")}
                >
                  <div className="flex items-center">
                    Phone Number
                    {getSortIcon("phone")}
                  </div>
                </th>
                <th 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer group hover:bg-[#e4f1f8] transition-colors"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
=======
                  onClick={() => requestSort('name')} 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
                >
                  <div className="flex items-center">Candidate Name {getSortIcon('name')}</div>
                </th>
                <th 
                  onClick={() => requestSort('email')} 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
                >
                  <div className="flex items-center">Email {getSortIcon('email')}</div>
                </th>
                <th 
                  onClick={() => requestSort('applicationNumber')} 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
                >
                  <div className="flex items-center">Application Number {getSortIcon('applicationNumber')}</div>
                </th>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center">Phone Number</div>
                </th>
                <th 
                  onClick={() => requestSort('status')} 
                  className="px-5 py-4 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none hover:bg-[#e3eff6] transition-colors"
                >
                  <div className="flex items-center">Status {getSortIcon('status')}</div>
>>>>>>> origin/main
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                // Smooth Skeleton Loader
                Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedCandidates.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No candidates found matching your search.
                  </td>
                </tr>
              ) : (
                // Data Rows
                sortedCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id}
                    onClick={() => handleRowClick(candidate.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-slate-800 font-medium">{candidate.name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{candidate.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{candidate.applicationNumber}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{candidate.phone}</td>
                    <td className="px-5 py-4 text-sm">
                      <StatusBadge status={candidate.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination Footer */}
        {!isLoading && totalRecords > 0 && (
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>
                Showing <span className="font-medium text-slate-700">{startRecord}</span> to <span className="font-medium text-slate-700">{endRecord}</span> of <span className="font-medium text-slate-700">{totalRecords}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pageNo === 1}
                onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Dynamic Page Numbers */}
              <div className="flex items-center gap-1 hidden sm:flex">
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPageNo(p as number)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === pageNo
                          ? "bg-[#0076b6] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                disabled={pageNo >= totalPages}
                onClick={() => setPageNo((prev) => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* React Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function StatCard({ 
  title, 
  value, 
  submitted, 
  draft,
  icon,
  iconBg
}: { 
  title: string; 
  value: number | string; 
  submitted?: number; 
  draft?: number;
  icon?: React.ReactNode;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-3">
          <h4 className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest truncate">
            {title}
          </h4>
          <p className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
            {value}
          </p>
        </div>
        
        {icon && (
          <div className={`flex items-center justify-center w-[46px] h-[46px] rounded-xl shrink-0 ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Subtext rendering styled similarly to "33% of total" */}
      {(submitted !== undefined || draft !== undefined) && (
        <div className="mt-3 text-[13px] text-slate-500 font-medium flex items-center flex-wrap gap-2">
          {submitted !== undefined && (
            <span>
              <span className="text-emerald-600 font-bold">{submitted}</span> Submitted
            </span>
          )}
          
          {submitted !== undefined && draft !== undefined && (
            <span className="text-slate-300">|</span>
          )}
          
          {draft !== undefined && (
            <span>
              <span className="text-rose-600 font-bold">{draft}</span> Draft
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || "";
  let baseClass = "bg-slate-100 text-slate-600 border-slate-200";

  if (s === "submitted" || s === "success" || s === "approved") {
    baseClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (s === "draft" || s === "pending" || s === "review") {
    baseClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (s === "failed" || s === "rejected" || s === "error") {
    baseClass = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${baseClass}`}>
      {status?.toUpperCase() || "UNKNOWN"}
    </span>
  );
}