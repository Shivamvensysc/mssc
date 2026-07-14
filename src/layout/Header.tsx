import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm h-16 border-b border-outline-variant/10">
      <div className="flex items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max mx-auto justify-between">
        <span className="font-headline-md text-[24px] font-bold text-primary">MSSC 2026</span>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-label-md text-[14px] font-bold text-primary border-b-2 border-primary pb-1">
            New Registration
          </Link>
          <a href="#" className="font-label-md text-[14px] font-medium text-on-surface hover:text-primary transition-all">
            Accessibility
          </a>
          <Link to="/login" className="font-label-md text-[14px] font-medium text-on-surface hover:text-primary transition-all border border-on-surface px-4 py-1.5 rounded-md">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}