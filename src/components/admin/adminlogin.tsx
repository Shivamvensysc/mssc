import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ShieldCheck, 
  User, 
  Lock, 
  RefreshCw,
  Eye,
  EyeOff,
  Users,
  Activity
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interfaces
interface CaptchaResponse {
  success: boolean;
  captchaId: string;
  captchaSvg: string;
  message?: string;
}

interface CaptchaValidateResponse {
  success: boolean;
  message?: string;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isValidatingCaptcha, setIsValidatingCaptcha] = useState(false);
  const [captchaId, setCaptchaId] = useState<string>("");
  const [captchaSvg, setCaptchaSvg] = useState<string>("");
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    staffId: "",
    password: "",
    captcha: "",
  });

  // Fetch CAPTCHA on component mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await fetch(`${BASE_URL}/auth/captcha`, {
        method: "GET",
      });
      const data: CaptchaResponse = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load CAPTCHA");
      }
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.captchaSvg);
      setFormData(prev => ({ ...prev, captcha: "" }));
    } catch (error: any) {
      console.error("CAPTCHA error:", error);
      toast.error(error?.message || "Failed to load CAPTCHA");
    } finally {
      setCaptchaLoading(false);
    }
  };

  const validateCaptcha = async (): Promise<boolean> => {
    if (!captchaId) {
      toast.error("Please refresh CAPTCHA");
      return false;
    }
    if (!formData.captcha.trim()) {
      toast.error("Please enter CAPTCHA");
      return false;
    }
    try {
      setIsValidatingCaptcha(true);
      const response = await fetch(`${BASE_URL}/auth/captcha/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captchaId: captchaId,
          captchaText: formData.captcha.trim(),
        }),
      });
      const data: CaptchaValidateResponse = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid CAPTCHA. Please try again.");
        await fetchCaptcha();
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("CAPTCHA validation error:", error);
      toast.error(error?.message || "Failed to validate CAPTCHA");
      await fetchCaptcha();
      return false;
    } finally {
      setIsValidatingCaptcha(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.staffId.trim()) {
      toast.error("Please enter username");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter password");
      return;
    }

    // Validate CAPTCHA
    const isCaptchaValid = await validateCaptcha();
    if (!isCaptchaValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Clear old session if exists
      try {
        await signOut();
      } catch {
        // Ignore if not signed in
      }

      const result = await signIn({
        username: formData.staffId.trim(),
        password: formData.password,
      });

      console.log("SignIn Result:", result);

      if (
        result.isSignedIn ||
        result.nextStep?.signInStep === "DONE"
      ) {
        const session = await fetchAuthSession();

        const accessToken =
          session.tokens?.accessToken?.toString() || "";

        const idToken =
          session.tokens?.idToken?.toString() || "";

        const refreshToken =
          (session as any)?.tokens?.refreshToken?.toString() || "";

        const userEmail =
          String(session.tokens?.idToken?.payload?.email || "");

        const username =
          String(
            session.tokens?.idToken?.payload?.cognito_username ||
              formData.staffId
          );

        localStorage.setItem("adminAccessToken", accessToken);
        localStorage.setItem("adminIdToken", idToken);
        localStorage.setItem("adminRefreshToken", refreshToken);
        localStorage.setItem("adminUsername", username);
        localStorage.setItem("adminEmail", userEmail);

        toast.success("Login successful! Redirecting...");

        // Delay navigation slightly so the Toast has time to render before the component unmounts
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
        return;
      }

      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        toast.error("New password required for this account.");
        return;
      }

      toast.error("Unable to complete login.");
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error?.name === "UserNotFoundException") {
        toast.error("User not found");
      } else if (error?.name === "NotAuthorizedException") {
        toast.error("Incorrect username or password");
      } else if (error?.name === "UserNotConfirmedException") {
        toast.error("User account is not confirmed");
      } else {
        toast.error(error?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refresh captcha
  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };

  return (
    // Changed from min-h-screen to min-h-[calc(100vh-5rem)] to account for the top navbar
    <div className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row bg-[#f8f9fa] font-sans antialiased overflow-hidden">
      
      {/* LEFT SIDE: PREMIUM BRANDING PANEL */}
      <div className="hidden lg:flex relative w-5/12 flex-col justify-center p-10 xl:p-14 bg-[#00476D]">
        
        {/* Dynamic Background with SVG Grid and Glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003554] to-[#006092]"></div>
        
        {/* Dot Matrix Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '36px 36px' }}></div>
        
        {/* Atmospheric Blur Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#00a8ff] rounded-full blur-[140px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#002B44] rounded-full blur-[120px] opacity-80 pointer-events-none"></div>

        {/* Center Content - Typographic & Sleek (Moved up slightly) */}
        <div className="relative z-10 w-full max-w-md mx-auto -mt-10">
          
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-5">
            Centralized <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#93c5fd]">
              Command Center
            </span>
          </h2>
          
          <p className="text-blue-100/70 text-sm leading-relaxed mb-8 max-w-sm">
            Seamlessly manage candidate applications, monitor real-time statistics, and oversee the recruitment lifecycle with enterprise-grade security.
          </p>

          {/* Feature Modules */}
          <div className="space-y-3">
            <div className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20">
              <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wide">Candidate Management</h4>
                <p className="text-blue-200/60 text-xs mt-0.5">Review & process applications efficiently</p>
              </div>
            </div>
            
            <div className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20">
              <div className="bg-purple-500/20 p-2.5 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wide">Real-time Analytics</h4>
                <p className="text-blue-200/60 text-xs mt-0.5">Live tracking and recruitment insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      {/* Added lg:-mt-12 to shift the card up on desktop screens */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-8 relative lg:-mt-8">
        
        {/* Mobile-only gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00476D] to-[#0076b6] lg:hidden -z-10"></div>

        {/* LOGIN CARD - Compacted paddings and margins */}
        <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] lg:shadow-2xl border border-slate-100 p-8 sm:p-10 space-y-6 relative overflow-hidden">
          
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0076b6] to-[#00476D]"></div>

          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Enter your administrative credentials to access the dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* STAFF ID / USERNAME */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700 tracking-wide block">
                Staff ID / Username <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-[#0076b6] transition-colors duration-300">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="e.g., ADMIN-102"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0076b6]/20 focus:border-[#0076b6] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700 tracking-wide block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-[#0076b6] transition-colors duration-300">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-11 pl-11 pr-12 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0076b6]/20 focus:border-[#0076b6] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 text-slate-400 hover:text-[#0076b6] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* HIGH-SECURITY CAPTCHA BLOCK */}
            <div className="relative pt-2">
              <div className="absolute -top-1 left-3 px-2 bg-white text-[10px] font-bold uppercase tracking-widest text-slate-400 z-10">
                Security Verification
              </div>
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-3.5 hover:border-[#0076b6]/30 transition-colors">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  
                  {/* CAPTCHA Display */}
                  <div className="relative h-11 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center select-none shadow-inner flex-1 overflow-hidden group">
                    {captchaLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-[#0076b6]" />
                    ) : captchaSvg ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: captchaSvg }}
                        className="w-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[30px]"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Loading...</span>
                    )}
                    
                    {/* Refresh Button overlaid on top right of captcha image */}
                    <button 
                      type="button"
                      onClick={handleRefreshCaptcha}
                      disabled={captchaLoading || isLoading}
                      className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-slate-400 hover:text-[#0076b6] rounded-md shadow-sm backdrop-blur-sm transition-all disabled:opacity-40"
                      title="Refresh Captcha Code"
                    >
                      <RefreshCw size={12} className={captchaLoading ? "animate-spin" : ""} />
                    </button>
                  </div>
                  
                  {/* CAPTCHA Input */}
                  <input
                    type="text"
                    required
                    disabled={isLoading || isValidatingCaptcha}
                    placeholder="Code"
                    value={formData.captcha}
                    onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                    className="w-full sm:w-[120px] h-11 px-3 bg-white border-2 border-slate-200 rounded-lg text-sm font-bold tracking-widest text-center text-slate-700 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-[#0076b6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || isValidatingCaptcha}
              className="relative w-full h-11 bg-gradient-to-r from-[#00476D] to-[#0076b6] hover:from-[#003d5e] hover:to-[#006092] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0076b6]/25 hover:shadow-xl hover:shadow-[#0076b6]/40 transform transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden group mt-2"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              {isLoading || isValidatingCaptcha ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white/90" />
                  <span>{isLoading ? "Authenticating..." : "Validating..."}</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ShieldCheck size={16} className="text-emerald-300" /> 
                </>
              )}
            </button>
          </form>
        </div>

      </div>
      
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Shimmer animation keyframes for button */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}