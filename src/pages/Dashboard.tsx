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

  // Pagination state
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 20; // Hardcoded to exactly 20 data records per page

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
        const headers = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        };

        const [statsRes, candidatesRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/stats`, { headers }),
          fetch(`${BASE_URL}/admin/candidates?page=${pageNo}&limit=${pageSize}`, { headers })
        ]);

        const statsData = await statsRes.json();
        const candidatesData = await candidatesRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }

        if (candidatesData.success) {
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
          } else if (statsData.data?.applications?.total) {
            setTotalRecords(statsData.data.applications.total);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [pageNo]); // pageSize removed from dependencies as it is constant

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
        {/* <StatCard 
          title="Total Candidates" 
          value={stats?.candidates?.total || 0} 
          color="border-l-purple-500" 
        /> */}
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
        {/* Table Header Area */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Candidate Data</h3>
            <p className="mt-0.5 text-sm text-slate-500">Click on any candidate row to view full details.</p>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-[#f0f7fb] text-[#0076b6]">
              <tr>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Candidate Name</th>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Application Number</th>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Phone Number</th>
                <th className="px-5 py-4 font-semibold text-sm uppercase tracking-wider">Status</th>
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
              ) : candidates.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                // Data Rows
                candidates.map((candidate) => (
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