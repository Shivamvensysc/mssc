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
        <section id="home" className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 lg:py-24">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex flex-col sm:flex-row gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Advt. No. 02/2026</span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase">Dated: 20/07/2026</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Recruitment of 80 Special Primary Teachers
              </h1>
              <p className="text-sm lg:text-base text-slate-300 max-w-xl">
                Applications are invited in the prescribed format for recruitment to the post of Special Primary Teacher in the Education (S) department on a regular basis. Online applications are accepted only for candidates sponsored by the concerned employment exchanges of Manipur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm">
                <Link to="/register" className="bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-lg shadow-lg hover:bg-emerald-500 transition text-center">
                  Start Online Application <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                <Link to="#eligibility" className="border border-slate-700 bg-slate-800/40 text-slate-200 font-semibold px-6 py-3.5 rounded-lg hover:bg-slate-800 transition text-center">
                  Check Qualifications
                </Link>
              </div>
            </div>

            {/* Important Dates Panel */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-md font-bold text-emerald-400 flex items-center gap-2 border-b border-white/10 pb-3">
                <i className="fas fa-calendar-alt"></i> Important Timelines
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="block text-slate-400">Online Link Active From:</span>
                  <span className="text-sm font-semibold text-white">27-07-2026 (05:00 PM)</span>
                </div>
                <div>
                  <span className="block text-slate-400">Closing Date for Submission:</span>
                  <span className="text-sm font-semibold text-red-400">17-08-2026 (05:00 PM)</span>
                </div>
                <div>
                  <span className="block text-slate-400">Exams Mode & Centres:</span>
                  <span className="text-sm font-semibold text-white">Computer Based Test (CBT)<br />Imphal, Churachandpur, Senapati</span>
                </div>
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
                    <th className="p-4 bg-emerald-50 text-emerald-900">Total Posts</th>
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
                    <td className="p-4 font-bold bg-emerald-50/50 text-emerald-800">80</td>
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
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-emerald-700"><i className="fas fa-user-check"></i> General Demographics</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>Candidate must be a citizen of India.</li>
                  <li>Must be able to speak Manipuri or any of the Tribal dialects of Manipur.</li>
                  <li>Must be a permanent resident of Manipur (or have direct ancestors with verified lineage).</li>
                  <li><strong>Age Limit:</strong> 18 to 38 years as on the date of notification. Upper limit relaxable by 5 years for SC/ST and 3 years for OBC.</li>
                </ul>
              </div>
              
              {/* Qualifications */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-emerald-700"><i className="fas fa-certificate"></i> Educational Qualifications</h3>
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
                <div className="absolute -left-3 top-0 bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <h4 className="font-bold text-slate-900">Registration & Login</h4>
                <p className="text-slate-600">Register on the portal using parameters matching your Employment Exchange sponsorship credentials, then log in using your User ID and password.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <h4 className="font-bold text-slate-900">Fill Application Details</h4>
                <p className="text-slate-600">Enter your Profile parameters accurately (Name, DOB, Category, Language, RCI CRR status, and Government Service NOC if applicable).</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <h4 className="font-bold text-slate-900">Upload Media & Sign Declaration</h4>
                <p className="text-slate-600">Upload a live photo, scanned documents, and signature. Accept the mandatory qualification validation declaration checkbox.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3 top-0 bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</div>
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
                <div className="grid grid-cols-3 p-4 bg-emerald-50/50 font-bold text-emerald-900">
                  <span>Total Evaluation Metrics</span>
                  <span className="text-center">100</span>
                  <span className="text-center">100</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section id="support" className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-slate-900 rounded-2xl text-white p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-xl font-bold mb-3">Portal Grievance & Technical Helpdesk</h2>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  If you encounter payment status failures, registration bugs, or document submission errors, reach out to the Commission's technical partner or desk team immediately.
                </p>
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-envelope text-emerald-400 text-sm"></i>
                    <span>Official Communications: <strong>mssc-mn@manipur.gov.in</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-building text-emerald-400 text-sm"></i>
                    <span>DC Office Complex Imphal West, Lamphelpat, 795004</span>
                  </div>
                </div>
              </div>

              {/* Query Form */}
              <div className="bg-white p-5 rounded-xl text-slate-800 text-xs">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Log an Application Discrepancy</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Candidate Reg No / Email</label>
                    <input 
                      type="text" 
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none" 
                      placeholder="Provide tracking values"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Issue Description</label>
                    <textarea 
                      rows={2} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none" 
                      placeholder="Elaborate details..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded transition shadow-sm">
                    Submit Support Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
