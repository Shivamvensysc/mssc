import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReusableTable, type Column } from "../components/ReusableTable"; // Verify your file path

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the shape of our flattened candidate data for the table
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
  const [isLoading, setIsLoading] = useState(true);

  // Reusable Table Columns
  const columns: Column<TableCandidate>[] = [
    { key: "name", title: "Candidate Name", type: "text", sortable: true },
    { key: "email", title: "Email", type: "text", sortable: true },
    { key: "applicationNumber", title: "Application Number", type: "text", sortable: true },
    { key: "phone", title: "Phone Number", type: "phone", sortable: false },
    { key: "status", title: "Status", type: "status", sortable: true },
  ];

  const customTheme = {
    accentColor: "#0076b6",
    headerBackground: "#f0f7fb",
    headerColor: "#0076b6",
    borderColor: "#e2e8f0",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Using idToken as stored in your AdminLoginPage
        const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
        const headers = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        };

        // Fetch stats and candidates in parallel
        const [statsRes, candidatesRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/stats`, { headers }),
          fetch(`${BASE_URL}/admin/candidates`, { headers })
        ]);

        const statsData = await statsRes.json();
        const candidatesData = await candidatesRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }

        if (candidatesData.success) {
          // Flatten the nested API data into a simple object for the ReusableTable
          const formattedCandidates = candidatesData.data.map((c: any) => ({
            id: c.id,
            name: c.user?.fullName || "N/A",
            email: c.user?.email || "N/A",
            applicationNumber: c.application?.applicationReferenceNumber || c.registrationNumber || "N/A",
            phone: c.mobileNumber || "N/A",
            status: c.application?.status || "N/A"
          }));
          setCandidates(formattedCandidates);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRowClick = (candidate: TableCandidate) => {
    navigate(`candidate/${candidate.id}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* 4 CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard 
          title="Total Applications" 
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
        <StatCard 
          title="Total Candidates" 
          value={stats?.candidates?.total || 0} 
          color="border-l-purple-500" 
        />
      </div>

      {/* TABLE SECTION */}
      <div className="shadow-sm rounded-2xl bg-white border border-slate-200">
        <ReusableTable<TableCandidate>
          title="Candidate Data for File"
          subtitle="Click on any candidate row to view full details."
          data={candidates}
          columns={columns}
          rowKey="id"
          onRowClick={handleRowClick}
          theme={customTheme}
          toolbar={{ search: true, filter: true, export: true }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number | string; color: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${color}`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}