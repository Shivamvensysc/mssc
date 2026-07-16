import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import { getDistricts, getCategories } from '../api/registrationApi'; // Adjust import path as needed
import { sendOtp, verifyOtp, resendOtp } from '../auth/cognito'; // Adjust import path as needed
import {
  registrationSchema,
  otpSchema,
  flattenZodErrors,
  days,
  months,
  years,
} from '../schemas/registrationSchema'; // Adjust import path as needed

interface RegistrationFormData {
  name: string;
  citizen: string;
  dialect: string;
  residencyConfirmed: boolean;
  gender: string;
  maritalStatus: string;
  reservationCategory: string;
  ph: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  mobile: string;
  email: string;
  district: string;
  captchaInput: string;
  govEmployee: string;
}

type RegistrationFormErrors = Partial<Record<keyof RegistrationFormData, string>>;

interface District {
  districtId: number;
  stateId: number;
  districtName: string;
  isActive: boolean;
}

interface Category {
  value: number;
  label: string;
  subCategories: any[];
}

const initialFormData: RegistrationFormData = {
  name: '',
  citizen: '',
  dialect: '',
  residencyConfirmed: false,
  gender: '',
  maritalStatus: '',
  reservationCategory: '',
  ph: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  mobile: '',
  email: '',
  district: '',
  captchaInput: '',
  govEmployee: '',
};

// Simple visual security-code generator for the captcha widget.
const generateCaptcha = (): string => {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const out: string[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return out.join(' ');
};

/** Small helper so every field renders its inline error the same way. */
const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-error font-label-sm text-[12px] mt-1">{message}</p> : null;

export default function RegistrationForm() {
  const [captcha, setCaptcha] = useState<string>(generateCaptcha);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [workExperienceRows, setWorkExperienceRows] = useState([1]);

  // State for API data
  const [districts, setDistricts] = useState<District[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState({
    districts: false,
    categories: false
  });
  const [error, setError] = useState({
    districts: '',
    categories: ''
  });

  // ---- Cognito OTP verification state ----
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Fetch districts and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch districts
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const districtsData = await getDistricts();
        if (districtsData.success) {
          setDistricts(districtsData.data);
          setError(prev => ({ ...prev, districts: '' }));
        } else {
          setError(prev => ({ ...prev, districts: 'Failed to load districts' }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, districts: 'Failed to load districts' }));
        console.error('Error fetching districts:', err);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }

      // Fetch categories
      setLoading(prev => ({ ...prev, categories: true }));
      try {
        const categoriesData = await getCategories();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
          setError(prev => ({ ...prev, categories: '' }));
        } else {
          setError(prev => ({ ...prev, categories: 'Failed to load categories' }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, categories: 'Failed to load categories' }));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    fetchData();
  }, []);

  // Countdown for the "Resend code" button.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getMobileHint = (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.startsWith('0') || value.startsWith('+91') || value.startsWith('91')) {
      return "Do not prefix '0' or '+91' before the mobile no.";
    }
    if (!/^\d{10}$/.test(value)) {
      return 'Enter a valid 10-digit mobile number.';
    }
    return undefined;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, mobile: value }));
    setErrors((prev) => ({ ...prev, mobile: getMobileHint(value) }));
  };

  const regenerateCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData((prev) => ({ ...prev, captchaInput: '' }));
    setErrors((prev) => ({ ...prev, captchaInput: undefined }));
  };

  /** Step 1: validate with Zod, check the captcha, then register the candidate in Cognito. */
  const handleStep1Submit = async () => {
    const result = registrationSchema.safeParse(formData);

    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      toast.error('Please fix the highlighted fields before continuing.');
      return;
    }

    const normalizedCaptcha = captcha.replace(/\s+/g, '').toUpperCase();
    const normalizedInput = formData.captchaInput.replace(/\s+/g, '').toUpperCase();
    if (normalizedCaptcha !== normalizedInput) {
      setErrors((prev) => ({ ...prev, captchaInput: 'Security code does not match. Please try again.' }));
      toast.error('Security code does not match. Please try again.');
      regenerateCaptcha();
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await sendOtp(result.data);
      toast.success('OTP sent! Please check your email to verify your account.');
      setOtpValue('');
      setOtpError(undefined);
      setShowOtpModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong while registering. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const result = otpSchema.safeParse({ otp: otpValue });
    if (!result.success) {
      setOtpError(result.error.issues[0]?.message ?? 'Enter a valid code');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await verifyOtp(formData.email, result.data.otp);
      toast.success('Email verified successfully!');
      setShowOtpModal(false);
      setOtpValue('');
      setOtpError(undefined);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid or expired code. Please try again.';
      setOtpError(message);
      toast.error(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsResendingOtp(true);
    try {
      await resendOtp(formData.email);
      toast.success('A new verification code has been sent to your email.');
      setResendCooldown(30);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not resend the code. Please try again.';
      toast.error(message);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep === 1) {
      await handleStep1Submit();
      return;
    }

    setIsSubmitting(true);
    try {
      // NOTE: Step 2 ("Application") fields are not yet wired to component state
      // in this template — hook them up the same way Step 1 fields are before
      // sending this to your application-submission API.
      console.log('Final Application submitted:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepNames = ['Registration', 'Application', 'Payment', 'Completed'];

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface">

      <ToastContainer position="top-right" autoClose={4000} newestOnTop pauseOnHover />

      <Header />

      {/* 2. Hero Section */}
      <header className="pt-24 pb-48 hero-gradient relative overflow-hidden">
        {currentStep === 2 && (
          <div className="absolute top-10 left-10 opacity-10">
             
          </div>
        )}
        
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-white relative z-10">
          
          <h1 className="text-6xl font-bold text-white mb-6">
            {currentStep === 1 ? 'Request a Quote & Registration' : 'Application Form'}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            {currentStep === 1 
              ? 'Join the MSSC 2026 initiative. Complete your professional registration to unlock career opportunities within the council.'
              : 'Step 2: Detailed application and documentation submission. Please ensure all details are accurate before final submission.'}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-12">
            {[1, 2, 3, 4].map((step, idx) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;

              return (
                <React.Fragment key={step}>
                  <div className={`flex items-center gap-3 ${!isActive && !isPast ? 'opacity-60' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white text-primary shadow-lg' : isPast ? 'bg-white text-primary border-2 border-white' : 'border-2 border-white/50 text-white'}`}>
                      {isPast ? <span className="material-symbols-outlined text-sm">check</span> : step}
                    </div>
                    <span className={`font-label-md text-[14px] ${isActive ? 'font-bold text-white' : 'font-medium text-white'}`}>
                      {stepNames[step - 1]}
                    </span>
                  </div>
                  {idx < 3 && <div className="hidden md:block w-16 h-px bg-white/30"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Form Island */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-32 pb-24 relative z-20">
        <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 transition-transform duration-300 hover:shadow-xl">
          <form className={currentStep === 1 ? "space-y-12" : ""} onSubmit={handleSubmit} noValidate>
            
            {/* ======================================================== */}
            {/* STEP 1: INITIAL REGISTRATION CONTENT                     */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Post Name</label>
                      <div className="py-2.5 p-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface">
                        Multi Tasking Staff (MTS)
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you citizen of india?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="citizen"
                              value={opt}
                              checked={formData.citizen === opt}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <FieldError message={errors.citizen} />
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Can you speak Manipuri or any tribal dialect of Manipur?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="dialect"
                              value={opt}
                              checked={formData.dialect === opt}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <FieldError message={errors.dialect} />
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">The candidate must be a permanent resident of Manipur.</p>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="residencyConfirmed"
                          checked={formData.residencyConfirmed}
                          onChange={handleCheckboxChange}
                          className="w-5 h-5 text-primary border-outline rounded focus:ring-primary"
                        />
                        <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">I confirm residency eligibility</span>
                      </label>
                      <FieldError message={errors.residencyConfirmed} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Gender</label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          >
                            <option value="">Please Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                        <FieldError message={errors.gender} />
                      </div>
                      <div>
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Marital Status</label>
                        <div className="relative">
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          >
                            <option value="">Please Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                        <FieldError message={errors.maritalStatus} />
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Reservation Category</label>
                      <div className="relative">
                        <select
                          name="reservationCategory"
                          value={formData.reservationCategory}
                          onChange={handleInputChange}
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          disabled={loading.categories}
                        >
                          <option value="">{loading.categories ? 'Loading...' : 'Please Select'}</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.label}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                      </div>
                      {error.categories && (
                        <p className="text-error font-label-sm text-[12px] mt-1">{error.categories}</p>
                      )}
                      <FieldError message={errors.reservationCategory} />
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Physically Handicapped (PH)</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={`ph-${opt}`} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="ph"
                              value={opt}
                              checked={formData.ph === opt}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                      {formData.ph === 'Yes' && (
                        <p className="text-error font-label-sm text-[12px] italic">[Must have a minimum of 40% specified disability]</p>
                      )}
                      <FieldError message={errors.ph} />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Name of Candidate</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <FieldError message={errors.name} />
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Date of Birth</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Day', field: 'dobDay' as const, options: days },
                          { label: 'Month', field: 'dobMonth' as const, options: months },
                          { label: 'Year', field: 'dobYear' as const, options: years },
                        ].map((item) => (
                          <div key={item.field} className="relative">
                            <select
                              name={item.field}
                              value={formData[item.field]}
                              onChange={handleInputChange}
                              className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none text-on-surface-variant"
                            >
                              <option value="">{item.label}</option>
                              {item.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">expand_more</span>
                          </div>
                        ))}
                      </div>
                      <FieldError message={errors.dobDay || errors.dobMonth || errors.dobYear} />
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Mobile No.</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your mobile number"
                      />
                      <FieldError message={errors.mobile} />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Please keep this Mobile No. active for receiving communications]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">E-mail Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your email address"
                      />
                      <FieldError message={errors.email} />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Please keep this Email ID active for the Recruitment process — your OTP is sent here]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Select District</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                          disabled={loading.districts}
                        >
                          <option value="">{loading.districts ? 'Loading...' : 'Please Select'}</option>
                          {districts.map((district) => (
                            <option key={district.districtId} value={district.districtName}>
                              {district.districtName}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                      </div>
                      {error.districts && (
                        <p className="text-error font-label-sm text-[12px] mt-1">{error.districts}</p>
                      )}
                      <FieldError message={errors.district} />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Select your district of residence]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Captcha</label>
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="bg-surface-container rounded-lg py-2.5 px-3 border border-outline-variant flex items-center gap-2 w-full md:w-auto">
                          <div className="px-3 py-1 bg-white flex items-center justify-center font-bold tracking-wide text-on-surface-variant select-none border border-outline-variant/30 italic font-serif whitespace-nowrap">
                            {captcha}
                          </div>
                          <button
                            type="button"
                            onClick={regenerateCaptcha}
                            className="material-symbols-outlined shrink-0 text-primary hover:rotate-180 transition-all duration-300 text-xl leading-none"
                          >
                            refresh
                          </button>
                        </div>
                        <div className="relative w-full">
                          <input
                            type="text"
                            name="captchaInput"
                            value={formData.captchaInput}
                            onChange={handleInputChange}
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                            placeholder="Enter security code"
                          />
                        </div>
                      </div>
                      <FieldError message={errors.captchaInput} />
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you State Government Employees?</p>
                      <div className="flex gap-6">
                        {['Yes', 'No'].map((opt) => (
                          <label key={`gov-${opt}`} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="govEmployee"
                              value={opt}
                              checked={formData.govEmployee === opt}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-primary border-outline focus:ring-primary"
                            />
                            <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <FieldError message={errors.govEmployee} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-2 border-t border-outline-variant/30">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary-gradient text-white px-12 py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Proceed to Application'}
                  </button>
                  <p className="mt-6 text-on-surface-variant font-label-sm text-[12px] font-medium">
                    Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                  </p>
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* STEP 2: DETAILED APPLICATION CONTENT                     */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                
                {/* 1. Personal Details Section */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">person</span>
                        Personal Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">Name of Candidate</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" placeholder="" />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="block font-label-md text-[18px] text-on-surface-variant">Date of Birth</label>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { label: 'Day', field: 'dobDay' as const, options: days },
                                  { label: 'Month', field: 'dobMonth' as const, options: months },
                                  { label: 'Year', field: 'dobYear' as const, options: years },
                                ].map((item) => (
                                  <div key={item.field} className="relative">
                                    <select
                                      name={item.field}
                                      value={formData[item.field]}
                                      onChange={handleInputChange}
                                      className="w-full p-3 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md outline-none text-on-surface-variant"
                                    >
                                      <option value="">{item.label}</option>
                                      {item.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">expand_more</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">Gender</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">District</label>
                                <select 
                                  className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none"
                                  disabled={loading.districts}
                                >
                                    <option value="">{loading.districts ? 'Loading...' : 'Select District'}</option>
                                    {districts.map((district) => (
                                      <option key={district.districtId} value={district.districtName}>
                                        {district.districtName}
                                      </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">Mobile No.</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="tel" placeholder="" />
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">Marital Status</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="">Select Status</option>
                                    <option value="unmarried">Unmarried</option>
                                    <option value="married">Married</option>
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">E-mail Address</label>
                                <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="email" placeholder="" />
                            </div>
                        </div>

                        {/* Photo and Signature Upload */}
                        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-between gap-6 border border-outline-variant/30">
                          <div className="w-full space-y-6">
                              {/* Photo Upload Zone */}
                              <div className="group relative">
                                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 text-center">Upload Photo</label>
                                  <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-outline-variant/30 rounded-xl bg-white/30 hover:bg-white/50 hover:border-primary/50 transition-all cursor-pointer">
                                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".jpg,.jpeg" />
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                              <span className="material-symbols-outlined">add_a_photo</span>
                                          </div>
                                          <div className="text-center">
                                              <p className="font-label-sm text-primary">Click to upload</p>
                                              <p className="text-[10px] text-on-surface-variant/70">or drag and drop</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Signature Upload Zone */}
                              <div className="group relative">
                                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 text-center">Upload Signature</label>
                                  <div className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline-variant/30 rounded-xl bg-white/30 hover:bg-white/50 hover:border-primary/50 transition-all cursor-pointer">
                                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".jpg,.jpeg" />
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                              <span className="material-symbols-outlined">draw</span>
                                          </div>
                                          <div className="text-center">
                                              <p className="font-label-sm text-primary">Click to upload</p>
                                              <p className="text-[10px] text-on-surface-variant/70">or drag and drop</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Helper Text */}
                              <div className="pt-2 border-t border-outline-variant/10">
                                  <p className="text-[10px] text-on-surface-variant/70 text-center leading-tight italic">
                                      Only jpeg, jpg allowed.<br />File size: 20kb - 50kb
                                  </p>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="space-y-1">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Father's Name</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" />
                        </div>
                        <div className="space-y-1">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Mother's Name</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Identification Marks</label>
                            <input className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" placeholder="e.g. A mole on the left cheek" />
                        </div>
                        <div className="space-y-1">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Permanent Address</label>
                            <textarea className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] outline-none"></textarea>
                        </div>
                        <div className="space-y-1">
                            <label className="flex items-center justify-between font-label-md text-[18px] text-on-surface-variant">
                                Correspondence Address
                                <span className="text-[11px] flex items-center gap-1 font-normal"><input type="checkbox" className="rounded text-primary focus:ring-primary w-3 h-3" /> Same as Permanent</span>
                            </label>
                            <textarea className="w-full p-3 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] outline-none"></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="space-y-2">
                            <p className="font-label-md text-[18px] text-on-surface-variant">Are you State Gov. Employee?</p>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gov_emp" className="text-primary" /> <span className="text-body-md">Yes</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gov_emp" className="text-primary" /> <span className="text-body-md">No</span></label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="font-label-md text-[18px] text-on-surface-variant">Sponsored by Employment Exch.?</p>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsored" className="text-primary" /> <span className="text-body-md">Yes</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsored" className="text-primary" /> <span className="text-body-md">No</span></label>
                            </div>
                        </div>
                        <div className="space-y-1">
    <label className="block font-label-md text-[18px] text-on-surface-variant">Nationality</label>
    <div className="relative">
        <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none appearance-none font-body-md text-on-surface">
            <option value="indian">Indian</option>
            <option value="other">Other</option>
        </select>
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
    </div>
</div>
                    </div>
                </section>

                {/* 2. Additional Documents */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">description</span>
                        Additional Documents &amp; Eligibility
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Certificate of eligibility [PAN, Aadhaar, etc]</label>
                            <div className="relative flex items-center justify-between w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant/60 overflow-hidden">
                                <span>No file chosen</span>
                                <span className="px-3 py-1.5 bg-white border border-outline-variant/60 rounded text-xs text-on-surface font-medium pointer-events-none">Choose File</span>
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Permanent Resident Certificate</label>
                            <div className="relative flex items-center justify-between w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant/60 overflow-hidden">
                                <span>No file chosen</span>
                                <span className="px-3 py-1.5 bg-white border border-outline-variant/60 rounded text-xs text-on-surface font-medium pointer-events-none">Choose File</span>
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-label-md text-[18px] text-on-surface-variant">Domicile Certificate</label>
                            <div className="relative flex items-center justify-between w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant/60 overflow-hidden">
                                <span>No file chosen</span>
                                <span className="px-3 py-1.5 bg-white border border-outline-variant/60 rounded text-xs text-on-surface font-medium pointer-events-none">Choose File</span>
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">Reservation Category</label>
                                <select 
                                  className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none"
                                  disabled={loading.categories}
                                >
                                    <option value="">{loading.categories ? 'Loading...' : 'Select Category'}</option>
                                    {categories.map((category) => (
                                      <option key={category.value} value={category.label}>
                                        {category.label}
                                      </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-[18px] text-on-surface-variant">PH Status</label>
                                <select className="w-full p-3 bg-white border border-outline-variant rounded-lg outline-none">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Educational Details */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">school</span>
                        Educational Details
                    </h2>
                    <div className="overflow-x-auto border border-outline-variant rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-surface-container-low border-b border-outline-variant">
                                <tr>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-12 text-center">Sr.No</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Name of Examination</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">School/College/Institution</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Board/University</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">Year</th>
                                    <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">% Marks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">A</td>
                                    <td className="p-3 text-[16px] font-medium">10th / Equivalent</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" placeholder="99.99" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">B</td>
                                    <td className="p-3 text-[16px] font-medium">Intermediate / Equi.</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">C</td>
                                    <td className="p-3 text-[16px] font-medium">Graduation</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                                <tr className="hover:bg-surface-bright transition-colors">
                                    <td className="p-3 text-center text-[16px] font-medium text-on-surface-variant">D</td>
                                    <td className="p-3 text-[16px] font-medium">Post Graduation</td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                    <td className="p-2"><input type="text" className="w-full p-2 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Mandatory Uploads */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block font-label-md text-[18px] text-on-surface-variant">Marksheet of H.S.L.C./ Matriculate</label>
                        <div className="relative flex items-center justify-between w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant/60 overflow-hidden">
                            <span>No file chosen</span>
                            <span className="px-3 py-1.5 bg-white border border-outline-variant/60 rounded text-xs text-on-surface font-medium pointer-events-none">Choose File</span>
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-[18px] text-on-surface-variant">Provisional Certificate of H.S.L.C./ Matriculate</label>
                        <div className="relative flex items-center justify-between w-full h-[50px] px-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant/60 overflow-hidden">
                            <span>No file chosen</span>
                            <span className="px-3 py-1.5 bg-white border border-outline-variant/60 rounded text-xs text-on-surface font-medium pointer-events-none">Choose File</span>
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </section>

                {/* 5. Work Experience Details */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined">work</span>
                            Work Experience Details
                        </h2>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="has_exp" value="yes" className="text-primary focus:ring-primary" />
                                <span className="font-label-md text-[18px] text-on-surface group-hover:text-primary transition-colors">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input defaultChecked type="radio" name="has_exp" value="no" className="text-primary focus:ring-primary" />
                                <span className="font-label-md text-[18px] text-on-surface group-hover:text-primary transition-colors">No</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Dynamic Work Experience Rows mapped from state */}
                    {workExperienceRows.map((row, index) => (
                      <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-end ${index > 0 ? 'mt-6 pt-6 border-t border-outline-variant/50' : ''}`}>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[18px] text-on-surface-variant">Employer/Designation</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Employer/Designation" type="text" />
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[18px] text-on-surface-variant">Service Period (Months)</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Total Months" type="number" />
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[18px] text-on-surface-variant">Upload Certificate</label>
                              <div className="relative flex items-center justify-between w-full h-[38px] px-3 bg-white border border-outline-variant rounded text-xs text-on-surface-variant/60 overflow-hidden">
                                  <span>No file chosen</span>
                                  <span className="px-2 py-1 bg-surface-container border border-outline-variant/40 rounded text-[10px] text-on-surface font-medium pointer-events-none">Choose File</span>
                                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="block font-label-sm text-[18px] text-on-surface-variant">Reason of Leaving</label>
                              <input className="w-full p-2 border border-outline-variant rounded bg-white text-sm outline-none" placeholder="Remark" type="text" />
                          </div>
                      </div>
                    ))}
                    
                    <button 
                        type="button" 
                        onClick={() => setWorkExperienceRows([...workExperienceRows, workExperienceRows.length + 1])}
                        className="mt-6 border border-primary text-primary bg-white px-8 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-primary/5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add More
                    </button>
                </section>

                {/* 6. Final Actions */}
                <div className="flex flex-col items-center justify-center pt-12 border-t border-outline-variant/30 space-y-8">
                    
                    {/* Fixed Captcha Layout */}
                    <div className="w-full max-w-lg space-y-4">
                        <label className="block font-label-md text-[18px] text-on-surface-variant text-center">Security Verification</label>
                        <div className="flex flex-row justify-center gap-4 items-center">
                            <div className="bg-surface-container rounded-lg p-2 border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
                                <div className="h-12 w-32 bg-white flex items-center justify-center font-bold tracking-widest text-on-surface-variant select-none border border-outline-variant/30 italic" style={{ fontFamily: 'serif' }}>
                                    U D J I L 2
                                </div>
                                <button className="material-symbols-outlined ml-2 text-primary hover:rotate-180 transition-all duration-300" type="button">refresh</button>
                            </div>
                            <input className="w-full max-w-[200px] p-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md outline-none" placeholder="Enter security code" type="text" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        <div className="flex items-center gap-4">
                            <button 
                                type="button" 
                                onClick={() => {
                                  setCurrentStep(1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-8 py-4 border-2 border-outline-variant text-on-surface-variant rounded-full font-label-md text-[14px] font-bold hover:bg-surface-container-low transition-all active:scale-95"
                            >
                                Back
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="primary-gradient text-white px-16 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                        <p className="text-on-surface-variant font-label-sm text-[12px] text-center">
                            By submitting, you agree to the <a className="text-primary font-bold hover:underline" href="#">Terms and Conditions</a> of MSSC 2026.
                        </p>
                    </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* ======================================================== */}
      {/* Cognito OTP verification modal (shown after Step 1 submit) */}
      {/* ======================================================== */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">mark_email_read</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">Verify your email</h3>
              <p className="text-on-surface-variant text-sm">
                Enter the 6-digit code sent to <span className="font-semibold">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value.replace(/\D/g, ''));
                  setOtpError(undefined);
                }}
                className="w-full text-center tracking-[0.5em] text-lg py-3 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="------"
              />
              <FieldError message={otpError} />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className="w-full primary-gradient text-white py-3 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendingOtp || resendCooldown > 0}
                className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : isResendingOtp
                  ? 'Resending...'
                  : 'Resend code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpValue('');
                  setOtpError(undefined);
                }}
                className="text-on-surface-variant hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
