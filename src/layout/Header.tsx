import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Portal Logo / Identity */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-emerald-700 text-white p-2.5 rounded-lg font-bold text-xl tracking-wider">MSSC</div>
          <div>
            <span className="text-md font-bold text-slate-900 block leading-tight">MANIPUR STAFF SELECTION COMMISSION</span>
          </div>
        </Link>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex space-x-6 font-medium text-slate-600 text-sm">
          <Link to="#home" className="hover:text-emerald-700 transition">Home</Link>
        
          <Link to="#support" className="hover:text-emerald-700 transition">Support</Link>
        </nav>

        {/* Desktop Authentication Controls */}
        <div className="hidden lg:flex items-center space-x-3 text-sm">
          <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-semibold transition"> Login</Link>
          <Link to="/register" className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Registration</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-slate-600 hover:text-emerald-700 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-4 shadow-inner">
          <nav className="flex flex-col space-y-3 font-medium text-slate-600 text-sm">
            <Link to="#home" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Home</Link>
            <Link to="#vacancies" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Vacancies</Link>
            <Link to="#eligibility" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Eligibility</Link>
            <Link to="#process" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Steps to Apply</Link>
            <Link to="#syllabus" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Exam Scheme</Link>
            <Link to="#support" onClick={() => setIsOpen(false)} className="hover:text-emerald-700 transition">Support</Link>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 text-sm">
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-emerald-700 font-semibold transition text-center py-2 border border-slate-200 rounded-lg">Candidate Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm text-center">New Registration</Link>
          </div>
        </div>
      )}
    </header>
  );
};