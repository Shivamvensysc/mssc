// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // ----------------------------------------------------------------------
// // 1. MOCK DATA (Replaced with your provided JSON structure)
// // ----------------------------------------------------------------------
// const MOCK_USER_DATA = {
//   success: true,
//   data: {
//     applicationId: "47a0757c-038c-4b72-926f-4d897460a6ab",
//     candidateId: "6413d1d0-acf5-437d-ab88-364d5f3bf622",
//     status: "submitted",
//     applicationReferenceNumber: "MANIPURMS4P039T",
//     submissionDate: "2026-07-28T13:29:34.865Z",
//     candidateDetails: {
//       registrationNumber: "MANIPUR20266240431",
//       dateOfBirth: "2000-08-16T00:00:00.000Z",
//       mobileNumber: "7018416867",
//       mobileVerified: true,
//       emailVerified: true,
//     },
//     steps: {
//       step0: {
//         age: 24,
//         isPwd: true,
//         gender: "male",
//         emailId: "superman@yopmail.com",
//         fullName: "shivam singh",
//         identityType: "aadhaar",
//         maritalStatus: "unmarried",
//         reservationCategory: "UR",
//       },
//       step1: {
//         personalInfo: {
//           examCity: "Imphal",
//           fatherName: "father",
//           motherName: "mother",
//           typeOfDisability: "disability",
//           identificationMarks: "cut",
//           nationality: "Indian",
//         },
//         address: {
//           permanent: { city: "city", state: "Jharkhand", pincode: "111111", village: "village", district: "Chatra", policeStation: "police" },
//           correspond: { city: "town two", state: "Jammu and Kashmir", pincode: "222222", village: "village delhi", district: "Rajouri", policeStation: "delhi police" },
//           sameAsPermanent: false
//         },
//         education: {
//           "10th": { year: "2002", board: "cbse", college: "ten", percentage: "50" },
//           "12th": { year: "2001", board: "cbse", college: "twelth", percentage: "59.98" },
//           "graduation": { year: "2002", board: "univ", college: "graduation", percentage: "79.98" },
//           "postGraduation": { year: "2003", board: "univ two", college: "post", percentage: "80" }
//         },
//         teachereligibilit: {
//           dedQual: "D.Ed. in Special Education from RCI approved institute",
//           rciNumber: "1100LK",
//           dedInstitution: "DED  instittute",
//         },
//         experience: [
//           { duration: "10", designation: "ELECTRIC", reasonLeaving: "blind" }
//         ]
//       },
//       step2: {
//         photograph: "https://via.placeholder.com/150", // Replaced massive AWS string with placeholder for clean rendering, real URL works perfectly here.
//         signature: "#",
//         livePhoto: "#",
//         eligibilityCert: "#",
//         permanentResCert: "#",
//         domicileCert: "#",
//         hslcMarksheet: "#",
//         hslcProvCert: "#",
//         nocCert: "#",
//         reservationCert: "#",
//         tenPlusTwoCert: "#",
//         experienceCert_0: "#"
//       },
//       step3: {
//         paymentOrderId: "free_A154DDF7-30D8-",
//         amount: "0.00",
//         paymentMode: "exempt",
//         status: "completed",
//       }
//     }
//   }
// };

// // ----------------------------------------------------------------------
// // 2. MAIN COMPONENT
// // ----------------------------------------------------------------------
// export default function UserDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // In a real scenario, use `id` to fetch the data. 
//   // For now, we load our mock data payload.
//   const appData = MOCK_USER_DATA.data;
//   const basicInfo = appData.steps.step0;
//   const personalExt = appData.steps.step1.personalInfo;
//   const address = appData.steps.step1.address;
//   const education = appData.steps.step1.education;
//   const docs = appData.steps.step2;

//   if (!appData) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32">
//         <h2 className="text-2xl font-bold text-slate-700">Candidate not found</h2>
//         <button onClick={() => navigate(-1)} className="mt-4 text-[#0076b6] hover:underline font-medium">
//           &larr; Go Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // Format Date Helper
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: '2-digit', month: 'short', year: 'numeric'
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
//             title="Go Back"
//           >
//             <ArrowLeftIcon className="w-5 h-5" />
//           </button>
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Data</h2>
//             <p className="text-sm text-slate-500 font-medium mt-0.5">Ref: {appData.applicationReferenceNumber}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <StatusBadge status={appData.status} />
//           <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">
//             Reg: {appData.candidateDetails.registrationNumber}
//           </div>
//         </div>
//       </div>

//       {/* --- PROFILE BANNER --- */}
//       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
//         <div className="bg-gradient-to-r from-[#0076b6] to-[#005a8c] h-32 w-full"></div>
//         <div className="px-6 sm:px-10 pb-8 relative">
//           <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
//             <div className="relative">
//               <img 
//                 src={docs.photograph} 
//                 alt="Candidate" 
//                 className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md"
//                 onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
//               />
//             </div>
//             <div className="pb-2">
//               <h1 className="text-3xl font-bold text-slate-900 capitalize">{basicInfo.fullName}</h1>
//               <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-600">
//                 <span className="flex items-center gap-1.5"><MailIcon className="w-4 h-4 text-[#0076b6]"/> {basicInfo.emailId}</span>
//                 <span className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4 text-[#0076b6]"/> +91 {basicInfo.mobileNumber}</span>
//                 <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-[#0076b6]"/> {formatDate(appData.candidateDetails.dateOfBirth)} ({basicInfo.age} Yrs)</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- DATA GRID --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Column (2/3 width) */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Personal Info */}
//           <SectionCard title="Personal Details" icon={<UserIcon className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
//               <DetailRow label="Father's Name" value={personalExt.fatherName} />
//               <DetailRow label="Mother's Name" value={personalExt.motherName} />
//               <DetailRow label="Gender" value={basicInfo.gender} capitalize />
//               <DetailRow label="Marital Status" value={basicInfo.maritalStatus} capitalize />
//               <DetailRow label="Category" value={basicInfo.reservationCategory} />
//               <DetailRow label="Nationality" value={personalExt.nationality} />
//               <DetailRow label="Identity Type" value={basicInfo.identityType} capitalize />
//               <DetailRow label="Identification Mark" value={personalExt.identificationMarks} />
//               <DetailRow label="Is PWD?" value={basicInfo.isPwd ? `Yes (${personalExt.typeOfDisability})` : "No"} />
//               <DetailRow label="Exam City" value={personalExt.examCity} />
//             </div>
//           </SectionCard>

//           {/* Education Details */}
//           <SectionCard title="Educational Qualifications" icon={<AcademicIcon className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm whitespace-nowrap">
//                 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
//                   <tr>
//                     <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Level</th>
//                     <th className="px-4 py-3">Board / University</th>
//                     <th className="px-4 py-3">Institution</th>
//                     <th className="px-4 py-3">Year</th>
//                     <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">% / CGPA</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {Object.entries(education).map(([level, data]) => (
//                     <tr key={level} className="hover:bg-slate-50/50 transition-colors text-slate-800 font-medium">
//                       <td className="px-4 py-3 capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</td>
//                       <td className="px-4 py-3 uppercase">{data.board}</td>
//                       <td className="px-4 py-3 capitalize">{data.college}</td>
//                       <td className="px-4 py-3">{data.year}</td>
//                       <td className="px-4 py-3 text-right text-[#0076b6] font-bold">{data.percentage}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </SectionCard>

//           {/* Teacher Eligibility & Experience */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//              <SectionCard title="Teacher Eligibility" icon={<BadgeIcon className="w-5 h-5 text-[#0076b6]"/>}>
//                <div className="space-y-4">
//                  <DetailRow label="RCI Number" value={appData.steps.step1.teachereligibilit.rciNumber} />
//                  <DetailRow label="D.Ed Qualification" value={appData.steps.step1.teachereligibilit.dedQual} />
//                  <DetailRow label="Institution" value={appData.steps.step1.teachereligibilit.dedInstitution} />
//                </div>
//              </SectionCard>

//              <SectionCard title="Work Experience" icon={<BriefcaseIcon className="w-5 h-5 text-[#0076b6]"/>}>
//                {appData.steps.step1.experience.map((exp, idx) => (
//                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                    <DetailRow label="Designation" value={exp.designation} />
//                    <div className="mt-3 flex gap-4">
//                      <DetailRow label="Duration" value={`${exp.duration} Months`} />
//                      <DetailRow label="Reason for leaving" value={exp.reasonLeaving} />
//                    </div>
//                  </div>
//                ))}
//              </SectionCard>
//           </div>

//         </div>

//         {/* Right Column (1/3 width) */}
//         <div className="space-y-6">
          
//           {/* Application Status Card */}
//           <SectionCard title="Application Info" icon={<InfoIcon className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="space-y-4">
//               <DetailRow label="Application ID" value={appData.applicationId} copyable />
//               <DetailRow label="Submitted On" value={formatDate(appData.submissionDate)} />
//               <div className="pt-4 border-t border-slate-100">
//                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h4>
//                 <DetailRow label="Payment Mode" value={appData.steps.step3.paymentMode} capitalize />
//                 <DetailRow label="Amount" value={`${appData.steps.step3.currency} ${appData.steps.step3.amount}`} />
//                 <DetailRow label="Transaction Status" value={appData.steps.step3.status} capitalize />
//               </div>
//             </div>
//           </SectionCard>

//           {/* Addresses */}
//           <SectionCard title="Addresses" icon={<MapPinIcon className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="space-y-6">
//               <div>
//                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</h4>
//                 <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
//                   {address.permanent.village}, {address.permanent.city},<br/>
//                   Police Station: {address.permanent.policeStation}<br/>
//                   {address.permanent.district}, {address.permanent.state} - {address.permanent.pincode}
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correspondence Address</h4>
//                 {address.sameAsPermanent ? (
//                   <p className="text-sm font-medium text-slate-600 italic">Same as Permanent Address</p>
//                 ) : (
//                   <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
//                     {address.correspond.village}, {address.correspond.city},<br/>
//                     Police Station: {address.correspond.policeStation}<br/>
//                     {address.correspond.district}, {address.correspond.state} - {address.correspond.pincode}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </SectionCard>

//           {/* Documents */}
//           <SectionCard title="Uploaded Documents" icon={<FileIcon className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="grid grid-cols-1 gap-2">
//               <DocLink label="Photograph" url={docs.photograph} />
//               <DocLink label="Signature" url={docs.signature} />
//               <DocLink label="Live Photo" url={docs.livePhoto} />
//               <DocLink label="Domicile Certificate" url={docs.domicileCert} />
//               <DocLink label="Eligibility Certificate" url={docs.eligibilityCert} />
//               <DocLink label="HSLC Marksheet" url={docs.hslcMarksheet} />
//               <DocLink label="10+2 Certificate" url={docs.tenPlusTwoCert} />
//               <DocLink label="Reservation Certificate" url={docs.reservationCert} />
//             </div>
//           </SectionCard>

//         </div>
//       </div>
//     </div>
//   );
// }

// // ----------------------------------------------------------------------
// // 3. HELPER COMPONENTS
// // ----------------------------------------------------------------------

// function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
//         {icon}
//         <h3 className="text-lg font-bold text-slate-800">{title}</h3>
//       </div>
//       <div className="p-6">
//         {children}
//       </div>
//     </div>
//   );
// }

// function DetailRow({ label, value, capitalize, copyable }: { label: string; value?: string | number | null; capitalize?: boolean; copyable?: boolean }) {
//   if (value === null || value === undefined || value === "") return null;
//   return (
//     <div className="flex flex-col gap-1 w-full overflow-hidden">
//       <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
//       <div className="flex items-center gap-2">
//         <span className={`text-sm font-medium text-slate-800 truncate ${capitalize ? "capitalize" : ""}`}>
//           {value}
//         </span>
//         {copyable && (
//           <button 
//             onClick={() => navigator.clipboard.writeText(String(value))}
//             className="text-slate-400 hover:text-[#0076b6] transition-colors"
//             title="Copy to clipboard"
//           >
//             <CopyIcon className="w-3.5 h-3.5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// function DocLink({ label, url }: { label: string, url?: string | null }) {
//   if (!url) return null;
//   return (
//     <a 
//       href={url} 
//       target="_blank" 
//       rel="noopener noreferrer"
//       className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0076b6] hover:bg-blue-50/30 transition-all group"
//     >
//       <div className="flex items-center gap-3 overflow-hidden">
//         <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-[#0076b6] transition-colors shrink-0">
//           <FileIcon className="w-4 h-4" />
//         </div>
//         <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
//       </div>
//       <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0076b6] shrink-0" />
//     </a>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const isComplete = status.toLowerCase() === "submitted" || status.toLowerCase() === "approved";
//   return (
//     <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${
//       isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
//       "bg-amber-50 text-amber-600 border-amber-200"
//     }`}>
//       {status}
//     </span>
//   );
// }

// // ----------------------------------------------------------------------
// // 4. SVG ICONS
// // ----------------------------------------------------------------------
// const ArrowLeftIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
// const UserIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
// const MailIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
// const PhoneIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
// const CalendarIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
// const InfoIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
// const AcademicIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
// const BadgeIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
// const BriefcaseIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
// const MapPinIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
// const FileIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
// const ExternalLinkIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
// const CopyIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------
// 1. MOCK DATA 
// ----------------------------------------------------------------------
const MOCK_USER_DATA = {
  success: true,
  data: {
    applicationId: "47a0757c-038c-4b72-926f-4d897460a6ab",
    candidateId: "6413d1d0-acf5-437d-ab88-364d5f3bf622",
    status: "submitted",
    applicationReferenceNumber: "MANIPURMS4P039T",
    submissionDate: "2026-07-28T13:29:34.865Z",
    candidateDetails: {
      registrationNumber: "MANIPUR20266240431",
      dateOfBirth: "2000-08-16T00:00:00.000Z",
      mobileNumber: "7018416867",
      mobileVerified: true,
      emailVerified: true,
    },
    steps: {
      step0: {
        age: 24,
        isPwd: true,
        gender: "male",
        emailId: "superman@yopmail.com",
        fullName: "shivam singh",
        identityType: "aadhaar",
        maritalStatus: "unmarried",
        reservationCategory: "UR",
      },
      step1: {
        personalInfo: {
          examCity: "Imphal",
          fatherName: "father",
          motherName: "mother",
          typeOfDisability: "disability",
          identificationMarks: "cut",
          nationality: "Indian",
        },
        address: {
          permanent: { city: "city", state: "Jharkhand", pincode: "111111", village: "village", district: "Chatra", policeStation: "police" },
          correspond: { city: "town two", state: "Jammu and Kashmir", pincode: "222222", village: "village delhi", district: "Rajouri", policeStation: "delhi police" },
          sameAsPermanent: false
        },
        education: {
          "10th": { year: "2002", board: "cbse", college: "ten", percentage: "50" },
          "12th": { year: "2001", board: "cbse", college: "twelth", percentage: "59.98" },
          "graduation": { year: "2002", board: "univ", college: "graduation", percentage: "79.98" },
          "postGraduation": { year: "2003", board: "univ two", college: "post", percentage: "80" }
        },
        teachereligibilit: {
          dedQual: "D.Ed. in Special Education from RCI approved institute",
          rciNumber: "1100LK",
          dedInstitution: "DED  instittute",
        },
        experience: [
          { duration: "10", designation: "ELECTRIC", reasonLeaving: "blind" }
        ]
      },
      step2: {
        photograph: "https://via.placeholder.com/150", 
        signature: "#",
        livePhoto: "#",
        eligibilityCert: "#",
        permanentResCert: "#",
        domicileCert: "#",
        hslcMarksheet: "#",
        hslcProvCert: "#",
        nocCert: "#",
        reservationCert: "#",
        tenPlusTwoCert: "#",
        experienceCert_0: "#"
      },
      step3: {
        paymentOrderId: "free_A154DDF7-30D8-",
        amount: "0.00",
        paymentMode: "exempt",
        status: "completed",
        currency: "INR" // Added to fix the TS 'currency' error
      }
    }
  }
};

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------
export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real scenario, use `id` to fetch the data. 
  // For now, we load our mock data payload.
  const appData = MOCK_USER_DATA.data;
  const basicInfo = appData.steps.step0;
  const personalExt = appData.steps.step1.personalInfo;
  const address = appData.steps.step1.address;
  const education = appData.steps.step1.education;
  const docs = appData.steps.step2;

  if (!appData) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold text-slate-700">Candidate not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#0076b6] hover:underline font-medium">
          &larr; Go Back to Dashboard
        </button>
      </div>
    );
  }

  // Format Date Helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Go Back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Data</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Ref: {appData.applicationReferenceNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={appData.status} />
          <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">
            Reg: {appData.candidateDetails.registrationNumber}
          </div>
        </div>
      </div>

      {/* --- PROFILE BANNER --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="bg-gradient-to-r from-[#0076b6] to-[#005a8c] h-32 w-full"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
            <div className="relative">
              <img 
                src={docs.photograph} 
                alt="Candidate" 
                className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
              />
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">{basicInfo.fullName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><MailIcon className="w-4 h-4 text-[#0076b6]"/> {basicInfo.emailId}</span>
                {/* Fixed: changed basicInfo.mobileNumber to appData.candidateDetails.mobileNumber */}
                <span className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4 text-[#0076b6]"/> +91 {appData.candidateDetails.mobileNumber}</span>
                <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-[#0076b6]"/> {formatDate(appData.candidateDetails.dateOfBirth)} ({basicInfo.age} Yrs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <SectionCard title="Personal Details" icon={<UserIcon className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <DetailRow label="Father's Name" value={personalExt.fatherName} />
              <DetailRow label="Mother's Name" value={personalExt.motherName} />
              <DetailRow label="Gender" value={basicInfo.gender} capitalize />
              <DetailRow label="Marital Status" value={basicInfo.maritalStatus} capitalize />
              <DetailRow label="Category" value={basicInfo.reservationCategory} />
              <DetailRow label="Nationality" value={personalExt.nationality} />
              <DetailRow label="Identity Type" value={basicInfo.identityType} capitalize />
              <DetailRow label="Identification Mark" value={personalExt.identificationMarks} />
              <DetailRow label="Is PWD?" value={basicInfo.isPwd ? `Yes (${personalExt.typeOfDisability})` : "No"} />
              <DetailRow label="Exam City" value={personalExt.examCity} />
            </div>
          </SectionCard>

          {/* Education Details */}
          <SectionCard title="Educational Qualifications" icon={<AcademicIcon className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Level</th>
                    <th className="px-4 py-3">Board / University</th>
                    <th className="px-4 py-3">Institution</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">% / CGPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(education).map(([level, data]) => (
                    <tr key={level} className="hover:bg-slate-50/50 transition-colors text-slate-800 font-medium">
                      <td className="px-4 py-3 capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="px-4 py-3 uppercase">{data.board}</td>
                      <td className="px-4 py-3 capitalize">{data.college}</td>
                      <td className="px-4 py-3">{data.year}</td>
                      <td className="px-4 py-3 text-right text-[#0076b6] font-bold">{data.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Teacher Eligibility & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <SectionCard title="Teacher Eligibility" icon={<BadgeIcon className="w-5 h-5 text-[#0076b6]"/>}>
               <div className="space-y-4">
                 <DetailRow label="RCI Number" value={appData.steps.step1.teachereligibilit.rciNumber} />
                 <DetailRow label="D.Ed Qualification" value={appData.steps.step1.teachereligibilit.dedQual} />
                 <DetailRow label="Institution" value={appData.steps.step1.teachereligibilit.dedInstitution} />
               </div>
             </SectionCard>

             <SectionCard title="Work Experience" icon={<BriefcaseIcon className="w-5 h-5 text-[#0076b6]"/>}>
               {appData.steps.step1.experience.map((exp, idx) => (
                 <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <DetailRow label="Designation" value={exp.designation} />
                   <div className="mt-3 flex gap-4">
                     <DetailRow label="Duration" value={`${exp.duration} Months`} />
                     <DetailRow label="Reason for leaving" value={exp.reasonLeaving} />
                   </div>
                 </div>
               ))}
             </SectionCard>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* Application Status Card */}
          <SectionCard title="Application Info" icon={<InfoIcon className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="space-y-4">
              <DetailRow label="Application ID" value={appData.applicationId} copyable />
              <DetailRow label="Submitted On" value={formatDate(appData.submissionDate)} />
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h4>
                <DetailRow label="Payment Mode" value={appData.steps.step3.paymentMode} capitalize />
                <DetailRow label="Amount" value={`${appData.steps.step3.currency} ${appData.steps.step3.amount}`} />
                <DetailRow label="Transaction Status" value={appData.steps.step3.status} capitalize />
              </div>
            </div>
          </SectionCard>

          {/* Addresses */}
          <SectionCard title="Addresses" icon={<MapPinIcon className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</h4>
                <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {address.permanent.village}, {address.permanent.city},<br/>
                  Police Station: {address.permanent.policeStation}<br/>
                  {address.permanent.district}, {address.permanent.state} - {address.permanent.pincode}
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correspondence Address</h4>
                {address.sameAsPermanent ? (
                  <p className="text-sm font-medium text-slate-600 italic">Same as Permanent Address</p>
                ) : (
                  <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {address.correspond.village}, {address.correspond.city},<br/>
                    Police Station: {address.correspond.policeStation}<br/>
                    {address.correspond.district}, {address.correspond.state} - {address.correspond.pincode}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Uploaded Documents" icon={<FileIcon className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="grid grid-cols-1 gap-2">
              <DocLink label="Photograph" url={docs.photograph} />
              <DocLink label="Signature" url={docs.signature} />
              <DocLink label="Live Photo" url={docs.livePhoto} />
              <DocLink label="Domicile Certificate" url={docs.domicileCert} />
              <DocLink label="Eligibility Certificate" url={docs.eligibilityCert} />
              <DocLink label="HSLC Marksheet" url={docs.hslcMarksheet} />
              <DocLink label="10+2 Certificate" url={docs.tenPlusTwoCert} />
              <DocLink label="Reservation Certificate" url={docs.reservationCert} />
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. HELPER COMPONENTS
// ----------------------------------------------------------------------

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        {icon}
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, capitalize, copyable }: { label: string; value?: string | number | null; capitalize?: boolean; copyable?: boolean }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-1 w-full overflow-hidden">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium text-slate-800 truncate ${capitalize ? "capitalize" : ""}`}>
          {value}
        </span>
        {copyable && (
          <button 
            onClick={() => navigator.clipboard.writeText(String(value))}
            className="text-slate-400 hover:text-[#0076b6] transition-colors"
            title="Copy to clipboard"
          >
            <CopyIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function DocLink({ label, url }: { label: string, url?: string | null }) {
  if (!url) return null;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0076b6] hover:bg-blue-50/30 transition-all group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-[#0076b6] transition-colors shrink-0">
          <FileIcon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
      </div>
      <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0076b6] shrink-0" />
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isComplete = status.toLowerCase() === "submitted" || status.toLowerCase() === "approved";
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${
      isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
      "bg-amber-50 text-amber-600 border-amber-200"
    }`}>
      {status}
    </span>
  );
}

// ----------------------------------------------------------------------
// 4. SVG ICONS
// ----------------------------------------------------------------------
const ArrowLeftIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const UserIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const CalendarIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const InfoIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const AcademicIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const BadgeIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const BriefcaseIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MapPinIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const FileIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const ExternalLinkIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const CopyIcon = (p: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;