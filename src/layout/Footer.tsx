// import React from 'react';
// import { Link } from 'react-router-dom';

// export const Footer: React.FC = () => {
//   return (
//     <footer className="bg-[#FFFFFF] text-black py-10 text-sm border-t border-black/20">
//       <div className="container mx-auto px-6 flex flex-col items-center text-center mb-6">
//         {/* Organization Branding */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-center space-x-3">
//             {/* Replaced text logo with image logo */}
//             <img 
//               src="/mssc.png" 
//               alt="MSSC Logo" 
//               className="h-20 w-auto object-contain" 
//             />
//             <span className="font-bold tracking-tight text-lg leading-tight">
//               Manipur Staff Selection Commission
//             </span>
//           </div>
//           <p className="text-black/90 text-xs">
//            Official Statutory Recruitment Portal of the Directorate of Education (S), Government of Manipur.
//           </p>
//         </div>
//       </div>
      
//       <hr className="border-black/20 my-6" />
      
//       {/* Copyright Notice */}
//       <div className="container mx-auto px-6 text-center text-black/80 text-[11px] tracking-wide">
//         &copy; 2026 Manipur Staff Selection Commission (MSSC). All rights reserved. Maintained for State Education Selection Frameworks.
//       </div>
//     </footer>
//   );
// };
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0076b6] text-white py-10 text-sm border-t border-white/20">
      <div className="container mx-auto px-6 flex flex-col items-center text-center mb-6">
        {/* Organization Branding */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {/* Added white background, padding, and rounded corners to the logo */}
            <img 
              src="/mssc.png" 
              alt="MSSC Logo" 
              className="h-20 w-auto object-contain bg-white p-2 rounded-lg shadow-sm" 
            />
            <span className="font-bold tracking-tight text-lg leading-tight">
              Manipur Staff Selection Commission
            </span>
          </div>
          <p className="text-white/90 text-xs">
           Official Statutory Recruitment Portal of the Directorate of Education (S), Government of Manipur.
          </p>
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