// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Eye, EyeOff, KeyRound } from 'lucide-react';
// import examSheetImage from '../assets/pic1.png';

// // Import the Cognito functions (Adjust the path as needed for your project)
// import { login, triggerSetPassword, confirmSetPassword } from '../auth/cognito';

// // ==========================================
// // 1. FORGOT PASSWORD PAGE COMPONENT
// // ==========================================
// export function ForgotPasswordPage() {
//   const [email, setEmail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   // Setup states for Step 2: Confirming the code
//   const [resetCode, setResetCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value);
//   const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrorMsg('');
//     try {
//       await triggerSetPassword(email);
//       setIsSubmitted(true);
//     } catch (err: any) {
//       setErrorMsg(err.message || 'Failed to send reset code.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleConfirmSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsConfirming(true);
//     setErrorMsg('');
//     try {
//       await confirmSetPassword(email, resetCode, newPassword);
//       setIsComplete(true);
//     } catch (err: any) {
//       setErrorMsg(err.message || 'Failed to reset password.');
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   return (
//     <div className="relative flex flex-col w-full min-h-screen font-body-md text-[#191c1e] overflow-hidden bg-[#f7f9fb]">
      
//       {/* Ambient Background Blobs */}
//       <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4648d4]/10 to-[#8127cf]/5 blur-[80px] pointer-events-none animate-[pulse_8s_infinite_alternate]"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8127cf]/10 to-[#4648d4]/5 blur-[80px] pointer-events-none delay-500 animate-[pulse_8s_infinite_alternate]"></div>

//       <div className="w-full flex-grow flex flex-col items-center justify-center p-6 relative z-10">
//         <div className="w-full max-w-[480px]">
//           <div className="bg-white/95 backdrop-blur-xl shadow-[0px_10px_25px_rgba(0,0,0,0.05)] border border-white/20 rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
            
//             {!isSubmitted ? (
//               <>
//                 <div className="flex justify-center mb-8">
//                   <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e1e0ff] text-[#4648d4]">
//                     <LockKeyhole className="w-10 h-10 stroke-[1.5]" />
//                   </div>
//                 </div>

//                 <div className="text-center mb-10">
//                   <h1 className="font-headline-lg text-[32px] font-bold text-[#191c1e] mb-4 tracking-tight">
//                     Forgot Password?
//                   </h1>
//                   <p className="font-body-md text-[16px] text-[#464554] max-w-sm mx-auto leading-relaxed">
//                     Enter your email address and we'll send you a code to reset your password.
//                   </p>
//                 </div>

//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                   <div className="space-y-2">
//                     <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="email">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                         <Mail className="w-5 h-5" />
//                       </div>
//                       <input
//                         id="email"
//                         type="email"
//                         required
//                         placeholder="name@company.com"
//                         value={email}
//                         onChange={handleEmailChange}
//                         className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                       />
//                     </div>
//                   </div>

//                   {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? 'Sending...' : 'Send Reset Code'}
//                     {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
//                   </button>
//                 </form>
//               </>
//             ) : !isComplete ? (
//               /* Step 2: Verify Code and Set New Password */
//               <div className="animate-[fadeIn_0.3s_ease-out]">
//                  <div className="text-center mb-8">
//                   <h1 className="font-headline-lg text-[28px] font-bold text-[#191c1e] mb-2 tracking-tight">
//                     Reset Password
//                   </h1>
//                   <p className="font-body-md text-[15px] text-[#464554] max-w-sm mx-auto leading-relaxed">
//                     We've sent a code to <span className="font-semibold text-[#191c1e]">{email}</span>.
//                   </p>
//                 </div>
                
//                 <form className="space-y-5" onSubmit={handleConfirmSubmit}>
//                   <div className="space-y-2">
//                     <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="resetCode">
//                       Verification Code
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                         <KeyRound className="w-5 h-5" />
//                       </div>
//                       <input
//                         id="resetCode"
//                         type="text"
//                         required
//                         placeholder="Enter 6-digit code"
//                         value={resetCode}
//                         onChange={handleCodeChange}
//                         className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="newPassword">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                         <LockKeyhole className="w-5 h-5" />
//                       </div>
//                       <input
//                         id="newPassword"
//                         type={showNewPassword ? 'text' : 'password'}
//                         required
//                         placeholder="Enter new password"
//                         value={newPassword}
//                         onChange={handleNewPasswordChange}
//                         className="w-full pl-12 pr-14 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                       />
//                       <button 
//                         type="button" 
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#767586] hover:text-[#4648d4] transition-colors"
//                       >
//                         {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

//                   <button
//                     type="submit"
//                     disabled={isConfirming}
//                     className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
//                   >
//                     {isConfirming ? 'Resetting...' : 'Set New Password'}
//                   </button>
//                 </form>
//               </div>
//             ) : (
//               /* Success Confirmation View */
//               <div className="space-y-8 text-center animate-[fadeIn_0.3s_ease-out]">
//                 <div className="flex justify-center">
//                   <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f2f4f6] text-[#8127cf]">
//                     <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
//                   </div>
//                 </div>
//                 <div className="bg-[#f2f4f6] border border-[#c7c4d7]/30 rounded-2xl p-6 text-left flex items-start gap-4">
//                   <div className="p-1 mt-0.5 rounded-md bg-white text-[#8127cf] shadow-sm">
//                     <LockKeyhole className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="font-label-md text-[14px] font-bold text-[#6900b3] mb-1">
//                       Password Reset Successfully
//                     </h3>
//                     <p className="font-body-md text-[14px] text-[#464554] leading-relaxed">
//                       Your password has been successfully updated. You can now use your new password to log in to your account.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-4 pt-4 border-t border-[#c7c4d7]/30 text-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center gap-2 text-[#4648d4] font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
//               >
//                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                 Back to Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // 2. LOGIN PAGE COMPONENT
// // ==========================================
// export function LoginPage() {
//   const navigate = useNavigate();
  
//   // Login States
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const [loginError, setLoginError] = useState('');

//   // Toggles which card (Login vs Forgot Password) shows in the right-side slot
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   // Forgot Password inline form states
//   const [resetEmail, setResetEmail] = useState('');
//   const [isResetSubmitting, setIsResetSubmitting] = useState(false);
//   const [isResetSubmitted, setIsResetSubmitted] = useState(false);
//   const [resetError, setResetError] = useState('');
  
//   // Inline password confirm states
//   const [resetCode, setResetCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [isResetComplete, setIsResetComplete] = useState(false);

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
//   const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value);
//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value);
//   const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoggingIn(true);
//     setLoginError('');
//     try {
//       const result = await login(email, password);
//       if (result.status === "SUCCESS") {

//         if (result.accessToken) {
//           localStorage.setItem('accessToken', result.accessToken);
//         }
        
//         if (result.idToken) {
//           localStorage.setItem('idToken', result.idToken);
//         }
        
//         if (result.refreshToken) {
//           localStorage.setItem('refreshToken', result.refreshToken);
//         }
        
//         // Redirect upon successful authentication
//         navigate('/application'); // Change this path to your protected route
//       } else if (result.status === "NEW_PASSWORD_REQUIRED") {
//         setLoginError("Your account requires a new password setup. Please contact support.");
//       }
//     } catch (err: any) {
//       setLoginError(err.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   const handleResetSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsResetSubmitting(true);
//     setResetError('');
//     try {
//       await triggerSetPassword(resetEmail);
//       setIsResetSubmitted(true);
//     } catch(err: any) {
//       setResetError(err.message || 'Failed to send verification code.');
//     } finally {
//       setIsResetSubmitting(false);
//     }
//   };

//   const handleConfirmSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsConfirming(true);
//     setResetError('');
//     try {
//       await confirmSetPassword(resetEmail, resetCode, newPassword);
//       setIsResetComplete(true);
//     } catch (err: any) {
//       setResetError(err.message || 'Failed to set new password.');
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   const backToLogin = () => {
//     setShowForgotPassword(false);
//     setResetEmail('');
//     setResetCode('');
//     setNewPassword('');
//     setIsResetSubmitted(false);
//     setIsResetComplete(false);
//     setResetError('');
//     setLoginError('');
//   };

//   return (
//     <div className="relative flex flex-col w-full min-h-screen font-body-md text-on-surface overflow-x-hidden bg-gradient-to-br from-[#4648d4] to-[#8127cf]">

//       {/* Global Background Image */}
//       <img
//         src={examSheetImage}
//         alt="Student filling out an answer sheet"
//         className="absolute inset-0 w-full h-full object-cover object-[75%_center] z-0"
//       />

//       {/* Full-page gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#4648d4]/85 via-[#4648d4]/40 to-[#8127cf]/70 z-[1] pointer-events-none"></div>

//       {/* Columns Content Container */}
//       <div className="flex flex-grow w-full relative z-10">
        
//         {/* Left Side: Brand Area */}
//         <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#4648d4] from-10% via-[#4648d4]/60 via-40% to-transparent to-85% z-[1]"></div>
//           <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl z-[1]"></div>
          
//           <div className="relative z-10 text-white">
//             <div className="flex items-center gap-3 mb-16">
//               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
//                 <span className="material-symbols-outlined text-[#4648d4] font-bold">account_balance_wallet</span>
//               </div>
//               <span className="text-2xl font-bold font-headline-md tracking-tight">MSSC 2026</span>
//             </div>
            
//             <h1 className="text-7xl font-bold font-display-lg mb-6">Hey, Hello!</h1>
//             <h2 className="text-2xl font-semibold mb-6">Join The Waitlist For The Portal!</h2>
//             <p className="text-lg opacity-80 max-w-md leading-relaxed mb-10">
//               We provide all the advantages that can simplify all your financial transactions without any further requirements.
//             </p>
//           </div>
//         </div>

//         {/* Right Side: Login Form / Forgot Password Form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">

//           {!showForgotPassword ? (
//             /* -------- LOGIN CARD -------- */
//             <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.1)] rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
              
//               <div className="mb-10 text-center">
//                 <h2 className="font-headline-lg text-3xl text-on-surface mb-3 font-bold tracking-tight">Welcome Back</h2>
//                 <p className="font-body-md text-on-surface-variant">Let's get started with your account.</p>
//               </div>

//               <form className="space-y-5" onSubmit={handleLoginSubmit}>
//                 <div>
//                   <input 
//                     id="email" 
//                     type="text" // Kept "text" for Username compatibility based on your specs
//                     placeholder="Username or Email" 
//                     value={email}
//                     onChange={handleEmailChange}
//                     required
//                     className="w-full px-6 py-2.5 bg-white border border-outline-variant rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-on-surface placeholder:text-outline [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <div className="relative">
//                     <input 
//                       id="password" 
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Password" 
//                       value={password}
//                       onChange={handlePasswordChange}
//                       required
//                       className="w-full pl-6 pr-14 py-2.5 bg-white border border-outline-variant rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-on-surface placeholder:text-outline [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
//                     />
//                     <button 
//                       type="button" 
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-5 flex items-center text-outline hover:text-[#4648d4] transition-colors"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>

//                   <div className="text-right">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotPassword(true)}
//                       className="text-sm font-medium text-outline hover:text-[#4648d4] transition-colors"
//                     >
//                       Forgot Password?
//                     </button>
//                   </div>
//                 </div>
                
//                 {loginError && <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>}

//                 <button 
//                   type="submit" 
//                   disabled={isLoggingIn}
//                   className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:opacity-90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {isLoggingIn ? 'Logging in...' : 'Login'}
//                 </button>
//               </form>

//               <div className="my-4 flex items-center gap-4">
//                 <div className="flex-grow h-px bg-outline-variant/30"></div>
//                 <span className="font-label-sm text-[12px] text-outline uppercase tracking-wider font-semibold">OR</span>
//                 <div className="flex-grow h-px bg-outline-variant/30"></div>
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="font-body-md text-sm text-on-surface-variant">
//                   Don't have an account? 
//                   <Link to="/" className="text-[#4648d4] font-bold hover:underline ml-1">Register</Link>
//                 </p>
//               </div>
//             </div>
//           ) : (
//             /* -------- FORGOT PASSWORD CARD -------- */
//             <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.1)] rounded-[2rem] px-8 py-10 md:px-14 md:py-14">

//               {!isResetSubmitted ? (
//                 <>
//                   <div className="flex justify-center mb-6">
//                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e1e0ff] text-[#4648d4]">
//                       <LockKeyhole className="w-8 h-8 stroke-[1.5]" />
//                     </div>
//                   </div>

//                   <div className="text-center mb-8">
//                     <h1 className="font-headline-lg text-[28px] font-bold text-[#191c1e] mb-2 tracking-tight">
//                       Forgot Password?
//                     </h1>
//                     <p className="font-body-md text-[15px] text-[#464554] max-w-sm mx-auto leading-relaxed">
//                       Enter your email address and we'll send you a code to reset your password.
//                     </p>
//                   </div>

//                   <form className="space-y-5" onSubmit={handleResetSubmit}>
//                     <div className="space-y-2">
//                       <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="reset-email">
//                         Email Address
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                           <Mail className="w-5 h-5" />
//                         </div>
//                         <input
//                           id="reset-email"
//                           type="email"
//                           required
//                           placeholder="name@company.com"
//                           value={resetEmail}
//                           onChange={handleResetEmailChange}
//                           className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                         />
//                       </div>
//                     </div>

//                     {resetError && <p className="text-red-500 text-sm text-center font-medium">{resetError}</p>}

//                     <button
//                       type="submit"
//                       disabled={isResetSubmitting}
//                       className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {isResetSubmitting ? 'Sending...' : 'Send Reset Code'}
//                       {!isResetSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
//                     </button>
//                   </form>
//                 </>
//               ) : !isResetComplete ? (
//                 /* Step 2: Verification Form inline */
//                 <div className="animate-[fadeIn_0.3s_ease-out]">
//                    <div className="text-center mb-8">
//                     <h1 className="font-headline-lg text-[24px] font-bold text-[#191c1e] mb-2 tracking-tight">
//                       Reset Password
//                     </h1>
//                     <p className="font-body-md text-[14px] text-[#464554] max-w-sm mx-auto leading-relaxed">
//                       We sent a verification code to <span className="font-semibold text-[#191c1e]">{resetEmail}</span>.
//                     </p>
//                   </div>
                  
//                   <form className="space-y-4" onSubmit={handleConfirmSubmit}>
//                     <div className="space-y-1">
//                       <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="inlineCode">
//                         Verification Code
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                           <KeyRound className="w-5 h-5" />
//                         </div>
//                         <input
//                           id="inlineCode"
//                           type="text"
//                           required
//                           placeholder="6-digit code"
//                           value={resetCode}
//                           onChange={handleCodeChange}
//                           className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="inlineNewPassword">
//                         New Password
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
//                           <LockKeyhole className="w-5 h-5" />
//                         </div>
//                         <input
//                           id="inlineNewPassword"
//                           type={showNewPassword ? 'text' : 'password'}
//                           required
//                           placeholder="New password"
//                           value={newPassword}
//                           onChange={handleNewPasswordChange}
//                           className="w-full pl-12 pr-14 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
//                         />
//                         <button 
//                           type="button" 
//                           onClick={() => setShowNewPassword(!showNewPassword)}
//                           className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#767586] hover:text-[#4648d4] transition-colors"
//                         >
//                           {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                         </button>
//                       </div>
//                     </div>

//                     {resetError && <p className="text-red-500 text-sm text-center font-medium">{resetError}</p>}

//                     <button
//                       type="submit"
//                       disabled={isConfirming}
//                       className="w-full mt-2 bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {isConfirming ? 'Resetting...' : 'Set New Password'}
//                     </button>
//                   </form>
//                 </div>
//               ) : (
//                 <div className="space-y-6 text-center">
//                   <div className="flex justify-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f2f4f6] text-[#8127cf]">
//                       <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
//                     </div>
//                   </div>

//                   <div className="bg-[#f2f4f6] border border-[#c7c4d7]/30 rounded-2xl p-6 text-left flex items-start gap-4">
//                     <div className="p-1 mt-0.5 rounded-md bg-white text-[#8127cf] shadow-sm">
//                       <LockKeyhole className="w-4 h-4" />
//                     </div>
//                     <div>
//                       <h3 className="font-label-md text-[14px] font-bold text-[#6900b3] mb-1">
//                         Password Reset Complete
//                       </h3>
//                       <p className="font-body-md text-[14px] text-[#464554] leading-relaxed">
//                         Your password has been changed. You can log in using your new credentials.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 pt-5 border-t border-[#c7c4d7]/30 text-center">
//                 <button
//                   type="button"
//                   onClick={backToLogin}
//                   className="inline-flex items-center gap-2 text-[#4648d4] font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
//                 >
//                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                   Back to Login
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Eye, EyeOff, KeyRound } from 'lucide-react';
import examSheetImage from '../assets/pic1.png';

// Import the Cognito functions (Adjust the path as needed for your project)
import { login, triggerSetPassword, confirmSetPassword } from '../auth/cognito';

// ==========================================
// 1. FORGOT PASSWORD PAGE COMPONENT
// ==========================================
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Setup states for Step 2: Confirming the code
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await triggerSetPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);
    setErrorMsg('');
    try {
      await confirmSetPassword(email, resetCode, newPassword);
      setIsComplete(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen font-body-md text-slate-800 overflow-hidden bg-slate-50">
      
      {/* Ambient Background Blobs matched with emerald theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-700/10 to-teal-600/5 blur-[80px] pointer-events-none animate-[pulse_8s_infinite_alternate]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-600/10 to-emerald-700/5 blur-[80px] pointer-events-none delay-500 animate-[pulse_8s_infinite_alternate]"></div>

      <div className="w-full flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[480px]">
          <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-slate-200/50 rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
            
            {!isSubmitted ? (
              <>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-700">
                    <LockKeyhole className="w-10 h-10 stroke-[1.5]" />
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h1 className="font-headline-lg text-[32px] font-bold text-slate-900 mb-4 tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="font-body-md text-[16px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Enter your email address and we'll send you a code to reset your password.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                      />
                    </div>
                  </div>

                  {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </>
            ) : !isComplete ? (
              /* Step 2: Verify Code and Set New Password */
              <div className="animate-[fadeIn_0.3s_ease-out]">
                 <div className="text-center mb-8">
                  <h1 className="font-headline-lg text-[28px] font-bold text-slate-900 mb-2 tracking-tight">
                    Reset Password
                  </h1>
                  <p className="font-body-md text-[15px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                    We've sent a code to <span className="font-semibold text-slate-900">{email}</span>.
                  </p>
                </div>
                
                <form className="space-y-5" onSubmit={handleConfirmSubmit}>
                  <div className="space-y-2">
                    <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="resetCode">
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <input
                        id="resetCode"
                        type="text"
                        required
                        placeholder="Enter 6-digit code"
                        value={resetCode}
                        onChange={handleCodeChange}
                        className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="newPassword">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                        <LockKeyhole className="w-5 h-5" />
                      </div>
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className="w-full pl-12 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-emerald-700 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={isConfirming}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? 'Resetting...' : 'Set New Password'}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Confirmation View */
              <div className="space-y-8 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-emerald-700">
                    <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left flex items-start gap-4">
                  <div className="p-1 mt-0.5 rounded-md bg-white text-emerald-700 shadow-sm border border-slate-100">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-label-md text-[14px] font-bold text-emerald-800 mb-1">
                      Password Reset Successfully
                    </h3>
                    <p className="font-body-md text-[14px] text-slate-600 leading-relaxed">
                      Your password has been successfully updated. You can now use your new password to log in to your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-emerald-700 font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. LOGIN PAGE COMPONENT
// ==========================================
export function LoginPage() {
  const navigate = useNavigate();
  
  // Login States
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Toggles which card (Login vs Forgot Password) shows in the right-side slot
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Forgot Password inline form states
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [isResetSubmitted, setIsResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState('');
  
  // Inline password confirm states
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value);
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await login(email, password);
      if (result.status === "SUCCESS") {

        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
        }
        
        if (result.idToken) {
          localStorage.setItem('idToken', result.idToken);
        }
        
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
        
        // Redirect upon successful authentication
        navigate('/application'); 
      } else if (result.status === "NEW_PASSWORD_REQUIRED") {
        setLoginError("Your account requires a new password setup. Please contact support.");
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSubmitting(true);
    setResetError('');
    try {
      await triggerSetPassword(resetEmail);
      setIsResetSubmitted(true);
    } catch(err: any) {
      setResetError(err.message || 'Failed to send verification code.');
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);
    setResetError('');
    try {
      await confirmSetPassword(resetEmail, resetCode, newPassword);
      setIsResetComplete(true);
    } catch (err: any) {
      setResetError(err.message || 'Failed to set new password.');
    } finally {
      setIsConfirming(false);
    }
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setIsResetSubmitted(false);
    setIsResetComplete(false);
    setResetError('');
    setLoginError('');
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen font-body-md text-slate-800 overflow-x-hidden bg-gradient-to-br from-slate-900 to-emerald-950">

      {/* Global Background Image */}
      <img
        src={examSheetImage}
        alt="Student filling out an answer sheet"
        className="absolute inset-0 w-full h-full object-cover object-[75%_center] z-0"
      />

      {/* Full-page Emerald overlay wrapper */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-emerald-900/80 z-[1] pointer-events-none"></div>

      {/* Columns Content Container */}
      <div className="flex flex-grow w-full relative z-10">
        
        {/* Left Side: Brand Area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 from-10% via-slate-900/60 via-40% to-transparent to-85% z-[1]"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl z-[1]"></div>
          
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-16">
              <div className="bg-emerald-700 text-white p-2 rounded-lg font-bold text-lg tracking-wider shadow-md">MSSC</div>
              <span className="text-xl font-bold font-headline-md tracking-tight">MSSC 2026</span>
            </div>
            
            <h1 className="text-6xl font-bold font-display-lg mb-6 leading-tight">Welcome to the Portal</h1>
            <h2 className="text-xl font-semibold mb-6 text-emerald-400">Recruitment Allocation Systems</h2>
            <p className="text-sm opacity-80 max-w-md leading-relaxed mb-10 text-slate-300">
              Access your dashboard to process portal registrations, monitor candidate application pathways, and verify normalization criteria matrices.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form / Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">

          {!showForgotPassword ? (
            /* -------- LOGIN CARD -------- */
            <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.15)] rounded-[2rem] px-8 py-12 md:px-14 md:py-16 border border-slate-100">
              
              <div className="mb-10 text-center">
                <h2 className="font-headline-lg text-3xl text-slate-900 mb-3 font-bold tracking-tight">Welcome Back</h2>
                <p className="font-body-md text-slate-500 text-sm">Let's get started with your account.</p>
              </div>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <input 
                    id="email" 
                    type="text" 
                    placeholder="Username or Email" 
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="w-full px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder:text-slate-400 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
                  />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password" 
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full pl-6 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder:text-slate-400 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-emerald-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                
                {loginError && <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>}

                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4 rounded-full font-label-md font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 hover:opacity-95 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="my-4 flex items-center gap-4">
                <div className="flex-grow h-px bg-slate-200"></div>
                <span className="font-label-sm text-[11px] text-slate-400 uppercase tracking-wider font-bold">OR</span>
                <div className="flex-grow h-px bg-slate-200"></div>
              </div>

              <div className="mt-4 text-center">
                <p className="font-body-md text-sm text-slate-600">
                  Don't have an account? 
                  <Link to="/" className="text-emerald-700 font-bold hover:underline ml-1">Register</Link>
                </p>
              </div>
            </div>
          ) : (
            /* -------- FORGOT PASSWORD CARD -------- */
            <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.15)] rounded-[2rem] px-8 py-10 md:px-14 md:py-14 border border-slate-100">

              {!isResetSubmitted ? (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-700">
                      <LockKeyhole className="w-8 h-8 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h1 className="font-headline-lg text-[24px] font-bold text-slate-900 mb-2 tracking-tight">
                      Forgot Password?
                    </h1>
                    <p className="font-body-md text-[14px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Enter your email address and we'll send you a code to reset your password.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleResetSubmit}>
                    <div className="space-y-2">
                      <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="reset-email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={resetEmail}
                          onChange={handleResetEmailChange}
                          className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                        />
                      </div>
                    </div>

                    {resetError && <p className="text-red-500 text-sm text-center font-medium">{resetError}</p>}

                    <button
                      type="submit"
                      disabled={isResetSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isResetSubmitting ? 'Sending...' : 'Send Reset Code'}
                      {!isResetSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </>
              ) : !isResetComplete ? (
                /* Step 2: Verification Form inline */
                <div className="animate-[fadeIn_0.3s_ease-out]">
                   <div className="text-center mb-8">
                    <h1 className="font-headline-lg text-[22px] font-bold text-slate-900 mb-2 tracking-tight">
                      Reset Password
                    </h1>
                    <p className="font-body-md text-[14px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                      We sent a verification code to <span className="font-semibold text-slate-900">{resetEmail}</span>.
                    </p>
                  </div>
                  
                  <form className="space-y-4" onSubmit={handleConfirmSubmit}>
                    <div className="space-y-1">
                      <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="inlineCode">
                        Verification Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <input
                          id="inlineCode"
                          type="text"
                          required
                          placeholder="6-digit code"
                          value={resetCode}
                          onChange={handleCodeChange}
                          className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-label-md text-[14px] font-semibold text-slate-700 ml-1" htmlFor="inlineNewPassword">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                          <LockKeyhole className="w-5 h-5" />
                        </div>
                        <input
                          id="inlineNewPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="New password"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          className="w-full pl-12 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all outline-none text-slate-900 placeholder-slate-400/70 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-emerald-700 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {resetError && <p className="text-red-500 text-sm text-center font-medium">{resetError}</p>}

                    <button
                      type="submit"
                      disabled={isConfirming}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isConfirming ? 'Resetting...' : 'Set New Password'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-emerald-700">
                      <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left flex items-start gap-4">
                    <div className="p-1 mt-0.5 rounded-md bg-white text-emerald-700 shadow-sm border border-slate-100">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-label-md text-[14px] font-bold text-emerald-800 mb-1">
                        Password Reset Complete
                      </h3>
                      <p className="font-body-md text-[14px] text-slate-600 leading-relaxed">
                        Your password has been changed. You can log in using your new credentials.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={backToLogin}
                  className="inline-flex items-center gap-2 text-emerald-700 font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}