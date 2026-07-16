// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from '../layout/Footer';
// import Header from '../layout/Header';
// import { getDistricts, getCategories } from '../api/registrationApi'; // Adjust import path as needed
// import { sendOtp, verifyOtp, resendOtp, triggerSetPassword, confirmSetPassword } from '../auth/cognito'; // Adjust import path as needed
// import {
//   registrationSchema,
//   otpSchema,
//   setPasswordSchema,
//   flattenZodErrors,
//   days,
//   months,
//   years,
//   EMAIL_REGEX,
//   MOBILE_REGEX,
// } from '../schemas/registrationSchema'; // Adjust import path as needed

// interface RegistrationFormData {
//   name: string;
//   citizen: string;
//   dialect: string;
//   residencyConfirmed: boolean;
//   gender: string;
//   maritalStatus: string;
//   reservationCategory: string;
//   ph: string;
//   dobDay: string;
//   dobMonth: string;
//   dobYear: string;
//   mobile: string;
//   confirmMobile: string;
//   email: string;
//   confirmEmail: string;
//   district: string;
//   captchaInput: string;
//   govEmployee: string;
// }

// type RegistrationFormErrors = Partial<Record<keyof RegistrationFormData, string>>;

// type SetPasswordField = 'code' | 'newPassword' | 'confirmNewPassword';
// type SetPasswordFormState = Record<SetPasswordField, string>;
// type SetPasswordErrors = Partial<Record<SetPasswordField, string>>;

// interface District {
//   districtId: number;
//   stateId: number;
//   districtName: string;
//   isActive: boolean;
// }

// interface Category {
//   value: number;
//   label: string;
//   subCategories: any[];
// }

// const initialFormData: RegistrationFormData = {
//   name: '',
//   citizen: '',
//   dialect: '',
//   residencyConfirmed: false,
//   gender: '',
//   maritalStatus: '',
//   reservationCategory: '',
//   ph: '',
//   dobDay: '',
//   dobMonth: '',
//   dobYear: '',
//   mobile: '',
//   confirmMobile: '',
//   email: '',
//   confirmEmail: '',
//   district: '',
//   captchaInput: '',
//   govEmployee: '',
// };

// const initialSetPasswordForm: SetPasswordFormState = {
//   code: '',
//   newPassword: '',
//   confirmNewPassword: '',
// };

// // Simple visual security-code generator for the captcha widget.
// const generateCaptcha = (): string => {
//   const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
//   const out: string[] = [];
//   for (let i = 0; i < 6; i++) {
//     out.push(chars[Math.floor(Math.random() * chars.length)]);
//   }
//   return out.join(' ');
// };

// /** Small helper so every field renders its inline error the same way. */
// const FieldError = ({ message }: { message?: string }) =>
//   message ? <p className="text-error font-label-sm text-[12px] mt-1">{message}</p> : null;

// /** Red asterisk marker used next to every mandatory field's label. */
// const RequiredMark = () => (
//   <span className="text-error" aria-hidden="true">
//     {' '}
//     *
//   </span>
// );

// export default function RegistrationForm() {
//   const [captcha, setCaptcha] = useState<string>(generateCaptcha);
//   const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
//   const [errors, setErrors] = useState<RegistrationFormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   // State for API data
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState({
//     districts: false,
//     categories: false
//   });
//   const [error, setError] = useState({
//     districts: '',
//     categories: ''
//   });

//   // ---- Cognito OTP verification state ----
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpValue, setOtpValue] = useState('');
//   const [otpError, setOtpError] = useState<string | undefined>(undefined);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [isResendingOtp, setIsResendingOtp] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(0);

//   // ---- Post-verification "set your password" state ----
//   const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
//   const [setPasswordForm, setSetPasswordForm] = useState<SetPasswordFormState>(initialSetPasswordForm);
//   const [setPasswordErrors, setSetPasswordErrors] = useState<SetPasswordErrors>({});
//   const [isSettingPassword, setIsSettingPassword] = useState(false);
//   const [isResendingSetPasswordCode, setIsResendingSetPasswordCode] = useState(false);
//   const [setPasswordResendCooldown, setSetPasswordResendCooldown] = useState(0);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

//   // Fetch districts and categories on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch districts
//       setLoading(prev => ({ ...prev, districts: true }));
//       try {
//         const districtsData = await getDistricts();
//         if (districtsData.success) {
//           setDistricts(districtsData.data);
//           setError(prev => ({ ...prev, districts: '' }));
//         } else {
//           setError(prev => ({ ...prev, districts: 'Failed to load districts' }));
//         }
//       } catch (err) {
//         setError(prev => ({ ...prev, districts: 'Failed to load districts' }));
//         console.error('Error fetching districts:', err);
//       } finally {
//         setLoading(prev => ({ ...prev, districts: false }));
//       }

//       // Fetch categories
//       setLoading(prev => ({ ...prev, categories: true }));
//       try {
//         const categoriesData = await getCategories();
//         if (categoriesData.success) {
//           setCategories(categoriesData.data);
//           setError(prev => ({ ...prev, categories: '' }));
//         } else {
//           setError(prev => ({ ...prev, categories: 'Failed to load categories' }));
//         }
//       } catch (err) {
//         setError(prev => ({ ...prev, categories: 'Failed to load categories' }));
//         console.error('Error fetching categories:', err);
//       } finally {
//         setLoading(prev => ({ ...prev, categories: false }));
//       }
//     };

//     fetchData();
//   }, []);

//   // Countdown for the OTP modal's "Resend code" button.
//   useEffect(() => {
//     if (resendCooldown <= 0) return;
//     const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
//     return () => clearInterval(timer);
//   }, [resendCooldown]);

//   // Countdown for the set-password modal's "Resend code" button.
//   useEffect(() => {
//     if (setPasswordResendCooldown <= 0) return;
//     const timer = setInterval(() => setSetPasswordResendCooldown((c) => c - 1), 1000);
//     return () => clearInterval(timer);
//   }, [setPasswordResendCooldown]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   /* ---------------- Mobile / Confirm-mobile live validation ---------------- */

//   const getMobileHint = (value: string): string | undefined => {
//     if (!value) return undefined;
//     if (value.startsWith('0') || value.startsWith('+91') || value.startsWith('91')) {
//       return "Do not prefix '0' or '+91' before the mobile no.";
//     }
//     if (!MOBILE_REGEX.test(value)) {
//       return 'Enter a valid 10-digit mobile number starting with 6-9.';
//     }
//     return undefined;
//   };

//   const getConfirmMobileHint = (confirmValue: string, originalValue: string): string | undefined => {
//     if (!confirmValue) return undefined;
//     if (confirmValue.trim() !== originalValue.trim()) {
//       return 'Mobile numbers do not match.';
//     }
//     return undefined;
//   };

//   const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData((prev) => ({ ...prev, mobile: value }));
//     setErrors((prev) => ({
//       ...prev,
//       mobile: getMobileHint(value),
//       confirmMobile: prev.confirmMobile !== undefined || formData.confirmMobile
//         ? getConfirmMobileHint(formData.confirmMobile, value)
//         : prev.confirmMobile,
//     }));
//   };

//   const handleConfirmMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData((prev) => ({ ...prev, confirmMobile: value }));
//     setErrors((prev) => ({ ...prev, confirmMobile: getConfirmMobileHint(value, formData.mobile) }));
//   };

//   /* ---------------- Email / Confirm-email live validation ---------------- */

//   const getEmailHint = (value: string): string | undefined => {
//     if (!value) return undefined;
//     if (!EMAIL_REGEX.test(value.trim())) {
//       return 'Enter a valid email address.';
//     }
//     return undefined;
//   };

//   const getConfirmEmailHint = (confirmValue: string, originalValue: string): string | undefined => {
//     if (!confirmValue) return undefined;
//     if (confirmValue.trim().toLowerCase() !== originalValue.trim().toLowerCase()) {
//       return 'Email addresses do not match.';
//     }
//     return undefined;
//   };

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData((prev) => ({ ...prev, email: value }));
//     setErrors((prev) => ({
//       ...prev,
//       email: getEmailHint(value),
//       confirmEmail: formData.confirmEmail
//         ? getConfirmEmailHint(formData.confirmEmail, value)
//         : prev.confirmEmail,
//     }));
//   };

//   const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setFormData((prev) => ({ ...prev, confirmEmail: value }));
//     setErrors((prev) => ({ ...prev, confirmEmail: getConfirmEmailHint(value, formData.email) }));
//   };

//   // Confirm fields are typed, not pasted — keeps the check honest.
//   const blockPaste = (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault();

//   const regenerateCaptcha = () => {
//     setCaptcha(generateCaptcha());
//     setFormData((prev) => ({ ...prev, captchaInput: '' }));
//     setErrors((prev) => ({ ...prev, captchaInput: undefined }));
//   };

//   /** Step 1: validate with Zod, check the captcha, then register the candidate in Cognito. */
//   const handleStep1Submit = async () => {
//     const result = registrationSchema.safeParse(formData);

//     if (!result.success) {
//       setErrors(flattenZodErrors(result.error));
//       toast.error('Please fix the highlighted fields before continuing.');
//       return;
//     }

//     const normalizedCaptcha = captcha.replace(/\s+/g, '').toUpperCase();
//     const normalizedInput = formData.captchaInput.replace(/\s+/g, '').toUpperCase();
//     if (normalizedCaptcha !== normalizedInput) {
//       setErrors((prev) => ({ ...prev, captchaInput: 'Security code does not match. Please try again.' }));
//       toast.error('Security code does not match. Please try again.');
//       regenerateCaptcha();
//       return;
//     }

//     setErrors({});
//     setIsSubmitting(true);
//     try {
//       await sendOtp(result.data);
//       toast.success('OTP sent! Please check your email to verify your account.');
//       setOtpValue('');
//       setOtpError(undefined);
//       setShowOtpModal(true);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Something went wrong while registering. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const result = otpSchema.safeParse({ otp: otpValue });
//     if (!result.success) {
//       setOtpError(result.error.issues[0]?.message ?? 'Enter a valid code');
//       return;
//     }

//     setIsVerifyingOtp(true);
//     try {
//       await verifyOtp(formData.email, result.data.otp);
//       toast.success('Email verified successfully!');
//       setShowOtpModal(false);
//       setOtpValue('');
//       setOtpError(undefined);

//       // Immediately kick off the "set your password" step: Cognito emails a
//       // fresh code to the (now-verified) address that the candidate uses
//       // below to choose the password they'll actually log in with.
//       setSetPasswordForm(initialSetPasswordForm);
//       setSetPasswordErrors({});
//       setShowSetPasswordModal(true);
//       try {
//         await triggerSetPassword(formData.email);
//         toast.info('Enter the code we just emailed you to set your password.');
//       } catch (spErr) {
//         // The modal is still shown — the candidate can use "Resend code" to try again.
//         const message = spErr instanceof Error ? spErr.message : 'Could not send the password-setup code.';
//         toast.error(message);
//       }
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Invalid or expired code. Please try again.';
//       setOtpError(message);
//       toast.error(message);
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (resendCooldown > 0) return;
//     setIsResendingOtp(true);
//     try {
//       await resendOtp(formData.email);
//       toast.success('A new verification code has been sent to your email.');
//       setResendCooldown(30);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Could not resend the code. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsResendingOtp(false);
//     }
//   };

//   /* ---------------- Set-password modal handlers ---------------- */

//   const handleSetPasswordFieldChange = (field: SetPasswordField, value: string) => {
//     setSetPasswordForm((prev) => ({ ...prev, [field]: value }));
//     setSetPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const handleSetPasswordSubmit = async () => {
//     const result = setPasswordSchema.safeParse(setPasswordForm);
//     if (!result.success) {
//       setSetPasswordErrors(flattenZodErrors(result.error));
//       return;
//     }

//     setIsSettingPassword(true);
//     try {
//       await confirmSetPassword(formData.email, result.data.code, result.data.newPassword);
//       toast.success('Password set successfully! You can now log in with it.');
//       setShowSetPasswordModal(false);
//       setSetPasswordForm(initialSetPasswordForm);
//       setCurrentStep(2);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to set password. Please check the code and try again.';
//       toast.error(message);
//     } finally {
//       setIsSettingPassword(false);
//     }
//   };

//   const handleResendSetPasswordCode = async () => {
//     if (setPasswordResendCooldown > 0) return;
//     setIsResendingSetPasswordCode(true);
//     try {
//       await triggerSetPassword(formData.email);
//       toast.success('A new code has been sent to your email.');
//       setSetPasswordResendCooldown(30);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Could not resend the code. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsResendingSetPasswordCode(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (currentStep === 1) {
//       await handleStep1Submit();
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // NOTE: Step 2 ("Application") fields are not yet wired to component state
//       // in this template — hook them up the same way Step 1 fields are before
//       // sending this to your application-submission API.
//       console.log('Final Application submitted:', formData);
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       toast.success('Application submitted successfully!');
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-background min-h-screen font-body-md text-on-surface">

//       <ToastContainer position="top-right" autoClose={4000} newestOnTop pauseOnHover />

//       <Header />

//       {/* 2. Hero Section */}
//       <header className="pt-24 pb-48 hero-gradient relative overflow-hidden">
//         {currentStep === 2 && (
//           <div className="absolute top-10 left-10 opacity-10">
             
//           </div>
//         )}
        
        
        
//       </header>

//       {/* 3. Main Form Island */}
//       <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-32 pb-24 relative z-20">
//         <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 transition-transform duration-300 hover:shadow-xl">
//           <form className={currentStep === 1 ? "space-y-12" : ""} onSubmit={handleSubmit} noValidate>
            
//             {/* ======================================================== */}
//             {/* STEP 1: INITIAL REGISTRATION CONTENT                     */}
//             {/* ======================================================== */}
//             {currentStep === 1 && (
//               <>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//                   {/* Left Column */}
//                   <div className="space-y-8">
//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Post Name</label>
//                       <div className="py-2.5 p-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface">
//                         Multi Tasking Staff (MTS)
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you citizen of india?<RequiredMark /></p>
//                       <div className="flex gap-6">
//                         {['Yes', 'No'].map((opt) => (
//                           <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                             <input
//                               type="radio"
//                               name="citizen"
//                               value={opt}
//                               checked={formData.citizen === opt}
//                               onChange={handleInputChange}
//                               className="w-5 h-5 text-primary border-outline focus:ring-primary"
//                             />
//                             <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
//                           </label>
//                         ))}
//                       </div>
//                       <FieldError message={errors.citizen} />
//                     </div>

//                     <div className="space-y-4">
//                       <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Can you speak Manipuri or any tribal dialect of Manipur?<RequiredMark /></p>
//                       <div className="flex gap-6">
//                         {['Yes', 'No'].map((opt) => (
//                           <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                             <input
//                               type="radio"
//                               name="dialect"
//                               value={opt}
//                               checked={formData.dialect === opt}
//                               onChange={handleInputChange}
//                               className="w-5 h-5 text-primary border-outline focus:ring-primary"
//                             />
//                             <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
//                           </label>
//                         ))}
//                       </div>
//                       <FieldError message={errors.dialect} />
//                     </div>

//                     <div className="space-y-4">
//                       <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">The candidate must be a permanent resident of Manipur.<RequiredMark /></p>
//                       <label className="flex items-center gap-3 cursor-pointer group">
//                         <input
//                           type="checkbox"
//                           name="residencyConfirmed"
//                           checked={formData.residencyConfirmed}
//                           onChange={handleCheckboxChange}
//                           className="w-5 h-5 text-primary border-outline rounded focus:ring-primary"
//                         />
//                         <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">I confirm residency eligibility</span>
//                       </label>
//                       <FieldError message={errors.residencyConfirmed} />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Gender<RequiredMark /></label>
//                         <div className="relative">
//                           <select
//                             name="gender"
//                             value={formData.gender}
//                             onChange={handleInputChange}
//                             className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                           >
//                             <option value="">Please Select</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                           </select>
//                           <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
//                         </div>
//                         <FieldError message={errors.gender} />
//                       </div>
//                       <div>
//                         <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Marital Status<RequiredMark /></label>
//                         <div className="relative">
//                           <select
//                             name="maritalStatus"
//                             value={formData.maritalStatus}
//                             onChange={handleInputChange}
//                             className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                           >
//                             <option value="">Please Select</option>
//                             <option value="single">Single</option>
//                             <option value="married">Married</option>
//                           </select>
//                           <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
//                         </div>
//                         <FieldError message={errors.maritalStatus} />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Reservation Category<RequiredMark /></label>
//                       <div className="relative">
//                         <select
//                           name="reservationCategory"
//                           value={formData.reservationCategory}
//                           onChange={handleInputChange}
//                           className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                           disabled={loading.categories}
//                         >
//                           <option value="">{loading.categories ? 'Loading...' : 'Please Select'}</option>
//                           {categories.map((category) => (
//                             <option key={category.value} value={category.label}>
//                               {category.label}
//                             </option>
//                           ))}
//                         </select>
//                         <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
//                       </div>
//                       {error.categories && (
//                         <p className="text-error font-label-sm text-[12px] mt-1">{error.categories}</p>
//                       )}
//                       <FieldError message={errors.reservationCategory} />
//                     </div>

//                     <div className="space-y-4">
//                       <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Physically Handicapped (PH)<RequiredMark /></p>
//                       <div className="flex gap-6">
//                         {['Yes', 'No'].map((opt) => (
//                           <label key={`ph-${opt}`} className="flex items-center gap-2 cursor-pointer group">
//                             <input
//                               type="radio"
//                               name="ph"
//                               value={opt}
//                               checked={formData.ph === opt}
//                               onChange={handleInputChange}
//                               className="w-5 h-5 text-primary border-outline focus:ring-primary"
//                             />
//                             <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
//                           </label>
//                         ))}
//                       </div>
//                       {formData.ph === 'Yes' && (
//                         <p className="text-error font-label-sm text-[12px] italic">[Must have a minimum of 40% specified disability]</p>
//                       )}
//                       <FieldError message={errors.ph} />
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-8">
//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Name of Candidate<RequiredMark /></label>
//                       <div className="relative">
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                           placeholder="Enter your full name"
//                         />
//                       </div>
//                       <FieldError message={errors.name} />
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Date of Birth<RequiredMark /></label>
//                       <div className="grid grid-cols-3 gap-3">
//                         {[
//                           { label: 'Day', field: 'dobDay' as const, options: days },
//                           { label: 'Month', field: 'dobMonth' as const, options: months },
//                           { label: 'Year', field: 'dobYear' as const, options: years },
//                         ].map((item) => (
//                           <div key={item.field} className="relative">
//                             <select
//                               name={item.field}
//                               value={formData[item.field]}
//                               onChange={handleInputChange}
//                               className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none text-on-surface-variant"
//                             >
//                               <option value="">{item.label}</option>
//                               {item.options.map((opt) => (
//                                 <option key={opt} value={opt}>
//                                   {opt}
//                                 </option>
//                               ))}
//                             </select>
//                             <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">expand_more</span>
//                           </div>
//                         ))}
//                       </div>
//                       <FieldError message={errors.dobDay || errors.dobMonth || errors.dobYear} />
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Mobile No.<RequiredMark /></label>
//                       <input
//                         type="tel"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleMobileChange}
//                         className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                         placeholder="Enter your mobile number"
//                         maxLength={10}
//                         inputMode="numeric"
//                       />
//                       <FieldError message={errors.mobile} />
//                       <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Please keep this Mobile No. active for receiving communications]</p>
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Confirm Mobile No.<RequiredMark /></label>
//                       <input
//                         type="tel"
//                         name="confirmMobile"
//                         value={formData.confirmMobile}
//                         onChange={handleConfirmMobileChange}
//                         onPaste={blockPaste}
//                         autoComplete="off"
//                         className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                         placeholder="Re-enter your mobile number"
//                         maxLength={10}
//                         inputMode="numeric"
//                       />
//                       <FieldError message={errors.confirmMobile} />
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">E-mail Address<RequiredMark /></label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleEmailChange}
//                         className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                         placeholder="Enter your email address"
//                       />
//                       <FieldError message={errors.email} />
//                       <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Please keep this Email ID active for the Recruitment process — your OTP is sent here]</p>
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Confirm Email Address<RequiredMark /></label>
//                       <input
//                         type="email"
//                         name="confirmEmail"
//                         value={formData.confirmEmail}
//                         onChange={handleConfirmEmailChange}
//                         onPaste={blockPaste}
//                         autoComplete="off"
//                         className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                         placeholder="Re-enter your email address"
//                       />
//                       <FieldError message={errors.confirmEmail} />
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Select District<RequiredMark /></label>
//                       <div className="relative">
//                         <select
//                           name="district"
//                           value={formData.district}
//                           onChange={handleInputChange}
//                           className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                           disabled={loading.districts}
//                         >
//                           <option value="">{loading.districts ? 'Loading...' : 'Please Select'}</option>
//                           {districts.map((district) => (
//                             <option key={district.districtId} value={district.districtName}>
//                               {district.districtName}
//                             </option>
//                           ))}
//                         </select>
//                         <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
//                       </div>
//                       {error.districts && (
//                         <p className="text-error font-label-sm text-[12px] mt-1">{error.districts}</p>
//                       )}
//                       <FieldError message={errors.district} />
//                       <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Select your district of residence]</p>
//                     </div>

//                     <div>
//                       <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Captcha<RequiredMark /></label>
//                       <div className="flex flex-col md:flex-row gap-4 items-center">
//                         <div className="bg-surface-container rounded-lg py-2.5 px-3 border border-outline-variant flex items-center gap-2 w-full md:w-auto">
//                           <div className="px-3 py-1 bg-white flex items-center justify-center font-bold tracking-wide text-on-surface-variant select-none border border-outline-variant/30 italic font-serif whitespace-nowrap">
//                             {captcha}
//                           </div>
//                           <button
//                             type="button"
//                             onClick={regenerateCaptcha}
//                             className="material-symbols-outlined shrink-0 text-primary hover:rotate-180 transition-all duration-300 text-xl leading-none"
//                           >
//                             refresh
//                           </button>
//                         </div>
//                         <div className="relative w-full">
//                           <input
//                             type="text"
//                             name="captchaInput"
//                             value={formData.captchaInput}
//                             onChange={handleInputChange}
//                             className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
//                             placeholder="Enter security code"
//                           />
//                         </div>
//                       </div>
//                       <FieldError message={errors.captchaInput} />
//                     </div>

//                     <div className="space-y-4">
//                       <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you State Government Employees?<RequiredMark /></p>
//                       <div className="flex gap-6">
//                         {['Yes', 'No'].map((opt) => (
//                           <label key={`gov-${opt}`} className="flex items-center gap-2 cursor-pointer group">
//                             <input
//                               type="radio"
//                               name="govEmployee"
//                               value={opt}
//                               checked={formData.govEmployee === opt}
//                               onChange={handleInputChange}
//                               className="w-5 h-5 text-primary border-outline focus:ring-primary"
//                             />
//                             <span className="font-body-md group-hover:text-primary transition-colors">{opt}</span>
//                           </label>
//                         ))}
//                       </div>
//                       <FieldError message={errors.govEmployee} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-center justify-center pt-2 border-t border-outline-variant/30">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="primary-gradient text-white px-12 py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? 'Registering...' : 'Proceed to Application'}
//                   </button>
//                   <p className="mt-6 text-on-surface-variant font-label-sm text-[12px] font-medium">
//                     Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
//                   </p>
//                 </div>
//               </>
//             )}

//           </form>
//         </div>
//       </main>

//       {/* ======================================================== */}
//       {/* Cognito OTP verification modal (shown after Step 1 submit) */}
//       {/* ======================================================== */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
//             <div className="text-center space-y-2">
//               <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
//                 <span className="material-symbols-outlined text-2xl">mark_email_read</span>
//               </div>
//               <h3 className="text-xl font-bold text-on-surface">Verify your email</h3>
//               <p className="text-on-surface-variant text-sm">
//                 Enter the 6-digit code sent to <span className="font-semibold">{formData.email}</span>
//               </p>
//             </div>

//             <div className="space-y-2">
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={6}
//                 value={otpValue}
//                 onChange={(e) => {
//                   setOtpValue(e.target.value.replace(/\D/g, ''));
//                   setOtpError(undefined);
//                 }}
//                 className="w-full text-center tracking-[0.5em] text-lg py-3 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
//                 placeholder="------"
//               />
//               <FieldError message={otpError} />
//             </div>

//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               disabled={isVerifyingOtp}
//               className="w-full primary-gradient text-white py-3 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
//             </button>

//             <div className="flex items-center justify-between text-sm">
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={isResendingOtp || resendCooldown > 0}
//                 className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
//               >
//                 {resendCooldown > 0
//                   ? `Resend code in ${resendCooldown}s`
//                   : isResendingOtp
//                   ? 'Resending...'
//                   : 'Resend code'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowOtpModal(false);
//                   setOtpValue('');
//                   setOtpError(undefined);
//                 }}
//                 className="text-on-surface-variant hover:underline"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================================================== */}
//       {/* Set-password modal (shown right after OTP verification)  */}
//       {/* ======================================================== */}
//       {showSetPasswordModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-5">
//             <div className="text-center space-y-2">
//               <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
//                 <span className="material-symbols-outlined text-2xl">lock_reset</span>
//               </div>
//               <h3 className="text-xl font-bold text-on-surface">Set your password</h3>
//               <p className="text-on-surface-variant text-sm">
//                 Enter the 6-digit code sent to <span className="font-semibold">{formData.email}</span> and choose the password you'll use to log in.
//               </p>
//             </div>

//             <div className="space-y-2">
//               <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
//                 Verification Code<RequiredMark />
//               </label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={6}
//                 value={setPasswordForm.code}
//                 onChange={(e) => handleSetPasswordFieldChange('code', e.target.value.replace(/\D/g, ''))}
//                 className="w-full text-center tracking-[0.5em] text-lg py-3 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
//                 placeholder="------"
//               />
//               <FieldError message={setPasswordErrors.code} />
//             </div>

//             <div className="space-y-2">
//               <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
//                 New Password<RequiredMark />
//               </label>
//               <div className="relative">
//                 <input
//                   type={showNewPassword ? 'text' : 'password'}
//                   value={setPasswordForm.newPassword}
//                   onChange={(e) => handleSetPasswordFieldChange('newPassword', e.target.value)}
//                   className="w-full py-2.5 px-4 pr-11 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
//                   placeholder="At least 8 characters"
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword((v) => !v)}
//                   className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg"
//                   aria-label={showNewPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showNewPassword ? 'visibility_off' : 'visibility'}
//                 </button>
//               </div>
//               <FieldError message={setPasswordErrors.newPassword} />
//               <p className="text-on-surface-variant/70 font-label-sm text-[12px]">
//                 Must include an uppercase letter, a lowercase letter, a number, and a special character.
//               </p>
//             </div>

//             <div className="space-y-2">
//               <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
//                 Confirm New Password<RequiredMark />
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmNewPassword ? 'text' : 'password'}
//                   value={setPasswordForm.confirmNewPassword}
//                   onChange={(e) => handleSetPasswordFieldChange('confirmNewPassword', e.target.value)}
//                   onPaste={blockPaste}
//                   className="w-full py-2.5 px-4 pr-11 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
//                   placeholder="Re-enter your new password"
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmNewPassword((v) => !v)}
//                   className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg"
//                   aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showConfirmNewPassword ? 'visibility_off' : 'visibility'}
//                 </button>
//               </div>
//               <FieldError message={setPasswordErrors.confirmNewPassword} />
//             </div>

//             <button
//               type="button"
//               onClick={handleSetPasswordSubmit}
//               disabled={isSettingPassword}
//               className="w-full primary-gradient text-white py-3 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isSettingPassword ? 'Saving...' : 'Set Password & Continue'}
//             </button>

//             <div className="flex items-center justify-center text-sm">
//               <button
//                 type="button"
//                 onClick={handleResendSetPasswordCode}
//                 disabled={isResendingSetPasswordCode || setPasswordResendCooldown > 0}
//                 className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
//               >
//                 {setPasswordResendCooldown > 0
//                   ? `Resend code in ${setPasswordResendCooldown}s`
//                   : isResendingSetPasswordCode
//                   ? 'Resending...'
//                   : 'Resend code'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import { getDistricts, getCategories, fetchCaptchaApi, validateCaptchaApi } from '../api/registrationApi'; // Adjust import path as needed
import { sendOtp, verifyOtp, resendOtp, triggerSetPassword, confirmSetPassword } from '../auth/cognito'; // Adjust import path as needed
import {
  registrationSchema,
  otpSchema,
  setPasswordSchema,
  flattenZodErrors,
  days,
  months,
  years,
  EMAIL_REGEX,
  MOBILE_REGEX,
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
  confirmMobile: string;
  email: string;
  confirmEmail: string;
  district: string;
  captchaInput: string;
  govEmployee: string;
}

type RegistrationFormErrors = Partial<Record<keyof RegistrationFormData, string>>;

type SetPasswordField = 'code' | 'newPassword' | 'confirmNewPassword';
type SetPasswordFormState = Record<SetPasswordField, string>;
type SetPasswordErrors = Partial<Record<SetPasswordField, string>>;

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
  confirmMobile: '',
  email: '',
  confirmEmail: '',
  district: '',
  captchaInput: '',
  govEmployee: '',
};

const initialSetPasswordForm: SetPasswordFormState = {
  code: '',
  newPassword: '',
  confirmNewPassword: '',
};

/** Small helper so every field renders its inline error the same way. */
const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-error font-label-sm text-[12px] mt-1">{message}</p> : null;

/** Red asterisk marker used next to every mandatory field's label. */
const RequiredMark = () => (
  <span className="text-error" aria-hidden="true">
    {' '}
    *
  </span>
);

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // ---- CAPTCHA State ----
  const [captchaId, setCaptchaId] = useState<string>('');
  const [captchaSvg, setCaptchaSvg] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [isValidatingCaptcha, setIsValidatingCaptcha] = useState<boolean>(false);

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

  // ---- Post-verification "set your password" state ----
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [setPasswordForm, setSetPasswordForm] = useState<SetPasswordFormState>(initialSetPasswordForm);
  const [setPasswordErrors, setSetPasswordErrors] = useState<SetPasswordErrors>({});
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isResendingSetPasswordCode, setIsResendingSetPasswordCode] = useState(false);
  const [setPasswordResendCooldown, setSetPasswordResendCooldown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Backend CAPTCHA Fetch
  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await fetchCaptchaApi();
      const data = response.data;

      if (response.status !== 200 || !data.success) {
        throw new Error(data.message || "Failed to load CAPTCHA");
      }

      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.captchaSvg);
      setFormData((prev) => ({ ...prev, captchaInput: "" }));
      setErrors((prev) => ({ ...prev, captchaInput: undefined }));
    } catch (err: any) {
      console.error("CAPTCHA error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to load CAPTCHA. Please refresh.";
      setErrors((prev) => ({ ...prev, captchaInput: msg }));
      toast.error(msg);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // Fetch districts, categories, and initial CAPTCHA on mount
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
      
      // Fetch initial CAPTCHA
      await fetchCaptcha();
    };

    fetchData();
  }, []);

  // Countdown for the OTP modal's "Resend code" button.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Countdown for the set-password modal's "Resend code" button.
  useEffect(() => {
    if (setPasswordResendCooldown <= 0) return;
    const timer = setInterval(() => setSetPasswordResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [setPasswordResendCooldown]);

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

  /* ---------------- Mobile / Confirm-mobile live validation ---------------- */

  const getMobileHint = (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.startsWith('0') || value.startsWith('+91') || value.startsWith('91')) {
      return "Do not prefix '0' or '+91' before the mobile no.";
    }
    if (!MOBILE_REGEX.test(value)) {
      return 'Enter a valid 10-digit mobile number starting with 6-9.';
    }
    return undefined;
  };

  const getConfirmMobileHint = (confirmValue: string, originalValue: string): string | undefined => {
    if (!confirmValue) return undefined;
    if (confirmValue.trim() !== originalValue.trim()) {
      return 'Mobile numbers do not match.';
    }
    return undefined;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, mobile: value }));
    setErrors((prev) => ({
      ...prev,
      mobile: getMobileHint(value),
      confirmMobile: prev.confirmMobile !== undefined || formData.confirmMobile
        ? getConfirmMobileHint(formData.confirmMobile, value)
        : prev.confirmMobile,
    }));
  };

  const handleConfirmMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, confirmMobile: value }));
    setErrors((prev) => ({ ...prev, confirmMobile: getConfirmMobileHint(value, formData.mobile) }));
  };

  /* ---------------- Email / Confirm-email live validation ---------------- */

  const getEmailHint = (value: string): string | undefined => {
    if (!value) return undefined;
    if (!EMAIL_REGEX.test(value.trim())) {
      return 'Enter a valid email address.';
    }
    return undefined;
  };

  const getConfirmEmailHint = (confirmValue: string, originalValue: string): string | undefined => {
    if (!confirmValue) return undefined;
    if (confirmValue.trim().toLowerCase() !== originalValue.trim().toLowerCase()) {
      return 'Email addresses do not match.';
    }
    return undefined;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({
      ...prev,
      email: getEmailHint(value),
      confirmEmail: formData.confirmEmail
        ? getConfirmEmailHint(formData.confirmEmail, value)
        : prev.confirmEmail,
    }));
  };

  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, confirmEmail: value }));
    setErrors((prev) => ({ ...prev, confirmEmail: getConfirmEmailHint(value, formData.email) }));
  };

  // Confirm fields are typed, not pasted — keeps the check honest.
  const blockPaste = (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault();

  // Backend CAPTCHA Validation
  const validateCaptcha = async (): Promise<boolean> => {
    if (!captchaId) {
      const msg = "Please refresh CAPTCHA";
      setErrors((prev) => ({ ...prev, captchaInput: msg }));
      toast.warn(msg);
      return false;
    }

    if (!formData.captchaInput.trim()) {
      const msg = "Please enter CAPTCHA";
      setErrors((prev) => ({ ...prev, captchaInput: msg }));
      toast.warn(msg);
      return false;
    }

    try {
      setIsValidatingCaptcha(true);
      const response = await validateCaptchaApi(captchaId, formData.captchaInput.trim());
      const data = response.data;

      if (response.status !== 200 || !data.success) {
        const msg = data.message || "Invalid CAPTCHA. Please try again.";
        setErrors((prev) => ({ ...prev, captchaInput: msg }));
        toast.error(msg);
        await fetchCaptcha();
        return false;
      }

      return true;
    } catch (err: any) {
      console.error("CAPTCHA validation error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to validate CAPTCHA";
      setErrors((prev) => ({ ...prev, captchaInput: msg }));
      toast.error(msg);
      await fetchCaptcha();
      return false;
    } finally {
      setIsValidatingCaptcha(false);
    }
  };

  /** Step 1: validate with Zod, validate backend CAPTCHA, then register the candidate in Cognito. */
  const handleStep1Submit = async () => {
    const result = registrationSchema.safeParse(formData);

    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      toast.error('Please fix the highlighted fields before continuing.');
      return;
    }

    // Await Backend validation
    const isCaptchaValid = await validateCaptcha();
    if (!isCaptchaValid) {
      return; // Stop the registration if CAPTCHA validation fails
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

      // Immediately kick off the "set your password" step: Cognito emails a
      // fresh code to the (now-verified) address that the candidate uses
      // below to choose the password they'll actually log in with.
      setSetPasswordForm(initialSetPasswordForm);
      setSetPasswordErrors({});
      setShowSetPasswordModal(true);
      try {
        await triggerSetPassword(formData.email);
        toast.info('Enter the code we just emailed you to set your password.');
      } catch (spErr) {
        // The modal is still shown — the candidate can use "Resend code" to try again.
        const message = spErr instanceof Error ? spErr.message : 'Could not send the password-setup code.';
        toast.error(message);
      }
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

  /* ---------------- Set-password modal handlers ---------------- */

  const handleSetPasswordFieldChange = (field: SetPasswordField, value: string) => {
    setSetPasswordForm((prev) => ({ ...prev, [field]: value }));
    setSetPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSetPasswordSubmit = async () => {
    const result = setPasswordSchema.safeParse(setPasswordForm);
    if (!result.success) {
      setSetPasswordErrors(flattenZodErrors(result.error));
      return;
    }

    setIsSettingPassword(true);
    try {
      await confirmSetPassword(formData.email, result.data.code, result.data.newPassword);
      toast.success('Password set successfully! You can now log in with it.');
      setShowSetPasswordModal(false);
      setSetPasswordForm(initialSetPasswordForm);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set password. Please check the code and try again.';
      toast.error(message);
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleResendSetPasswordCode = async () => {
    if (setPasswordResendCooldown > 0) return;
    setIsResendingSetPasswordCode(true);
    try {
      await triggerSetPassword(formData.email);
      toast.success('A new code has been sent to your email.');
      setSetPasswordResendCooldown(30);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not resend the code. Please try again.';
      toast.error(message);
    } finally {
      setIsResendingSetPasswordCode(false);
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
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you citizen of india?<RequiredMark /></p>
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
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Can you speak Manipuri or any tribal dialect of Manipur?<RequiredMark /></p>
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
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">The candidate must be a permanent resident of Manipur.<RequiredMark /></p>
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
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Gender<RequiredMark /></label>
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
                        <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Marital Status<RequiredMark /></label>
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
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Reservation Category<RequiredMark /></label>
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
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Physically Handicapped (PH)<RequiredMark /></p>
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
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Name of Candidate<RequiredMark /></label>
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
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Date of Birth<RequiredMark /></label>
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
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Mobile No.<RequiredMark /></label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your mobile number"
                        maxLength={10}
                        inputMode="numeric"
                      />
                      <FieldError message={errors.mobile} />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Please keep this Mobile No. active for receiving communications]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Confirm Mobile No.<RequiredMark /></label>
                      <input
                        type="tel"
                        name="confirmMobile"
                        value={formData.confirmMobile}
                        onChange={handleConfirmMobileChange}
                        onPaste={blockPaste}
                        autoComplete="off"
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Re-enter your mobile number"
                        maxLength={10}
                        inputMode="numeric"
                      />
                      <FieldError message={errors.confirmMobile} />
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">E-mail Address<RequiredMark /></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Enter your email address"
                      />
                      <FieldError message={errors.email} />
                      <p className="text-on-surface-variant/70 font-label-sm text-[12px] mt-2">[Note: Please keep this Email ID active for the Recruitment process — your OTP is sent here]</p>
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Confirm Email Address<RequiredMark /></label>
                      <input
                        type="email"
                        name="confirmEmail"
                        value={formData.confirmEmail}
                        onChange={handleConfirmEmailChange}
                        onPaste={blockPaste}
                        autoComplete="off"
                        className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none"
                        placeholder="Re-enter your email address"
                      />
                      <FieldError message={errors.confirmEmail} />
                    </div>

                    <div>
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Select District<RequiredMark /></label>
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
                      <label className="block font-label-md text-[14px] font-semibold text-on-surface-variant mb-2">Captcha<RequiredMark /></label>
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="bg-surface-container rounded-lg py-2.5 px-3 border border-outline-variant flex items-center gap-2 w-full md:w-auto">
                          
                          {/* Updated CAPTCHA Display Box */}
                          <div 
                            className="px-1 py-1 bg-white flex items-center justify-center select-none border border-outline-variant/30 overflow-hidden" 
                            style={{ minWidth: '120px', minHeight: '40px' }}
                          >
                            {captchaLoading ? (
                              <span className="text-sm text-outline animate-pulse">Loading...</span>
                            ) : (
                              <div 
                                dangerouslySetInnerHTML={{ __html: captchaSvg }} 
                                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" 
                              />
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={fetchCaptcha}
                            disabled={captchaLoading}
                            className="material-symbols-outlined shrink-0 text-primary hover:rotate-180 transition-all duration-300 text-xl leading-none disabled:opacity-50"
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
                            disabled={isValidatingCaptcha}
                            className="w-full py-2.5 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Enter security code"
                          />
                        </div>
                      </div>
                      <FieldError message={errors.captchaInput} />
                    </div>

                    <div className="space-y-4">
                      <p className="font-label-md text-[14px] font-semibold text-on-surface-variant">Are you State Government Employees?<RequiredMark /></p>
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
                    disabled={isSubmitting || isValidatingCaptcha}
                    className="primary-gradient text-white px-12 py-4 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || isValidatingCaptcha ? 'Registering...' : 'Proceed to Application'}
                  </button>
                  <p className="mt-6 text-on-surface-variant font-label-sm text-[12px] font-medium">
                    Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                  </p>
                </div>
              </>
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

      {/* ======================================================== */}
      {/* Set-password modal (shown right after OTP verification)  */}
      {/* ======================================================== */}
      {showSetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">Set your password</h3>
              <p className="text-on-surface-variant text-sm">
                Enter the 6-digit code sent to <span className="font-semibold">{formData.email}</span> and choose the password you'll use to log in.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
                Verification Code<RequiredMark />
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={setPasswordForm.code}
                onChange={(e) => handleSetPasswordFieldChange('code', e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-lg py-3 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="------"
              />
              <FieldError message={setPasswordErrors.code} />
            </div>

            <div className="space-y-2">
              <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
                New Password<RequiredMark />
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={setPasswordForm.newPassword}
                  onChange={(e) => handleSetPasswordFieldChange('newPassword', e.target.value)}
                  className="w-full py-2.5 px-4 pr-11 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? 'visibility_off' : 'visibility'}
                </button>
              </div>
              <FieldError message={setPasswordErrors.newPassword} />
              <p className="text-on-surface-variant/70 font-label-sm text-[12px]">
                Must include an uppercase letter, a lowercase letter, a number, and a special character.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-label-md text-[13px] font-semibold text-on-surface-variant">
                Confirm New Password<RequiredMark />
              </label>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={setPasswordForm.confirmNewPassword}
                  onChange={(e) => handleSetPasswordFieldChange('confirmNewPassword', e.target.value)}
                  onPaste={blockPaste}
                  className="w-full py-2.5 px-4 pr-11 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((v) => !v)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmNewPassword ? 'visibility_off' : 'visibility'}
                </button>
              </div>
              <FieldError message={setPasswordErrors.confirmNewPassword} />
            </div>

            <button
              type="button"
              onClick={handleSetPasswordSubmit}
              disabled={isSettingPassword}
              className="w-full primary-gradient text-white py-3 rounded-full font-label-md text-[14px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSettingPassword ? 'Saving...' : 'Set Password & Continue'}
            </button>

            <div className="flex items-center justify-center text-sm">
              <button
                type="button"
                onClick={handleResendSetPasswordCode}
                disabled={isResendingSetPasswordCode || setPasswordResendCooldown > 0}
                className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {setPasswordResendCooldown > 0
                  ? `Resend code in ${setPasswordResendCooldown}s`
                  : isResendingSetPasswordCode
                  ? 'Resending...'
                  : 'Resend code'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}