import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0076b6] text-white py-10 text-sm border-t border-white/20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {/* Organization Branding */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {/* Replaced text logo with image logo */}
            <img 
              src="/mssc.png" 
              alt="MSSC Logo" 
              className="h-12 w-auto object-contain" 
            />
            <span className="font-bold tracking-tight text-lg leading-tight">
              Manipur Staff Selection Commission
            </span>
          </div>
          <p className="text-white/90 text-xs">
            Official statutory recruitment allocation systems for the Directorate of Education (S), Government of Manipur.
          </p>
        </div>

        {/* Portal Information Links */}
        <div>
          <h4 className="font-semibold mb-3 text-base">Portal Information Links</h4>
          <ul className="space-y-2 text-xs text-white/90">
            <li>
              {/* External link uses anchor tag with secure rel attributes */}
              <a 
                href="https://manipurssc.mn.gov.in" 
                className="hover:text-white hover:underline transition duration-200" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Official Portal Home Link
              </a>
            </li>
            <li>
              <Link to="/docs/advertisement.pdf" className="hover:text-white hover:underline transition duration-200">
                Detailed Advertisement PDF
              </Link>
            </li>
            <li>
              <Link to="/guidelines/normalization" className="hover:text-white hover:underline transition duration-200">
                Normalization Criteria Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* Organization Motto */}
        <div>
          <h4 className="font-semibold mb-3 text-base">Motto</h4>
          <p className="italic text-white/90 text-xs">"Perseverance, Honesty & Dignity"</p>
        </div>
      </div>
      
      <hr className="border-white/20 my-6" />
      
      {/* Copyright Notice */}
      <div className="container mx-auto px-6 text-center text-white/80 text-[11px] tracking-wide">
        &copy; 2026 Manipur Staff Selection Commission (MSSC). All rights reserved. Maintained for State Education Selection Frameworks.
      </div>
    </footer>
  );
};