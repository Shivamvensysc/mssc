import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileQuestion, 
  Home, 
  ArrowLeft, 
  HelpCircle, 
  Compass 
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-slate-900 text-slate-100 font-sans min-h-screen flex items-center justify-center p-4 sm:p-8">
      
      {/* MAIN CONTAINER CARD */}
      <div className="max-w-2xl w-full bg-[#001f33]/80 backdrop-blur-md border border-[#00476D] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#0076b6]/20 rounded-full blur-3xl pointer-events-none" />

        {/* TOP ALERT / 404 ICON */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#0076b6]/10 border border-[#0076b6]/30 flex items-center justify-center text-[#0076b6] shadow-inner relative">
            <FileQuestion className="w-10 h-10" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 font-black text-[10px] px-1.5 py-0.5 rounded-full border border-slate-900">
              404
            </span>
          </div>
        </div>

        {/* ERROR BADGE */}
        <div className="inline-block">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            PAGE NOT FOUND
          </span>
        </div>

        {/* MAIN TEXT */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
            Looks like you've taken a wrong turn
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The page or resource you are searching for does not exist, has been removed, or moved to a different web address on the MSSC Portal.
          </p>
        </div>

        {/* HELPFUL QUICK LINKS */}
        <div className="bg-[#002b47]/40 border border-[#00476D]/60 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center gap-2 text-[#0076b6] font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>Where would you like to go next?</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <Link 
              to="/" 
              className="p-2.5 rounded-xl bg-[#002b47]/60 hover:bg-[#00476D]/50 border border-[#00476D] flex items-center gap-2 transition"
            >
              <Home className="w-4 h-4 text-[#0076b6]" />
              <span>MSSC Official Homepage</span>
            </Link>
            <Link 
              to="/login" 
              className="p-2.5 rounded-xl bg-[#002b47]/60 hover:bg-[#00476D]/50 border border-[#00476D] flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#0076b6]" />
              <span>Candidate Login Portal</span>
            </Link>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back Previous Page
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0076b6] hover:bg-[#005c8f] text-white text-sm font-bold shadow-lg shadow-[#0076b6]/20 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to MSSC Home
          </Link>
        </div>

        {/* SUPPORT CONTACT FOOTER */}
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Need technical assistance? Contact support at <a href="mailto:ssc.manipur@gmail.com" className="text-[#0076b6] underline hover:text-blue-400">ssc.manipur@gmail.com</a></span>
        </div>

      </div>
    </div>
  );
}