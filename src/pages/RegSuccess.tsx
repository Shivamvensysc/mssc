import React from 'react';
import { Link } from 'react-router-dom';

interface RegistrationSuccessProps {
  email?: string;
}

export default function RegistrationSuccess({ email = "Email & Mobile Number" }: RegistrationSuccessProps) {
  // Utility to generate a simulated application number 
  const generateMockApplicationId = () => `NON${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Mock OTS number as seen in the screenshot
  const otsNumber = "27729654"; 

  return (
    <div className="min-h-screen bg-[#f1f3f5] flex flex-col justify-between">
      
      {/* Main Content Wrapper (Centers the card perfectly) */}
      <div className="flex-1 flex items-center justify-center p-4">
        
        {/* The main block/card - REDUCED PADDING & MARGINS */}
        <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-8 shadow-xl animate-[fadeIn_0.5s_ease-out] text-center">
          
          {/* Success Checkmark Icon (Reduced Size) */}
          <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mb-4 mx-auto">
            <div className="w-10 h-10 bg-[#2a8742] rounded-full flex items-center justify-center shadow-md shadow-[#2a8742]/20">
              <span className="material-symbols-outlined text-white text-xl font-bold">check</span>
            </div>
          </div>

          {/* Headings */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2 tracking-tight">
            Registration Successful
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-6 text-[14px] leading-relaxed">
            Thank you for registering with <strong className="text-gray-800 font-semibold">Manipur Staff Selection Commission (MSSC)</strong>
          </p>

          {/* Info Card (Reduced padding and inner margins) */}
          <div className="w-full bg-[#f8f9fa] border border-[#e5e7eb] rounded-2xl p-5 md:p-6 mb-6 shadow-sm relative text-center mx-auto">
            
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Your Application Number
            </p>
            
            {/* Inner Dashed Box */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl py-10 px-8 mb-5 inline-block w-full sm:w-3/4 mx-auto">
              <div className="text-xl md:text-2xl font-bold text-[#d97706] tracking-widest font-mono">
                {generateMockApplicationId()}
              </div>
            </div>

            {/* Informational Paragraphs (Tighter line spacing) */}
            <div className="space-y-3 text-[13px] md:text-[14px] text-gray-600 max-w-2xl mx-auto">
              <p>
                Please keep your application number safe for future reference.
              </p>
              <p>
                Your One-Time Signup (OTS) has been successfully used to generate your OTS Application Number: <strong className="text-gray-800 font-medium">{otsNumber}</strong>
              </p>
              <p>
                Login credentials have been sent to your registered <strong className="text-gray-800 font-semibold">{email}</strong>. Please check your inbox (and spam folder) to proceed with the next step of the application process.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-4 mx-auto">
            <Link
              to="/login"
              className="flex-1 w-full flex justify-center items-center gap-2 bg-[#2530ad] text-white py-3 px-6 rounded-full text-[14px] font-semibold shadow-md hover:shadow-lg hover:bg-[#1f2894] hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Login Now
            </Link>
            <Link
              to="/"
              className="flex-1 w-full flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-full text-[14px] font-semibold hover:bg-gray-50 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Home
            </Link>
          </div>

          {/* Footer Disclaimer */}
          <p className="text-[11px] text-gray-400 max-w-xl text-center mt-2 mx-auto">
            All further communication regarding the examination will be sent to your registered email address and mobile number.
          </p>
        </div>
      </div>

      {/* Dark Footer Bar */}
      
    </div>
  );
}