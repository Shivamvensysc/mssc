import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, LockKeyhole, Eye, EyeOff } from 'lucide-react';

// FIXED PATHS: Only one '../' because we are only one folder deep now!
import examSheetImage from '../assets/pic1.png';

// ==========================================
// 1. FORGOT PASSWORD PAGE COMPONENT
// ==========================================
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating API verification transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen font-body-md text-[#191c1e] overflow-hidden bg-[#f7f9fb]">
      
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4648d4]/10 to-[#8127cf]/5 blur-[80px] pointer-events-none animate-[pulse_8s_infinite_alternate]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8127cf]/10 to-[#4648d4]/5 blur-[80px] pointer-events-none delay-500 animate-[pulse_8s_infinite_alternate]"></div>

      <div className="w-full flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[480px]">
          <div className="bg-white/95 backdrop-blur-xl shadow-[0px_10px_25px_rgba(0,0,0,0.05)] border border-white/20 rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
            
            {!isSubmitted ? (
              <>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e1e0ff] text-[#4648d4]">
                    <LockKeyhole className="w-10 h-10 stroke-[1.5]" />
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h1 className="font-headline-lg text-[32px] font-bold text-[#191c1e] mb-4 tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="font-body-md text-[16px] text-[#464554] max-w-sm mx-auto leading-relaxed">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Form Handling Connected to State */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60 [&:-webkit-allowed-autofill]:shadow-[0_0_0_1000px_white_inset]"
                      />
                    </div>
                  </div>

                  {/* State Trigger Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </>
            ) : (
              /* Success Confirmation View */
              <div className="space-y-8 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f2f4f6] text-[#8127cf]">
                    <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                  </div>
                </div>

                <div className="bg-[#f2f4f6] border border-[#c7c4d7]/30 rounded-2xl p-6 text-left flex items-start gap-4">
                  <div className="p-1 mt-0.5 rounded-md bg-white text-[#8127cf] shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-label-md text-[14px] font-bold text-[#6900b3] mb-1">
                      Email Sent Successfully
                    </h3>
                    <p className="font-body-md text-[14px] text-[#464554] leading-relaxed">
                      A path initialization link has been dispatched to <span className="font-semibold text-[#191c1e]">{email}</span>. Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#c7c4d7]/30 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#4648d4] font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* Security Trust Badges Layout Container */}
          <div className="mt-1 flex justify-center gap-6 opacity-60 text-[#464554]">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest">
              
            </div>
          </div>
        </div>
      </div>

      {/* Footer component sits cleanly at bottom layout level */}
      <div className="relative z-4 w-full mt-auto">
        
      </div>
    </div>
  );
}

// ==========================================
// 2. LOGIN PAGE COMPONENT
// ==========================================
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NEW: toggles which card (Login vs Forgot Password) shows in the right-side slot
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // NEW: state for the inline forgot-password form
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [isResetSubmitted, setIsResetSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password });
  };

  // NEW: handlers for the inline forgot-password form
  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSubmitting(true);
    setTimeout(() => {
      setIsResetSubmitting(false);
      setIsResetSubmitted(true);
    }, 1000);
  };

  // NEW: reset everything and go back to the login card
  const backToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setIsResetSubmitted(false);
    setIsResetSubmitting(false);
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen font-body-md text-on-surface overflow-x-hidden bg-gradient-to-br from-[#4648d4] to-[#8127cf]">

      {/* Global Background Image */}
      <img
        src={examSheetImage}
        alt="Student filling out an answer sheet"
        className="absolute inset-0 w-full h-full object-cover object-[75%_center] z-0"
      />

      {/* Full-page gradient overlay so the gradient covers the whole background, not just the left side */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4648d4]/85 via-[#4648d4]/40 to-[#8127cf]/70 z-[1] pointer-events-none"></div>

      {/* Columns Content Container — FIXED: z-4 is not a valid Tailwind class, changed to z-10 so the card stacks above the overlay */}
      <div className="flex flex-grow w-full relative z-10">
        {/* Left Side: Brand Area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20 relative overflow-hidden">

          {/* Fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4648d4] from-10% via-[#4648d4]/60 via-40% to-transparent to-85% z-[1]"></div>

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl z-[1]"></div>
          
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#4648d4] font-bold">account_balance_wallet</span>
              </div>
              <span className="text-2xl font-bold font-headline-md tracking-tight">MSSC 2026</span>
            </div>
            
            <h1 className="text-7xl font-bold font-display-lg mb-6">Hey, Hello!</h1>
            <h2 className="text-2xl font-semibold mb-6">Join The Waitlist For The Portal!</h2>
            <p className="text-lg opacity-80 max-w-md leading-relaxed mb-10">
              We provide all the advantages that can simplify all your financial transactions without any further requirements.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form / Forgot Password Form — same background stays visible behind either card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">

          {!showForgotPassword ? (
            /* -------- LOGIN CARD -------- */
            <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.1)] rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
              
              {/* Header Section */}
              <div className="mb-10 text-center">
                <h2 className="font-headline-lg text-3xl text-on-surface mb-3 font-bold tracking-tight">Welcome Back</h2>
                <p className="font-body-md text-on-surface-variant">Let's get started with your account.</p>
              </div>

              {/* Login Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Email Field */}
                <div>
                  <input 
                    id="email" 
                    type="email"
                    placeholder="Username" 
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-6 py-2.5 bg-white border border-outline-variant rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-on-surface placeholder:text-outline [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password" 
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full pl-6 pr-14 py-2.5 bg-white border border-outline-variant rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-on-surface placeholder:text-outline [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-outline hover:text-[#4648d4] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="text-right">
                    {/* CHANGED: was <Link to="/forgot-password">, now swaps to the forgot-password card in place */}
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-outline hover:text-[#4648d4] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Primary Action */}
                <button type="submit" className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:opacity-90 transition-all active:scale-95">
                  Login
                </button>
              </form>

              {/* Divider */}
              <div className="my-4 flex items-center gap-4">
                <div className="flex-grow h-px bg-outline-variant/30"></div>
                <span className="font-label-sm text-[12px] text-outline uppercase tracking-wider font-semibold">OR</span>
                <div className="flex-grow h-px bg-outline-variant/30"></div>
              </div>

              {/* Footer Link */}
              <div className="mt-4 text-center">
                <p className="font-body-md text-sm text-on-surface-variant">
                  Don't have an account? 
                  <Link to="/" className="text-[#4648d4] font-bold hover:underline ml-1">Register</Link>
                </p>
              </div>
            </div>
          ) : (
            /* -------- FORGOT PASSWORD CARD (spacing tightened for a cleaner, even rhythm) -------- */
            <div className="w-full max-w-[480px] bg-white shadow-[0px_20px_40px_rgba(0,0,0,0.1)] rounded-[2rem] px-8 py-10 md:px-14 md:py-14">

              {!isResetSubmitted ? (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e1e0ff] text-[#4648d4]">
                      <LockKeyhole className="w-8 h-8 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h1 className="font-headline-lg text-[28px] font-bold text-[#191c1e] mb-2 tracking-tight">
                      Forgot Password?
                    </h1>
                    <p className="font-body-md text-[15px] text-[#464554] max-w-sm mx-auto leading-relaxed">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleResetSubmit}>
                    <div className="space-y-2">
                      <label className="font-label-md text-[14px] font-semibold text-[#464554] ml-1" htmlFor="reset-email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#767586]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={resetEmail}
                          onChange={handleResetEmailChange}
                          className="w-full pl-12 pr-6 py-2.5 bg-[#f7f9fb] border border-[#c7c4d7] rounded-full focus:ring-2 focus:ring-[#4648d4]/20 focus:border-[#4648d4] transition-all outline-none text-[#191c1e] placeholder-[#767586]/60"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isResetSubmitting}
                      className="w-full bg-gradient-to-r from-[#4648d4] to-[#8127cf] text-white py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg shadow-[#4648d4]/30 hover:shadow-[#4648d4]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isResetSubmitting ? 'Sending...' : 'Send Reset Link'}
                      {!isResetSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f2f4f6] text-[#8127cf]">
                      <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="bg-[#f2f4f6] border border-[#c7c4d7]/30 rounded-2xl p-6 text-left flex items-start gap-4">
                    <div className="p-1 mt-0.5 rounded-md bg-white text-[#8127cf] shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-label-md text-[14px] font-bold text-[#6900b3] mb-1">
                        Email Sent Successfully
                      </h3>
                      <p className="font-body-md text-[14px] text-[#464554] leading-relaxed">
                        A password reset link has been dispatched to <span className="font-semibold text-[#191c1e]">{resetEmail}</span>. Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-[#c7c4d7]/30 text-center">
                <button
                  type="button"
                  onClick={backToLogin}
                  className="inline-flex items-center gap-2 text-[#4648d4] font-label-md text-[14px] font-bold hover:underline decoration-2 underline-offset-4 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FIXED: Wrapped footer component with strict stacking contexts and width metrics */}
      <div className="relative z-4 w-full mt-auto">
      
      </div>
    </div>
  );
}