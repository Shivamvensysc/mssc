
// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { 
// //   ArrowLeft, User, Mail, Phone, Calendar, Info, 
// //   GraduationCap, Award, Briefcase, MapPin, FileText, 
// //   ExternalLink, Copy 
// // } from "lucide-react";

// // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // export default function UserDetails() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
  
// //   const [appData, setAppData] = useState<any>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchCandidateDetails = async () => {
// //       try {
// //         setIsLoading(true);
// //         const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
// //         const headers = { 
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}` 
// //         };

// //         const response = await fetch(`${BASE_URL}/admin/candidates/${id}`, { headers });
// //         const data = await response.json();

// //         if (data.success && data.data) {
// //           setAppData(data.data);
// //         } else {
// //           setError(data.message || "Failed to fetch candidate details");
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError("An error occurred while fetching candidate data.");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (id) fetchCandidateDetails();
// //   }, [id]);

// //   if (isLoading) {
// //     return <div className="flex items-center justify-center py-32 text-slate-600">Loading Candidate Data...</div>;
// //   }

// //   if (error || !appData || !appData.finalSubmission) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-32 text-center">
// //         <h2 className="text-2xl font-bold text-slate-700">Candidate data not found or incomplete</h2>
// //         <p className="text-slate-500 mt-2">{error}</p>
// //         <button onClick={() => navigate(-1)} className="mt-4 text-[#0076b6] hover:underline font-medium">
// //           &larr; Go Back to Dashboard
// //         </button>
// //       </div>
// //     );
// //   }

// //   // Extract variables based on API Response
// //   const payload = appData.finalSubmission.payload;
// //   const basicInfo = payload.step0;
// //   const personalExt = payload.step1;
// //   const address = payload.step1.address;
// //   const qualifications = payload.step1.qualifications || [];
// //   const experience = payload.step1.experience;
// //   const teacherEligibility = payload.step1.teachereligibility;
// //   const docs = payload.step2;
// //   const payment = payload.step3;

// //   // Determine application status locally since it isn't at the root of this specific JSON
// //   const applicationStatus = appData.finalSubmission ? "Submitted" : "Draft";

// //   // Format Date Helper
// //   const formatDate = (dateString: string) => {
// //     if (!dateString) return "N/A";
// //     const date = new Date(dateString);
// //     return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-IN", {
// //       day: '2-digit', month: 'short', year: 'numeric'
// //     });
// //   };

// //   return (
// //     <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 animate-in fade-in duration-300">
      
// //       {/* --- HEADER --- */}
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
// //         <div className="flex items-center gap-4">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
// //             title="Go Back"
// //           >
// //             <ArrowLeft className="w-5 h-5" />
// //           </button>
// //           <div>
// //             <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Data</h2>
// //           </div>
// //         </div>
// //         <div className="flex flex-wrap items-center gap-3">
// //           <StatusBadge status={applicationStatus} />
// //           <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">
// //             Reg: {appData.registrationNumber}
// //           </div>
// //         </div>
// //       </div>

// //       {/* --- PROFILE BANNER --- */}
// //       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
// //         <div className="bg-gradient-to-r from-[#0076b6] to-[#005a8c] h-32 w-full"></div>
// //         <div className="px-6 sm:px-10 pb-8 relative">
// //           <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
// //             <div className="relative">
// //             <img 
// //   src={docs.photo ? `${BASE_URL}/files/${docs.photo}` : "https://via.placeholder.com/150"} 
// //   alt="Candidate" 
// //   className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md"
// //   onError={(e) => {
// //     const fallbackSrc = "https://via.placeholder.com/150?text=No+Image";
// //     // Only update the src if it hasn't already been set to the fallback
// //     if (e.currentTarget.src !== fallbackSrc) {
// //       e.currentTarget.src = fallbackSrc;
// //     }
// //   }}
// // />
// //             </div>
// //             <div className="pb-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //               <div>
// //                 <h1 className="text-3xl font-bold text-slate-900 capitalize">{basicInfo.fullName}</h1>
// //                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-600">
// //                   <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#0076b6]"/> {basicInfo.emailId}</span>
// //                   <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#0076b6]"/> +91 {basicInfo.mobileNumber}</span>
// //                   <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0076b6]"/> {formatDate(appData.dateOfBirth)} ({basicInfo.age} Yrs)</span>
// //                 </div>
// //               </div>
// //               <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
// //                 <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Post Applied For</span>
// //                 <span className="text-sm font-semibold text-slate-800">{basicInfo.post || "N/A"}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* --- DATA GRID --- */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
// //         {/* Left Column (2/3 width) */}
// //         <div className="lg:col-span-2 space-y-6">
          
// //           {/* Personal Info */}
// //           <SectionCard title="Personal Details" icon={<User className="w-5 h-5 text-[#0076b6]"/>}>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
// //               <DetailRow label="Father's Name" value={personalExt.fatherName} />
// //               <DetailRow label="Mother's Name" value={personalExt.motherName} />
// //               <DetailRow label="Gender" value={basicInfo.gender} capitalize />
// //               <DetailRow label="Marital Status" value={basicInfo.maritalStatus} capitalize />
// //               <DetailRow label="Category" value={basicInfo.reservationCategory} />
// //               <DetailRow label="Nationality" value={basicInfo.nationality} />
// //               <DetailRow label="Identity Type" value={basicInfo.identityType} capitalize />
// //               <DetailRow label="Identity Number" value={basicInfo.identityNumber} />
// //               <DetailRow label="Exam City" value={personalExt.personalInfo?.examCity} />
              
// //               {/* PWD Details conditional rendering */}
// //               {basicInfo.isPwd && (
// //                 <>
// //                   <DetailRow label="Is PWD?" value="Yes" />
// //                   <DetailRow label="Disability Type" value={basicInfo.type_of_disability} />
// //                   <DetailRow label="PWD Percentage" value={personalExt.pwdPercentage ? `${personalExt.pwdPercentage}%` : null} />
// //                   <DetailRow label="Scribe Required" value={personalExt.personalInfo?.isScribe} capitalize />
// //                 </>
// //               )}
// //             </div>
// //           </SectionCard>

// //           {/* Educational Qualifications */}
// //           <SectionCard title="Educational Qualifications" icon={<GraduationCap className="w-5 h-5 text-[#0076b6]"/>}>
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-left text-sm whitespace-nowrap">
// //                 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
// //                   <tr>
// //                     <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Level</th>
// //                     <th className="px-4 py-3">Board / University</th>
// //                     <th className="px-4 py-3">Year</th>
// //                     <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">% / CGPA</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-100">
// //                   {qualifications && qualifications.length > 0 ? (
// //                     qualifications.map((qual: any, index: number) => (
// //                       <tr key={index} className="hover:bg-slate-50/50 transition-colors text-slate-800 font-medium">
// //                         <td className="px-4 py-3 capitalize">{qual.degree}</td>
// //                         <td className="px-4 py-3 capitalize">{qual.boardUniversity}</td>
// //                         <td className="px-4 py-3">{qual.passingYear}</td>
// //                         <td className="px-4 py-3 text-right text-[#0076b6] font-bold">{qual.percentage}%</td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan={4} className="px-4 py-6 text-center text-slate-500 italic">No qualifications added.</td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </SectionCard>

// //           {/* Teacher Eligibility & Experience */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //              <SectionCard title="Teacher Eligibility" icon={<Award className="w-5 h-5 text-[#0076b6]"/>}>
// //                {teacherEligibility ? (
// //                  <div className="space-y-4">
// //                    <DetailRow label="RCI Number" value={teacherEligibility.rciNumber} />
// //                    <DetailRow label="D.Ed Qualification" value={teacherEligibility.dedQual} />
// //                    <DetailRow label="Institution" value={teacherEligibility.dedInstitution} />
// //                    <DetailRow label="TET-1 Passed" value={teacherEligibility.tet1Passed ? "Yes" : "No"} />
// //                  </div>
// //                ) : (
// //                  <div className="text-slate-500 text-sm italic">Eligibility details not provided.</div>
// //                )}
// //              </SectionCard>

// //              <SectionCard title="Work Experience" icon={<Briefcase className="w-5 h-5 text-[#0076b6]"/>}>
// //                {experience?.hasExperience ? (
// //                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
// //                    <DetailRow label="Designation" value={experience.employerDesignation} />
// //                    <div className="mt-3 flex flex-col gap-2">
// //                      <DetailRow label="Duration" value={`${experience.servicePeriodMonths || 0} Months`} />
// //                      <DetailRow label="Reason for leaving" value={experience.reasonForLeaving} />
// //                    </div>
// //                  </div>
// //                ) : (
// //                  <div className="text-slate-500 text-sm italic">No work experience added.</div>
// //                )}
// //              </SectionCard>
// //           </div>

// //         </div>

// //         {/* Right Column (1/3 width) */}
// //         <div className="space-y-6">
          
// //           {/* Application Status Card */}
// //           <SectionCard title="Application Info" icon={<Info className="w-5 h-5 text-[#0076b6]"/>}>
// //             <div className="space-y-4">
// //               <DetailRow label="Submitted On" value={formatDate(appData.finalSubmission.createdAt)} />
// //               <div className="pt-4 border-t border-slate-100">
// //                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h4>
// //                 <DetailRow label="Fee Category" value={payment?.feeCategory} capitalize />
// //                 <DetailRow label="Payment Mode" value={payment?.paymentMode} capitalize />
// //                 <DetailRow label="Amount" value={`INR ${payment?.amount || 0}`} />
// //                 <DetailRow label="Transaction Status" value={payment?.paymentStatus} capitalize />
// //                 <DetailRow label="Order ID" value={payment?.paymentOrderId} copyable />
// //               </div>
// //             </div>
// //           </SectionCard>

// //           {/* Addresses */}
// //           <SectionCard title="Addresses" icon={<MapPin className="w-5 h-5 text-[#0076b6]"/>}>
// //             <div className="space-y-6">
// //               <div>
// //                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</h4>
// //                 {address?.permanent ? (
// //                   <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
// //                     {address.permanent.village}, {address.permanent.city},<br/>
// //                     Police Station: {address.permanent.policeStation}<br/>
// //                     {address.permanent.district}, {address.permanent.state} - {address.permanent.pincode}
// //                   </p>
// //                 ) : (
// //                   <p className="text-sm text-slate-500 italic">Not provided</p>
// //                 )}
// //               </div>
              
// //               <div>
// //                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correspondence Address</h4>
// //                 {address?.sameAsPermanent ? (
// //                   <p className="text-sm font-medium text-slate-600 italic">Same as Permanent Address</p>
// //                 ) : address?.correspond ? (
// //                   <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
// //                     {address.correspond.village}, {address.correspond.city},<br/>
// //                     Police Station: {address.correspond.policeStation}<br/>
// //                     {address.correspond.district}, {address.correspond.state} - {address.correspond.pincode}
// //                   </p>
// //                 ) : (
// //                   <p className="text-sm text-slate-500 italic">Not provided</p>
// //                 )}
// //               </div>
// //             </div>
// //           </SectionCard>

// //           {/* Documents */}
// //           <SectionCard title="Uploaded Documents" icon={<FileText className="w-5 h-5 text-[#0076b6]"/>}>
// //             <div className="grid grid-cols-1 gap-2">
// //               <DocLink label="Photograph" url={docs.photo} />
// //               <DocLink label="Signature" url={docs.signature} />
// //               <DocLink label="10th Marksheet" url={docs.tenthMarksheet} />
// //               <DocLink label="12th Marksheet" url={docs.twelfthMarksheet} />
// //               <DocLink label="Domicile Certificate" url={docs.domicileCertificate} />
// //               <DocLink label="Caste Certificate" url={docs.castCertificate} />
// //               <DocLink label="TET-1 Certificate" url={docs.tet1Certificate} />
// //               <DocLink label="D.Ed Certificate" url={docs.dedCertificate} />
// //               <DocLink label="PWD Certificate" url={docs.pwdCertificate} />
// //               <DocLink label="Experience Certificate" url={docs.experienceCertificate} />
// //               <DocLink label="NOC Certificate" url={docs.nocCertificate} />
// //             </div>
// //           </SectionCard>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ----------------------------------------------------------------------
// // // HELPER COMPONENTS
// // // ----------------------------------------------------------------------

// // function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
// //   return (
// //     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
// //       <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
// //         {icon}
// //         <h3 className="text-lg font-bold text-slate-800">{title}</h3>
// //       </div>
// //       <div className="p-6">
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // function DetailRow({ label, value, capitalize, copyable }: { label: string; value?: string | number | null; capitalize?: boolean; copyable?: boolean }) {
// //   if (value === null || value === undefined || value === "") return null;
// //   return (
// //     <div className="flex flex-col gap-1 w-full overflow-hidden">
// //       <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
// //       <div className="flex items-center gap-2">
// //         <span className={`text-sm font-medium text-slate-800 truncate ${capitalize ? "capitalize" : ""}`}>
// //           {value}
// //         </span>
// //         {copyable && (
// //           <button 
// //             onClick={() => navigator.clipboard.writeText(String(value))}
// //             className="text-slate-400 hover:text-[#0076b6] transition-colors"
// //             title="Copy to clipboard"
// //           >
// //             <Copy className="w-3.5 h-3.5" />
// //           </button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // function DocLink({ label, url }: { label: string, url?: string | null }) {
// //   if (!url) return null;
// //   // Assumes URLs that are raw UUIDs need to be prepended with the BASE_URL
// //   const fullUrl = url.startsWith('http') ? url : `${BASE_URL}/files/${url}`;
  
// //   return (
// //     <a 
// //       href={fullUrl}
// //       target="_blank" 
// //       rel="noopener noreferrer"
// //       className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0076b6] hover:bg-blue-50/30 transition-all group"
// //     >
// //       <div className="flex items-center gap-3 overflow-hidden">
// //         <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-[#0076b6] transition-colors shrink-0">
// //           <FileText className="w-4 h-4" />
// //         </div>
// //         <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
// //       </div>
// //       <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0076b6] shrink-0" />
// //     </a>
// //   );
// // }

// // function StatusBadge({ status }: { status: string }) {
// //   const isComplete = status.toLowerCase() === "submitted" || status.toLowerCase() === "approved" || status.toLowerCase() === "completed";
// //   return (
// //     <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${
// //       isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
// //       "bg-amber-50 text-amber-600 border-amber-200"
// //     }`}>
// //       {status}
// //     </span>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, User, Mail, Phone, Calendar, Info, 
//   GraduationCap, Award, Briefcase, MapPin, FileText, 
//   ExternalLink, Copy 
// } from "lucide-react";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function UserDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [appData, setAppData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCandidateDetails = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
//         const headers = { 
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}` 
//         };

//         const response = await fetch(`${BASE_URL}/admin/candidates/${id}`, { headers });
//         const data = await response.json();

//         if (data.success && data.data) {
//           setAppData(data.data);
//         } else {
//           setError(data.message || "Failed to fetch candidate details");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("An error occurred while fetching candidate data.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchCandidateDetails();
//   }, [id]);

//   if (isLoading) {
//     return <div className="flex items-center justify-center py-32 text-slate-600">Loading Candidate Data...</div>;
//   }

//   // Ensure appData and steps object exist
//   if (error || !appData || !appData.steps) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32 text-center">
//         <h2 className="text-2xl font-bold text-slate-700">Candidate data not found or incomplete</h2>
//         <p className="text-slate-500 mt-2">{error}</p>
//         <button onClick={() => navigate(-1)} className="mt-4 text-[#0076b6] hover:underline font-medium">
//           &larr; Go Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // Extract variables based on the new `steps` object in the API Response
//   const steps = appData.steps;
//   const basicInfo = steps.step0 || {};
//   const personalExt = steps.step1 || {};
//   const address = personalExt.address || {};
//   const docs = steps.step2 || {};
//   const payment = steps.step3 || {};

//   // Extract Teacher Eligibility and Work Experience
//   const teacherEligibility = personalExt.teachereligibilit || personalExt.teachereligibility;
//   const experience = personalExt.experience;

//   // Format Qualifications from the `education` object into an array for the table
//   const rawEducation = personalExt.education || {};
//   const qualifications = Object.keys(rawEducation)
//     .map(key => ({
//       level: key,
//       boardUniversity: rawEducation[key].board,
//       passingYear: rawEducation[key].year,
//       percentage: rawEducation[key].percentage,
//       college: rawEducation[key].college
//     }))
//     .filter(q => q.passingYear && q.passingYear.trim() !== ""); // Filter out empty levels

//   // Determine application status
//   const applicationStatus = appData.application?.status || "Submitted";

//   // Format Date Helper
//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-IN", {
//       day: '2-digit', month: 'short', year: 'numeric'
//     });
//   };

//   // Profile Image - handles raw UUID or presigned AWS S3 URLs
//   const profilePhotoUrl = docs.photograph || docs.photo;
//   const displayPhoto = profilePhotoUrl 
//     ? (profilePhotoUrl.startsWith('http') ? profilePhotoUrl : `${BASE_URL}/files/${profilePhotoUrl}`)
//     : "https://via.placeholder.com/150";

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 animate-in fade-in duration-300">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
//             title="Go Back"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Data</h2>
//           </div>
//         </div>
//         <div className="flex flex-wrap items-center gap-3">
//           <StatusBadge status={applicationStatus} />
//           {appData.registrationNumber && (
//             <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">
//               Reg: {appData.registrationNumber}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- PROFILE BANNER --- */}
//       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
//         <div className="bg-gradient-to-r from-[#0076b6] to-[#005a8c] h-32 w-full"></div>
//         <div className="px-6 sm:px-10 pb-8 relative">
//           <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
//             <div className="relative">
//               <img 
//                 src={displayPhoto} 
//                 alt="Candidate" 
//                 className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md"
//                 onError={(e) => {
//                   const fallbackSrc = "https://via.placeholder.com/150?text=No+Image";
//                   if (e.currentTarget.src !== fallbackSrc) {
//                     e.currentTarget.src = fallbackSrc;
//                   }
//                 }}
//               />
//             </div>
//             <div className="pb-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-slate-900 capitalize">{basicInfo.fullName || appData.user?.fullName}</h1>
//                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-600">
//                   {basicInfo.emailId && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#0076b6]"/> {basicInfo.emailId}</span>}
//                   {basicInfo.mobileNumber && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#0076b6]"/> +91 {basicInfo.mobileNumber}</span>}
//                   {basicInfo.dateOfBirth && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0076b6]"/> {formatDate(basicInfo.dateOfBirth)} {basicInfo.age && `(${basicInfo.age} Yrs)`}</span>}
//                 </div>
//               </div>
//               {basicInfo.post && (
//                 <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
//                   <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Post Applied For</span>
//                   <span className="text-sm font-semibold text-slate-800">{basicInfo.post}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- DATA GRID --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Column (2/3 width) */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Personal Info */}
//           <SectionCard title="Personal Details" icon={<User className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
//               <DetailRow label="Father's Name" value={personalExt.personalInfo?.fatherName || basicInfo.fatherName || personalExt.fatherName} />
//               <DetailRow label="Mother's Name" value={personalExt.personalInfo?.motherName || basicInfo.motherName || personalExt.motherName} />
//               <DetailRow label="Gender" value={basicInfo.gender} capitalize />
//               <DetailRow label="Marital Status" value={basicInfo.maritalStatus} capitalize />
//               <DetailRow label="Category" value={basicInfo.reservationCategory} />
//               <DetailRow label="Nationality" value={basicInfo.nationality} />
//               <DetailRow label="Identity Type" value={basicInfo.identityType} capitalize />
//               <DetailRow label="Identity Number" value={basicInfo.identityNumber} />
//               <DetailRow label="Exam City" value={personalExt.personalInfo?.examCity || personalExt.exam_city} />
              
//               {/* PWD Details */}
//               {(basicInfo.isPwd || personalExt.personalInfo?.pwdStatus === "yes") && (
//                 <>
//                   <DetailRow label="Is PWD?" value="Yes" />
//                   <DetailRow label="Disability Type" value={basicInfo.disabilityType || basicInfo.type_of_disability || personalExt.personalInfo?.typeOfDisability} />
//                   <DetailRow label="PWD Percentage" value={personalExt.pwdPercentage ? `${personalExt.pwdPercentage}%` : null} />
//                   <DetailRow label="Scribe Required" value={personalExt.personalInfo?.isScribe || personalExt.isScribe} capitalize />
//                 </>
//               )}
//             </div>
//           </SectionCard>

//           {/* Educational Qualifications */}
//           <SectionCard title="Educational Qualifications" icon={<GraduationCap className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm whitespace-nowrap">
//                 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
//                   <tr>
//                     <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Level</th>
//                     <th className="px-4 py-3">Board / University</th>
//                     <th className="px-4 py-3">Institution / College</th>
//                     <th className="px-4 py-3">Year</th>
//                     <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">% / CGPA</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {qualifications && qualifications.length > 0 ? (
//                     qualifications.map((qual: any, index: number) => (
//                       <tr key={index} className="hover:bg-slate-50/50 transition-colors text-slate-800 font-medium">
//                         <td className="px-4 py-3 capitalize">{qual.level}</td>
//                         <td className="px-4 py-3 capitalize">{qual.boardUniversity || "-"}</td>
//                         <td className="px-4 py-3 capitalize">{qual.college || "-"}</td>
//                         <td className="px-4 py-3">{qual.passingYear}</td>
//                         <td className="px-4 py-3 text-right text-[#0076b6] font-bold">{qual.percentage ? `${qual.percentage}%` : "-"}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-4 py-6 text-center text-slate-500 italic">No qualifications added.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </SectionCard>

//           {/* Teacher Eligibility & Experience */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//              <SectionCard title="Teacher Eligibility" icon={<Award className="w-5 h-5 text-[#0076b6]"/>}>
//                {teacherEligibility && Object.keys(teacherEligibility).length > 0 ? (
//                  <div className="space-y-4">
//                    <DetailRow label="RCI Number" value={teacherEligibility.rciNumber} />
//                    <DetailRow label="D.Ed Qualification" value={teacherEligibility.dedQual} />
//                    <DetailRow label="Institution" value={teacherEligibility.dedInstitution} />
//                    <DetailRow label="TET-1 Passed" value={teacherEligibility.tet1Passed ? "Yes" : "No"} />
//                    <DetailRow label="Cross Disability Period" value={teacherEligibility.crossDisabilityPeriod ? `${teacherEligibility.crossDisabilityPeriod} Months` : null} />
//                  </div>
//                ) : (
//                  <div className="text-slate-500 text-sm italic">Eligibility details not provided.</div>
//                )}
//              </SectionCard>

//              <SectionCard title="Work Experience" icon={<Briefcase className="w-5 h-5 text-[#0076b6]"/>}>
//                {experience?.hasExperience ? (
//                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//                    <DetailRow label="Designation" value={experience.employerDesignation} />
//                    <div className="mt-3 flex flex-col gap-2">
//                      <DetailRow label="Duration" value={`${experience.servicePeriodMonths || 0} Months`} />
//                      <DetailRow label="Reason for leaving" value={experience.reasonForLeaving} />
//                    </div>
//                  </div>
//                ) : (
//                  <div className="text-slate-500 text-sm italic">No work experience added.</div>
//                )}
//              </SectionCard>
//           </div>

//         </div>

//         {/* Right Column (1/3 width) */}
//         <div className="space-y-6">
          
//           {/* Application Status Card */}
//           <SectionCard title="Application Info" icon={<Info className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="space-y-4">
//               <DetailRow label="Submitted On" value={formatDate(appData.application?.submissionDate || appData.createdAt)} />
              
//               {(payment?.paymentOrderId || payment?.amount !== undefined) && (
//                 <div className="pt-4 border-t border-slate-100">
//                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h4>
//                   <DetailRow label="Fee Category" value={payment?.feeCategory} capitalize />
//                   <DetailRow label="Payment Mode" value={payment?.paymentMode} capitalize />
//                   <DetailRow label="Amount" value={payment?.amount !== undefined ? `INR ${payment.amount}` : undefined} />
//                   <DetailRow label="Transaction Status" value={payment?.status || payment?.paymentStatus} capitalize />
//                   <DetailRow label="Order ID" value={payment?.paymentOrderId} copyable />
//                   <DetailRow label="Transaction ID" value={payment?.transactionId} copyable />
//                 </div>
//               )}
//             </div>
//           </SectionCard>

//           {/* Addresses */}
//           <SectionCard title="Addresses" icon={<MapPin className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="space-y-6">
              
//               {/* Permanent Address block shown only if at least one field exists */}
//               {(address?.permanent?.village || address?.permanent?.city || address?.permanent?.state) && (
//                 <div>
//                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</h4>
//                   <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
//                     {[address.permanent.village, address.permanent.city].filter(Boolean).join(", ")}<br/>
//                     {address.permanent.policeStation && <>Police Station: {address.permanent.policeStation}<br/></>}
//                     {[address.permanent.district, address.permanent.state].filter(Boolean).join(", ")} 
//                     {address.permanent.pincode && ` - ${address.permanent.pincode}`}
//                   </p>
//                 </div>
//               )}
              
//               {/* Correspond block */}
//               <div>
//                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correspondence Address</h4>
//                 {address?.sameAsPermanent ? (
//                   <p className="text-sm font-medium text-slate-600 italic">Same as Permanent Address</p>
//                 ) : (address?.correspond?.village || address?.correspond?.city || address?.correspond?.state) ? (
//                   <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
//                     {[address.correspond.village, address.correspond.city].filter(Boolean).join(", ")}<br/>
//                     {address.correspond.policeStation && <>Police Station: {address.correspond.policeStation}<br/></>}
//                     {[address.correspond.district, address.correspond.state].filter(Boolean).join(", ")} 
//                     {address.correspond.pincode && ` - ${address.correspond.pincode}`}
//                   </p>
//                 ) : (
//                   <p className="text-sm text-slate-500 italic">Not provided</p>
//                 )}
//               </div>
//             </div>
//           </SectionCard>

//           {/* Documents */}
//           <SectionCard title="Uploaded Documents" icon={<FileText className="w-5 h-5 text-[#0076b6]"/>}>
//             <div className="grid grid-cols-1 gap-2">
//               <DocLink label="Photograph" url={docs.photograph || docs.photo} />
//               <DocLink label="Signature" url={docs.signature} />
//               <DocLink label="10th Marksheet" url={docs.tenthMarksheet || docs.hslcMarksheet} />
//               <DocLink label="12th Marksheet" url={docs.twelfthMarksheet || docs.tenPlusTwoCert} />
//               <DocLink label="Graduation Marksheet" url={docs.graduationMarksheet} />
//               <DocLink label="Domicile Certificate" url={docs.domicileCert || docs.domicileCertificate} />
//               <DocLink label="Caste/Reservation Certificate" url={docs.reservationCert || docs.castCertificate} />
//               <DocLink label="TET-1 Certificate" url={docs.tet1Cert || docs.tet1Certificate} />
//               <DocLink label="D.Ed Certificate" url={docs.dedCert || docs.dedCertificate} />
//               <DocLink label="PWD Certificate" url={docs.pwdCert || docs.pwdCertificate} />
//               <DocLink label="Experience Certificate" url={docs.experienceCert || docs.experienceCertificate || docs.experienceCert_0} />
//               <DocLink label="NOC Certificate" url={docs.nocCert || docs.nocCertificate} />
//             </div>
//             {Object.keys(docs).length === 0 && (
//               <p className="text-sm text-slate-500 italic text-center py-2">No documents found.</p>
//             )}
//           </SectionCard>

//         </div>
//       </div>
//     </div>
//   );
// }

// // ----------------------------------------------------------------------
// // HELPER COMPONENTS
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
//   // Gracefully handles empty values, strings, nulls, and undefined. 
//   // It won't render the label if there's no useful data attached.
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
//             <Copy className="w-3.5 h-3.5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// function DocLink({ label, url }: { label: string, url?: string | null }) {
//   if (!url) return null; // If url is missing or null, it completely hides this document row
  
//   // Assumes URLs that are raw UUIDs need to be prepended with the BASE_URL
//   const fullUrl = url.startsWith('http') ? url : `${BASE_URL}/files/${url}`;
  
//   return (
//     <a 
//       href={fullUrl}
//       target="_blank" 
//       rel="noopener noreferrer"
//       className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0076b6] hover:bg-blue-50/30 transition-all group"
//     >
//       <div className="flex items-center gap-3 overflow-hidden">
//         <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-[#0076b6] transition-colors shrink-0">
//           <FileText className="w-4 h-4" />
//         </div>
//         <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
//       </div>
//       <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0076b6] shrink-0" />
//     </a>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const isComplete = status.toLowerCase() === "submitted" || status.toLowerCase() === "approved" || status.toLowerCase() === "completed";
//   return (
//     <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${
//       isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
//       "bg-amber-50 text-amber-600 border-amber-200"
//     }`}>
//       {status}
//     </span>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, Mail, Phone, Calendar, Info, 
  GraduationCap, Award, Briefcase, MapPin, FileText, 
  ExternalLink, Copy 
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [appData, setAppData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminIdToken") || localStorage.getItem("adminAccessToken");
        const headers = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        };

        const response = await fetch(`${BASE_URL}/admin/candidates/${id}`, { headers });
        const data = await response.json();

        if (data.success && data.data) {
          setAppData(data.data);
        } else {
          setError(data.message || "Failed to fetch candidate details");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching candidate data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCandidateDetails();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-32 text-slate-600">Loading Candidate Data...</div>;
  }

  // Ensure appData and steps object exist
  if (error || !appData || !appData.steps) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-2xl font-bold text-slate-700">Candidate data not found or incomplete</h2>
        <p className="text-slate-500 mt-2">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#0076b6] hover:underline font-medium">
          &larr; Go Back to Dashboard
        </button>
      </div>
    );
  }

  // Extract variables based on the new `steps` object in the API Response
  const steps = appData.steps;
  const basicInfo = steps.step0 || {};
  const personalExt = steps.step1 || {};
  const address = personalExt.address || {};
  const docs = steps.step2 || {};
  const payment = steps.step3 || {};

  // Extract Teacher Eligibility and Work Experience
  const teacherEligibility = personalExt.teachereligibilit || personalExt.teachereligibility;
  const experience = personalExt.experience;

  // Format Qualifications from the `education` object into an array for the table
  const rawEducation = personalExt.education || {};
  const qualifications = Object.keys(rawEducation)
    .map(key => ({
      level: key,
      boardUniversity: rawEducation[key].board,
      passingYear: rawEducation[key].year,
      percentage: rawEducation[key].percentage,
      college: rawEducation[key].college
    }))
    .filter(q => q.passingYear && q.passingYear.trim() !== ""); // Filter out empty levels

  // Determine application status
  const applicationStatus = appData.application?.status || "Submitted";

  // Format Date Helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-IN", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // Profile Image - handles raw UUID or presigned AWS S3 URLs
  const profilePhotoUrl = docs.photograph || docs.photo;
  const displayPhoto = profilePhotoUrl 
    ? (profilePhotoUrl.startsWith('http') ? profilePhotoUrl : `${BASE_URL}/files/${profilePhotoUrl}`)
    : "https://via.placeholder.com/150";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Data</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={applicationStatus} />
          {appData.registrationNumber && (
            <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200">
              Reg: {appData.registrationNumber}
            </div>
          )}
        </div>
      </div>

      {/* --- PROFILE BANNER --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="bg-gradient-to-r from-[#0076b6] to-[#005a8c] h-32 w-full"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
            <div className="relative">
              <img 
                src={displayPhoto} 
                alt="Candidate" 
                className="w-32 h-32 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md"
                onError={(e) => {
                  const fallbackSrc = "https://via.placeholder.com/150?text=No+Image";
                  if (e.currentTarget.src !== fallbackSrc) {
                    e.currentTarget.src = fallbackSrc;
                  }
                }}
              />
            </div>
            <div className="pb-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 capitalize">{basicInfo.fullName || appData.user?.fullName}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm font-medium text-slate-600">
                  {basicInfo.emailId && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#0076b6]"/> {basicInfo.emailId}</span>}
                  {basicInfo.mobileNumber && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#0076b6]"/> +91 {basicInfo.mobileNumber}</span>}
                  {basicInfo.dateOfBirth && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0076b6]"/> {formatDate(basicInfo.dateOfBirth)} {basicInfo.age && `(${basicInfo.age} Yrs)`}</span>}
                </div>
              </div>
              {basicInfo.post && (
                <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
                  <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Post Applied For</span>
                  <span className="text-sm font-semibold text-slate-800">{basicInfo.post}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info */}
          <SectionCard title="Personal Details" icon={<User className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <DetailRow label="Father's Name" value={personalExt.personalInfo?.fatherName || basicInfo.fatherName || personalExt.fatherName} />
              <DetailRow label="Mother's Name" value={personalExt.personalInfo?.motherName || basicInfo.motherName || personalExt.motherName} />
              <DetailRow label="Gender" value={basicInfo.gender} capitalize />
              <DetailRow label="Marital Status" value={basicInfo.maritalStatus} capitalize />
              <DetailRow label="Category" value={basicInfo.reservationCategory} />
              <DetailRow label="Nationality" value={basicInfo.nationality} />
              <DetailRow label="Identity Type" value={basicInfo.identityType} capitalize />
              <DetailRow label="Identity Number" value={basicInfo.identityNumber} />
              <DetailRow label="Exam City" value={personalExt.personalInfo?.examCity || personalExt.exam_city} />
              
              {/* PWD Details */}
              {(basicInfo.isPwd || personalExt.personalInfo?.pwdStatus === "yes") && (
                <>
                  <DetailRow label="Is PWD?" value="Yes" />
                  <DetailRow label="Disability Type" value={basicInfo.disabilityType || basicInfo.type_of_disability || personalExt.personalInfo?.typeOfDisability} />
                  <DetailRow label="PWD Percentage" value={personalExt.pwdPercentage ? `${personalExt.pwdPercentage}%` : null} />
                  <DetailRow label="Scribe Required" value={personalExt.personalInfo?.isScribe || personalExt.isScribe} capitalize />
                </>
              )}
            </div>
          </SectionCard>

          {/* Educational Qualifications */}
          <SectionCard title="Educational Qualifications" icon={<GraduationCap className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Level</th>
                    <th className="px-4 py-3">Board / University</th>
                    <th className="px-4 py-3">Institution / College</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3 rounded-tr-lg rounded-br-lg text-right">% / CGPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {qualifications && qualifications.length > 0 ? (
                    qualifications.map((qual: any, index: number) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors text-slate-800 font-medium">
                        <td className="px-4 py-3 capitalize">{qual.level}</td>
                        <td className="px-4 py-3 capitalize">{qual.boardUniversity || "-"}</td>
                        <td className="px-4 py-3 capitalize">{qual.college || "-"}</td>
                        <td className="px-4 py-3">{qual.passingYear}</td>
                        <td className="px-4 py-3 text-right text-[#0076b6] font-bold">{qual.percentage ? `${qual.percentage}%` : "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500 italic">No qualifications added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Teacher Eligibility & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <SectionCard title="Teacher Eligibility" icon={<Award className="w-5 h-5 text-[#0076b6]"/>}>
               {teacherEligibility && Object.keys(teacherEligibility).length > 0 ? (
                 <div className="space-y-4">
                   <DetailRow label="RCI Number" value={teacherEligibility.rciNumber} />
                   <DetailRow label="D.Ed Qualification" value={teacherEligibility.dedQual} />
                   <DetailRow label="Institution" value={teacherEligibility.dedInstitution} />
                   <DetailRow label="TET-1 Passed" value={teacherEligibility.tet1Passed ? "Yes" : "No"} />
                   <DetailRow label="Cross Disability Period" value={teacherEligibility.crossDisabilityPeriod ? `${teacherEligibility.crossDisabilityPeriod} Months` : null} />
                 </div>
               ) : (
                 <div className="text-slate-500 text-sm italic">Eligibility details not provided.</div>
               )}
             </SectionCard>

             <SectionCard title="Work Experience" icon={<Briefcase className="w-5 h-5 text-[#0076b6]"/>}>
               {experience?.hasExperience ? (
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <DetailRow label="Designation" value={experience.employerDesignation} />
                   <div className="mt-3 flex flex-col gap-2">
                     <DetailRow label="Duration" value={`${experience.servicePeriodMonths || 0} Months`} />
                     <DetailRow label="Reason for leaving" value={experience.reasonForLeaving} />
                   </div>
                 </div>
               ) : (
                 <div className="text-slate-500 text-sm italic">No work experience added.</div>
               )}
             </SectionCard>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* Application Status Card */}
          <SectionCard title="Application Info" icon={<Info className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="space-y-4">
              <DetailRow label="Submitted On" value={formatDate(appData.application?.submissionDate || appData.createdAt)} />
              
              {(payment?.paymentOrderId || payment?.amount !== undefined) && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Details</h4>
                  <DetailRow label="Fee Category" value={payment?.feeCategory} capitalize />
                  <DetailRow label="Payment Mode" value={payment?.paymentMode} capitalize />
                  <DetailRow label="Amount" value={payment?.amount !== undefined ? `INR ${payment.amount}` : undefined} />
                  <DetailRow label="Transaction Status" value={payment?.status || payment?.paymentStatus} capitalize />
                  <DetailRow label="Order ID" value={payment?.paymentOrderId} copyable />
                  <DetailRow label="Transaction ID" value={payment?.transactionId} copyable />
                </div>
              )}
            </div>
          </SectionCard>

          {/* Addresses */}
          <SectionCard title="Addresses" icon={<MapPin className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="space-y-6">
              
              {/* Permanent Address block shown only if at least one field exists */}
              {(address?.permanent?.village || address?.permanent?.city || address?.permanent?.state) && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</h4>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {[address.permanent.village, address.permanent.city].filter(Boolean).join(", ")}<br/>
                    {address.permanent.policeStation && <>Police Station: {address.permanent.policeStation}<br/></>}
                    {[address.permanent.district, address.permanent.state].filter(Boolean).join(", ")} 
                    {address.permanent.pincode && ` - ${address.permanent.pincode}`}
                  </p>
                </div>
              )}
              
              {/* Correspond block */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correspondence Address</h4>
                {address?.sameAsPermanent ? (
                  <p className="text-sm font-medium text-slate-600 italic">Same as Permanent Address</p>
                ) : (address?.correspond?.village || address?.correspond?.city || address?.correspond?.state) ? (
                  <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {[address.correspond.village, address.correspond.city].filter(Boolean).join(", ")}<br/>
                    {address.correspond.policeStation && <>Police Station: {address.correspond.policeStation}<br/></>}
                    {[address.correspond.district, address.correspond.state].filter(Boolean).join(", ")} 
                    {address.correspond.pincode && ` - ${address.correspond.pincode}`}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">Not provided</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard title="Uploaded Documents" icon={<FileText className="w-5 h-5 text-[#0076b6]"/>}>
            <div className="grid grid-cols-1 gap-2">
              <DocLink label="Photograph" url={docs.photograph || docs.photo} />
              <DocLink label="Signature" url={docs.signature} />
              <DocLink label="10th Marksheet" url={docs.tenthMarksheet || docs.hslcMarksheet} />
              <DocLink label="12th Marksheet" url={docs.twelfthMarksheet || docs.tenPlusTwoCert} />
              <DocLink label="Graduation Marksheet" url={docs.graduationMarksheet} />
              <DocLink label="Domicile Certificate" url={docs.domicileCert || docs.domicileCertificate} />
              <DocLink label="Caste/Reservation Certificate" url={docs.reservationCert || docs.castCertificate} />
              <DocLink label="TET-1 Certificate" url={docs.tet1Cert || docs.tet1Certificate} />
              <DocLink label="D.Ed Certificate" url={docs.dedCert || docs.dedCertificate} />
              <DocLink label="PWD Certificate" url={docs.pwdCert || docs.pwdCertificate} />
              <DocLink label="Experience Certificate" url={docs.experienceCert || docs.experienceCertificate || docs.experienceCert_0} />
              <DocLink label="NOC Certificate" url={docs.nocCert || docs.nocCertificate} />
            </div>
            {Object.keys(docs).length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-2">No documents found.</p>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
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
  // Gracefully handles empty values, strings, nulls, and undefined. 
  // It won't render the label if there's no useful data attached.
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
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function DocLink({ label, url }: { label: string, url?: string | null }) {
  if (!url) return null; // If url is missing or null, it completely hides this document row
  
  // Assumes URLs that are raw UUIDs need to be prepended with the BASE_URL
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}/files/${url}`;
  
  return (
    <a 
      href={fullUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0076b6] hover:bg-blue-50/30 transition-all group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-[#0076b6] transition-colors shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0076b6] shrink-0" />
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isComplete = status.toLowerCase() === "submitted" || status.toLowerCase() === "approved" || status.toLowerCase() === "completed";
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider border ${
      isComplete ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
      "bg-amber-50 text-amber-600 border-amber-200"
    }`}>
      {status}
    </span>
  );
}