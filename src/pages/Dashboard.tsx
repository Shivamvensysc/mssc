import React from "react";
import { useNavigate } from "react-router-dom";
import { ReusableTable, type Column } from "../components/ReusableTable"; // Verify your file path
import { type Candidate, MOCK_CANDIDATES } from "../mockData";

export default function Dashboard() {
  const navigate = useNavigate();

  const columns: Column<Candidate>[] = [
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

  const handleRowClick = (candidate: Candidate) => {
    // Navigate to the user details page using React Router
    navigate(`candidate/${candidate.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      

      {/* 4 CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Total Applications" value={MOCK_CANDIDATES.length} color="border-l-[#0076b6]" />
        <StatCard title="Completed " value={MOCK_CANDIDATES.filter(d => d.status === "Approved").length} color="border-l-emerald-500" />
        <StatCard title="Pending" value={MOCK_CANDIDATES.filter(d => d.status === "Pending").length} color="border-l-amber-500" />
        <StatCard title="Total Registeration" value={MOCK_CANDIDATES.filter(d => d.status === "Rejected").length} color="border-l-rose-500" />
      </div>

      {/* TABLE SECTION */}
      <div className="shadow-sm rounded-2xl bg-white border border-slate-200">
        <ReusableTable<Candidate>
          title="Candidate Data for File"
          subtitle="Click on any candidate row to view full details."
          data={MOCK_CANDIDATES}
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

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${color}`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}