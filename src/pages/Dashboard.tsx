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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
//         const headers = { 
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}` 
//         };

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
//           } else if (statsData?.data?.applications?.total) {
//             setTotalRecords(statsData.data.applications.total);
//           } else {
//             // Fallback for search results if pagination data structure changes slightly during searches
//             setTotalRecords(formattedCandidates.length);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
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
        
//         {/* Table Header Area WITH SEARCH BAR & EXPORT BUTTON */}
//         <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h3 className="text-base font-semibold text-slate-800">Candidate Data</h3>
//             <p className="mt-0.5 text-sm text-slate-500">Click on any candidate row to view full details.</p>
//           </div>
          
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
//         </div>

//         {/* Responsive Table Wrapper */}
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[800px] text-left border-collapse">
//             <thead className="bg-[#f0f7fb] text-[#0076b6]">
//               <tr>
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
//               ) : sortedCandidates.length === 0 ? (
//                 // Empty State
//                 <tr>
//                   <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
//                     No candidates found matching your search.
//                   </td>
//                 </tr>
//               ) : (
//                 // Data Rows
//                 sortedCandidates.map((candidate) => (
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TableCandidate {
  id: string;
  name: string;
  email: string;
  applicationNumber: string;
  phone: string;
  status: string;
}

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
          
          if (candidatesData.pagination?.total) {
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

  const handleRowClick = (candidateId: string) => {
    navigate(`candidate/${candidateId}`);
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
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      
      {/* 4 CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard 
          title="Total Registered Applications" 
          value={stats?.applications?.total || 0} 
          color="border-l-[#0076b6]" 
        />
        <StatCard 
          title="Submitted" 
          value={stats?.applications?.submitted || 0} 
          color="border-l-emerald-500" 
        />
        <StatCard 
          title="Draft / Pending" 
          value={stats?.applications?.draft || 0} 
          color="border-l-amber-500" 
        />
      </div>

      {/* DYNAMIC EXAM CITY STATS SECTION */}
      {stats?.examCityStats && stats.examCityStats.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-slate-700">Exam Center Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.examCityStats.map((cityStat: any, index: number) => {
              const displayTitle = (!cityStat.examCity || cityStat.examCity === "Not Selected") 
                ? "No center selected" 
                : cityStat.examCity;
                
              return (
                <StatCard 
                  key={index}
                  title={displayTitle}
                  value={cityStat.count}
                  color="border-l-indigo-400"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* SIMPLE TABLE SECTION */}
      <div className="shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden">
        
        {/* Table Header Area WITH SEARCH BAR & EXPORT BUTTON */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Candidate Data</h3>
            <p className="mt-0.5 text-sm text-slate-500">Click on any candidate row to view full details.</p>
          </div>
          
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
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-[#f0f7fb] text-[#0076b6]">
              <tr>
                <th 
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
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                // Smooth Skeleton Loader
                Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-5 py-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function StatCard({ title, value, color }: { title: string; value: number | string; color: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${color}`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${baseClass}`}>
      {status?.toUpperCase() || "UNKNOWN"}
    </span>
  );
}