// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// export const HomePage: React.FC = () => {
//   const [regNo, setRegNo] = useState<string>('');
//   const [description, setDescription] = useState<string>('');

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log({ regNo, description });
//   };

//   return (
//     <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col justify-between">

//       <main className="flex-grow">
//         {/* HERO SECTION */}
//         {/* Updated gradient to use the official MSSC blue (#0076b6) and a deeper variant (#00476D) */}
//         <section id="home" className="relative bg-gradient-to-br from-[#00476D] via-[#0076b6] to-[#00476D] text-white py-16 lg:py-24">
//           <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="inline-flex flex-col sm:flex-row gap-2">
//                 <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Advt. No. 02/2026</span>
//                 <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Dated: 20/07/2026</span>
//               </div>
//               <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight">
//                 Recruitment of 80 Special Primary Teachers
//               </h1>
//               <p className="text-sm lg:text-base text-blue-100 max-w-xl">
//                 Applications are invited in the prescribed format for recruitment to the post of Special Primary Teacher in the Education (S) department on a regular basis. Online applications are accepted only for candidates sponsored by the concerned employment exchanges of Manipur.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm">
//                 {/* Updated primary button to white for contrast against the blue hero */}
//                 <Link to="/register" className="bg-white text-[#0076b6] font-bold px-6 py-3.5 rounded-lg shadow-lg hover:bg-slate-100 transition text-center">
//                   Start Online Application <i className="fas fa-arrow-right ml-2"></i>
//                 </Link>
                
                
//               </div>
//             </div>

//             {/* Important Dates Panel */}
//             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4">
//               <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/20 pb-3">
//                 <i className="fas fa-calendar-alt"></i> Important Timelines
//               </h3>
//               <div className="space-y-3 text-xs text-blue-100">
//                 <div>
//                   <span className="block text-blue-200">Online Link Active From:</span>
//                   <span className="text-sm font-semibold text-white">31/07/2026 (05:00 PM)</span>
//                 </div>
//                 <div>
//                   <span className="block text-blue-200">Closing Date for Submission:</span>
//                   {/* Kept red for urgency/closing date */}
//                   <span className="text-sm font-semibold text-red-300">20/08/2026(05:00 PM)</span>
//                 </div>
//                 <div>
//                   <span className="block text-blue-200">Exams Mode & Centres:</span>
//                   <span className="text-sm font-semibold text-white">Computer Based Test (CBT)<br />Imphal, Churachandpur, Senapati</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* HELPDESK SECTION (Updated to match screenshot) */}
//         <section id="helpdesk" className="py-12 bg-slate-50 border-b border-slate-200">
//           <div className="container mx-auto px-6 max-w-5xl">
//             <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
//               {/* Header */}
//               <div className="bg-[#0076b6] px-6 py-4 flex items-center gap-3">
//                 <div className="border border-white/60 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
//                   <i className="fas fa-question"></i>
//                 </div>
//                 <h2 className="text-white font-semibold text-lg">Help Desk</h2>
//               </div>

//               {/* Content */}
//               <div className="p-4 sm:p-6 space-y-5">
//                 {/* Email Section */}
//                 <div className="bg-[#f8fafc] rounded-lg p-5">
//                   <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technical Support Email</h4>
//                   <div className="flex items-center gap-2 text-[#014d40] font-medium text-base">
//                     <i className="far fa-envelope"></i>
//                     <a href="mailto:ssc.manipur@gmail.com" className="hover:underline">ssc.manipur@gmail.com</a>
//                   </div>
//                 </div>

//                 {/* Phone Section */}
//                 <div className="bg-[#f8fafc] rounded-lg p-5">
//                   <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Helpline Number</h4>
//                   <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
//                     <i className="far fa-clock"></i>
//                     <span>10:00 AM - 6:00 PM (Mon-Fri)</span>
//                   </div>
//                   <div className="text-[#014d40] font-bold text-xl sm:text-2xl">
//                     +91 9810732530
//                   </div>
//                 </div>

//                 {/* Note Section */}
                
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* VACANCY BREAKDOWN SECTION */}
//         <section id="vacancies" className="py-16 bg-white">
//           <div className="container mx-auto px-6">
//             <div className="text-center max-w-2xl mx-auto mb-10">
//               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vacancy Distribution & Pay Scale</h2>
//               <p className="text-slate-600 text-sm mt-1">Classification: Group-C Non-Gazetted | Level 6 Pay Matrix</p>
//             </div>
            
//             <div className="overflow-x-auto max-w-4xl mx-auto border border-slate-200 rounded-xl shadow-sm">
//               <table className="w-full text-left border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
//                     <th className="p-4">Post Name</th>
//                     <th className="p-4">UR</th>
//                     <th className="p-4">ST</th>
//                     <th className="p-4">SC</th>
//                     <th className="p-4">OBC(M)</th>
//                     <th className="p-4">OBC(MP)</th>
//                     {/* Updated to theme color */}
//                     <th className="p-4 bg-[#0076b6]/10 text-[#00476D]">Total Posts</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200 text-slate-600">
//                   <tr>
//                     <td className="p-4 font-medium text-slate-900">Special Primary Teacher</td>
//                     <td className="p-4">42</td>
//                     <td className="p-4">24</td>
//                     <td className="p-4">1</td>
//                     <td className="p-4">10</td>
//                     <td className="p-4">3</td>
//                     {/* Updated to theme color */}
//                     <td className="p-4 font-bold bg-[#0076b6]/5 text-[#0076b6]">80</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
            
//             <p className="text-xs text-slate-500 text-center mt-4 max-w-2xl mx-auto">
//               * Note: PwD reservation covered under respective categories: (a) Blindness and low vision - 1 post, (b) Deaf and hard of hearing - 1 post, (c) Locomotor disability - 1 post. Candidate must possess minimum 40% benchmark disability.
//             </p>
//           </div>
//         </section>

//         {/* ELIGIBILITY CONDITIONS SECTION */}
//         <section id="eligibility" className="py-16 bg-slate-50 border-t border-b border-slate-200/60">
//           <div className="container mx-auto px-6 max-w-5xl">
//             <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-10">Eligibility & Academic Benchmarks</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
//               {/* General Criteria */}
//               <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
//                 <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-[#0076b6]"><i className="fas fa-user-check"></i> General Demographics</h3>
//                 <ul className="list-disc list-inside space-y-2 text-slate-600">
//                   <li>Candidate must be a citizen of India.</li>
//                   <li>Must be able to speak Manipuri or any of the Tribal dialects of Manipur.</li>
//                   <li>Must be a permanent resident of Manipur (or have direct ancestors with verified lineage).</li>
//                   <li><strong>Age Limit:</strong> 18 to 38 years as on the date of notification. Upper limit relaxable by 5 years for SC/ST and 3 years for OBC.</li>
//                 </ul>
//               </div>
              
//               {/* Qualifications */}
//               <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
//                 <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-[#0076b6]"><i className="fas fa-certificate"></i> Educational Qualifications</h3>
//                 <ul className="list-disc list-inside space-y-2 text-slate-600 text-xs leading-relaxed">
//                   <li>10+2 (or equivalent) with at least 50% marks (or 45% in accordance with NCTE Regulations, 2002).</li>
//                   <li>D.Ed. or D.El.Ed in Special Education from an RCI approved institute with a **valid RCI CRR number**.</li>
//                   <li>Compulsory 6 months training in cross-disability areas in inclusive education (if not yet completed, to be undergone post-recruitment when arranged).</li>
//                   <li>Passed Teacher Eligibility Test-1 (TET-1) conducted by the State Govt. or NCTE-approved agency.</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* HOW TO SUBMIT APPLICATION SECTION */}
//         <section id="process" className="py-16 bg-white">
//           <div className="container mx-auto px-6 max-w-4xl">
//             <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-10">Steps for Submission of Online Application</h2>
            
//             <div className="relative border-l border-slate-200 ml-4 space-y-8 text-sm">
//               <div className="relative pl-8">
//                 {/* Updated bullet color */}
//                 <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
//                 <h4 className="font-bold text-slate-900">Registration & Login</h4>
//                 <p className="text-slate-600">Register on the portal using parameters matching your Employment Exchange sponsorship credentials, then log in using your User ID and password.</p>
//               </div>
//               <div className="relative pl-8">
//                 <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
//                 <h4 className="font-bold text-slate-900">Fill Application Details</h4>
//                 <p className="text-slate-600">Enter your Profile parameters accurately (Name, DOB, Category, Language, RCI CRR status, and Government Service NOC if applicable).</p>
//               </div>
//               <div className="relative pl-8">
//                 <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
//                 <h4 className="font-bold text-slate-900">Upload Media & Sign Declaration</h4>
//                 <p className="text-slate-600">Upload a live photo, scanned documents, and signature. Accept the mandatory qualification validation declaration checkbox.</p>
//               </div>
//               <div className="relative pl-8">
//                 <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</div>
//                 <h4 className="font-bold text-slate-900">Application Fee Payment</h4>
//                 <p className="text-slate-600">Confirm details and pay via net banking/cards. <strong>General & OBC: Rs. 400/- | SC & ST: Rs. 200/-</strong>. PwD applicants are exempted from paying fees.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* EXAMINATION SCHEME SECTION */}
//         <section id="syllabus" className="py-16 bg-slate-50 border-t border-slate-200">
//           <div className="container mx-auto px-6 max-w-3xl">
//             <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-4">CBT Examination Scheme & Content Structure</h2>
//             <p className="text-center text-slate-600 text-sm mb-8">Duration: 75 minutes (100 minutes for DAP using a scribe). Standard: Class XII Level. No negative marks.</p>
            
//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
//               <div className="grid grid-cols-3 bg-slate-100 font-bold p-4 border-b border-slate-200">
//                 <span>Section Topic</span>
//                 <span className="text-center">No. of Questions</span>
//                 <span className="text-center">Total Marks</span>
//               </div>
//               <div className="divide-y divide-slate-200">
//                 <div className="grid grid-cols-3 p-4">
//                   <span>General Knowledge <span className="block text-xs text-slate-400">(Politics, History, Geography, Special Ed, etc.)</span></span>
//                   <span className="text-center font-medium">50</span>
//                   <span className="text-center font-medium">50</span>
//                 </div>
//                 <div className="grid grid-cols-3 p-4">
//                   <span>Basic Mathematics</span>
//                   <span className="text-center font-medium">25</span>
//                   <span className="text-center font-medium">25</span>
//                 </div>
//                 <div className="grid grid-cols-3 p-4">
//                   <span>English Language</span>
//                   <span className="text-center font-medium">25</span>
//                   <span className="text-center font-medium">25</span>
//                 </div>
//                 {/* Updated highlight color */}
//                 <div className="grid grid-cols-3 p-4 bg-[#0076b6]/10 font-bold text-[#00476D]">
//                   <span>Total Evaluation Metrics</span>
//                   <span className="text-center">100</span>
//                   <span className="text-center">100</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* SUPPORT SECTION */}
        
//       </main>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [regNo, setRegNo] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ regNo, description });
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col justify-between">

      <main className="flex-grow">
        {/* HERO SECTION */}
        {/* Updated gradient to use the official MSSC blue (#0076b6) and a deeper variant (#00476D) */}
        <section id="home" className="relative bg-gradient-to-br from-[#00476D] via-[#0076b6] to-[#00476D] text-white py-16 lg:py-24">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex flex-col sm:flex-row gap-2">
                <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Advt. No. 02/2026</span>
                <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Dated: 20/07/2026</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Recruitment of 80 Special Primary Teachers
              </h1>
              <p className="text-sm lg:text-base text-blue-100 max-w-xl">
                Applications are invited in the prescribed format for recruitment to the post of Special Primary Teacher in the Education (S) department on a regular basis. Online applications are accepted only for candidates sponsored by the concerned employment exchanges of Manipur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm">
                {/* Updated primary button to white for contrast against the blue hero */}
                <Link to="/register" className="bg-white text-[#0076b6] font-bold px-6 py-3.5 rounded-lg shadow-lg hover:bg-slate-100 transition text-center">
                  Start Online Application <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                
                
              </div>
            </div>

            {/* Important Dates Panel */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4">
              <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/20 pb-3">
                <i className="fas fa-calendar-alt"></i> Important Timelines
              </h3>
              <div className="space-y-3 text-xs text-blue-100">
                <div>
                  <span className="block text-blue-200">Online Link Active From:</span>
                  <span className="text-sm font-semibold text-white">31/07/2026 (05:00 PM)</span>
                </div>
                <div>
                  <span className="block text-blue-200">Closing Date for Submission:</span>
                  {/* Kept red for urgency/closing date */}
                  <span className="text-sm font-semibold text-red-300">20/08/2026(05:00 PM)</span>
                </div>
                <div>
                  <span className="block text-blue-200">Exams Mode & Centres:</span>
                  <span className="text-sm font-semibold text-white">Computer Based Test (CBT)<br />Imphal, Churachandpur, Senapati</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HELPDESK SECTION (Updated to match screenshot) */}
        <section id="helpdesk" className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
              {/* Header */}
              <div className="bg-[#0076b6] px-6 py-4 flex items-center gap-3">
                
                <h2 className="text-white font-semibold text-lg">Help Desk</h2>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Phone Section (Left Side) */}
                  <div className="bg-[#f8fafc] rounded-lg p-5">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Helpline Number</h4>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                      <i className="far fa-clock"></i>
                      <span>10:00 AM - 6:00 PM (Mon-Fri)</span>
                    </div>
                    <div className="text-[#0076b6] font-semibold text-xl sm:text-1xl">
                      +91 9810732530
                    </div>
                  </div>

                  {/* Email Section (Right Side) */}
                  <div className="bg-[#f8fafc] rounded-lg p-5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technical Support Email</h4>
                    <div className="flex items-center gap-2 text-[#0076b6] font-medium text-base">
                      <i className="far fa-envelope"></i>
                      <a href="mailto:ssc.manipur@gmail.com" className="hover:underline">ssc.manipur@gmail.com</a>
                    </div>
                  </div>
                </div>

                {/* Note Section */}
                
              </div>
            </div>
          </div>
        </section>

        {/* VACANCY BREAKDOWN SECTION */}
        <section id="vacancies" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vacancy Distribution & Pay Scale</h2>
              <p className="text-slate-600 text-sm mt-1">Classification: Group-C Non-Gazetted | Level 6 Pay Matrix</p>
            </div>
            
            <div className="overflow-x-auto max-w-4xl mx-auto border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-4">Post Name</th>
                    <th className="p-4">UR</th>
                    <th className="p-4">ST</th>
                    <th className="p-4">SC</th>
                    <th className="p-4">OBC(M)</th>
                    <th className="p-4">OBC(MP)</th>
                    {/* Updated to theme color */}
                    <th className="p-4 bg-[#0076b6]/10 text-[#00476D]">Total Posts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-4 font-medium text-slate-900">Special Primary Teacher</td>
                    <td className="p-4">42</td>
                    <td className="p-4">24</td>
                    <td className="p-4">1</td>
                    <td className="p-4">10</td>
                    <td className="p-4">3</td>
                    {/* Updated to theme color */}
                    <td className="p-4 font-bold bg-[#0076b6]/5 text-[#0076b6]">80</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4 max-w-2xl mx-auto">
              * Note: PwD reservation covered under respective categories: (a) Blindness and low vision - 1 post, (b) Deaf and hard of hearing - 1 post, (c) Locomotor disability - 1 post. Candidate must possess minimum 40% benchmark disability.
            </p>
          </div>
        </section>

        {/* ELIGIBILITY CONDITIONS SECTION */}
        <section id="eligibility" className="py-16 bg-slate-50 border-t border-b border-slate-200/60">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-10">Eligibility & Academic Benchmarks</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              {/* General Criteria */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-[#0076b6]"><i className="fas fa-user-check"></i> General Demographics</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>Candidate must be a citizen of India.</li>
                  <li>Must be able to speak Manipuri or any of the Tribal dialects of Manipur.</li>
                  <li>Must be a permanent resident of Manipur (or have direct ancestors with verified lineage).</li>
                  <li><strong>Age Limit:</strong> 18 to 38 years as on the date of notification. Upper limit relaxable by 5 years for SC/ST and 3 years for OBC.</li>
                </ul>
              </div>
              
              {/* Qualifications */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-[#0076b6]"><i className="fas fa-certificate"></i> Educational Qualifications</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-xs leading-relaxed">
                  <li>10+2 (or equivalent) with at least 50% marks (or 45% in accordance with NCTE Regulations, 2002).</li>
                  <li>D.Ed. or D.El.Ed in Special Education from an RCI approved institute with a **valid RCI CRR number**.</li>
                  <li>Compulsory 6 months training in cross-disability areas in inclusive education (if not yet completed, to be undergone post-recruitment when arranged).</li>
                  <li>Passed Teacher Eligibility Test-1 (TET-1) conducted by the State Govt. or NCTE-approved agency.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO SUBMIT APPLICATION SECTION */}
        <section id="process" className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-10">Steps for Submission of Online Application</h2>
            
            <div className="relative border-l border-slate-200 ml-4 space-y-8 text-sm">
              <div className="relative pl-8">
                {/* Updated bullet color */}
                <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <h4 className="font-bold text-slate-900">Registration & Login</h4>
                <p className="text-slate-600">Register on the portal using parameters matching your Employment Exchange sponsorship credentials, then log in using your User ID and password.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <h4 className="font-bold text-slate-900">Fill Application Details</h4>
                <p className="text-slate-600">Enter your Profile parameters accurately (Name, DOB, Category, Language, RCI CRR status, and Government Service NOC if applicable).</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <h4 className="font-bold text-slate-900">Upload Media & Sign Declaration</h4>
                <p className="text-slate-600">Upload a live photo, scanned documents, and signature. Accept the mandatory qualification validation declaration checkbox.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-[#0076b6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <h4 className="font-bold text-slate-900">Application Fee Payment</h4>
                <p className="text-slate-600">Confirm details and pay via net banking/cards. <strong>General & OBC: Rs. 400/- | SC & ST: Rs. 200/-</strong>. PwD applicants are exempted from paying fees.</p>
              </div>
            </div>
          </div>
        </section>

        {/* EXAMINATION SCHEME SECTION */}
        <section id="syllabus" className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mb-4">CBT Examination Scheme & Content Structure</h2>
            <p className="text-center text-slate-600 text-sm mb-8">Duration: 75 minutes (100 minutes for DAP using a scribe). Standard: Class XII Level. No negative marks.</p>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">
              <div className="grid grid-cols-3 bg-slate-100 font-bold p-4 border-b border-slate-200">
                <span>Section Topic</span>
                <span className="text-center">No. of Questions</span>
                <span className="text-center">Total Marks</span>
              </div>
              <div className="divide-y divide-slate-200">
                <div className="grid grid-cols-3 p-4">
                  <span>General Knowledge <span className="block text-xs text-slate-400">(Politics, History, Geography, Special Ed, etc.)</span></span>
                  <span className="text-center font-medium">50</span>
                  <span className="text-center font-medium">50</span>
                </div>
                <div className="grid grid-cols-3 p-4">
                  <span>Basic Mathematics</span>
                  <span className="text-center font-medium">25</span>
                  <span className="text-center font-medium">25</span>
                </div>
                <div className="grid grid-cols-3 p-4">
                  <span>English Language</span>
                  <span className="text-center font-medium">25</span>
                  <span className="text-center font-medium">25</span>
                </div>
                {/* Updated highlight color */}
                <div className="grid grid-cols-3 p-4 bg-[#0076b6]/10 font-bold text-[#00476D]">
                  <span>Total Evaluation Metrics</span>
                  <span className="text-center">100</span>
                  <span className="text-center">100</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        
      </main>
    </div>
  );
};