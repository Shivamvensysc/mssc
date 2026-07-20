import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-10 text-xs border-t border-slate-900">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {/* Organization Branding */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white">
            <div className="bg-emerald-700 text-white p-1 rounded font-bold">MSSC</div>
            <span className="font-bold tracking-tight">Manipur Staff Selection Commission</span>
          </div>
          <p className="text-slate-600">
            Official statutory recruitment allocation systems for the Directorate of Education (S), Government of Manipur.
          </p>
        </div>

        {/* Portal Information Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Portal Information Links</h4>
          <ul className="space-y-1.5">
            <li>
              {/* External link uses anchor tag with secure rel attributes */}
              <a 
                href="https://manipurssc.mn.gov.in" 
                className="hover:text-white transition" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Official Portal Home Link
              </a>
            </li>
            <li>
              <Link to="/docs/advertisement.pdf" className="hover:text-white transition">
                Detailed Advertisement PDF
              </Link>
            </li>
            <li>
              <Link to="/guidelines/normalization" className="hover:text-white transition">
                Normalization Criteria Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* Organization Motto */}
        <div className="text-slate-600">
          <h4 className="text-white font-semibold mb-3">Motto</h4>
          <p className="italic text-slate-400">"Perseverance, Honesty & Dignity"</p>
        </div>
      </div>
      
      <hr className="border-slate-900 my-4" />
      
      {/* Copyright Notice */}
      <div className="container mx-auto px-6 text-center text-slate-600 text-[11px] tracking-wide">
        &copy; 2026 Manipur Staff Selection Commission (MSSC). All rights reserved. Maintained for State Education Selection Frameworks.
      </div>
    </footer>
  );
};