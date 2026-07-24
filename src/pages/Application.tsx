// import React, { useState, useId } from 'react';
// import axios from 'axios';
// import { Plus, Trash2, FileText, CreditCard, CheckCircle, Upload, Loader2, X, AlertCircle, Calendar, Mail, Phone } from 'lucide-react';
// import { process } from 'zod/v4/core';

// // ==========================================
// // DESIGN TOKENS
// // ==========================================
// // Forest green + muted gold: a deliberate departure from the generic
// // Tailwind-default look, tuned for an official, trustworthy
// // government-application feel.
// const theme = {
//   navy: '#1B5E3F',
//   navyDark: '#0F3D28',
//   navyLight: '#3D8A63',
//   gold: '#B8873D',
//   goldLight: '#F3E7D3',
//   success: '#2F7A55',
//   error: '#C0392B',
//   bg: '#F7F8FA',
//   surface: '#FFFFFF',
//   border: '#E2E5EA',
//   textPrimary: '#1A2233',
//   textMuted: '#6B7684',
// };

// // --- TYPES & INTERFACES ---
// type Address = {
//   village: string;
//   city: string;
//   state: string;
//   district: string;
//   pincode: string;
//   policeStation: string;
// };

// type EducationLevel = {
//   college: string;
//   board: string;
//   year: string;
//   percentage: string;
// };

// type Experience = {
//   designation: string;
//   duration: string;
//   certificate: File | null;
//   reasonLeaving: string;
// };

// interface FormState {
//   personalInfo: {
//     name: string;
//     dob: string;
//     gender: string;
//     district: string;
//     maritalStatus: string;
//     mobile: string;
//     email: string;
//     fatherName: string;
//     motherName: string;
//     nationality: string;
//     reservationCategory: string;
//     pwdStatus: string;
//     typeOfDisability: string;
//     is40Percent: string;
//     stateGovEmployee: string;
//     sponsoredExchange: string;
//     identificationMarks: string;
//   };
//   address: {
//     permanent: Address;
//     correspond: Address;
//     sameAsPermanent: boolean;
//   };
//   documents: {
//     photograph: File | null;
//     signature: File | null;
//     eligibilityCert: File | null;
//     permanentResCert: File | null;
//     domicileCert: File | null;
//     hslcMarksheet: File | null;
//     hslcProvCert: File | null;
//     nocCert: File | null;
//     reservationCert: File | null;
//   };
//   education: {
//     '10th': EducationLevel;
//     '12th': EducationLevel;
//     graduation: EducationLevel;
//     postGraduation: EducationLevel;
//   };
//   teacherEligibility: {
//     tenPlusTwoCert: File | null;
//     dedQual: string;
//     dedInstitution: string;
//     crossDisabilityPeriod: string;
//     rciNumber: string;
//   };
//   experience: Experience[];
// }

// const emptyAddress: Address = {
//   village: '',
//   city: '',
//   state: '',
//   district: '',
//   pincode: '',
//   policeStation: '',
// };

// const emptyEducation: EducationLevel = {
//   college: '',
//   board: '',
//   year: '',
//   percentage: '',
// };

// const initialState: FormState = {
//   personalInfo: {
//     name: '',
//     dob: '',
//     gender: '',
//     district: '',
//     maritalStatus: '',
//     mobile: '',
//     email: '',
//     fatherName: '',
//     motherName: '',
//     nationality: '',
//     reservationCategory: '',
//     pwdStatus: 'no',
//     typeOfDisability: '',
//     is40Percent: 'no',
//     stateGovEmployee: 'no',
//     sponsoredExchange: 'no',
//     identificationMarks: '',
//   },
//   address: {
//     permanent: { ...emptyAddress },
//     correspond: { ...emptyAddress },
//     sameAsPermanent: false,
//   },
//   documents: {
//     photograph: null,
//     signature: null,
//     eligibilityCert: null,
//     permanentResCert: null,
//     domicileCert: null,
//     hslcMarksheet: null,
//     hslcProvCert: null,
//     nocCert: null,
//     reservationCert: null,
//   },
//   education: {
//     '10th': { ...emptyEducation },
//     '12th': { ...emptyEducation },
//     graduation: { ...emptyEducation },
//     postGraduation: { ...emptyEducation },
//   },
//   teacherEligibility: {
//     tenPlusTwoCert: null,
//     dedQual: '',
//     dedInstitution: '',
//     crossDisabilityPeriod: '',
//     rciNumber: '',
//   },
//   experience: [
//     {
//       designation: '',
//       duration: '',
//       certificate: null,
//       reasonLeaving: '',
//     },
//   ],
// };

// // Human-readable labels for keys that don't read well auto-capitalized
// const FIELD_LABELS: Record<string, string> = {
//   village: 'Village / Locality',
//   city: 'City / Town',
//   state: 'State',
//   district: 'District',
//   pincode: 'PIN Code',
//   policeStation: 'Police Station',
//   photograph: 'Photograph',
//   signature: 'Signature',
//   eligibilityCert: 'Eligibility Certificate',
//   permanentResCert: 'Permanent Residence Certificate',
//   domicileCert: 'Domicile Certificate',
//   hslcMarksheet: 'HSLC Marksheet',
//   hslcProvCert: 'HSLC Provisional Certificate',
//   nocCert: 'No Objection Certificate',
//   reservationCert: 'Reservation Certificate',
// };

// const labelFor = (key: string) =>
//   FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

// export default function MultiStepForm() {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState<FormState>(initialState);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [applicationId, setApplicationId] = useState<string | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
//   const [successModal, setSuccessModal] = useState<{ referenceNumber: string } | null>(null);

//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     setToast({ message, type });
//     window.clearTimeout((window as any)._toastTimeout);
//     (window as any)._toastTimeout = window.setTimeout(() => setToast(null), 4000);
//   };

//   // Explicitly forces connection to the local backend for debugging, ignoring AWS
//   const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

//   // --- STEP 1: Submit Application Data (JSON) ---
//   const submitStep1 = async () => {
//     const token = localStorage.getItem('accessToken');

//     const step1Payload = {
//       personalInfo: formData.personalInfo,
//       address: formData.address,
//       education: formData.education,
//       teacherEligibility: { // Fixed typo from teachereligibilit
//         dedQual: formData.teacherEligibility.dedQual,
//         dedInstitution: formData.teacherEligibility.dedInstitution,
//         crossDisabilityPeriod: formData.teacherEligibility.crossDisabilityPeriod,
//         rciNumber: formData.teacherEligibility.rciNumber,
//       },
//       experience: formData.experience.map((exp) => ({
//         designation: exp.designation,
//         duration: exp.duration,
//         reasonLeaving: exp.reasonLeaving,
//       })),
//     };

//     const response = await axios.patch(`${BASE_URL}/auth/candidate/step-1`, step1Payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   };

//   // --- STEP 2: Upload Documents (FormData with files) ---
//   const submitStep2 = async (applicationId: string) => {
//     const token = localStorage.getItem('accessToken');
//     const formDataToSend = new FormData();

//     Object.entries(formData.documents).forEach(([key, file]) => {
//       if (file) formDataToSend.append(key, file);
//     });

//     if (formData.teacherEligibility.tenPlusTwoCert) {
//       formDataToSend.append('tenPlusTwoCert', formData.teacherEligibility.tenPlusTwoCert);
//     }

//     formData.experience.forEach((exp, index) => {
//       if (exp.certificate) formDataToSend.append(`experienceCert_${index}`, exp.certificate);
//     });

//     formDataToSend.append('applicationId', applicationId);

//     const response = await axios.post(`${BASE_URL}/auth/candidate/step-2`, formDataToSend, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   };

//   // --- STEP 3: Initiate Payment ---
//   const initiatePayment = async (applicationId: string) => {
//     const token = localStorage.getItem('accessToken');

//     const response = await axios.post(
//       `${BASE_URL}/payment/initiate`,
//       { applicationId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     return response.data;
//   };

//   // --- STEP 4: Final Submit ---
//   const finalSubmit = async (applicationId: string) => {
//     const token = localStorage.getItem("accessToken");

//     const response = await axios.post(
//       `${BASE_URL}/application/${applicationId}/final-submit`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   };


//   // --- Navigation Handlers ---
//   const handleNext = async () => {
//     if (step === 1) {
//       try {
//         setIsProcessing(true);
//         const response = await submitStep1();
//         if (response.success) {
//           setApplicationId(response.data.applicationId);
//           setStep(2);
//         }
//       } catch (error: any) {
//         if (error.response?.data?.errors) {
//           const errorMessages = error.response.data.errors
//             .map((e: any) => `${e.field}: ${e.message}`)
//             .join(' • ');
//           showToast(errorMessages, 'error');
//         } else if (error.response?.data?.message) {
//           showToast(error.response.data.message, 'error');
//         } else {
//           showToast('Something went wrong. Please try again.', 'error');
//         }
//       } finally {
//         setIsProcessing(false);
//       }
//     } else if (step === 2) {
//       try {
//         setIsProcessing(true);
//         if (!applicationId) {
//           showToast('Application ID is missing. Please go back and submit step 1 again.', 'error');
//           return;
//         }
//         const response = await submitStep2(applicationId);
//         if (response.success) setStep(3);
//       } catch (error: any) {
//         if (error.response?.data?.errors) {
//           const errorMessages = error.response.data.errors
//             .map((e: any) => `${e.field}: ${e.message}`)
//             .join(' • ');
//           showToast(errorMessages, 'error');
//         } else {
//           showToast('Failed to upload documents. Please try again.', 'error');
//         }
//       } finally {
//         setIsProcessing(false);
//       }
//     } else if (step === 3) {
//       try {
//         setIsProcessing(true);
//         if (!applicationId) {
//           showToast('Application ID is missing.', 'error');
//           return;
//         }
//         const response = await initiatePayment(applicationId);
//         if (response.success) {
//           window.location.href = response.data.paymentUrl;
//         }
//       } catch (error: any) {
//         const serverMessage: string = error.response?.data?.message || '';
//         const alreadyPaid = serverMessage.toLowerCase().includes('already been completed') ||
//           serverMessage.toLowerCase().includes('already paid');

//         if (alreadyPaid) {
//           showToast('Payment has already been completed for this application.', 'success');
//           setStep(4);
//         } else if (serverMessage) {
//           showToast(serverMessage, 'error');
//         } else {
//           showToast('Failed to initiate payment. Please try again.', 'error');
//         }
//       } finally {
//         setIsProcessing(false);
//       }
//     } else if (step === 4) {
//       try {
//         setIsProcessing(true);
//         if (!applicationId) {
//           showToast('Application ID is missing.', 'error');
//           return;
//         }
//         const response = await finalSubmit(applicationId);
//         if (response.success) {
//           const referenceNumber = response.data?.applicationReferenceNumber;
//           setSuccessModal({ referenceNumber });
//         }
//       } catch (error) {
//         showToast('Failed to submit application.', 'error');
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

//   const steps = [
//     { num: 1, label: 'Application', icon: FileText },
//     { num: 2, label: 'Documents', icon: Upload },
//     { num: 3, label: 'Payment', icon: CreditCard },
//     { num: 4, label: 'Review', icon: CheckCircle },
//   ];

//   return (
//     <div
//       className="min-h-screen py-10 px-4"
//       style={{ backgroundColor: theme.bg, ['--navy' as any]: theme.navy, ['--gold' as any]: theme.gold }}
//     >
//       <Toast toast={toast} onDismiss={() => setToast(null)} />
//       <SuccessModal
//         data={successModal}
//         onClose={() => {
//           window.location.href = '/';
//         }}
//       />
//       <div
//         className="max-w-6xl mx-auto rounded-2xl overflow-hidden"
//         style={{ backgroundColor: theme.surface, boxShadow: '0 1px 2px rgba(20,30,50,0.04), 0 12px 32px -12px rgba(20,30,50,0.12)' }}
//       >
//         {/* Header band */}
//         <div className="px-8 pt-8 pb-6" style={{ backgroundColor: theme.navy }}>
//           <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: theme.goldLight }}>
//             Teacher Recruitment Portal
//           </p>
//           <h1 className="text-2xl font-bold text-white mt-1">Candidate Application</h1>
//         </div>

//         {/* Stepper */}
//         <div className="px-8 pt-8">
//           <StepIndicator steps={steps} current={step} />
//         </div>

//         <div className="px-8 pb-2 pt-6 min-h-[500px]">
//           {step === 1 && <Step1Application data={formData} setData={setFormData} />}
//           {step === 2 && <Step2Documents data={formData} setData={setFormData} />}
//           {step === 3 && <Step3Payment />}
//           {step === 4 && <Step4Review data={formData} />}
//         </div>

//         {/* Footer nav */}
//         <div className="flex justify-between items-center px-8 py-6 mt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
//           <button
//             onClick={handlePrev}
//             disabled={step === 1 || isProcessing}
//             className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
//             style={
//               step === 1
//                 ? { backgroundColor: '#EEF0F3', color: '#B3B9C2' }
//                 : { backgroundColor: '#EEF0F3', color: theme.textPrimary }
//             }
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={isProcessing}
//             className="px-7 py-2.5 rounded-lg font-semibold text-sm text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//             style={{ backgroundColor: step === 3 ? theme.gold : theme.navy }}
//           >
//             {isProcessing && <Loader2 className="animate-spin" size={16} />}
//             {step === 4 ? 'Submit Application' : step === 3 ? 'Proceed to Pay' : 'Save & Continue'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // SUCCESS MODAL
// // ==========================================
// function SuccessModal({
//   data,
//   onClose,
// }: {
//   data: { referenceNumber: string } | null;
//   onClose: () => void;
// }) {
//   const [secondsLeft, setSecondsLeft] = useState(6);
//   const [copied, setCopied] = useState(false);

//   React.useEffect(() => {
//     if (!data) return;
//     setSecondsLeft(6);
//     const interval = setInterval(() => {
//       setSecondsLeft((s) => {
//         if (s <= 1) {
//           clearInterval(interval);
//           onClose();
//           return 0;
//         }
//         return s - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);

//   if (!data) return null;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(data.referenceNumber);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1800);
//     } catch {
//       /* clipboard unavailable — ignore */
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center p-4"
//       style={{ backgroundColor: 'rgba(15, 61, 40, 0.55)' }}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="success-modal-title"
//     >
//       <div
//         className="w-full max-w-md rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
//         style={{ backgroundColor: theme.surface, boxShadow: '0 24px 60px -12px rgba(15,61,40,0.4)' }}
//       >
//         <div className="pt-9 pb-7 px-7 text-center">
//           <div
//             className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
//             style={{ backgroundColor: '#E7F4EC' }}
//           >
//             <CheckCircle size={34} style={{ color: theme.success }} />
//           </div>

//           <h2 id="success-modal-title" className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
//             Application Submitted Successfully
//           </h2>
//           <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
//             Your application has been received. Please save your reference number for future tracking.
//           </p>

//           <div
//             className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 mb-6"
//             style={{ backgroundColor: theme.goldLight, border: `1px solid #E3CB9C` }}
//           >
//             <div className="text-left min-w-0">
//               <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: theme.navyDark }}>
//                 Reference Number
//               </p>
//               <p className="text-base font-bold tracking-wide truncate" style={{ color: theme.navy }}>
//                 {data.referenceNumber || 'N/A'}
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={handleCopy}
//               className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
//               style={{ backgroundColor: theme.navy, color: '#fff' }}
//             >
//               {copied ? 'Copied!' : 'Copy'}
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors"
//             style={{ backgroundColor: theme.navy }}
//           >
//             Go to Homepage
//           </button>
//           <p className="text-xs mt-3" style={{ color: theme.textMuted }}>
//             Redirecting automatically in {secondsLeft}s…
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // TOAST NOTIFICATION
// // ==========================================
// function Toast({
//   toast,
//   onDismiss,
// }: {
//   toast: { message: string; type: 'success' | 'error' | 'info' } | null;
//   onDismiss: () => void;
// }) {
//   if (!toast) return null;

//   const palette = {
//     success: { bg: '#F1F8F4', border: '#BEE3CC', text: theme.success, Icon: CheckCircle },
//     error: { bg: '#FDEEEC', border: '#F1C3BC', text: theme.error, Icon: AlertCircle },
//     info: { bg: theme.goldLight, border: '#E3CB9C', text: theme.navyDark, Icon: AlertCircle },
//   }[toast.type];

//   const { Icon } = palette;

//   return (
//     <div
//       role="status"
//       aria-live="polite"
//       className="fixed top-6 right-6 z-50 flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-xl shadow-lg max-w-sm animate-in fade-in slide-in-from-top-2"
//       style={{ backgroundColor: palette.bg, border: `1px solid ${palette.border}` }}
//     >
//       <Icon size={18} style={{ color: palette.text }} className="shrink-0 mt-0.5" />
//       <p className="text-sm font-medium leading-snug" style={{ color: palette.text }}>
//         {toast.message}
//       </p>
//       <button
//         onClick={onDismiss}
//         className="shrink-0 rounded-full p-0.5 hover:bg-black/5"
//         aria-label="Dismiss notification"
//       >
//         <X size={14} style={{ color: palette.text }} />
//       </button>
//     </div>
//   );
// }

// // ==========================================
// // STEP INDICATOR
// // ==========================================
// function StepIndicator({
//   steps,
//   current,
// }: {
//   steps: { num: number; label: string; icon: any }[];
//   current: number;
// }) {
//   const progressPct = ((current - 1) / (steps.length - 1)) * 100;

//   return (
//     <div className="relative pb-8">
//       {/* Track */}
//       <div className="absolute top-5 left-0 right-0 h-[2px] mx-10" style={{ backgroundColor: theme.border }} />
//       <div
//         className="absolute top-5 left-0 h-[2px] mx-10 transition-all duration-500"
//         style={{ backgroundColor: theme.gold, width: `calc(${progressPct}% - ${progressPct > 0 ? '0px' : '0px'})`, maxWidth: 'calc(100% - 80px)' }}
//       />
//       <div className="flex justify-between relative">
//         {steps.map((s) => {
//           const isDone = current > s.num;
//           const isActive = current === s.num;
//           return (
//             <div key={s.num} className="flex flex-col items-center gap-2 z-10" style={{ width: 80 }}>
//               <div
//                 className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
//                 style={{
//                   backgroundColor: isDone || isActive ? theme.navy : theme.surface,
//                   borderColor: isDone || isActive ? theme.navy : theme.border,
//                   color: isDone || isActive ? '#fff' : theme.textMuted,
//                   boxShadow: isActive ? `0 0 0 4px ${theme.goldLight}` : 'none',
//                 }}
//               >
//                 {isDone ? <CheckCircle size={18} /> : <s.icon size={18} />}
//               </div>
//               <span
//                 className="text-xs font-semibold text-center"
//                 style={{ color: isActive || isDone ? theme.textPrimary : theme.textMuted }}
//               >
//                 {s.label}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // SHARED FORM PRIMITIVES
// // ==========================================

// /**
//  * Outlined label input — stacking naturally above the border.
//  * Focus lifts the border to navy with a soft gold glow; icons hint at the field's
//  * data type (mail, phone) for quicker scanning on a long form.
//  */
// function FormField({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   required = false,
//   placeholder,
//   error,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   required?: boolean;
//   placeholder?: string;
//   error?: string;
// }) {
//   const id = useId();
//   const [focused, setFocused] = useState(false);
//   const borderColor = error ? theme.error : focused ? theme.navy : theme.border;
//   const Icon = type === 'email' ? Mail : type === 'tel' ? Phone : null;

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label
//         htmlFor={id}
//         className="text-xs font-bold tracking-wide"
//         style={{ color: error ? theme.error : focused ? theme.navy : theme.textPrimary }}
//       >
//         {label} {required && <span style={{ color: theme.gold }}>*</span>}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <Icon
//             size={15}
//             className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
//             style={{ color: focused ? theme.navy : theme.textMuted }}
//           />
//         )}
//         <input
//           id={id}
//           type={type}
//           value={value || ''}
//           onChange={onChange}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder={placeholder}
//           required={required}
//           className="w-full rounded-xl border-2 bg-white py-2.5 text-sm outline-none transition-all duration-150"
//           style={{
//             borderColor,
//             color: theme.textPrimary,
//             paddingLeft: Icon ? '2.25rem' : '0.9rem',
//             paddingRight: '0.9rem',
//             boxShadow: focused ? `0 0 0 4px ${error ? '#F8DEDA' : theme.goldLight}` : 'none',
//           }}
//         />
//       </div>
//       {error ? (
//         <span className="flex items-center gap-1 text-xs" style={{ color: theme.error }}>
//           <AlertCircle size={12} /> {error}
//         </span>
//       ) : placeholder ? null : null}
//     </div>
//   );
// }

// /** Select input, stacking naturally above the border */
// function FormSelect({
//   label,
//   value,
//   onChange,
//   options,
//   required = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   options: string[];
//   required?: boolean;
// }) {
//   const id = useId();
//   const [focused, setFocused] = useState(false);
//   const hasValue = Boolean(value);
//   const borderColor = focused ? theme.navy : theme.border;

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label
//         htmlFor={id}
//         className="text-xs font-bold tracking-wide"
//         style={{ color: focused ? theme.navy : theme.textPrimary }}
//       >
//         {label} {required && <span style={{ color: theme.gold }}>*</span>}
//       </label>
//       <div className="relative">
//         <select
//           id={id}
//           value={value || ''}
//           onChange={onChange}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           required={required}
//           className="w-full rounded-xl border-2 bg-white pl-3.5 pr-9 py-3 text-sm outline-none appearance-none transition-all duration-150 cursor-pointer"
//           style={{
//             borderColor,
//             color: hasValue ? theme.textPrimary : theme.textMuted,
//             boxShadow: focused ? `0 0 0 4px ${theme.goldLight}` : 'none',
//           }}
//         >
//           <option value="" disabled hidden>
//             Select {label}
//           </option>
//           {options.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt}
//             </option>
//           ))}
//         </select>
//         <svg
//           className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
//           width="12"
//           height="8"
//           viewBox="0 0 12 8"
//           fill="none"
//         >
//           <path d="M1 1.5L6 6.5L11 1.5" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// /**
//  * Day / Month / Year date field — three linked segment boxes instead
//  * of the native browser date picker.
//  */
// function DateField({
//   label,
//   value,
//   onChange,
//   required = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (isoValue: string) => void;
//   required?: boolean;
// }) {
//   const [yyyy, mm, dd] = value ? value.split('-') : ['', '', ''];
//   const [day, setDay] = useState(dd || '');
//   const [month, setMonth] = useState(mm || '');
//   const [year, setYear] = useState(yyyy || '');
//   const [focused, setFocused] = useState(false);

//   const dayRef = React.useRef<HTMLInputElement>(null);
//   const monthRef = React.useRef<HTMLInputElement>(null);
//   const yearRef = React.useRef<HTMLInputElement>(null);

//   const emit = (d: string, m: string, y: string) => {
//     if (d.length === 2 && m.length === 2 && y.length === 4) {
//       onChange(`${y}-${m}-${d}`);
//     } else {
//       onChange('');
//     }
//   };

//   const handleDay = (raw: string) => {
//     const v = raw.replace(/\D/g, '').slice(0, 2);
//     setDay(v);
//     emit(v, month, year);
//     if (v.length === 2) monthRef.current?.focus();
//   };

//   const handleMonth = (raw: string) => {
//     const v = raw.replace(/\D/g, '').slice(0, 2);
//     setMonth(v);
//     emit(day, v, year);
//     if (v.length === 2) yearRef.current?.focus();
//   };

//   const handleYear = (raw: string) => {
//     const v = raw.replace(/\D/g, '').slice(0, 4);
//     setYear(v);
//     emit(day, month, v);
//   };

//   const segmentStyle = (filled: boolean): React.CSSProperties => ({
//     color: theme.textPrimary,
//     borderColor: 'transparent',
//   });

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label
//         className="text-xs font-bold tracking-wide"
//         style={{ color: focused ? theme.navy : theme.textPrimary }}
//       >
//         {label} {required && <span style={{ color: theme.gold }}>*</span>}
//       </label>
//       <div
//         className="relative rounded-xl border-2 bg-white flex items-center gap-1.5 py-2.5 px-3 transition-all duration-150"
//         style={{
//           borderColor: focused ? theme.navy : theme.border,
//           boxShadow: focused ? `0 0 0 4px ${theme.goldLight}` : 'none',
//         }}
//       >
//         <Calendar size={15} style={{ color: focused ? theme.navy : theme.textMuted }} className="shrink-0" />
//         <input
//           ref={dayRef}
//           value={day}
//           onChange={(e) => handleDay(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder="DD"
//           inputMode="numeric"
//           maxLength={2}
//           className="w-8 text-sm text-center outline-none bg-transparent"
//           style={segmentStyle(day.length === 2)}
//         />
//         <span className="text-sm" style={{ color: theme.border }}>/</span>
//         <input
//           ref={monthRef}
//           value={month}
//           onChange={(e) => handleMonth(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder="MM"
//           inputMode="numeric"
//           maxLength={2}
//           className="w-8 text-sm text-center outline-none bg-transparent"
//           style={segmentStyle(month.length === 2)}
//         />
//         <span className="text-sm" style={{ color: theme.border }}>/</span>
//         <input
//           ref={yearRef}
//           value={year}
//           onChange={(e) => handleYear(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder="YYYY"
//           inputMode="numeric"
//           maxLength={4}
//           className="w-14 text-sm text-center outline-none bg-transparent"
//           style={segmentStyle(year.length === 4)}
//         />
//       </div>
//     </div>
//   );
// }

// /** Section wrapper with numbered badge + navy accent */
// function FormSection({
//   number,
//   title,
//   children,
// }: {
//   number: number;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section
//       className="rounded-xl p-6 mb-6"
//       style={{ backgroundColor: '#FBFCFD', border: `1px solid ${theme.border}` }}
//     >
//       <div className="flex items-center gap-3 mb-5">
//         <span
//           className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
//           style={{ backgroundColor: theme.navy }}
//         >
//           {number}
//         </span>
//         <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>
//           {title}
//         </h3>
//       </div>
//       {children}
//     </section>
//   );
// }

// /** Polished file upload control with chosen/empty states */
// function FileUploadField({
//   label,
//   onChange,
//   onClear,
//   required = false,
//   fileName,
// }: {
//   label: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onClear?: () => void;
//   required?: boolean;
//   fileName?: string;
// }) {
//   const hasFile = Boolean(fileName);

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-xs font-bold tracking-wide" style={{ color: theme.textPrimary }}>
//         {label} {required && <span style={{ color: theme.gold }}>*</span>}
//       </label>
//       <div
//         className="relative rounded-lg border border-dashed px-3.5 py-3 flex items-center justify-between gap-2 transition-colors"
//         style={{
//           borderColor: hasFile ? theme.success : theme.border,
//           backgroundColor: hasFile ? '#F1F8F4' : '#FAFBFC',
//         }}
//       >
//         <div className="flex items-center gap-2 min-w-0">
//           {hasFile ? (
//             <CheckCircle size={16} style={{ color: theme.success }} className="shrink-0" />
//           ) : (
//             <Upload size={16} style={{ color: theme.textMuted }} className="shrink-0" />
//           )}
//           <span
//             className="text-xs truncate"
//             style={{ color: hasFile ? theme.textPrimary : theme.textMuted, maxWidth: 190 }}
//             title={fileName}
//           >
//             {fileName || 'Choose file (PDF, JPG, PNG)'}
//           </span>
//         </div>
//         {hasFile && onClear ? (
//           <button
//             type="button"
//             onClick={onClear}
//             className="shrink-0 rounded-full p-1 hover:bg-black/5 z-10 relative"
//             aria-label={`Remove ${label}`}
//           >
//             <X size={14} style={{ color: theme.textMuted }} />
//           </button>
//         ) : null}
//         <input
//           type="file"
//           onChange={onChange}
//           required={required}
//           className="absolute inset-0 opacity-0 cursor-pointer"
//         />
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // STEP 1: APPLICATION (JSON Data)
// // ==========================================
// function Step1Application({
//   data,
//   setData,
// }: {
//   data: FormState;
//   setData: React.Dispatch<React.SetStateAction<FormState>>;
// }) {
//   const updateField = (category: keyof FormState, field: string, value: any, subCategory?: string) => {
//     setData((prev) => {
//       if (subCategory) {
//         const categoryData = prev[category] as any;
//         return {
//           ...prev,
//           [category]: {
//             ...categoryData,
//             [subCategory]: {
//               ...categoryData[subCategory],
//               [field]: value,
//             },
//           },
//         };
//       }
//       return {
//         ...prev,
//         [category]: {
//           ...(prev[category] as any),
//           [field]: value,
//         },
//       };
//     });
//   };

//   const handleAddressToggle = (checked: boolean) => {
//     setData((prev) => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         sameAsPermanent: checked,
//         correspond: checked ? { ...prev.address.permanent } : { ...emptyAddress },
//       },
//     }));
//   };

//   const addExperience = () => {
//     setData((prev) => ({
//       ...prev,
//       experience: [...prev.experience, { designation: '', duration: '', certificate: null, reasonLeaving: '' }],
//     }));
//   };

//   const removeExperience = (index: number) => {
//     setData((prev) => ({
//       ...prev,
//       experience: prev.experience.filter((_, i) => i !== index),
//     }));
//   };

//   const updateExperience = (index: number, field: keyof Experience, value: any) => {
//     setData((prev) => {
//       const newExperience = [...prev.experience];
//       newExperience[index] = { ...newExperience[index], [field]: value };
//       return { ...prev, experience: newExperience };
//     });
//   };

//   const genderOptions = ['Male', 'Female', 'Other',];
//   const maritalStatusOptions = ['Married', 'Unmarried', 'Divorced', 'Widowed', ];
//   const reservationOptions = ['General', 'OBC(M)','OBC','SC', 'ST','Other'];
//   const yesNoOptions = ['yes', 'no'];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
//           Application Details
//         </h2>
//         <span
//           className="text-xs font-medium px-3 py-1 rounded-full"
//           style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
//         >
//           Saved as JSON
//         </span>
//       </div>

//       <FormSection number={1} title="Personal Details">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormField label="Candidate Name" value={data.personalInfo.name} onChange={(e) => updateField('personalInfo', 'name', e.target.value)} required />
//           <DateField label="Date of Birth" value={data.personalInfo.dob} onChange={(iso) => updateField('personalInfo', 'dob', iso)} required />
//           <FormSelect label="Gender" value={data.personalInfo.gender} onChange={(e) => updateField('personalInfo', 'gender', e.target.value)} options={genderOptions} required />
//           <FormField label="District" value={data.personalInfo.district} onChange={(e) => updateField('personalInfo', 'district', e.target.value)} required />
//           <FormSelect label="Marital Status" value={data.personalInfo.maritalStatus} onChange={(e) => updateField('personalInfo', 'maritalStatus', e.target.value)} options={maritalStatusOptions} required />
//           <FormField label="Mobile Number" type="tel" value={data.personalInfo.mobile} onChange={(e) => updateField('personalInfo', 'mobile', e.target.value)} required />
//           <FormField label="Email Address" type="email" value={data.personalInfo.email} onChange={(e) => updateField('personalInfo', 'email', e.target.value)} required />
//           <FormField label="Father's Name" value={data.personalInfo.fatherName} onChange={(e) => updateField('personalInfo', 'fatherName', e.target.value)} required />
//           <FormField label="Mother's Name" value={data.personalInfo.motherName} onChange={(e) => updateField('personalInfo', 'motherName', e.target.value)} required />
//           <FormField label="Nationality" value={data.personalInfo.nationality} onChange={(e) => updateField('personalInfo', 'nationality', e.target.value)} required />
//           <FormSelect label="Reservation Category" value={data.personalInfo.reservationCategory} onChange={(e) => updateField('personalInfo', 'reservationCategory', e.target.value)} options={reservationOptions} required />
//           <FormSelect label="PWD Status" value={data.personalInfo.pwdStatus} onChange={(e) => updateField('personalInfo', 'pwdStatus', e.target.value)} options={yesNoOptions} required />
//           {data.personalInfo.pwdStatus === 'yes' && (
//             <>
//               <FormField label="Type of Disability" value={data.personalInfo.typeOfDisability} onChange={(e) => updateField('personalInfo', 'typeOfDisability', e.target.value)} required />
//               <FormSelect label="Is 40% or More?" value={data.personalInfo.is40Percent} onChange={(e) => updateField('personalInfo', 'is40Percent', e.target.value)} options={yesNoOptions} required />
//             </>
//           )}
//           <FormSelect label="State Government Employee" value={data.personalInfo.stateGovEmployee} onChange={(e) => updateField('personalInfo', 'stateGovEmployee', e.target.value)} options={yesNoOptions} required />
//           <FormSelect label="Sponsored by Employment Exchange" value={data.personalInfo.sponsoredExchange} onChange={(e) => updateField('personalInfo', 'sponsoredExchange', e.target.value)} options={yesNoOptions} required />
//           <FormField label="Identification Marks" value={data.personalInfo.identificationMarks} onChange={(e) => updateField('personalInfo', 'identificationMarks', e.target.value)} />
//         </div>
//       </FormSection>

//       <FormSection number={2} title="Address Details">
//         <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
//           PERMANENT ADDRESS
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
//           {Object.keys(emptyAddress).map((key) => (
//             <FormField
//               key={`perm-${key}`}
//               label={labelFor(key)}
//               value={(data.address.permanent as any)[key]}
//               onChange={(e) => updateField('address', key, e.target.value, 'permanent')}
//               required
//             />
//           ))}
//         </div>

//         <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none w-fit">
//           <input
//             type="checkbox"
//             checked={data.address.sameAsPermanent}
//             onChange={(e) => handleAddressToggle(e.target.checked)}
//             className="w-4 h-4 rounded"
//             style={{ accentColor: theme.navy }}
//           />
//           <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
//             Correspondence address is same as permanent address
//           </span>
//         </label>

//         {!data.address.sameAsPermanent && (
//           <div>
//             <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
//               CORRESPONDENCE ADDRESS
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {Object.keys(emptyAddress).map((key) => (
//                 <FormField
//                   key={`corr-${key}`}
//                   label={labelFor(key)}
//                   value={(data.address.correspond as any)[key]}
//                   onChange={(e) => updateField('address', key, e.target.value, 'correspond')}
//                   required
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </FormSection>

//       <FormSection number={3} title="Educational Qualifications">
//         <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${theme.border}` }}>
//           <table className="w-full text-left border-collapse min-w-[640px]">
//             <thead>
//               <tr style={{ backgroundColor: theme.navy }}>
//                 <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Level</th>
//                 <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Institution</th>
//                 <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Board / University</th>
//                 <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Year</th>
//                 <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Percentage</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(['10th', '12th', 'graduation', 'postGraduation'] as const).map((level, idx) => (
//                 <tr key={level} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFCFD' }}>
//                   <td className="p-3 font-semibold text-sm capitalize" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
//                     {level === 'postGraduation' ? 'Post-Graduation' : level}
//                   </td>
//                   <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
//                     <input
//                       className="w-full p-2 rounded border text-sm outline-none focus:ring-2"
//                       style={{ borderColor: theme.border }}
//                       value={data.education[level].college}
//                       onChange={(e) => updateField('education', 'college', e.target.value, level)}
//                       placeholder="Institution name"
//                     />
//                   </td>
//                   <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
//                     <input
//                       className="w-full p-2 rounded border text-sm outline-none"
//                       style={{ borderColor: theme.border }}
//                       value={data.education[level].board}
//                       onChange={(e) => updateField('education', 'board', e.target.value, level)}
//                       placeholder="Board / University"
//                     />
//                   </td>
//                   <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
//                     <input
//                       className="w-full p-2 rounded border text-sm outline-none"
//                       style={{ borderColor: theme.border }}
//                       type="number"
//                       value={data.education[level].year}
//                       onChange={(e) => updateField('education', 'year', e.target.value, level)}
//                       placeholder="Year"
//                     />
//                   </td>
//                   <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
//                     <input
//                       className="w-full p-2 rounded border text-sm outline-none"
//                       style={{ borderColor: theme.border }}
//                       type="number"
//                       step="0.01"
//                       value={data.education[level].percentage}
//                       onChange={(e) => updateField('education', 'percentage', e.target.value, level)}
//                       placeholder="%"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </FormSection>

//       <FormSection number={4} title="Teacher Eligibility">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField label="D.Ed Qualification" value={data.teacherEligibility.dedQual} onChange={(e) => updateField('teacherEligibility', 'dedQual', e.target.value)} required />
//           <FormField label="D.Ed Institution" value={data.teacherEligibility.dedInstitution} onChange={(e) => updateField('teacherEligibility', 'dedInstitution', e.target.value)} required />
//           <FormField label="Cross Disability Period" value={data.teacherEligibility.crossDisabilityPeriod} onChange={(e) => updateField('teacherEligibility', 'crossDisabilityPeriod', e.target.value)} placeholder="e.g., 2 years" />
//           <FormField label="RCI Number" value={data.teacherEligibility.rciNumber} onChange={(e) => updateField('teacherEligibility', 'rciNumber', e.target.value)} required />
//         </div>
//       </FormSection>

//       <FormSection number={5} title="Work Experience">
//         <div className="flex justify-end mb-4 -mt-1">
//           <button
//             type="button"
//             onClick={addExperience}
//             className="text-sm font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors"
//             style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
//           >
//             <Plus size={16} /> Add Experience
//           </button>
//         </div>

//         <div className="space-y-4">
//           {data.experience.map((exp, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg relative bg-white"
//               style={{ border: `1px solid ${theme.border}` }}
//             >
//               <FormField label="Designation" value={exp.designation} onChange={(e) => updateExperience(index, 'designation', e.target.value)} required />
//               <FormField label="Service Period" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} placeholder="e.g., 2 years 3 months" required />
//               <FormField label="Reason for Leaving" value={exp.reasonLeaving} onChange={(e) => updateExperience(index, 'reasonLeaving', e.target.value)} />

//               {data.experience.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeExperience(index)}
//                   className="absolute -right-2.5 -top-2.5 p-1.5 rounded-full transition-colors"
//                   style={{ backgroundColor: '#FDEEEC', color: theme.error }}
//                   aria-label="Remove experience"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </FormSection>
//     </div>
//   );
// }

// // ==========================================
// // STEP 2: DOCUMENTS UPLOAD
// // ==========================================
// function Step2Documents({
//   data,
//   setData,
// }: {
//   data: FormState;
//   setData: React.Dispatch<React.SetStateAction<FormState>>;
// }) {
//   const updateField = (category: keyof FormState, field: string, value: any) => {
//     setData((prev) => ({
//       ...prev,
//       [category]: { ...(prev[category] as any), [field]: value },
//     }));
//   };

//   const updateExperience = (index: number, field: keyof Experience, value: any) => {
//     setData((prev) => {
//       const newExperience = [...prev.experience];
//       newExperience[index] = { ...newExperience[index], [field]: value };
//       return { ...prev, experience: newExperience };
//     });
//   };

//   const requiredDocs = ['photograph', 'signature', 'hslcMarksheet'];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
//           Upload Documents
//         </h2>
//         <span
//           className="text-xs font-medium px-3 py-1 rounded-full"
//           style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
//         >
//           Multipart Upload
//         </span>
//       </div>

//       <div
//         className="flex items-start gap-3 p-4 rounded-lg text-sm"
//         style={{ backgroundColor: '#FFF8EC', border: '1px solid #EFDCB4', color: '#8A6416' }}
//       >
//         <AlertCircle size={18} className="shrink-0 mt-0.5" />
//         <div>
//           <p className="font-semibold mb-1">Mandatory documents</p>
//           <p>Photograph, signature and HSLC marksheet must be uploaded before you can continue.</p>
//         </div>
//       </div>

//       <FormSection number={1} title="Identity & Certificate Documents">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {Object.entries(data.documents).map(([key, value]) => (
//             <FileUploadField
//               key={key}
//               label={labelFor(key)}
//               required={requiredDocs.includes(key)}
//               fileName={value?.name}
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) updateField('documents', key, file);
//               }}
//               onClear={() => updateField('documents', key, null)}
//             />
//           ))}
//         </div>
//       </FormSection>

//       <FormSection number={2} title="Teacher Eligibility Certificate">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FileUploadField
//             label="10+2 / Equivalent Qualification Certificate"
//             fileName={data.teacherEligibility.tenPlusTwoCert?.name}
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) updateField('teacherEligibility', 'tenPlusTwoCert', file);
//             }}
//             onClear={() => updateField('teacherEligibility', 'tenPlusTwoCert', null)}
//           />
//         </div>
//       </FormSection>

//       <FormSection number={3} title="Experience Certificates">
//         <div className="space-y-4">
//           {data.experience.map((exp, index) => (
//             <div key={index} className="p-4 rounded-lg bg-white" style={{ border: `1px solid ${theme.border}` }}>
//               <p className="text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>
//                 Experience #{index + 1}
//                 {exp.designation ? ` — ${exp.designation}` : ''}
//               </p>
//               <FileUploadField
//                 label="Upload Certificate"
//                 fileName={exp.certificate?.name}
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) updateExperience(index, 'certificate', file);
//                 }}
//                 onClear={() => updateExperience(index, 'certificate', null)}
//               />
//             </div>
//           ))}
//         </div>
//       </FormSection>
//     </div>
//   );
// }

// // ==========================================
// // STEP 3: PAYMENT
// // ==========================================
// function Step3Payment() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[420px]">
//       <div
//         className="p-8 rounded-2xl max-w-md w-full text-center"
//         style={{ backgroundColor: '#FBFCFD', border: `1px solid ${theme.border}` }}
//       >
//         <div
//           className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
//           style={{ backgroundColor: theme.goldLight }}
//         >
//           <CreditCard size={28} style={{ color: theme.navy }} />
//         </div>
//         <h2 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
//           Application Fee Payment
//         </h2>
//         <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
//           You'll be redirected to a secure payment gateway to complete your transaction.
//         </p>
//         <div className="p-4 rounded-lg bg-white mb-4" style={{ border: `1px solid ${theme.border}` }}>
//           <div className="flex justify-between items-center">
//             <span className="text-sm" style={{ color: theme.textMuted }}>
//               Application Fee
//             </span>
//             <span className="text-2xl font-bold" style={{ color: theme.navy }}>
//               ₹500
//             </span>
//           </div>
//         </div>
//         <p className="text-xs" style={{ color: theme.textMuted }}>
//           🔒 Payments are processed securely and are non-refundable.
//         </p>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // STEP 4: REVIEW
// // ==========================================
// function Step4Review({ data }: { data: FormState }) {
//   const InfoGrid = ({ obj }: { obj: Record<string, any> }) => (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {Object.entries(obj).map(([key, val]) => {
//         if (typeof val === 'object' || typeof val === 'boolean') return null;
//         return (
//           <div key={key} className="flex flex-col">
//             <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
//               {labelFor(key)}
//             </span>
//             <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
//               {String(val) || '—'}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
//         Review & Submit
//       </h2>

//       <FormSection number={1} title="Personal Details">
//         <InfoGrid obj={data.personalInfo} />
//       </FormSection>

//       <FormSection number={2} title="Permanent Address">
//         <InfoGrid obj={data.address.permanent} />
//       </FormSection>

//       {!data.address.sameAsPermanent && (
//         <FormSection number={3} title="Correspondence Address">
//           <InfoGrid obj={data.address.correspond} />
//         </FormSection>
//       )}

//       <FormSection number={4} title="Education">
//         <div className="space-y-2">
//           {Object.entries(data.education).map(([level, details]) => (
//             <div key={level} className="p-3 rounded-lg bg-white flex flex-wrap gap-x-6 gap-y-1" style={{ border: `1px solid ${theme.border}` }}>
//               <span className="font-semibold text-sm capitalize" style={{ color: theme.navy, minWidth: 110 }}>
//                 {level === 'postGraduation' ? 'Post-Graduation' : level}
//               </span>
//               <span className="text-sm" style={{ color: theme.textPrimary }}>
//                 {details.college || '—'} &nbsp;•&nbsp; {details.board || '—'} &nbsp;•&nbsp; Year {details.year || '—'} &nbsp;•&nbsp; {details.percentage || '—'}%
//               </span>
//             </div>
//           ))}
//         </div>
//       </FormSection>

//       <FormSection number={5} title="Teacher Eligibility">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(data.teacherEligibility).map(([key, val]) => (
//             <div key={key} className="flex flex-col">
//               <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
//                 {labelFor(key)}
//               </span>
//               {val instanceof File ? (
//                 <span className="text-sm font-medium flex items-center gap-1" style={{ color: theme.success }}>
//                   <CheckCircle size={13} /> {val.name}
//                 </span>
//               ) : (
//                 <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
//                   {String(val) || '—'}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </FormSection>

//       <FormSection number={6} title="Documents">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(data.documents).map(([key, val]) => (
//             <div key={key} className="flex flex-col">
//               <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
//                 {labelFor(key)}
//               </span>
//               <span
//                 className="text-sm font-medium flex items-center gap-1"
//                 style={{ color: val ? theme.success : theme.error }}
//               >
//                 {val ? (
//                   <>
//                     <CheckCircle size={13} /> {val.name}
//                   </>
//                 ) : (
//                   <>
//                     <AlertCircle size={13} /> Not uploaded
//                   </>
//                 )}
//               </span>
//             </div>
//           ))}
//         </div>
//       </FormSection>

//       <FormSection number={7} title="Work Experience">
//         {data.experience.length === 0 ? (
//           <p className="text-sm" style={{ color: theme.textMuted }}>
//             No experience added.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {data.experience.map((exp, idx) => (
//               <div key={idx} className="p-3.5 rounded-lg bg-white" style={{ border: `1px solid ${theme.border}` }}>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   <div>
//                     <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Designation</span>
//                     <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.designation || '—'}</p>
//                   </div>
//                   <div>
//                     <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Duration</span>
//                     <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.duration || '—'}</p>
//                   </div>
//                   <div>
//                     <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Reason for Leaving</span>
//                     <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.reasonLeaving || '—'}</p>
//                   </div>
//                   <div>
//                     <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Certificate</span>
//                     <p
//                       className="text-sm font-medium flex items-center gap-1"
//                       style={{ color: exp.certificate ? theme.success : theme.error }}
//                     >
//                       {exp.certificate ? (
//                         <>
//                           <CheckCircle size={13} /> {exp.certificate.name}
//                         </>
//                       ) : (
//                         <>
//                           <AlertCircle size={13} /> Not uploaded
//                         </>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </FormSection>

//       <div
//         className="flex gap-3 items-start p-4 rounded-lg text-sm"
//         style={{ backgroundColor: '#FFF8EC', border: '1px solid #EFDCB4', color: '#8A6416' }}
//       >
//         <CheckCircle size={18} className="shrink-0 mt-0.5" />
//         <p>Please review all information carefully. Clicking <b>Submit Application</b> will finalize your registration and cannot be undone.</p>
//       </div>
//     </div>
//   );
// }
import React, { useState, useId } from 'react';
import axios from 'axios';
import { Plus, Trash2, FileText, CreditCard, CheckCircle, Upload, Loader2, X, AlertCircle, Calendar, Mail, Phone } from 'lucide-react';
import { process } from 'zod/v4/core';

// ==========================================
// DESIGN TOKENS
// ==========================================
// Forest green + muted gold: a deliberate departure from the generic
// Tailwind-default look, tuned for an official, trustworthy
// government-application feel.
const theme = {
  navy: '#1B5E3F',
  navyDark: '#0F3D28',
  navyLight: '#3D8A63',
  gold: '#B8873D',
  goldLight: '#F3E7D3',
  success: '#2F7A55',
  error: '#C0392B',
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E2E5EA',
  textPrimary: '#1A2233',
  textMuted: '#6B7684',
};

// --- TYPES & INTERFACES ---
type Address = {
  village: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
  policeStation: string;
};

type EducationLevel = {
  college: string;
  board: string;
  year: string;
  percentage: string;
};

type Experience = {
  designation: string;
  duration: string;
  certificate: File | null;
  reasonLeaving: string;
};

interface FormState {
  personalInfo: {
    name: string;
    dob: string;
    gender: string;
    district: string;
    maritalStatus: string;
    mobile: string;
    email: string;
    fatherName: string;
    motherName: string;
    nationality: string;
    reservationCategory: string;
    pwdStatus: string;
    typeOfDisability: string;
    is40Percent: string;
    stateGovEmployee: string;
    sponsoredExchange: string;
    identificationMarks: string;
  };
  address: {
    permanent: Address;
    correspond: Address;
    sameAsPermanent: boolean;
  };
  documents: {
    photograph: File | null;
    signature: File | null;
    eligibilityCert: File | null;
    permanentResCert: File | null;
    domicileCert: File | null;
    hslcMarksheet: File | null;
    hslcProvCert: File | null;
    nocCert: File | null;
    reservationCert: File | null;
  };
  education: {
    '10th': EducationLevel;
    '12th': EducationLevel;
    graduation: EducationLevel;
    postGraduation: EducationLevel;
  };
  teacherEligibility: {
    tenPlusTwoCert: File | null;
    tenPlusTwoTrack: string;
    dedQual: string;
    dedInstitution: string;
    crossDisabilityPeriod: string;
    rciNumber: string;
    trainingNotAvailable: boolean;
    tet1Passed: boolean;
  };
  experience: Experience[];
}

const emptyAddress: Address = {
  village: '',
  city: '',
  state: '',
  district: '',
  pincode: '',
  policeStation: '',
};

const emptyEducation: EducationLevel = {
  college: '',
  board: '',
  year: '',
  percentage: '',
};

const initialState: FormState = {
  personalInfo: {
    name: '',
    dob: '',
    gender: '',
    district: '',
    maritalStatus: '',
    mobile: '',
    email: '',
    fatherName: '',
    motherName: '',
    nationality: '',
    reservationCategory: '',
    pwdStatus: 'no',
    typeOfDisability: '',
    is40Percent: 'no',
    stateGovEmployee: 'no',
    sponsoredExchange: 'no',
    identificationMarks: '',
  },
  address: {
    permanent: { ...emptyAddress },
    correspond: { ...emptyAddress },
    sameAsPermanent: false,
  },
  documents: {
    photograph: null,
    signature: null,
    eligibilityCert: null,
    permanentResCert: null,
    domicileCert: null,
    hslcMarksheet: null,
    hslcProvCert: null,
    nocCert: null,
    reservationCert: null,
  },
  education: {
    '10th': { ...emptyEducation },
    '12th': { ...emptyEducation },
    graduation: { ...emptyEducation },
    postGraduation: { ...emptyEducation },
  },
  teacherEligibility: {
    tenPlusTwoCert: null,
    tenPlusTwoTrack: '',
    dedQual: '',
    dedInstitution: '',
    crossDisabilityPeriod: '',
    rciNumber: '',
    trainingNotAvailable: false,
    tet1Passed: false,
  },
  experience: [
    {
      designation: '',
      duration: '',
      certificate: null,
      reasonLeaving: '',
    },
  ],
};

// Human-readable labels for keys that don't read well auto-capitalized
const FIELD_LABELS: Record<string, string> = {
  village: 'Village / Locality',
  city: 'City / Town',
  state: 'State',
  district: 'District',
  pincode: 'PIN Code',
  policeStation: 'Police Station',
  photograph: 'Photograph',
  signature: 'Signature',
  eligibilityCert: 'Eligibility Certificate',
  permanentResCert: 'Permanent Residence Certificate',
  domicileCert: 'Domicile Certificate',
  hslcMarksheet: 'HSLC Marksheet',
  hslcProvCert: 'HSLC Provisional Certificate',
  nocCert: 'No Objection Certificate',
  reservationCert: 'Reservation Certificate',
  tenPlusTwoTrack: '10+2 / Equivalent Qualification Track',
  dedQual: 'D.Ed. / D.El.Ed. Qualification',
  dedInstitution: 'D.Ed. / D.El.Ed. Institute',
  rciNumber: 'RCI CRR Number',
  crossDisabilityPeriod: 'Cross-disability Inclusive Education Training Period (Months)',
  trainingNotAvailable: 'Training Deferment Acknowledged',
  tet1Passed: 'TET-1 Passed',
};

const labelFor = (key: string) =>
  FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [successModal, setSuccessModal] = useState<{ referenceNumber: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    window.clearTimeout((window as any)._toastTimeout);
    (window as any)._toastTimeout = window.setTimeout(() => setToast(null), 4000);
  };

  // Explicitly forces connection to the local backend for debugging, ignoring AWS
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

  // --- STEP 1: Submit Application Data (JSON) ---
  const submitStep1 = async () => {
    const token = localStorage.getItem('accessToken');

    const step1Payload = {
      personalInfo: formData.personalInfo,
      address: formData.address,
      education: formData.education,
      teacherEligibility: { // Fixed typo from teachereligibilit
        tenPlusTwoTrack: formData.teacherEligibility.tenPlusTwoTrack,
        dedQual: formData.teacherEligibility.dedQual,
        dedInstitution: formData.teacherEligibility.dedInstitution,
        crossDisabilityPeriod: formData.teacherEligibility.crossDisabilityPeriod,
        rciNumber: formData.teacherEligibility.rciNumber,
        trainingNotAvailable: formData.teacherEligibility.trainingNotAvailable,
        tet1Passed: formData.teacherEligibility.tet1Passed,
      },
      experience: formData.experience.map((exp) => ({
        designation: exp.designation,
        duration: exp.duration,
        reasonLeaving: exp.reasonLeaving,
      })),
    };

    const response = await axios.patch(`${BASE_URL}/auth/candidate/step-1`, step1Payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  // --- STEP 2: Upload Documents (FormData with files) ---
  const submitStep2 = async (applicationId: string) => {
    const token = localStorage.getItem('accessToken');
    const formDataToSend = new FormData();

    Object.entries(formData.documents).forEach(([key, file]) => {
      if (file) formDataToSend.append(key, file);
    });

    if (formData.teacherEligibility.tenPlusTwoCert) {
      formDataToSend.append('tenPlusTwoCert', formData.teacherEligibility.tenPlusTwoCert);
    }

    formData.experience.forEach((exp, index) => {
      if (exp.certificate) formDataToSend.append(`experienceCert_${index}`, exp.certificate);
    });

    formDataToSend.append('applicationId', applicationId);

    const response = await axios.post(`${BASE_URL}/auth/candidate/step-2`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  // --- STEP 3: Initiate Payment ---
  const initiatePayment = async (applicationId: string) => {
    const token = localStorage.getItem('accessToken');

    const response = await axios.post(
      `${BASE_URL}/payment/initiate`,
      { applicationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  };

  // --- STEP 4: Final Submit ---
  const finalSubmit = async (applicationId: string) => {
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${BASE_URL}/application/${applicationId}/final-submit`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };


  // --- Navigation Handlers ---
  const handleNext = async () => {
    if (step === 1) {
      if (!formData.teacherEligibility.tet1Passed) {
        showToast('Please confirm you have passed TET-1 before continuing.', 'error');
        return;
      }
      try {
        setIsProcessing(true);
        const response = await submitStep1();
        if (response.success) {
          setApplicationId(response.data.applicationId);
          setStep(2);
        }
      } catch (error: any) {
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors
            .map((e: any) => `${e.field}: ${e.message}`)
            .join(' • ');
          showToast(errorMessages, 'error');
        } else if (error.response?.data?.message) {
          showToast(error.response.data.message, 'error');
        } else {
          showToast('Something went wrong. Please try again.', 'error');
        }
      } finally {
        setIsProcessing(false);
      }
    } else if (step === 2) {
      try {
        setIsProcessing(true);
        if (!applicationId) {
          showToast('Application ID is missing. Please go back and submit step 1 again.', 'error');
          return;
        }
        const response = await submitStep2(applicationId);
        if (response.success) setStep(3);
      } catch (error: any) {
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors
            .map((e: any) => `${e.field}: ${e.message}`)
            .join(' • ');
          showToast(errorMessages, 'error');
        } else {
          showToast('Failed to upload documents. Please try again.', 'error');
        }
      } finally {
        setIsProcessing(false);
      }
    } else if (step === 3) {
      try {
        setIsProcessing(true);
        if (!applicationId) {
          showToast('Application ID is missing.', 'error');
          return;
        }
        const response = await initiatePayment(applicationId);
        if (response.success) {
          window.location.href = response.data.paymentUrl;
        }
      } catch (error: any) {
        const serverMessage: string = error.response?.data?.message || '';
        const alreadyPaid = serverMessage.toLowerCase().includes('already been completed') ||
          serverMessage.toLowerCase().includes('already paid');

        if (alreadyPaid) {
          showToast('Payment has already been completed for this application.', 'success');
          setStep(4);
        } else if (serverMessage) {
          showToast(serverMessage, 'error');
        } else {
          showToast('Failed to initiate payment. Please try again.', 'error');
        }
      } finally {
        setIsProcessing(false);
      }
    } else if (step === 4) {
      try {
        setIsProcessing(true);
        if (!applicationId) {
          showToast('Application ID is missing.', 'error');
          return;
        }
        const response = await finalSubmit(applicationId);
        if (response.success) {
          const referenceNumber = response.data?.applicationReferenceNumber;
          setSuccessModal({ referenceNumber });
        }
      } catch (error) {
        showToast('Failed to submit application.', 'error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { num: 1, label: 'Application', icon: FileText },
    { num: 2, label: 'Documents', icon: Upload },
    { num: 3, label: 'Payment', icon: CreditCard },
    { num: 4, label: 'Review', icon: CheckCircle },
  ];

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: theme.bg, ['--navy' as any]: theme.navy, ['--gold' as any]: theme.gold }}
    >
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <SuccessModal
        data={successModal}
        onClose={() => {
          window.location.href = '/';
        }}
      />
      <div
        className="max-w-6xl mx-auto rounded-2xl overflow-hidden"
        style={{ backgroundColor: theme.surface, boxShadow: '0 1px 2px rgba(20,30,50,0.04), 0 12px 32px -12px rgba(20,30,50,0.12)' }}
      >
        {/* Header band */}
        <div className="px-8 pt-8 pb-6" style={{ backgroundColor: theme.navy }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: theme.goldLight }}>
            Teacher Recruitment Portal
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">Candidate Application</h1>
        </div>

        {/* Stepper */}
        <div className="px-8 pt-8">
          <StepIndicator steps={steps} current={step} />
        </div>

        <div className="px-8 pb-2 pt-6 min-h-[500px]">
          {step === 1 && <Step1Application data={formData} setData={setFormData} />}
          {step === 2 && <Step2Documents data={formData} setData={setFormData} />}
          {step === 3 && <Step3Payment />}
          {step === 4 && <Step4Review data={formData} />}
        </div>

        {/* Footer nav */}
        <div className="flex justify-between items-center px-8 py-6 mt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={handlePrev}
            disabled={step === 1 || isProcessing}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
            style={
              step === 1
                ? { backgroundColor: '#EEF0F3', color: '#B3B9C2' }
                : { backgroundColor: '#EEF0F3', color: theme.textPrimary }
            }
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isProcessing}
            className="px-7 py-2.5 rounded-lg font-semibold text-sm text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: step === 3 ? theme.gold : theme.navy }}
          >
            {isProcessing && <Loader2 className="animate-spin" size={16} />}
            {step === 4 ? 'Submit Application' : step === 3 ? 'Proceed to Pay' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUCCESS MODAL
// ==========================================
function SuccessModal({
  data,
  onClose,
}: {
  data: { referenceNumber: string } | null;
  onClose: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!data) return;
    setSecondsLeft(6);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 61, 40, 0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: theme.surface, boxShadow: '0 24px 60px -12px rgba(15,61,40,0.4)' }}
      >
        <div className="pt-9 pb-7 px-7 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#E7F4EC' }}
          >
            <CheckCircle size={34} style={{ color: theme.success }} />
          </div>

          <h2 id="success-modal-title" className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Application Submitted Successfully
          </h2>
          <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
            Your application has been received. Please save your reference number for future tracking.
          </p>

          <div
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 mb-6"
            style={{ backgroundColor: theme.goldLight, border: `1px solid #E3CB9C` }}
          >
            <div className="text-left min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: theme.navyDark }}>
                Reference Number
              </p>
              <p className="text-base font-bold tracking-wide truncate" style={{ color: theme.navy }}>
                {data.referenceNumber || 'N/A'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: theme.navy, color: '#fff' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors"
            style={{ backgroundColor: theme.navy }}
          >
            Go to Homepage
          </button>
          <p className="text-xs mt-3" style={{ color: theme.textMuted }}>
            Redirecting automatically in {secondsLeft}s…
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function Toast({
  toast,
  onDismiss,
}: {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  const palette = {
    success: { bg: '#F1F8F4', border: '#BEE3CC', text: theme.success, Icon: CheckCircle },
    error: { bg: '#FDEEEC', border: '#F1C3BC', text: theme.error, Icon: AlertCircle },
    info: { bg: theme.goldLight, border: '#E3CB9C', text: theme.navyDark, Icon: AlertCircle },
  }[toast.type];

  const { Icon } = palette;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 right-6 z-50 flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-xl shadow-lg max-w-sm animate-in fade-in slide-in-from-top-2"
      style={{ backgroundColor: palette.bg, border: `1px solid ${palette.border}` }}
    >
      <Icon size={18} style={{ color: palette.text }} className="shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-snug" style={{ color: palette.text }}>
        {toast.message}
      </p>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-full p-0.5 hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X size={14} style={{ color: palette.text }} />
      </button>
    </div>
  );
}

// ==========================================
// STEP INDICATOR
// ==========================================
function StepIndicator({
  steps,
  current,
}: {
  steps: { num: number; label: string; icon: any }[];
  current: number;
}) {
  const progressPct = ((current - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative pb-8">
      {/* Track */}
      <div className="absolute top-5 left-0 right-0 h-[2px] mx-10" style={{ backgroundColor: theme.border }} />
      <div
        className="absolute top-5 left-0 h-[2px] mx-10 transition-all duration-500"
        style={{ backgroundColor: theme.gold, width: `calc(${progressPct}% - ${progressPct > 0 ? '0px' : '0px'})`, maxWidth: 'calc(100% - 80px)' }}
      />
      <div className="flex justify-between relative">
        {steps.map((s) => {
          const isDone = current > s.num;
          const isActive = current === s.num;
          return (
            <div key={s.num} className="flex flex-col items-center gap-2 z-10" style={{ width: 80 }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                style={{
                  backgroundColor: isDone || isActive ? theme.navy : theme.surface,
                  borderColor: isDone || isActive ? theme.navy : theme.border,
                  color: isDone || isActive ? '#fff' : theme.textMuted,
                  boxShadow: isActive ? `0 0 0 4px ${theme.goldLight}` : 'none',
                }}
              >
                {isDone ? <CheckCircle size={18} /> : <s.icon size={18} />}
              </div>
              <span
                className="text-xs font-semibold text-center"
                style={{ color: isActive || isDone ? theme.textPrimary : theme.textMuted }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// SHARED FORM PRIMITIVES
// ==========================================

/**
 * Outlined label input — stacking naturally above the border.
 * Focus lifts the border to navy with a soft gold glow; icons hint at the field's
 * data type (mail, phone) for quicker scanning on a long form.
 */
function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? theme.error : focused ? theme.navy : theme.border;
  const Icon = type === 'email' ? Mail : type === 'tel' ? Phone : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wide"
        style={{ color: error ? theme.error : focused ? theme.navy : theme.textPrimary }}
      >
        {label} {required && <span style={{ color: theme.gold }}>*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focused ? theme.navy : theme.textMuted }}
          />
        )}
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border-2 bg-white py-2.5 text-sm outline-none transition-all duration-150"
          style={{
            borderColor,
            color: theme.textPrimary,
            paddingLeft: Icon ? '2.25rem' : '0.9rem',
            paddingRight: '0.9rem',
            boxShadow: focused ? `0 0 0 4px ${error ? '#F8DEDA' : theme.goldLight}` : 'none',
          }}
        />
      </div>
      {error ? (
        <span className="flex items-center gap-1 text-xs" style={{ color: theme.error }}>
          <AlertCircle size={12} /> {error}
        </span>
      ) : placeholder ? null : null}
    </div>
  );
}

/** Select input, stacking naturally above the border */
function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value);
  const borderColor = focused ? theme.navy : theme.border;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wide"
        style={{ color: focused ? theme.navy : theme.textPrimary }}
      >
        {label} {required && <span style={{ color: theme.gold }}>*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full rounded-xl border-2 bg-white pl-3.5 pr-9 py-3 text-sm outline-none appearance-none transition-all duration-150 cursor-pointer"
          style={{
            borderColor,
            color: hasValue ? theme.textPrimary : theme.textMuted,
            boxShadow: focused ? `0 0 0 4px ${theme.goldLight}` : 'none',
          }}
        >
          <option value="" disabled hidden>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Day / Month / Year date field — three linked segment boxes instead
 * of the native browser date picker.
 */
function DateField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (isoValue: string) => void;
  required?: boolean;
}) {
  const [yyyy, mm, dd] = value ? value.split('-') : ['', '', ''];
  const [day, setDay] = useState(dd || '');
  const [month, setMonth] = useState(mm || '');
  const [year, setYear] = useState(yyyy || '');
  const [focused, setFocused] = useState(false);

  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  const emit = (d: string, m: string, y: string) => {
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      onChange(`${y}-${m}-${d}`);
    } else {
      onChange('');
    }
  };

  const handleDay = (raw: string) => {
    const v = raw.replace(/\D/g, '').slice(0, 2);
    setDay(v);
    emit(v, month, year);
    if (v.length === 2) monthRef.current?.focus();
  };

  const handleMonth = (raw: string) => {
    const v = raw.replace(/\D/g, '').slice(0, 2);
    setMonth(v);
    emit(day, v, year);
    if (v.length === 2) yearRef.current?.focus();
  };

  const handleYear = (raw: string) => {
    const v = raw.replace(/\D/g, '').slice(0, 4);
    setYear(v);
    emit(day, month, v);
  };

  const segmentStyle = (filled: boolean): React.CSSProperties => ({
    color: theme.textPrimary,
    borderColor: 'transparent',
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-bold tracking-wide"
        style={{ color: focused ? theme.navy : theme.textPrimary }}
      >
        {label} {required && <span style={{ color: theme.gold }}>*</span>}
      </label>
      <div
        className="relative rounded-xl border-2 bg-white flex items-center gap-1.5 py-2.5 px-3 transition-all duration-150"
        style={{
          borderColor: focused ? theme.navy : theme.border,
          boxShadow: focused ? `0 0 0 4px ${theme.goldLight}` : 'none',
        }}
      >
        <Calendar size={15} style={{ color: focused ? theme.navy : theme.textMuted }} className="shrink-0" />
        <input
          ref={dayRef}
          value={day}
          onChange={(e) => handleDay(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="DD"
          inputMode="numeric"
          maxLength={2}
          className="w-8 text-sm text-center outline-none bg-transparent"
          style={segmentStyle(day.length === 2)}
        />
        <span className="text-sm" style={{ color: theme.border }}>/</span>
        <input
          ref={monthRef}
          value={month}
          onChange={(e) => handleMonth(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="MM"
          inputMode="numeric"
          maxLength={2}
          className="w-8 text-sm text-center outline-none bg-transparent"
          style={segmentStyle(month.length === 2)}
        />
        <span className="text-sm" style={{ color: theme.border }}>/</span>
        <input
          ref={yearRef}
          value={year}
          onChange={(e) => handleYear(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="YYYY"
          inputMode="numeric"
          maxLength={4}
          className="w-14 text-sm text-center outline-none bg-transparent"
          style={segmentStyle(year.length === 4)}
        />
      </div>
    </div>
  );
}

/** Section wrapper with numbered badge + navy accent */
function FormSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl p-6 mb-6"
      style={{ backgroundColor: '#FBFCFD', border: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: theme.navy }}
        >
          {number}
        </span>
        <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

/** Polished file upload control with chosen/empty states */
function FileUploadField({
  label,
  onChange,
  onClear,
  required = false,
  fileName,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  required?: boolean;
  fileName?: string;
}) {
  const hasFile = Boolean(fileName);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-wide" style={{ color: theme.textPrimary }}>
        {label} {required && <span style={{ color: theme.gold }}>*</span>}
      </label>
      <div
        className="relative rounded-lg border border-dashed px-3.5 py-3 flex items-center justify-between gap-2 transition-colors"
        style={{
          borderColor: hasFile ? theme.success : theme.border,
          backgroundColor: hasFile ? '#F1F8F4' : '#FAFBFC',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasFile ? (
            <CheckCircle size={16} style={{ color: theme.success }} className="shrink-0" />
          ) : (
            <Upload size={16} style={{ color: theme.textMuted }} className="shrink-0" />
          )}
          <span
            className="text-xs truncate"
            style={{ color: hasFile ? theme.textPrimary : theme.textMuted, maxWidth: 190 }}
            title={fileName}
          >
            {fileName || 'Choose file (PDF, JPG, PNG)'}
          </span>
        </div>
        {hasFile && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full p-1 hover:bg-black/5 z-10 relative"
            aria-label={`Remove ${label}`}
          >
            <X size={14} style={{ color: theme.textMuted }} />
          </button>
        ) : null}
        <input
          type="file"
          onChange={onChange}
          required={required}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

// ==========================================
// STEP 1: APPLICATION (JSON Data)
// ==========================================
function Step1Application({
  data,
  setData,
}: {
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const updateField = (category: keyof FormState, field: string, value: any, subCategory?: string) => {
    setData((prev) => {
      if (subCategory) {
        const categoryData = prev[category] as any;
        return {
          ...prev,
          [category]: {
            ...categoryData,
            [subCategory]: {
              ...categoryData[subCategory],
              [field]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [category]: {
          ...(prev[category] as any),
          [field]: value,
        },
      };
    });
  };

  const handleAddressToggle = (checked: boolean) => {
    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        sameAsPermanent: checked,
        correspond: checked ? { ...prev.address.permanent } : { ...emptyAddress },
      },
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { designation: '', duration: '', certificate: null, reasonLeaving: '' }],
    }));
  };

  const removeExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const genderOptions = ['Male', 'Female', 'Other',];
  const maritalStatusOptions = ['Married', 'Unmarried', 'Divorced', 'Widowed', ];
  const reservationOptions = ['General', 'OBC(M)','OBC','SC', 'ST','Other'];
  const yesNoOptions = ['yes', 'no'];
  const tenPlusTwoTrackOptions = [
    '10+2 / equivalent with at least 50% marks',
    '10+2 / equivalent under NCTE Regulations, 2002 with at least 45% marks',
  ];
  const dedQualOptions = [
    'D.Ed. in Special Education from RCI approved institute',
    'D.El.Ed. equivalent recognized RCI qualification',
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
          Application Details
        </h2>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
        >
          Saved as JSON
        </span>
      </div>

      <FormSection number={1} title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Candidate Name" value={data.personalInfo.name} onChange={(e) => updateField('personalInfo', 'name', e.target.value)} required />
          <DateField label="Date of Birth" value={data.personalInfo.dob} onChange={(iso) => updateField('personalInfo', 'dob', iso)} required />
          <FormSelect label="Gender" value={data.personalInfo.gender} onChange={(e) => updateField('personalInfo', 'gender', e.target.value)} options={genderOptions} required />
          <FormField label="District" value={data.personalInfo.district} onChange={(e) => updateField('personalInfo', 'district', e.target.value)} required />
          <FormSelect label="Marital Status" value={data.personalInfo.maritalStatus} onChange={(e) => updateField('personalInfo', 'maritalStatus', e.target.value)} options={maritalStatusOptions} required />
          <FormField label="Mobile Number" type="tel" value={data.personalInfo.mobile} onChange={(e) => updateField('personalInfo', 'mobile', e.target.value)} required />
          <FormField label="Email Address" type="email" value={data.personalInfo.email} onChange={(e) => updateField('personalInfo', 'email', e.target.value)} required />
          <FormField label="Father's Name" value={data.personalInfo.fatherName} onChange={(e) => updateField('personalInfo', 'fatherName', e.target.value)} required />
          <FormField label="Mother's Name" value={data.personalInfo.motherName} onChange={(e) => updateField('personalInfo', 'motherName', e.target.value)} required />
          <FormField label="Nationality" value={data.personalInfo.nationality} onChange={(e) => updateField('personalInfo', 'nationality', e.target.value)} required />
          <FormSelect label="Reservation Category" value={data.personalInfo.reservationCategory} onChange={(e) => updateField('personalInfo', 'reservationCategory', e.target.value)} options={reservationOptions} required />
          <FormSelect label="PWD Status" value={data.personalInfo.pwdStatus} onChange={(e) => updateField('personalInfo', 'pwdStatus', e.target.value)} options={yesNoOptions} required />
          {data.personalInfo.pwdStatus === 'yes' && (
            <>
              <FormField label="Type of Disability" value={data.personalInfo.typeOfDisability} onChange={(e) => updateField('personalInfo', 'typeOfDisability', e.target.value)} required />
              <FormSelect label="Is 40% or More?" value={data.personalInfo.is40Percent} onChange={(e) => updateField('personalInfo', 'is40Percent', e.target.value)} options={yesNoOptions} required />
            </>
          )}
          <FormSelect label="State Government Employee" value={data.personalInfo.stateGovEmployee} onChange={(e) => updateField('personalInfo', 'stateGovEmployee', e.target.value)} options={yesNoOptions} required />
          <FormSelect label="Sponsored by Employment Exchange" value={data.personalInfo.sponsoredExchange} onChange={(e) => updateField('personalInfo', 'sponsoredExchange', e.target.value)} options={yesNoOptions} required />
          <FormField label="Identification Marks" value={data.personalInfo.identificationMarks} onChange={(e) => updateField('personalInfo', 'identificationMarks', e.target.value)} />
        </div>
      </FormSection>

      <FormSection number={2} title="Address Details">
        <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
          PERMANENT ADDRESS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {Object.keys(emptyAddress).map((key) => (
            <FormField
              key={`perm-${key}`}
              label={labelFor(key)}
              value={(data.address.permanent as any)[key]}
              onChange={(e) => updateField('address', key, e.target.value, 'permanent')}
              required
            />
          ))}
        </div>

        <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={data.address.sameAsPermanent}
            onChange={(e) => handleAddressToggle(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: theme.navy }}
          />
          <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
            Correspondence address is same as permanent address
          </span>
        </label>

        {!data.address.sameAsPermanent && (
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
              CORRESPONDENCE ADDRESS
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(emptyAddress).map((key) => (
                <FormField
                  key={`corr-${key}`}
                  label={labelFor(key)}
                  value={(data.address.correspond as any)[key]}
                  onChange={(e) => updateField('address', key, e.target.value, 'correspond')}
                  required
                />
              ))}
            </div>
          </div>
        )}
      </FormSection>

      <FormSection number={3} title="Educational Qualifications">
        <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${theme.border}` }}>
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr style={{ backgroundColor: theme.navy }}>
                <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Level</th>
                <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Institution</th>
                <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Board / University</th>
                <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Year</th>
                <th className="p-3 text-xs font-semibold text-white uppercase tracking-wide">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {(['10th', '12th', 'graduation', 'postGraduation'] as const).map((level, idx) => (
                <tr key={level} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFCFD' }}>
                  <td className="p-3 font-semibold text-sm capitalize" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                    {level === 'postGraduation' ? 'Post-Graduation' : level}
                  </td>
                  <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                    <input
                      className="w-full p-2 rounded border text-sm outline-none focus:ring-2"
                      style={{ borderColor: theme.border }}
                      value={data.education[level].college}
                      onChange={(e) => updateField('education', 'college', e.target.value, level)}
                      placeholder="Institution name"
                    />
                  </td>
                  <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                    <input
                      className="w-full p-2 rounded border text-sm outline-none"
                      style={{ borderColor: theme.border }}
                      value={data.education[level].board}
                      onChange={(e) => updateField('education', 'board', e.target.value, level)}
                      placeholder="Board / University"
                    />
                  </td>
                  <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                    <input
                      className="w-full p-2 rounded border text-sm outline-none"
                      style={{ borderColor: theme.border }}
                      type="number"
                      value={data.education[level].year}
                      onChange={(e) => updateField('education', 'year', e.target.value, level)}
                      placeholder="Year"
                    />
                  </td>
                  <td className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                    <input
                      className="w-full p-2 rounded border text-sm outline-none"
                      style={{ borderColor: theme.border }}
                      type="number"
                      step="0.01"
                      value={data.education[level].percentage}
                      onChange={(e) => updateField('education', 'percentage', e.target.value, level)}
                      placeholder="%"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection number={4} title="Teacher Eligibility">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect label="10+2 / Equivalent Qualification Track" value={data.teacherEligibility.tenPlusTwoTrack} onChange={(e) => updateField('teacherEligibility', 'tenPlusTwoTrack', e.target.value)} options={tenPlusTwoTrackOptions} required />
          <FormSelect label="D.Ed. / D.El.Ed. Qualification" value={data.teacherEligibility.dedQual} onChange={(e) => updateField('teacherEligibility', 'dedQual', e.target.value)} options={dedQualOptions} required />
          <FormField label="D.Ed. / D.El.Ed. Institute" value={data.teacherEligibility.dedInstitution} onChange={(e) => updateField('teacherEligibility', 'dedInstitution', e.target.value)} required />
          <FormField label="RCI CRR Number" value={data.teacherEligibility.rciNumber} onChange={(e) => updateField('teacherEligibility', 'rciNumber', e.target.value)} required />
          <div className="flex flex-col gap-1.5">
            <FormField
              label="Cross-disability Inclusive Education Training Period (Months)"
              value={data.teacherEligibility.crossDisabilityPeriod}
              onChange={(e) => updateField('teacherEligibility', 'crossDisabilityPeriod', e.target.value)}
              required={!data.teacherEligibility.trainingNotAvailable}
            />
            <span className="text-xs" style={{ color: theme.textMuted }}>
              Minimum 6 months required unless deferment acknowledgement is selected.
            </span>
          </div>
          <label className="flex items-start gap-2.5 cursor-pointer select-none pt-6">
            <input
              type="checkbox"
              checked={data.teacherEligibility.trainingNotAvailable}
              onChange={(e) => updateField('teacherEligibility', 'trainingNotAvailable', e.target.checked)}
              className="w-4 h-4 rounded mt-0.5 shrink-0"
              style={{ accentColor: theme.navy }}
            />
            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              Yes, training is not available and I undertake to complete it as soon as it is conducted.
            </span>
          </label>
        </div>

        <label className="flex items-start gap-2.5 mt-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={data.teacherEligibility.tet1Passed}
            onChange={(e) => updateField('teacherEligibility', 'tet1Passed', e.target.checked)}
            className="w-4 h-4 rounded mt-0.5 shrink-0"
            style={{ accentColor: theme.error }}
          />
          <span className="text-sm font-bold" style={{ color: theme.error }}>
            Yes, passed Teacher Eligibility Test-1 (TET-1) conducted by the State Government or an NCTE-approved agency.
          </span>
        </label>
      </FormSection>

      <FormSection number={5} title="Work Experience">
        <div className="flex justify-end mb-4 -mt-1">
          <button
            type="button"
            onClick={addExperience}
            className="text-sm font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
          >
            <Plus size={16} /> Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg relative bg-white"
              style={{ border: `1px solid ${theme.border}` }}
            >
              <FormField label="Designation" value={exp.designation} onChange={(e) => updateExperience(index, 'designation', e.target.value)} required />
              <FormField label="Service Period" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} placeholder="e.g., 2 years 3 months" required />
              <FormField label="Reason for Leaving" value={exp.reasonLeaving} onChange={(e) => updateExperience(index, 'reasonLeaving', e.target.value)} />

              {data.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute -right-2.5 -top-2.5 p-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: '#FDEEEC', color: theme.error }}
                  aria-label="Remove experience"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}

// ==========================================
// STEP 2: DOCUMENTS UPLOAD
// ==========================================
function Step2Documents({
  data,
  setData,
}: {
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const updateField = (category: keyof FormState, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [category]: { ...(prev[category] as any), [field]: value },
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const requiredDocs = ['photograph', 'signature', 'hslcMarksheet'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
          Upload Documents
        </h2>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
        >
          Multipart Upload
        </span>
      </div>

      <div
        className="flex items-start gap-3 p-4 rounded-lg text-sm"
        style={{ backgroundColor: '#FFF8EC', border: '1px solid #EFDCB4', color: '#8A6416' }}
      >
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Mandatory documents</p>
          <p>Photograph, signature and HSLC marksheet must be uploaded before you can continue.</p>
        </div>
      </div>

      <FormSection number={1} title="Identity & Certificate Documents">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.documents).map(([key, value]) => (
            <FileUploadField
              key={key}
              label={labelFor(key)}
              required={requiredDocs.includes(key)}
              fileName={value?.name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateField('documents', key, file);
              }}
              onClear={() => updateField('documents', key, null)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection number={2} title="Teacher Eligibility Certificate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField
            label="10+2 / Equivalent Qualification Certificate"
            fileName={data.teacherEligibility.tenPlusTwoCert?.name}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateField('teacherEligibility', 'tenPlusTwoCert', file);
            }}
            onClear={() => updateField('teacherEligibility', 'tenPlusTwoCert', null)}
          />
        </div>
      </FormSection>

      <FormSection number={3} title="Experience Certificates">
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg bg-white" style={{ border: `1px solid ${theme.border}` }}>
              <p className="text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>
                Experience #{index + 1}
                {exp.designation ? ` — ${exp.designation}` : ''}
              </p>
              <FileUploadField
                label="Upload Certificate"
                fileName={exp.certificate?.name}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateExperience(index, 'certificate', file);
                }}
                onClear={() => updateExperience(index, 'certificate', null)}
              />
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}

// ==========================================
// STEP 3: PAYMENT
// ==========================================
function Step3Payment() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[420px]">
      <div
        className="p-8 rounded-2xl max-w-md w-full text-center"
        style={{ backgroundColor: '#FBFCFD', border: `1px solid ${theme.border}` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: theme.goldLight }}
        >
          <CreditCard size={28} style={{ color: theme.navy }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Application Fee Payment
        </h2>
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
          You'll be redirected to a secure payment gateway to complete your transaction.
        </p>
        <div className="p-4 rounded-lg bg-white mb-4" style={{ border: `1px solid ${theme.border}` }}>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: theme.textMuted }}>
              Application Fee
            </span>
            <span className="text-2xl font-bold" style={{ color: theme.navy }}>
              ₹500
            </span>
          </div>
        </div>
        <p className="text-xs" style={{ color: theme.textMuted }}>
          🔒 Payments are processed securely and are non-refundable.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// STEP 4: REVIEW
// ==========================================
function Step4Review({ data }: { data: FormState }) {
  const InfoGrid = ({ obj }: { obj: Record<string, any> }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(obj).map(([key, val]) => {
        if (typeof val === 'object' || typeof val === 'boolean') return null;
        return (
          <div key={key} className="flex flex-col">
            <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
              {labelFor(key)}
            </span>
            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              {String(val) || '—'}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2" style={{ color: theme.textPrimary }}>
        Review & Submit
      </h2>

      <FormSection number={1} title="Personal Details">
        <InfoGrid obj={data.personalInfo} />
      </FormSection>

      <FormSection number={2} title="Permanent Address">
        <InfoGrid obj={data.address.permanent} />
      </FormSection>

      {!data.address.sameAsPermanent && (
        <FormSection number={3} title="Correspondence Address">
          <InfoGrid obj={data.address.correspond} />
        </FormSection>
      )}

      <FormSection number={4} title="Education">
        <div className="space-y-2">
          {Object.entries(data.education).map(([level, details]) => (
            <div key={level} className="p-3 rounded-lg bg-white flex flex-wrap gap-x-6 gap-y-1" style={{ border: `1px solid ${theme.border}` }}>
              <span className="font-semibold text-sm capitalize" style={{ color: theme.navy, minWidth: 110 }}>
                {level === 'postGraduation' ? 'Post-Graduation' : level}
              </span>
              <span className="text-sm" style={{ color: theme.textPrimary }}>
                {details.college || '—'} &nbsp;•&nbsp; {details.board || '—'} &nbsp;•&nbsp; Year {details.year || '—'} &nbsp;•&nbsp; {details.percentage || '—'}%
              </span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection number={5} title="Teacher Eligibility">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.teacherEligibility).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
                {labelFor(key)}
              </span>
              {val instanceof File ? (
                <span className="text-sm font-medium flex items-center gap-1" style={{ color: theme.success }}>
                  <CheckCircle size={13} /> {val.name}
                </span>
              ) : (
                <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                  {String(val) || '—'}
                </span>
              )}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection number={6} title="Documents">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.documents).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
                {labelFor(key)}
              </span>
              <span
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: val ? theme.success : theme.error }}
              >
                {val ? (
                  <>
                    <CheckCircle size={13} /> {val.name}
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} /> Not uploaded
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection number={7} title="Work Experience">
        {data.experience.length === 0 ? (
          <p className="text-sm" style={{ color: theme.textMuted }}>
            No experience added.
          </p>
        ) : (
          <div className="space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-white" style={{ border: `1px solid ${theme.border}` }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Designation</span>
                    <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.designation || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Duration</span>
                    <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.duration || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Reason for Leaving</span>
                    <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.reasonLeaving || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Certificate</span>
                    <p
                      className="text-sm font-medium flex items-center gap-1"
                      style={{ color: exp.certificate ? theme.success : theme.error }}
                    >
                      {exp.certificate ? (
                        <>
                          <CheckCircle size={13} /> {exp.certificate.name}
                        </>
                      ) : (
                        <>
                          <AlertCircle size={13} /> Not uploaded
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <div
        className="flex gap-3 items-start p-4 rounded-lg text-sm"
        style={{ backgroundColor: '#FFF8EC', border: '1px solid #EFDCB4', color: '#8A6416' }}
      >
        <CheckCircle size={18} className="shrink-0 mt-0.5" />
        <p>Please review all information carefully. Clicking <b>Submit Application</b> will finalize your registration and cannot be undone.</p>
      </div>
    </div>
  );
}