
// //this is correct version of code 
// import React, { useState, useId, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Plus, Trash2, FileText, CreditCard, CheckCircle, Upload, Loader2, X, 
//   AlertCircle, Calendar, Mail, Phone, CloudUpload, File as FileIcon, Eye,
//   CheckCircle2, Building2, ChevronRight, Smartphone
// } from 'lucide-react';

// // ==========================================
// // DESIGN TOKENS
// // ==========================================
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
//     examCity: string;
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
//     pwdCert: File | null;
//   };
//   education: {
//     '10th': EducationLevel;
//     '12th': EducationLevel;
//     graduation: EducationLevel;
//     postGraduation: EducationLevel;
//   };
//   teacherEligibility: {
//     tenPlusTwoCert: File | null;
//     tenPlusTwoTrack: string;
//     dedQual: string;
//     dedInstitution: string;
//     crossDisabilityPeriod: string;
//     rciNumber: string;
//     trainingNotAvailable: boolean;
//     tet1Passed: boolean;
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
//     examCity: '',
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
//     pwdCert: null,
//   },
//   education: {
//     '10th': { ...emptyEducation },
//     '12th': { ...emptyEducation },
//     graduation: { ...emptyEducation },
//     postGraduation: { ...emptyEducation },
//   },
//   teacherEligibility: {
//     tenPlusTwoCert: null,
//     tenPlusTwoTrack: '',
//     dedQual: '',
//     dedInstitution: '',
//     crossDisabilityPeriod: '',
//     rciNumber: '',
//     trainingNotAvailable: false,
//     tet1Passed: false,
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
//   pwdCert: 'PWD Certificate',
//   tenPlusTwoTrack: '10+2 / Equivalent Qualification Track',
//   dedQual: 'D.Ed. / D.El.Ed. Qualification',
//   dedInstitution: 'D.Ed. / D.El.Ed. Institute',
//   rciNumber: 'RCI CRR Number',
//   crossDisabilityPeriod: 'Cross-disability Inclusive Education Training Period (Months)',
//   trainingNotAvailable: 'Training Deferment Acknowledged',
//   tet1Passed: 'TET-1 Passed',
//   examCity: 'Examination City',
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
//   const [paymentData, setPaymentData] = useState<any>(null);
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//     setToast({ message, type });
//     window.clearTimeout((window as any)._toastTimeout);
//     (window as any)._toastTimeout = window.setTimeout(() => setToast(null), 4000);
//   };

//   const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

//   // Fetch application data on mount
//   useEffect(() => {
//     const fetchApplicationData = async () => {
//       try {
//         setIsLoadingData(true);
//         const token = localStorage.getItem('accessToken');
        
//         if (!token) {
//           setIsLoadingData(false);
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/application/steps/all`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success) {
//           const data = response.data.data;
//           setApplicationId(data.applicationId);
//           setCompletedSteps(data.completedSteps || []);
//           setIsSubmitted(data.isSubmitted || false);
          
//           // Check if we have step data
//           const steps = data.steps || {};
          
//           // Store uploaded document URLs from step2
//           if (steps.step2) {
//             const docUrls: Record<string, string> = {};
//             Object.entries(steps.step2).forEach(([key, value]) => {
//               if (value && typeof value === 'string' && value.startsWith('http')) {
//                 docUrls[key] = value;
//               }
//             });
//             setUploadedDocuments(docUrls);
//           }
          
//           // Auto-fill step 1 data from step0 and step1
//           if (steps.step0 || steps.step1) {
//             const step0 = steps.step0 || {};
//             const step1 = steps.step1 || {};
            
//             // Fill personal info from step0
//             const personalInfoUpdates: any = {};
            
//             if (step0.fullName) personalInfoUpdates.name = step0.fullName;
//             if (step0.dateOfBirth) {
//               // Convert DD-MM-YYYY to YYYY-MM-DD
//               const parts = step0.dateOfBirth.split('-');
//               if (parts.length === 3) {
//                 personalInfoUpdates.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
//               }
//             }
//             if (step0.gender) personalInfoUpdates.gender = step0.gender.charAt(0).toUpperCase() + step0.gender.slice(1);
//             if (step0.emailId) personalInfoUpdates.email = step0.emailId;
//             if (step0.mobileNumber) personalInfoUpdates.mobile = step0.mobileNumber;
//             if (step0.maritalStatus) personalInfoUpdates.maritalStatus = step0.maritalStatus.charAt(0).toUpperCase() + step0.maritalStatus.slice(1);
//             if (step0.nationality) personalInfoUpdates.nationality = step0.nationality;
//             if (step0.selectDistrict) personalInfoUpdates.district = step0.selectDistrict;
//             if (step0.reservationCategory) personalInfoUpdates.reservationCategory = step0.reservationCategory;
//             if (step0.isPwd !== undefined) personalInfoUpdates.pwdStatus = step0.isPwd ? 'yes' : 'no';
//             if (step0.govEmployee !== undefined) personalInfoUpdates.stateGovEmployee = step0.govEmployee ? 'yes' : 'no';
            
//             // Fill from step1 if available
//             if (step1.personalInfo) {
//               const pInfo = step1.personalInfo;
//               if (pInfo.name) personalInfoUpdates.name = pInfo.name;
//               if (pInfo.dob) personalInfoUpdates.dob = pInfo.dob;
//               if (pInfo.gender) personalInfoUpdates.gender = pInfo.gender;
//               if (pInfo.email) personalInfoUpdates.email = pInfo.email;
//               if (pInfo.mobile) personalInfoUpdates.mobile = pInfo.mobile;
//               if (pInfo.district) personalInfoUpdates.district = pInfo.district;
//               if (pInfo.examCity) personalInfoUpdates.examCity = pInfo.examCity;
//               if (pInfo.maritalStatus) personalInfoUpdates.maritalStatus = pInfo.maritalStatus;
//               if (pInfo.fatherName) personalInfoUpdates.fatherName = pInfo.fatherName;
//               if (pInfo.motherName) personalInfoUpdates.motherName = pInfo.motherName;
//               if (pInfo.nationality) personalInfoUpdates.nationality = pInfo.nationality;
//               if (pInfo.reservationCategory) personalInfoUpdates.reservationCategory = pInfo.reservationCategory;
//               if (pInfo.pwdStatus) personalInfoUpdates.pwdStatus = pInfo.pwdStatus;
//               if (pInfo.typeOfDisability) personalInfoUpdates.typeOfDisability = pInfo.typeOfDisability;
//               if (pInfo.is40Percent) personalInfoUpdates.is40Percent = pInfo.is40Percent;
//               if (pInfo.stateGovEmployee) personalInfoUpdates.stateGovEmployee = pInfo.stateGovEmployee;
//               if (pInfo.sponsoredExchange) personalInfoUpdates.sponsoredExchange = pInfo.sponsoredExchange;
//               if (pInfo.identificationMarks) personalInfoUpdates.identificationMarks = pInfo.identificationMarks;
//             }
            
//             // Fill address from step1
//             let addressUpdates: any = null;
//             if (step1.address) {
//               addressUpdates = {
//                 permanent: { ...emptyAddress },
//                 correspond: { ...emptyAddress },
//                 sameAsPermanent: step1.address.sameAsPermanent || false,
//               };
              
//               if (step1.address.permanent) {
//                 addressUpdates.permanent = { ...step1.address.permanent };
//               }
              
//               if (step1.address.correspond) {
//                 addressUpdates.correspond = { ...step1.address.correspond };
//               }
//             }
            
//             // Fill education from step1
//             let educationUpdates: any = null;
//             if (step1.education) {
//               educationUpdates = {
//                 '10th': { ...emptyEducation },
//                 '12th': { ...emptyEducation },
//                 graduation: { ...emptyEducation },
//                 postGraduation: { ...emptyEducation },
//               };
              
//               if (step1.education['10th']) educationUpdates['10th'] = { ...step1.education['10th'] };
//               if (step1.education['12th']) educationUpdates['12th'] = { ...step1.education['12th'] };
//               if (step1.education.graduation) educationUpdates.graduation = { ...step1.education.graduation };
//               if (step1.education.postGraduation) educationUpdates.postGraduation = { ...step1.education.postGraduation };
//             }
            
//             // Fill teacher eligibility from step1
//             let teacherEligibilityUpdates: any = null;
//             if (step1.teachereligibilit) {
//               const te = step1.teachereligibilit;
//               teacherEligibilityUpdates = {
//                 tenPlusTwoTrack: te.tenPlusTwoTrack || '',
//                 dedQual: te.dedQual || '',
//                 dedInstitution: te.dedInstitution || '',
//                 crossDisabilityPeriod: te.crossDisabilityPeriod || '',
//                 rciNumber: te.rciNumber || '',
//                 trainingNotAvailable: te.trainingNotAvailable || false,
//                 tet1Passed: te.tet1Passed || false,
//                 tenPlusTwoCert: null,
//               };
//             }
            
//             // Fill experience from step1
//             let experienceUpdates: any[] = [];
//             if (step1.experience && step1.experience.length > 0) {
//               experienceUpdates = step1.experience.map((exp: any) => ({
//                 designation: exp.designation || '',
//                 duration: exp.duration || '',
//                 reasonLeaving: exp.reasonLeaving || '',
//                 certificate: null,
//               }));
//             }
            
//             // Update form data
//             setFormData((prev) => ({
//               ...prev,
//               personalInfo: {
//                 ...prev.personalInfo,
//                 ...personalInfoUpdates,
//               },
//               address: addressUpdates || prev.address,
//               education: educationUpdates || prev.education,
//               teacherEligibility: teacherEligibilityUpdates || prev.teacherEligibility,
//               experience: experienceUpdates.length > 0 ? experienceUpdates : prev.experience,
//             }));
//           }
          
//           // Check payment data from step3
//           if (steps.step3) {
//             setPaymentData(steps.step3);
//           }
          
//           // Determine current step based on completed steps and status
//           if (data.isSubmitted) {
//             // If application is submitted, go to review
//             setStep(4);
//           } else if (data.status === 'payment_completed' || data.status === 'completed') {
//             // If payment is completed, go to step 4 (Review)
//             // Check if step2 documents are uploaded
//             const step2Data = steps.step2 || {};
//             const hasDocuments = Object.values(step2Data).some((val: any) => val !== null && val !== '');
            
//             if (hasDocuments || data.completedSteps?.includes(2)) {
//               setStep(4);
//             } else {
//               // If no documents but payment completed, go to step 2
//               setStep(2);
//             }
//           } else if (data.currentStep !== undefined && data.currentStep !== null) {
//             // Map backend step numbers to frontend steps
//             const stepMapping: { [key: number]: number } = {
//               0: 1,
//               1: 1,
//               2: 2,
//               3: 3,
//             };
            
//             const frontendStep = stepMapping[data.currentStep] || 1;
//             setStep(frontendStep);
//           }
          
//           setIsDataFetched(true);
//         }
//       } catch (error) {
//         console.error('Failed to fetch application data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     fetchApplicationData();
//   }, []);

//   const submitStep1 = async () => {
//     const token = localStorage.getItem('accessToken');

//     const step1Payload = {
//       personalInfo: formData.personalInfo,
//       address: formData.address,
//       education: formData.education,
//       teacherEligibility: {
//         tenPlusTwoTrack: formData.teacherEligibility.tenPlusTwoTrack,
//         dedQual: formData.teacherEligibility.dedQual,
//         dedInstitution: formData.teacherEligibility.dedInstitution,
//         crossDisabilityPeriod: formData.teacherEligibility.crossDisabilityPeriod,
//         rciNumber: formData.teacherEligibility.rciNumber,
//         trainingNotAvailable: formData.teacherEligibility.trainingNotAvailable,
//         tet1Passed: formData.teacherEligibility.tet1Passed,
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

//   const initiatePayment = async (applicationId: string, paymentMode?: string) => {
//     const token = localStorage.getItem('accessToken');

//     const payload: any = { applicationId };
//     if (paymentMode) {
//       payload.paymentMode = paymentMode;
//     }

//     const response = await axios.post(
//       `${BASE_URL}/payment/initiate`,
//       payload,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     return response.data;
//   };

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

//   const handleNext = async () => {
//     if (step === 1) {
//       if (!formData.teacherEligibility.tet1Passed) {
//         showToast('Please confirm you have passed TET-1 before continuing.', 'error');
//         return;
//       }
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
//         if (response.success) {
//           // Fetch payment data before moving to step 3
//           const paymentResponse = await initiatePayment(applicationId);
//           if (paymentResponse.success) {
//             setPaymentData(paymentResponse.data);
//             setStep(3);
//           }
//         }
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
//       // Payment is handled inside Step3Payment component
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

//   if (isLoadingData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
//         <div className="text-center">
//           <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{ color: theme.navy }} />
//           <p className="text-sm" style={{ color: theme.textMuted }}>Loading your application...</p>
//         </div>
//       </div>
//     );
//   }

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
//         <div className="px-8 pt-8 pb-6" style={{ backgroundColor: theme.navy }}>
//           <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: theme.goldLight }}>
//             Teacher Recruitment Portal
//           </p>
//           <h1 className="text-2xl font-bold text-white mt-1">Candidate Application</h1>
//         </div>

//         <div className="px-8 pt-8">
//           <StepIndicator steps={steps} current={step} />
//         </div>

//         <div className="px-8 pb-2 pt-6 min-h-[500px]">
//           {step === 1 && <Step1Application data={formData} setData={setFormData} isDataFetched={isDataFetched} />}
//           {step === 2 && <Step2Documents data={formData} setData={setFormData} />}
//           {step === 3 && <Step3Payment 
//             paymentData={paymentData} 
//             applicationId={applicationId}
//             onPaymentSuccess={() => setStep(4)}
//             showToast={showToast}
//             initiatePayment={initiatePayment}
//           />}
//           {step === 4 && <Step4Review 
//             data={formData} 
//             uploadedDocuments={uploadedDocuments}
//             isSubmitted={isSubmitted}
//           />}
//         </div>

//         <div className="flex justify-between items-center px-8 py-6 mt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
//           <button
//             onClick={handlePrev}
//             disabled={step === 1 || isProcessing || (step === 4 && isSubmitted)}
//             className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
//             style={
//               step === 1 || (step === 4 && isSubmitted)
//                 ? { backgroundColor: '#EEF0F3', color: '#B3B9C2' }
//                 : { backgroundColor: '#EEF0F3', color: theme.textPrimary }
//             }
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={isProcessing || step === 3 || (step === 4 && isSubmitted)}
//             className="px-7 py-2.5 rounded-lg font-semibold text-sm text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//             style={{ backgroundColor: step === 4 ? (isSubmitted ? '#9ca3af' : theme.gold) : theme.navy }}
//           >
//             {isProcessing && <Loader2 className="animate-spin" size={16} />}
//             {step === 4 ? (isSubmitted ? 'Submitted' : 'Submit Application') : step === 2 ? 'Proceed to Payment' : 'Save & Continue'}
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

// function FormField({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   required = false,
//   placeholder,
//   error,
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   required?: boolean;
//   placeholder?: string;
//   error?: string;
//   disabled?: boolean;
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
//           disabled={disabled}
//           className="w-full rounded-lg border-2 bg-white py-2 px-3.5 text-sm outline-none transition-all duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
//           style={{
//             borderColor,
//             color: disabled ? theme.textMuted : theme.textPrimary,
//             paddingLeft: Icon ? '2.25rem' : '0.9rem',
//             paddingRight: '0.9rem',
//             boxShadow: focused ? `0 0 0 3px ${error ? '#F8DEDA' : theme.goldLight}` : 'none',
//           }}
//         />
//       </div>
//       {error ? (
//         <span className="flex items-center gap-1 text-xs" style={{ color: theme.error }}>
//           <AlertCircle size={12} /> {error}
//         </span>
//       ) : null}
//     </div>
//   );
// }

// function FormSelect({
//   label,
//   value,
//   onChange,
//   options,
//   required = false,
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   options: string[];
//   required?: boolean;
//   disabled?: boolean;
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
//           disabled={disabled}
//           className="w-full rounded-lg border-2 bg-white pl-3.5 pr-9 py-2 text-sm outline-none appearance-none transition-all duration-150 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
//           style={{
//             borderColor,
//             color: hasValue ? theme.textPrimary : theme.textMuted,
//             boxShadow: focused ? `0 0 0 3px ${theme.goldLight}` : 'none',
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

// function DateField({
//   label,
//   value,
//   onChange,
//   required = false,
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (isoValue: string) => void;
//   required?: boolean;
//   disabled?: boolean;
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
//     if (disabled) return;
//     const v = raw.replace(/\D/g, '').slice(0, 2);
//     setDay(v);
//     emit(v, month, year);
//     if (v.length === 2) monthRef.current?.focus();
//   };

//   const handleMonth = (raw: string) => {
//     if (disabled) return;
//     const v = raw.replace(/\D/g, '').slice(0, 2);
//     setMonth(v);
//     emit(day, v, year);
//     if (v.length === 2) yearRef.current?.focus();
//   };

//   const handleYear = (raw: string) => {
//     if (disabled) return;
//     const v = raw.replace(/\D/g, '').slice(0, 4);
//     setYear(v);
//     emit(day, month, v);
//   };

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label
//         className="text-xs font-bold tracking-wide"
//         style={{ color: focused ? theme.navy : theme.textPrimary }}
//       >
//         {label} {required && <span style={{ color: theme.gold }}>*</span>}
//       </label>
//       <div
//         className="relative rounded-lg border-2 bg-white flex items-center gap-1.5 py-2 px-3 transition-all duration-150 disabled:bg-gray-100"
//         style={{
//           borderColor: focused ? theme.navy : theme.border,
//           boxShadow: focused ? `0 0 0 3px ${theme.goldLight}` : 'none',
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
//           disabled={disabled}
//           className="w-8 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
//           style={{ color: theme.textPrimary }}
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
//           disabled={disabled}
//           className="w-8 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
//           style={{ color: theme.textPrimary }}
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
//           disabled={disabled}
//           className="w-14 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
//           style={{ color: theme.textPrimary }}
//         />
//       </div>
//     </div>
//   );
// }

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

// // ==========================================
// // UPDATED: FileUploadField with Preview
// // ==========================================
// function FileUploadField({
//   label,
//   required = false,
//   fileName,
//   fileData,
//   onChange,
//   onClear,
//   disabled = false,
// }: {
//   label: string;
//   required?: boolean;
//   fileName?: string;
//   fileData?: File | null;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onClear: () => void;
//   disabled?: boolean;
// }) {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [showPreview, setShowPreview] = useState(false);

//   useEffect(() => {
//     if (fileData) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(fileData);
//     } else {
//       setPreview(null);
//     }
//   }, [fileData]);

//   const isImage = fileData?.type?.startsWith('image/');
//   const isPDF = fileData?.type === 'application/pdf';

//   return (
//     <div className="flex flex-col gap-2">
//       {label && (
//         <label className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
//           {label} {required && <span style={{ color: theme.error }}>*</span>}
//         </label>
//       )}

//       <div
//         className="relative flex flex-col items-center justify-center p-6 text-center rounded-xl transition-all"
//         style={{
//           backgroundColor: disabled ? '#f3f4f6' : '#E8F5E9',
//           border: `2px dashed ${disabled ? '#d1d5db' : '#81C784'}`,
//           minHeight: '160px',
//         }}
//       >
//         {fileName ? (
//           <div className="flex flex-col items-center gap-2 z-10 relative w-full">
//             {isImage && preview && (
//               <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
//             )}
//             {isPDF && (
//               <FileIcon className="w-8 h-8" style={{ color: '#D32F2F' }} />
//             )}
//             {!isImage && !isPDF && (
//               <FileIcon className="w-8 h-8" style={{ color: theme.navy }} />
//             )}
//             <span className="text-sm font-medium break-all px-4 max-w-full" style={{ color: theme.textPrimary }}>
//               {fileName}
//             </span>
//             <div className="flex gap-2 mt-1">
//               {preview && (
//                 <button
//                   type="button"
//                   onClick={() => setShowPreview(true)}
//                   className="px-3 py-1.5 bg-white border rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-sm hover:bg-gray-50"
//                   style={{ borderColor: theme.border, color: theme.textMuted }}
//                 >
//                   <Eye size={14} /> Preview
//                 </button>
//               )}
//               {!disabled && (
//                 <button
//                   type="button"
//                   onClick={onClear}
//                   className="px-3 py-1.5 bg-white border rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-sm hover:bg-gray-50"
//                   style={{ borderColor: theme.border, color: theme.textMuted }}
//                 >
//                   <X size={14} /> Remove
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <>
//             {!disabled && (
//               <input
//                 type="file"
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                 onChange={onChange}
//                 accept=".jpeg,.jpg,.png,.pdf"
//               />
//             )}
            
//             <div className="flex flex-col items-center pointer-events-none">
//               <CloudUpload className="w-8 h-8 mb-3 stroke-[2.5]" style={{ color: disabled ? '#9ca3af' : '#388E3C' }} />
              
//               <p className="font-semibold text-[15px] mb-1.5" style={{ color: disabled ? '#9ca3af' : theme.textPrimary }}>
//                 {disabled ? 'No file uploaded' : 'Choose a file or drag & drop it here'}
//               </p>
              
//               <p className="text-xs mb-4 font-medium" style={{ color: theme.textMuted }}>
//                 JPEG, PNG, PDF formats, up to 5MB
//               </p>
              
//               {!disabled && (
//                 <div 
//                   className="flex items-center gap-2 px-5 py-1.5 bg-white rounded-lg border text-sm font-semibold shadow-sm"
//                   style={{ borderColor: '#388E3C', color: '#388E3C' }}
//                 >
//                   Browse <FileIcon size={16} className="stroke-[2.5]" />
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Preview Modal */}
//       {showPreview && preview && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-4"
//           style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
//           onClick={() => setShowPreview(false)}
//         >
//           <div className="max-w-2xl max-h-[90vh] bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-end mb-2">
//               <button
//                 onClick={() => setShowPreview(false)}
//                 className="p-1 hover:bg-gray-100 rounded-full"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             {isImage ? (
//               <img src={preview} alt="Preview" className="max-w-full max-h-[70vh] object-contain" />
//             ) : (
//               <iframe src={preview} className="w-full h-[70vh]" title="Preview" />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ==========================================
// // STEP 1: APPLICATION (JSON Data)
// // ==========================================
// function Step1Application({
//   data,
//   setData,
//   isDataFetched = false,
// }: {
//   data: FormState;
//   setData: React.Dispatch<React.SetStateAction<FormState>>;
//   isDataFetched?: boolean;
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

//   // Copy permanent address to correspond when permanent address changes
//   useEffect(() => {
//     if (data.address.sameAsPermanent) {
//       setData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           correspond: { ...prev.address.permanent },
//         },
//       }));
//     }
//   }, [data.address.permanent, data.address.sameAsPermanent]);

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

//   const genderOptions = ['Male', 'Female', 'Other'];
//   const maritalStatusOptions = ['Married', 'Unmarried', 'Divorced', 'Widowed'];
//   const reservationOptions = ['General', 'OBC(M)', 'OBC', 'SC', 'ST', 'Other'];
//   const yesNoOptions = ['yes', 'no'];
//   const examCityOptions = ['Lucknow', 'Bihar', 'Gorakhpur', 'Varanasi', 'Allahabad', 'Agra'];
//   const tenPlusTwoTrackOptions = [
//     '10+2 / equivalent with at least 50% marks',
//     '10+2 / equivalent under NCTE Regulations, 2002 with at least 45% marks',
//   ];
//   const dedQualOptions = [
//     'D.Ed. in Special Education from RCI approved institute',
//     'D.El.Ed. equivalent recognized RCI qualification',
//   ];

//   // Check if fields should be disabled (when data is fetched from API)
//   const isDisabled = (field: string) => {
//     if (!isDataFetched) return false;
//     // These fields come from step0 and should be disabled
//     const step0Fields = ['name', 'dob', 'gender', 'mobile', 'email', 'maritalStatus', 'nationality', 'district'];
//     return step0Fields.includes(field);
//   };

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
//           {isDataFetched ? 'Auto-filled from previous data' : 'New Application'}
//         </span>
//       </div>

//       <FormSection number={1} title="Personal Details">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <FormField 
//             label="Candidate Name" 
//             value={data.personalInfo.name} 
//             onChange={(e) => updateField('personalInfo', 'name', e.target.value)} 
//             required 
//             disabled={isDisabled('name')}
//           />
//           <DateField 
//             label="Date of Birth" 
//             value={data.personalInfo.dob} 
//             onChange={(iso) => updateField('personalInfo', 'dob', iso)} 
//             required 
//             disabled={isDisabled('dob')}
//           />
//           <FormSelect 
//             label="Gender" 
//             value={data.personalInfo.gender} 
//             onChange={(e) => updateField('personalInfo', 'gender', e.target.value)} 
//             options={genderOptions} 
//             required 
//             disabled={isDisabled('gender')}
//           />
//           <FormSelect 
//             label="Examination City" 
//             value={data.personalInfo.examCity} 
//             onChange={(e) => updateField('personalInfo', 'examCity', e.target.value)} 
//             options={examCityOptions} 
//             required 
//           />
//           <FormField 
//             label="District" 
//             value={data.personalInfo.district} 
//             onChange={(e) => updateField('personalInfo', 'district', e.target.value)} 
//             required 
//             disabled={isDisabled('district')}
//           />
//           <FormSelect 
//             label="Marital Status" 
//             value={data.personalInfo.maritalStatus} 
//             onChange={(e) => updateField('personalInfo', 'maritalStatus', e.target.value)} 
//             options={maritalStatusOptions} 
//             required 
//             disabled={isDisabled('maritalStatus')}
//           />
//           <FormField 
//             label="Mobile Number" 
//             type="tel" 
//             value={data.personalInfo.mobile} 
//             onChange={(e) => updateField('personalInfo', 'mobile', e.target.value)} 
//             required 
//             disabled={isDisabled('mobile')}
//           />
//           <FormField 
//             label="Email Address" 
//             type="email" 
//             value={data.personalInfo.email} 
//             onChange={(e) => updateField('personalInfo', 'email', e.target.value)} 
//             required 
//             disabled={isDisabled('email')}
//           />
//           <FormField 
//             label="Father's Name" 
//             value={data.personalInfo.fatherName} 
//             onChange={(e) => updateField('personalInfo', 'fatherName', e.target.value)} 
//             required 
//           />
//           <FormField 
//             label="Mother's Name" 
//             value={data.personalInfo.motherName} 
//             onChange={(e) => updateField('personalInfo', 'motherName', e.target.value)} 
//             required 
//           />
//           <FormField 
//             label="Nationality" 
//             value={data.personalInfo.nationality} 
//             onChange={(e) => updateField('personalInfo', 'nationality', e.target.value)} 
//             required 
//             disabled={isDisabled('nationality')}
//           />
//           <FormSelect 
//             label="Reservation Category" 
//             value={data.personalInfo.reservationCategory} 
//             onChange={(e) => updateField('personalInfo', 'reservationCategory', e.target.value)} 
//             options={reservationOptions} 
//             required 
//           />
//           <FormSelect 
//             label="PWD Status" 
//             value={data.personalInfo.pwdStatus} 
//             onChange={(e) => updateField('personalInfo', 'pwdStatus', e.target.value)} 
//             options={yesNoOptions} 
//             required 
//           />
//           {data.personalInfo.pwdStatus === 'yes' && (
//             <>
//               <FormField 
//                 label="Type of Disability" 
//                 value={data.personalInfo.typeOfDisability} 
//                 onChange={(e) => updateField('personalInfo', 'typeOfDisability', e.target.value)} 
//                 required 
//               />
//               <FormSelect 
//                 label="Is 40% or More?" 
//                 value={data.personalInfo.is40Percent} 
//                 onChange={(e) => updateField('personalInfo', 'is40Percent', e.target.value)} 
//                 options={yesNoOptions} 
//                 required 
//               />
//             </>
//           )}
//           <FormSelect 
//             label="State Government Employee" 
//             value={data.personalInfo.stateGovEmployee} 
//             onChange={(e) => updateField('personalInfo', 'stateGovEmployee', e.target.value)} 
//             options={yesNoOptions} 
//             required 
//           />
//           <FormSelect 
//             label="Sponsored by Employment Exchange" 
//             value={data.personalInfo.sponsoredExchange} 
//             onChange={(e) => updateField('personalInfo', 'sponsoredExchange', e.target.value)} 
//             options={yesNoOptions} 
//             required 
//           />
//           <FormField 
//             label="Identification Marks" 
//             value={data.personalInfo.identificationMarks} 
//             onChange={(e) => updateField('personalInfo', 'identificationMarks', e.target.value)} 
//           />
//         </div>
//       </FormSection>

//       <FormSection number={2} title="Address Details">
//         <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
//           PERMANENT ADDRESS
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
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
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
//           <FormSelect 
//             label="10+2 / Equivalent Qualification Track" 
//             value={data.teacherEligibility.tenPlusTwoTrack} 
//             onChange={(e) => updateField('teacherEligibility', 'tenPlusTwoTrack', e.target.value)} 
//             options={tenPlusTwoTrackOptions} 
//             required 
//           />
//           <FormSelect 
//             label="D.Ed. / D.El.Ed. Qualification" 
//             value={data.teacherEligibility.dedQual} 
//             onChange={(e) => updateField('teacherEligibility', 'dedQual', e.target.value)} 
//             options={dedQualOptions} 
//             required 
//           />
//           <FormField 
//             label="D.Ed. / D.El.Ed. Institute" 
//             value={data.teacherEligibility.dedInstitution} 
//             onChange={(e) => updateField('teacherEligibility', 'dedInstitution', e.target.value)} 
//             required 
//           />
//           <FormField 
//             label="RCI CRR Number" 
//             value={data.teacherEligibility.rciNumber} 
//             onChange={(e) => updateField('teacherEligibility', 'rciNumber', e.target.value)} 
//             required 
//           />
//           <div className="flex flex-col gap-1.5">
//             <FormField
//               label="Cross-disability Inclusive Education Training Period (Months)"
//               value={data.teacherEligibility.crossDisabilityPeriod}
//               onChange={(e) => updateField('teacherEligibility', 'crossDisabilityPeriod', e.target.value)}
//               required={!data.teacherEligibility.trainingNotAvailable}
//             />
//             <span className="text-xs" style={{ color: theme.textMuted }}>
//               Minimum 6 months required unless deferment acknowledgement is selected.
//             </span>
//           </div>
//           <label className="flex items-start gap-2.5 cursor-pointer select-none pt-6">
//             <input
//               type="checkbox"
//               checked={data.teacherEligibility.trainingNotAvailable}
//               onChange={(e) => updateField('teacherEligibility', 'trainingNotAvailable', e.target.checked)}
//               className="w-4 h-4 rounded mt-0.5 shrink-0"
//               style={{ accentColor: theme.navy }}
//             />
//             <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
//               Yes, training is not available and I undertake to complete it as soon as it is conducted.
//             </span>
//           </label>
//         </div>

//         <label className="flex items-start gap-2.5 mt-5 cursor-pointer select-none">
//           <input
//             type="checkbox"
//             checked={data.teacherEligibility.tet1Passed}
//             onChange={(e) => updateField('teacherEligibility', 'tet1Passed', e.target.checked)}
//             className="w-4 h-4 rounded mt-0.5 shrink-0"
//             style={{ accentColor: theme.error }}
//           />
//           <span className="text-sm font-bold" style={{ color: theme.error }}>
//             Yes, passed Teacher Eligibility Test-1 (TET-1) conducted by the State Government or an NCTE-approved agency.
//           </span>
//         </label>
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
//               <FormField 
//                 label="Designation" 
//                 value={exp.designation} 
//                 onChange={(e) => updateExperience(index, 'designation', e.target.value)} 
//                 required 
//               />
//               <FormField 
//                 label="Service Period" 
//                 value={exp.duration} 
//                 onChange={(e) => updateExperience(index, 'duration', e.target.value)} 
//                 placeholder="e.g., 2 years 3 months" 
//                 required 
//               />
//               <FormField 
//                 label="Reason for Leaving" 
//                 value={exp.reasonLeaving} 
//                 onChange={(e) => updateExperience(index, 'reasonLeaving', e.target.value)} 
//               />

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
// // STEP 2: DOCUMENTS UPLOAD with Conditional Fields
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

//   // Get document entries based on conditions
//   const getDocumentEntries = () => {
//     const entries = Object.entries(data.documents);
//     const filtered: [string, File | null][] = [];

//     for (const [key, value] of entries) {
//       // Skip reservation certificate if General or Other
//       if (key === 'reservationCert') {
//         const category = data.personalInfo.reservationCategory;
//         if (category === 'General' || category === 'Other') continue;
//       }
      
//       // Skip NOC if not state government employee
//       if (key === 'nocCert') {
//         if (data.personalInfo.stateGovEmployee !== 'yes') continue;
//       }
      
//       // Skip PWD certificate if PWD status is no
//       if (key === 'pwdCert') {
//         if (data.personalInfo.pwdStatus !== 'yes') continue;
//       }
      
//       filtered.push([key, value]);
//     }
    
//     return filtered;
//   };

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
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {getDocumentEntries().map(([key, value]) => (
//             <FileUploadField
//               key={key}
//               label={labelFor(key)}
//               required={requiredDocs.includes(key)}
//               fileName={value?.name}
//               fileData={value}
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
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FileUploadField
//             label="10+2 / Equivalent Qualification Certificate"
//             fileName={data.teacherEligibility.tenPlusTwoCert?.name}
//             fileData={data.teacherEligibility.tenPlusTwoCert}
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
//               <p className="text-sm font-semibold mb-4" style={{ color: theme.textPrimary }}>
//                 Experience #{index + 1}
//                 {exp.designation ? ` — ${exp.designation}` : ''}
//               </p>
//               <div className="max-w-md">
//                 <FileUploadField
//                   label="Upload Certificate"
//                   fileName={exp.certificate?.name}
//                   fileData={exp.certificate}
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) updateExperience(index, 'certificate', file);
//                   }}
//                   onClear={() => updateExperience(index, 'certificate', null)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </FormSection>
//     </div>
//   );
// }

// // ==========================================
// // UPDATED: STEP 3: PAYMENT with Dynamic Data
// // ==========================================
// function Step3Payment({ 
//   paymentData, 
//   applicationId,
//   onPaymentSuccess,
//   showToast,
//   initiatePayment
// }: { 
//   paymentData: any;
//   applicationId: string | null;
//   onPaymentSuccess: () => void;
//   showToast: (message: string, type: 'success' | 'error' | 'info') => void;
//   initiatePayment: (applicationId: string, paymentMode?: string) => Promise<any>;
// }) {
//   const [selectedMode, setSelectedMode] = useState<string>('credit');
//   const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const paymentOptions = [
//     {
//       id: 'credit',
//       labelEn: 'Credit Card',
//       labelHi: 'क्रेडिट कार्ड',
//       icon: <CreditCard className="w-6 h-6 text-slate-600" />,
//     },
//     {
//       id: 'debit',
//       labelEn: 'Debit Card',
//       labelHi: 'डेबिट कार्ड',
//       icon: <CreditCard className="w-6 h-6 text-slate-600" />,
//     },
//     {
//       id: 'upi',
//       labelEn: 'UPI',
//       labelHi: 'यूपीआई',
//       icon: <Smartphone className="w-6 h-6 text-slate-600" />,
//     },
//     {
//       id: 'netbanking',
//       labelEn: 'Net Banking',
//       labelHi: 'नेट बैंकिंग',
//       icon: <Building2 className="w-6 h-6 text-slate-600" />,
//     },
//   ];

//   const handleProceed = async () => {
//     if (!isAcknowledged || !applicationId) return;
    
//     setIsProcessing(true);
//     try {
//       const response = await initiatePayment(applicationId, selectedMode);

//       if (response.success) {
//         // Redirect to payment gateway
//         if (response.data?.paymentUrl) {
//           window.location.href = response.data.paymentUrl;
//         } else {
//           // If no redirect URL, assume payment is complete
//           showToast('Payment initiated successfully!', 'success');
//           onPaymentSuccess();
//         }
//       } else {
//         showToast(response.message || 'Payment initiation failed', 'error');
//       }
//     } catch (error: any) {
//       const serverMessage = error.response?.data?.message || 'Payment initiation failed. Please try again.';
//       showToast(serverMessage, 'error');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const feeAmount = paymentData?.amount || 500;
//   const isFeePaid = paymentData?.status === 'paid' || paymentData?.status === 'completed' || paymentData?.status === 'completed';

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
//       <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        
//         {/* Section 1: Applicable Fee Header & Banner */}
//         <div className="space-y-3">
//           <h2 className="text-sm sm:text-base font-bold text-slate-900">
//             Your applicable fee <span className="font-normal text-slate-700">· आपका लागू शुल्क</span>
//           </h2>

//           <div className={`border rounded-xl p-4 flex items-center space-x-3 ${isFeePaid ? 'bg-[#ebf6f0] border-[#d1ebd9]' : 'bg-[#fef3c7] border-[#fcd34d]'}`}>
//             <div className="flex-shrink-0">
//               <CheckCircle2 className={`w-6 h-6 ${isFeePaid ? 'text-[#15803d]' : 'text-[#b45309]'}`} />
//             </div>
//             <div>
//               <div className={`text-xl sm:text-2xl font-bold leading-none mb-1 ${isFeePaid ? 'text-[#15803d]' : 'text-[#b45309]'}`}>
//                 ₹{feeAmount}
//               </div>
//               <div className={`text-xs sm:text-sm font-medium ${isFeePaid ? 'text-[#166534]' : 'text-[#92400e]'}`}>
//                 {isFeePaid ? 'Fee already paid for this application' : 'Fee to be paid for this application'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section 2: Payment Mode Selection */}
//         {!isFeePaid && (
//           <div className="space-y-3">
//             <h3 className="text-sm sm:text-base font-bold text-slate-900">
//               <span className="text-red-500 mr-1">*</span>Select payment mode
//               <div className="text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
//                 भुगतान का तरीका चुनें
//               </div>
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
//               {paymentOptions.map((option) => {
//                 const isSelected = selectedMode === option.id;
//                 return (
//                   <button
//                     key={option.id}
//                     type="button"
//                     onClick={() => setSelectedMode(option.id)}
//                     className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
//                       isSelected
//                         ? 'border-slate-800 bg-slate-50/50 shadow-xs'
//                         : 'border-slate-200 bg-white hover:border-slate-300'
//                     }`}
//                   >
//                     <div className="mb-2">{option.icon}</div>
//                     <span className="text-sm font-bold text-slate-900">
//                       {option.labelEn}
//                     </span>
//                     <span className="text-xs text-slate-500 mt-0.5">
//                       {option.labelHi}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Section 3: Redirection Notice Box */}
//         <div className={`border rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${isFeePaid ? 'bg-[#ebf6f0] border-[#d1ebd9] text-[#166534]' : 'bg-[#fff8f0] border-[#fde2cb] text-[#9a3412]'}`}>
//           {isFeePaid ? (
//             'Payment has already been completed for this application. You can proceed to the next step.'
//           ) : (
//             'You will be redirected to the BSSC official payment gateway. After successful payment, your status updates to "Fee Paid" and a receipt is generated. · आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।'
//           )}
//         </div>

//         {/* Section 4: Acknowledgment Checkbox */}
//         {!isFeePaid && (
//           <div className="flex items-start space-x-3 pt-1">
//             <input
//               id="acknowledgement"
//               type="checkbox"
//               checked={isAcknowledged}
//               onChange={(e) => setIsAcknowledged(e.target.checked)}
//               className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800 cursor-pointer accent-slate-900"
//             />
//             <label 
//               htmlFor="acknowledgement" 
//               className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer leading-snug"
//             >
//               I acknowledge the examination fee is non-refundable and non-transferable. <span className="font-bold text-slate-900">· मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।</span>
//             </label>
//           </div>
//         )}
//       </div>

//       {/* Bottom Button Action */}
//       <div className="flex justify-end">
//         {isFeePaid ? (
//           <button
//             type="button"
//             onClick={onPaymentSuccess}
//             className="px-6 py-2.5 rounded-full font-medium text-sm text-white flex items-center space-x-2 bg-[#15803d] hover:bg-[#166534] cursor-pointer shadow-sm"
//           >
//             <span>Proceed to Review</span>
//             <ChevronRight className="w-4 h-4 ml-1" />
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={handleProceed}
//             disabled={!isAcknowledged || isProcessing}
//             className={`px-6 py-2.5 rounded-full font-medium text-sm text-white flex items-center space-x-2 transition-all ${
//               isAcknowledged && !isProcessing
//                 ? 'bg-[#0f1d38] hover:bg-[#1a2e54] cursor-pointer shadow-sm'
//                 : 'bg-[#0f1d38]/60 cursor-not-allowed'
//             }`}
//           >
//             {isProcessing ? (
//               <Loader2 className="animate-spin w-4 h-4" />
//             ) : (
//               <span>Proceed to Pay</span>
//             )}
//             <ChevronRight className="w-4 h-4 ml-1" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // UPDATED: STEP 4: REVIEW with Document URLs
// // ==========================================
// function Step4Review({ 
//   data, 
//   uploadedDocuments = {},
//   isSubmitted = false
// }: { 
//   data: FormState;
//   uploadedDocuments?: Record<string, string>;
//   isSubmitted?: boolean;
// }) {
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

//   // Check if a document is uploaded (either as File or URL)
//   const isDocumentUploaded = (key: string, fileValue: File | null) => {
//     // Check if there's a File object
//     if (fileValue) return true;
//     // Check if there's a URL in uploadedDocuments
//     if (uploadedDocuments[key]) return true;
//     return false;
//   };

//   // Get document display name
//   const getDocumentDisplayName = (key: string, fileValue: File | null) => {
//     if (fileValue) return fileValue.name;
//     if (uploadedDocuments[key]) {
//       // Extract filename from URL
//       const url = uploadedDocuments[key];
//       const filename = url.split('/').pop()?.split('?')[0] || 'Uploaded';
//       return filename;
//     }
//     return null;
//   };

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
//           {Object.entries(data.teacherEligibility).map(([key, val]) => {
//             // Skip File objects in this view
//             if (val instanceof File) return null;
//             return (
//               <div key={key} className="flex flex-col">
//                 <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
//                   {labelFor(key)}
//                 </span>
//                 <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
//                   {String(val) || '—'}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </FormSection>

//       <FormSection number={6} title="Documents">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {Object.entries(data.documents).map(([key, val]) => {
//             // Skip hidden documents in review
//             if (key === 'reservationCert' && (data.personalInfo.reservationCategory === 'General' || data.personalInfo.reservationCategory === 'Other')) return null;
//             if (key === 'nocCert' && data.personalInfo.stateGovEmployee !== 'yes') return null;
//             if (key === 'pwdCert' && data.personalInfo.pwdStatus !== 'yes') return null;
            
//             const isUploaded = isDocumentUploaded(key, val);
//             const displayName = getDocumentDisplayName(key, val);
            
//             return (
//               <div key={key} className="flex flex-col">
//                 <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
//                   {labelFor(key)}
//                 </span>
//                 <span
//                   className="text-sm font-medium flex items-center gap-1"
//                   style={{ color: isUploaded ? theme.success : theme.error }}
//                 >
//                   {isUploaded ? (
//                     <>
//                       <CheckCircle size={13} /> 
//                       <span className="truncate max-w-[150px]" title={displayName || undefined}>
//                         {displayName || 'Uploaded'}
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <AlertCircle size={13} /> Not uploaded
//                     </>
//                   )}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </FormSection>

//       <FormSection number={7} title="Work Experience">
//         {data.experience.length === 0 ? (
//           <p className="text-sm" style={{ color: theme.textMuted }}>
//             No experience added.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {data.experience.map((exp, idx) => {
//               const isExpCertUploaded = exp.certificate || uploadedDocuments[`experienceCert_${idx}`];
//               const expCertName = exp.certificate?.name || (uploadedDocuments[`experienceCert_${idx}`] ? 'Uploaded' : null);
              
//               return (
//                 <div key={idx} className="p-3.5 rounded-lg bg-white" style={{ border: `1px solid ${theme.border}` }}>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     <div>
//                       <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Designation</span>
//                       <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.designation || '—'}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Duration</span>
//                       <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.duration || '—'}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Reason for Leaving</span>
//                       <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{exp.reasonLeaving || '—'}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-bold mb-1 block" style={{ color: theme.textPrimary }}>Certificate</span>
//                       <p
//                         className="text-sm font-medium flex items-center gap-1"
//                         style={{ color: isExpCertUploaded ? theme.success : theme.error }}
//                       >
//                         {isExpCertUploaded ? (
//                           <>
//                             <CheckCircle size={13} /> 
//                             <span className="truncate max-w-[120px]" title={expCertName || undefined}>
//                               {expCertName || 'Uploaded'}
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <AlertCircle size={13} /> Not uploaded
//                           </>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
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


import React, { useState, useId, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, FileText, CreditCard, CheckCircle, Upload, Loader2, X, 
  AlertCircle, Calendar, Mail, Phone, CloudUpload, File as FileIcon, Eye,
  CheckCircle2, Building2, ChevronRight, Smartphone
} from 'lucide-react';

// ==========================================
// DESIGN TOKENS
// ==========================================
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
    examCity: string;
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
    pwdCert: File | null;
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
    examCity: '',
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
    pwdCert: null,
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
  pwdCert: 'PWD Certificate',
  tenPlusTwoTrack: '10+2 / Equivalent Qualification Track',
  dedQual: 'D.Ed. / D.El.Ed. Qualification',
  dedInstitution: 'D.Ed. / D.El.Ed. Institute',
  rciNumber: 'RCI CRR Number',
  crossDisabilityPeriod: 'Cross-disability Inclusive Education Training Period (Months)',
  trainingNotAvailable: 'Training Deferment Acknowledged',
  tet1Passed: 'TET-1 Passed',
  examCity: 'Examination City',
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const labelFor = (key: string) =>
  FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

// --- API Service ---
const apiService = {
  getStates: async () => {
    const response = await axios.get(`${BASE_URL}/countries/1/states`);
    return response.data;
  },
  getDistricts: async (stateId: number) => {
    const response = await axios.get(`${BASE_URL}/states/${stateId}/districts`);
    return response.data;
  }
};

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [successModal, setSuccessModal] = useState<{ referenceNumber: string } | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    window.clearTimeout((window as any)._toastTimeout);
    (window as any)._toastTimeout = window.setTimeout(() => setToast(null), 4000);
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';

  // Fetch application data on mount
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setIsLoadingData(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setIsLoadingData(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/application/steps/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const data = response.data.data;
          setApplicationId(data.applicationId);
          setCompletedSteps(data.completedSteps || []);
          setIsSubmitted(data.isSubmitted || false);
          
          // Check if we have step data
          const steps = data.steps || {};
          
          // Store uploaded document URLs from step2
          if (steps.step2) {
            const docUrls: Record<string, string> = {};
            Object.entries(steps.step2).forEach(([key, value]) => {
              if (value && typeof value === 'string' && value.startsWith('http')) {
                docUrls[key] = value;
              }
            });
            setUploadedDocuments(docUrls);
          }
          
          // Auto-fill step 1 data from step0 and step1
          if (steps.step0 || steps.step1) {
            const step0 = steps.step0 || {};
            const step1 = steps.step1 || {};
            
            // Fill personal info from step0
            const personalInfoUpdates: any = {};
            
            if (step0.fullName) personalInfoUpdates.name = step0.fullName;
            if (step0.dateOfBirth) {
              // Convert DD-MM-YYYY to YYYY-MM-DD
              const parts = step0.dateOfBirth.split('-');
              if (parts.length === 3) {
                personalInfoUpdates.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
            }
            if (step0.gender) personalInfoUpdates.gender = step0.gender.charAt(0).toUpperCase() + step0.gender.slice(1);
            if (step0.emailId) personalInfoUpdates.email = step0.emailId;
            if (step0.mobileNumber) personalInfoUpdates.mobile = step0.mobileNumber;
            if (step0.maritalStatus) personalInfoUpdates.maritalStatus = step0.maritalStatus.charAt(0).toUpperCase() + step0.maritalStatus.slice(1);
            if (step0.nationality) personalInfoUpdates.nationality = step0.nationality;
            if (step0.selectDistrict) personalInfoUpdates.district = step0.selectDistrict;
            if (step0.reservationCategory) personalInfoUpdates.reservationCategory = step0.reservationCategory;
            if (step0.isPwd !== undefined) personalInfoUpdates.pwdStatus = step0.isPwd ? 'yes' : 'no';
            if (step0.govEmployee !== undefined) personalInfoUpdates.stateGovEmployee = step0.govEmployee ? 'yes' : 'no';
            
            // Fill from step1 if available
            if (step1.personalInfo) {
              const pInfo = step1.personalInfo;
              if (pInfo.name) personalInfoUpdates.name = pInfo.name;
              if (pInfo.dob) personalInfoUpdates.dob = pInfo.dob;
              if (pInfo.gender) personalInfoUpdates.gender = pInfo.gender;
              if (pInfo.email) personalInfoUpdates.email = pInfo.email;
              if (pInfo.mobile) personalInfoUpdates.mobile = pInfo.mobile;
              if (pInfo.district) personalInfoUpdates.district = pInfo.district;
              if (pInfo.examCity) personalInfoUpdates.examCity = pInfo.examCity;
              if (pInfo.maritalStatus) personalInfoUpdates.maritalStatus = pInfo.maritalStatus;
              if (pInfo.fatherName) personalInfoUpdates.fatherName = pInfo.fatherName;
              if (pInfo.motherName) personalInfoUpdates.motherName = pInfo.motherName;
              if (pInfo.nationality) personalInfoUpdates.nationality = pInfo.nationality;
              if (pInfo.reservationCategory) personalInfoUpdates.reservationCategory = pInfo.reservationCategory;
              if (pInfo.pwdStatus) personalInfoUpdates.pwdStatus = pInfo.pwdStatus;
              if (pInfo.typeOfDisability) personalInfoUpdates.typeOfDisability = pInfo.typeOfDisability;
              if (pInfo.is40Percent) personalInfoUpdates.is40Percent = pInfo.is40Percent;
              if (pInfo.stateGovEmployee) personalInfoUpdates.stateGovEmployee = pInfo.stateGovEmployee;
              if (pInfo.sponsoredExchange) personalInfoUpdates.sponsoredExchange = pInfo.sponsoredExchange;
              if (pInfo.identificationMarks) personalInfoUpdates.identificationMarks = pInfo.identificationMarks;
            }
            
            // Fill address from step1
            let addressUpdates: any = null;
            if (step1.address) {
              addressUpdates = {
                permanent: { ...emptyAddress },
                correspond: { ...emptyAddress },
                sameAsPermanent: step1.address.sameAsPermanent || false,
              };
              
              if (step1.address.permanent) {
                addressUpdates.permanent = { ...step1.address.permanent };
              }
              
              if (step1.address.correspond) {
                addressUpdates.correspond = { ...step1.address.correspond };
              }
            }
            
            // Fill education from step1
            let educationUpdates: any = null;
            if (step1.education) {
              educationUpdates = {
                '10th': { ...emptyEducation },
                '12th': { ...emptyEducation },
                graduation: { ...emptyEducation },
                postGraduation: { ...emptyEducation },
              };
              
              if (step1.education['10th']) educationUpdates['10th'] = { ...step1.education['10th'] };
              if (step1.education['12th']) educationUpdates['12th'] = { ...step1.education['12th'] };
              if (step1.education.graduation) educationUpdates.graduation = { ...step1.education.graduation };
              if (step1.education.postGraduation) educationUpdates.postGraduation = { ...step1.education.postGraduation };
            }
            
            // Fill teacher eligibility from step1
            let teacherEligibilityUpdates: any = null;
            if (step1.teachereligibilit) {
              const te = step1.teachereligibilit;
              teacherEligibilityUpdates = {
                tenPlusTwoTrack: te.tenPlusTwoTrack || '',
                dedQual: te.dedQual || '',
                dedInstitution: te.dedInstitution || '',
                crossDisabilityPeriod: te.crossDisabilityPeriod || '',
                rciNumber: te.rciNumber || '',
                trainingNotAvailable: te.trainingNotAvailable || false,
                tet1Passed: te.tet1Passed || false,
                tenPlusTwoCert: null,
              };
            }
            
            // Fill experience from step1
            let experienceUpdates: any[] = [];
            if (step1.experience && step1.experience.length > 0) {
              experienceUpdates = step1.experience.map((exp: any) => ({
                designation: exp.designation || '',
                duration: exp.duration || '',
                reasonLeaving: exp.reasonLeaving || '',
                certificate: null,
              }));
            }
            
            // Update form data
            setFormData((prev) => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                ...personalInfoUpdates,
              },
              address: addressUpdates || prev.address,
              education: educationUpdates || prev.education,
              teacherEligibility: teacherEligibilityUpdates || prev.teacherEligibility,
              experience: experienceUpdates.length > 0 ? experienceUpdates : prev.experience,
            }));
          }
          
          // Check payment data from step3
          if (steps.step3) {
            setPaymentData(steps.step3);
          }
          
          // Determine current step based on completed steps and status
          if (data.isSubmitted) {
            // If application is submitted, go to review
            setStep(4);
          } else if (data.status === 'payment_completed' || data.status === 'completed') {
            // If payment is completed, go to step 4 (Review)
            // Check if step2 documents are uploaded
            const step2Data = steps.step2 || {};
            const hasDocuments = Object.values(step2Data).some((val: any) => val !== null && val !== '');
            
            if (hasDocuments || data.completedSteps?.includes(2)) {
              setStep(4);
            } else {
              // If no documents but payment completed, go to step 2
              setStep(2);
            }
          } else if (data.currentStep !== undefined && data.currentStep !== null) {
            // Map backend step numbers to frontend steps
            const stepMapping: { [key: number]: number } = {
              0: 1,
              1: 1,
              2: 2,
              3: 3,
            };
            
            const frontendStep = stepMapping[data.currentStep] || 1;
            setStep(frontendStep);
          }
          
          setIsDataFetched(true);
        }
      } catch (error) {
        console.error('Failed to fetch application data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchApplicationData();
  }, []);

  const submitStep1 = async () => {
    const token = localStorage.getItem('accessToken');

    const step1Payload = {
      personalInfo: formData.personalInfo,
      address: formData.address,
      education: formData.education,
      teacherEligibility: {
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

  const initiatePayment = async (applicationId: string, paymentMode?: string) => {
    const token = localStorage.getItem('accessToken');

    const payload: any = { applicationId };
    if (paymentMode) {
      payload.paymentMode = paymentMode;
    }

    const response = await axios.post(
      `${BASE_URL}/payment/initiate`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  };

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
        if (response.success) {
          // Fetch payment data before moving to step 3
          const paymentResponse = await initiatePayment(applicationId);
          if (paymentResponse.success) {
            setPaymentData(paymentResponse.data);
            setStep(3);
          }
        }
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
      // Payment is handled inside Step3Payment component
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{ color: theme.navy }} />
          <p className="text-sm" style={{ color: theme.textMuted }}>Loading your application...</p>
        </div>
      </div>
    );
  }

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
        <div className="px-8 pt-8 pb-6" style={{ backgroundColor: theme.navy }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: theme.goldLight }}>
            Teacher Recruitment Portal
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">Candidate Application</h1>
        </div>

        <div className="px-8 pt-8">
          <StepIndicator steps={steps} current={step} />
        </div>

        <div className="px-8 pb-2 pt-6 min-h-[500px]">
          {step === 1 && <Step1Application data={formData} setData={setFormData} isDataFetched={isDataFetched} />}
          {step === 2 && <Step2Documents data={formData} setData={setFormData} />}
          {step === 3 && <Step3Payment 
            paymentData={paymentData} 
            applicationId={applicationId}
            onPaymentSuccess={() => setStep(4)}
            showToast={showToast}
            initiatePayment={initiatePayment}
          />}
          {step === 4 && <Step4Review 
            data={formData} 
            uploadedDocuments={uploadedDocuments}
            isSubmitted={isSubmitted}
          />}
        </div>

        <div className="flex justify-between items-center px-8 py-6 mt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={handlePrev}
            disabled={step === 1 || isProcessing || (step === 4 && isSubmitted)}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
            style={
              step === 1 || (step === 4 && isSubmitted)
                ? { backgroundColor: '#EEF0F3', color: '#B3B9C2' }
                : { backgroundColor: '#EEF0F3', color: theme.textPrimary }
            }
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isProcessing || step === 3 || (step === 4 && isSubmitted)}
            className="px-7 py-2.5 rounded-lg font-semibold text-sm text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: step === 4 ? (isSubmitted ? '#9ca3af' : theme.gold) : theme.navy }}
          >
            {isProcessing && <Loader2 className="animate-spin" size={16} />}
            {step === 4 ? (isSubmitted ? 'Submitted' : 'Submit Application') : step === 2 ? 'Proceed to Payment' : 'Save & Continue'}
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

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
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
          disabled={disabled}
          className="w-full rounded-lg border-2 bg-white py-2 px-3.5 text-sm outline-none transition-all duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            borderColor,
            color: disabled ? theme.textMuted : theme.textPrimary,
            paddingLeft: Icon ? '2.25rem' : '0.9rem',
            paddingRight: '0.9rem',
            boxShadow: focused ? `0 0 0 3px ${error ? '#F8DEDA' : theme.goldLight}` : 'none',
          }}
        />
      </div>
      {error ? (
        <span className="flex items-center gap-1 text-xs" style={{ color: theme.error }}>
          <AlertCircle size={12} /> {error}
        </span>
      ) : null}
    </div>
  );
}

// Updated FormSelect to support loading state
function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  loading = false,
  placeholder = `Select ${label}`,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
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
          disabled={disabled || loading}
          className="w-full rounded-lg border-2 bg-white pl-3.5 pr-9 py-2 text-sm outline-none appearance-none transition-all duration-150 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            borderColor,
            color: hasValue ? theme.textPrimary : theme.textMuted,
            boxShadow: focused ? `0 0 0 3px ${theme.goldLight}` : 'none',
          }}
        >
          <option value="" disabled hidden>
            {loading ? 'Loading...' : placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin" size={14} style={{ color: theme.textMuted }} />
          </div>
        )}
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (isoValue: string) => void;
  required?: boolean;
  disabled?: boolean;
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
    if (disabled) return;
    const v = raw.replace(/\D/g, '').slice(0, 2);
    setDay(v);
    emit(v, month, year);
    if (v.length === 2) monthRef.current?.focus();
  };

  const handleMonth = (raw: string) => {
    if (disabled) return;
    const v = raw.replace(/\D/g, '').slice(0, 2);
    setMonth(v);
    emit(day, v, year);
    if (v.length === 2) yearRef.current?.focus();
  };

  const handleYear = (raw: string) => {
    if (disabled) return;
    const v = raw.replace(/\D/g, '').slice(0, 4);
    setYear(v);
    emit(day, month, v);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-bold tracking-wide"
        style={{ color: focused ? theme.navy : theme.textPrimary }}
      >
        {label} {required && <span style={{ color: theme.gold }}>*</span>}
      </label>
      <div
        className="relative rounded-lg border-2 bg-white flex items-center gap-1.5 py-2 px-3 transition-all duration-150 disabled:bg-gray-100"
        style={{
          borderColor: focused ? theme.navy : theme.border,
          boxShadow: focused ? `0 0 0 3px ${theme.goldLight}` : 'none',
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
          disabled={disabled}
          className="w-8 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
          style={{ color: theme.textPrimary }}
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
          disabled={disabled}
          className="w-8 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
          style={{ color: theme.textPrimary }}
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
          disabled={disabled}
          className="w-14 text-sm text-center outline-none bg-transparent disabled:text-gray-500"
          style={{ color: theme.textPrimary }}
        />
      </div>
    </div>
  );
}

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

// ==========================================
// UPDATED: FileUploadField with Preview
// ==========================================
function FileUploadField({
  label,
  required = false,
  fileName,
  fileData,
  onChange,
  onClear,
  disabled = false,
}: {
  label: string;
  required?: boolean;
  fileName?: string;
  fileData?: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(fileData);
    } else {
      setPreview(null);
    }
  }, [fileData]);

  const isImage = fileData?.type?.startsWith('image/');
  const isPDF = fileData?.type === 'application/pdf';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
          {label} {required && <span style={{ color: theme.error }}>*</span>}
        </label>
      )}

      <div
        className="relative flex flex-col items-center justify-center p-6 text-center rounded-xl transition-all"
        style={{
          backgroundColor: disabled ? '#f3f4f6' : '#E8F5E9',
          border: `2px dashed ${disabled ? '#d1d5db' : '#81C784'}`,
          minHeight: '160px',
        }}
      >
        {fileName ? (
          <div className="flex flex-col items-center gap-2 z-10 relative w-full">
            {isImage && preview && (
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
            )}
            {isPDF && (
              <FileIcon className="w-8 h-8" style={{ color: '#D32F2F' }} />
            )}
            {!isImage && !isPDF && (
              <FileIcon className="w-8 h-8" style={{ color: theme.navy }} />
            )}
            <span className="text-sm font-medium break-all px-4 max-w-full" style={{ color: theme.textPrimary }}>
              {fileName}
            </span>
            <div className="flex gap-2 mt-1">
              {preview && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-1.5 bg-white border rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-sm hover:bg-gray-50"
                  style={{ borderColor: theme.border, color: theme.textMuted }}
                >
                  <Eye size={14} /> Preview
                </button>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={onClear}
                  className="px-3 py-1.5 bg-white border rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-sm hover:bg-gray-50"
                  style={{ borderColor: theme.border, color: theme.textMuted }}
                >
                  <X size={14} /> Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {!disabled && (
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={onChange}
                accept=".jpeg,.jpg,.png,.pdf"
              />
            )}
            
            <div className="flex flex-col items-center pointer-events-none">
              <CloudUpload className="w-8 h-8 mb-3 stroke-[2.5]" style={{ color: disabled ? '#9ca3af' : '#388E3C' }} />
              
              <p className="font-semibold text-[15px] mb-1.5" style={{ color: disabled ? '#9ca3af' : theme.textPrimary }}>
                {disabled ? 'No file uploaded' : 'Choose a file or drag & drop it here'}
              </p>
              
              <p className="text-xs mb-4 font-medium" style={{ color: theme.textMuted }}>
                JPEG, PNG, PDF formats, up to 5MB
              </p>
              
              {!disabled && (
                <div 
                  className="flex items-center gap-2 px-5 py-1.5 bg-white rounded-lg border text-sm font-semibold shadow-sm"
                  style={{ borderColor: '#388E3C', color: '#388E3C' }}
                >
                  Browse <FileIcon size={16} className="stroke-[2.5]" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && preview && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-2xl max-h-[90vh] bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            {isImage ? (
              <img src={preview} alt="Preview" className="max-w-full max-h-[70vh] object-contain" />
            ) : (
              <iframe src={preview} className="w-full h-[70vh]" title="Preview" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADDRESS FIELDS COMPONENT
// ==========================================
function AddressFields({
  address,
  onChange,
  disabled = false,
  loadingStates = { states: false, districts: false },
  stateOptions = [],
  districtOptions = [],
  onStateChange,
}: {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  disabled?: boolean;
  loadingStates?: { states: boolean; districts: boolean };
  stateOptions?: Array<{ value: string; label: string }>;
  districtOptions?: Array<{ value: string; label: string }>;
  onStateChange?: (stateId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FormField
        label="Village / Locality"
        value={address.village}
        onChange={(e) => onChange('village', e.target.value)}
        required
        disabled={disabled}
      />
      <FormField
        label="City / Town"
        value={address.city}
        onChange={(e) => onChange('city', e.target.value)}
        required
        disabled={disabled}
      />
      <FormSelect
        label="State"
        value={address.state}
        onChange={(e) => {
          onChange('state', e.target.value);
          if (onStateChange) onStateChange(e.target.value);
        }}
        options={stateOptions}
        required
        disabled={disabled || loadingStates.states}
        loading={loadingStates.states}
        placeholder="Select State"
      />
      <FormSelect
        label="District"
        value={address.district}
        onChange={(e) => onChange('district', e.target.value)}
        options={districtOptions}
        required
        disabled={disabled || loadingStates.districts || !address.state}
        loading={loadingStates.districts}
        placeholder={address.state ? "Select District" : "Select State First"}
      />
      <FormField
        label="PIN Code"
        value={address.pincode}
        onChange={(e) => onChange('pincode', e.target.value)}
        type="text"
        required
        disabled={disabled}
      />
      <FormField
        label="Police Station"
        value={address.policeStation}
        onChange={(e) => onChange('policeStation', e.target.value)}
        required
        disabled={disabled}
      />
    </div>
  );
}

// ==========================================
// STEP 1: APPLICATION (JSON Data)
// ==========================================
function Step1Application({
  data,
  setData,
  isDataFetched = false,
}: {
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
  isDataFetched?: boolean;
}) {
  const [stateOptions, setStateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loadingStates, setLoadingStates] = useState({ states: false, districts: false });
  const [statesMap, setStatesMap] = useState<Record<string, number>>({});

  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(prev => ({ ...prev, states: true }));
      try {
        const response = await apiService.getStates();
        if (response.success) {
          const options = response.data.map((state: any) => ({
            value: state.stateName,
            label: state.stateName
          }));
          const map: Record<string, number> = {};
          response.data.forEach((state: any) => {
            map[state.stateName] = state.stateId;
          });
          setStateOptions(options);
          setStatesMap(map);
        }
      } catch (error) {
        console.error('Failed to load states:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, states: false }));
      }
    };
    loadStates();
  }, []);

  // Load districts when state changes
  const handleStateChange = async (stateName: string) => {
    const stateId = statesMap[stateName];
    if (!stateId) return;

    setLoadingStates(prev => ({ ...prev, districts: true }));
    setDistrictOptions([]);
    
    try {
      const response = await apiService.getDistricts(stateId);
      if (response.success) {
        const options = response.data.map((district: any) => ({
          value: district.districtName,
          label: district.districtName
        }));
        setDistrictOptions(options);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, districts: false }));
    }
  };

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

  // Copy permanent address to correspond when permanent address changes
  useEffect(() => {
    if (data.address.sameAsPermanent) {
      setData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          correspond: { ...prev.address.permanent },
        },
      }));
    }
  }, [data.address.permanent, data.address.sameAsPermanent]);

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

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Married', 'Unmarried', 'Divorced', 'Widowed'];
  const reservationOptions = ['General', 'OBC(M)', 'OBC', 'SC', 'ST', 'Other'];
  const yesNoOptions = ['yes', 'no'];
  const examCityOptions = ['Lucknow', 'Bihar', 'Gorakhpur', 'Varanasi', 'Allahabad', 'Agra'];
  const tenPlusTwoTrackOptions = [
    '10+2 / equivalent with at least 50% marks',
    '10+2 / equivalent under NCTE Regulations, 2002 with at least 45% marks',
  ];
  const dedQualOptions = [
    'D.Ed. in Special Education from RCI approved institute',
    'D.El.Ed. equivalent recognized RCI qualification',
  ];

  // Check if fields should be disabled (when data is fetched from API)
  const isDisabled = (field: string) => {
    if (!isDataFetched) return false;
    const step0Fields = ['name', 'dob', 'gender', 'mobile', 'email', 'maritalStatus', 'nationality', 'district'];
    return step0Fields.includes(field);
  };

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
          {isDataFetched ? 'Auto-filled from previous data' : 'New Application'}
        </span>
      </div>

      <FormSection number={1} title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField 
            label="Candidate Name" 
            value={data.personalInfo.name} 
            onChange={(e) => updateField('personalInfo', 'name', e.target.value)} 
            required 
            disabled={isDisabled('name')}
          />
          <DateField 
            label="Date of Birth" 
            value={data.personalInfo.dob} 
            onChange={(iso) => updateField('personalInfo', 'dob', iso)} 
            required 
            disabled={isDisabled('dob')}
          />
          <FormSelect 
            label="Gender" 
            value={data.personalInfo.gender} 
            onChange={(e) => updateField('personalInfo', 'gender', e.target.value)} 
            options={genderOptions.map(g => ({ value: g, label: g }))}
            required 
            disabled={isDisabled('gender')}
          />
          <FormSelect 
            label="Examination City" 
            value={data.personalInfo.examCity} 
            onChange={(e) => updateField('personalInfo', 'examCity', e.target.value)} 
            options={examCityOptions.map(c => ({ value: c, label: c }))}
            required 
          />
          <FormField 
            label="District" 
            value={data.personalInfo.district} 
            onChange={(e) => updateField('personalInfo', 'district', e.target.value)} 
            required 
            disabled={isDisabled('district')}
          />
          <FormSelect 
            label="Marital Status" 
            value={data.personalInfo.maritalStatus} 
            onChange={(e) => updateField('personalInfo', 'maritalStatus', e.target.value)} 
            options={maritalStatusOptions.map(m => ({ value: m, label: m }))}
            required 
            disabled={isDisabled('maritalStatus')}
          />
          <FormField 
            label="Mobile Number" 
            type="tel" 
            value={data.personalInfo.mobile} 
            onChange={(e) => updateField('personalInfo', 'mobile', e.target.value)} 
            required 
            disabled={isDisabled('mobile')}
          />
          <FormField 
            label="Email Address" 
            type="email" 
            value={data.personalInfo.email} 
            onChange={(e) => updateField('personalInfo', 'email', e.target.value)} 
            required 
            disabled={isDisabled('email')}
          />
          <FormField 
            label="Father's Name" 
            value={data.personalInfo.fatherName} 
            onChange={(e) => updateField('personalInfo', 'fatherName', e.target.value)} 
            required 
          />
          <FormField 
            label="Mother's Name" 
            value={data.personalInfo.motherName} 
            onChange={(e) => updateField('personalInfo', 'motherName', e.target.value)} 
            required 
          />
          <FormField 
            label="Nationality" 
            value={data.personalInfo.nationality} 
            onChange={(e) => updateField('personalInfo', 'nationality', e.target.value)} 
            required 
            disabled={isDisabled('nationality')}
          />
          <FormSelect 
            label="Reservation Category" 
            value={data.personalInfo.reservationCategory} 
            onChange={(e) => updateField('personalInfo', 'reservationCategory', e.target.value)} 
            options={reservationOptions.map(r => ({ value: r, label: r }))}
            required 
          />
          <FormSelect 
            label="PWD Status" 
            value={data.personalInfo.pwdStatus} 
            onChange={(e) => updateField('personalInfo', 'pwdStatus', e.target.value)} 
            options={yesNoOptions.map(y => ({ value: y, label: y }))}
            required 
          />
          {data.personalInfo.pwdStatus === 'yes' && (
            <>
              <FormField 
                label="Type of Disability" 
                value={data.personalInfo.typeOfDisability} 
                onChange={(e) => updateField('personalInfo', 'typeOfDisability', e.target.value)} 
                required 
              />
              <FormSelect 
                label="Is 40% or More?" 
                value={data.personalInfo.is40Percent} 
                onChange={(e) => updateField('personalInfo', 'is40Percent', e.target.value)} 
                options={yesNoOptions.map(y => ({ value: y, label: y }))}
                required 
              />
            </>
          )}
          <FormSelect 
            label="State Government Employee" 
            value={data.personalInfo.stateGovEmployee} 
            onChange={(e) => updateField('personalInfo', 'stateGovEmployee', e.target.value)} 
            options={yesNoOptions.map(y => ({ value: y, label: y }))}
            required 
          />
          <FormSelect 
            label="Sponsored by Employment Exchange" 
            value={data.personalInfo.sponsoredExchange} 
            onChange={(e) => updateField('personalInfo', 'sponsoredExchange', e.target.value)} 
            options={yesNoOptions.map(y => ({ value: y, label: y }))}
            required 
          />
          <FormField 
            label="Identification Marks" 
            value={data.personalInfo.identificationMarks} 
            onChange={(e) => updateField('personalInfo', 'identificationMarks', e.target.value)} 
          />
        </div>
      </FormSection>

      <FormSection number={2} title="Address Details">
        <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
          PERMANENT ADDRESS
        </p>
        <AddressFields
          address={data.address.permanent}
          onChange={(field, value) => updateField('address', field, value, 'permanent')}
          loadingStates={loadingStates}
          stateOptions={stateOptions}
          districtOptions={districtOptions}
          onStateChange={handleStateChange}
        />

        <label className="flex items-center gap-2.5 my-5 cursor-pointer select-none w-fit">
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

        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
            CORRESPONDENCE ADDRESS
          </p>
          <AddressFields
            address={data.address.correspond}
            onChange={(field, value) => updateField('address', field, value, 'correspond')}
            disabled={data.address.sameAsPermanent}
            loadingStates={loadingStates}
            stateOptions={stateOptions}
            districtOptions={districtOptions}
            onStateChange={handleStateChange}
          />
        </div>
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
          <FormSelect 
            label="10+2 / Equivalent Qualification Track" 
            value={data.teacherEligibility.tenPlusTwoTrack} 
            onChange={(e) => updateField('teacherEligibility', 'tenPlusTwoTrack', e.target.value)} 
            options={tenPlusTwoTrackOptions.map(t => ({ value: t, label: t }))}
            required 
          />
          <FormSelect 
            label="D.Ed. / D.El.Ed. Qualification" 
            value={data.teacherEligibility.dedQual} 
            onChange={(e) => updateField('teacherEligibility', 'dedQual', e.target.value)} 
            options={dedQualOptions.map(d => ({ value: d, label: d }))}
            required 
          />
          <FormField 
            label="D.Ed. / D.El.Ed. Institute" 
            value={data.teacherEligibility.dedInstitution} 
            onChange={(e) => updateField('teacherEligibility', 'dedInstitution', e.target.value)} 
            required 
          />
          <FormField 
            label="RCI CRR Number" 
            value={data.teacherEligibility.rciNumber} 
            onChange={(e) => updateField('teacherEligibility', 'rciNumber', e.target.value)} 
            required 
          />
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
              <FormField 
                label="Designation" 
                value={exp.designation} 
                onChange={(e) => updateExperience(index, 'designation', e.target.value)} 
                required 
              />
              <FormField 
                label="Service Period" 
                value={exp.duration} 
                onChange={(e) => updateExperience(index, 'duration', e.target.value)} 
                placeholder="e.g., 2 years 3 months" 
                required 
              />
              <FormField 
                label="Reason for Leaving" 
                value={exp.reasonLeaving} 
                onChange={(e) => updateExperience(index, 'reasonLeaving', e.target.value)} 
              />

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
// STEP 2: DOCUMENTS UPLOAD with Conditional Fields
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

  // Get document entries based on conditions
  const getDocumentEntries = () => {
    const entries = Object.entries(data.documents);
    const filtered: [string, File | null][] = [];

    for (const [key, value] of entries) {
      // Skip reservation certificate if General or Other
      if (key === 'reservationCert') {
        const category = data.personalInfo.reservationCategory;
        if (category === 'General' || category === 'Other') continue;
      }
      
      // Skip NOC if not state government employee
      if (key === 'nocCert') {
        if (data.personalInfo.stateGovEmployee !== 'yes') continue;
      }
      
      // Skip PWD certificate if PWD status is no
      if (key === 'pwdCert') {
        if (data.personalInfo.pwdStatus !== 'yes') continue;
      }
      
      filtered.push([key, value]);
    }
    
    return filtered;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDocumentEntries().map(([key, value]) => (
            <FileUploadField
              key={key}
              label={labelFor(key)}
              required={requiredDocs.includes(key)}
              fileName={value?.name}
              fileData={value}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadField
            label="10+2 / Equivalent Qualification Certificate"
            fileName={data.teacherEligibility.tenPlusTwoCert?.name}
            fileData={data.teacherEligibility.tenPlusTwoCert}
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
              <p className="text-sm font-semibold mb-4" style={{ color: theme.textPrimary }}>
                Experience #{index + 1}
                {exp.designation ? ` — ${exp.designation}` : ''}
              </p>
              <div className="max-w-md">
                <FileUploadField
                  label="Upload Certificate"
                  fileName={exp.certificate?.name}
                  fileData={exp.certificate}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateExperience(index, 'certificate', file);
                  }}
                  onClear={() => updateExperience(index, 'certificate', null)}
                />
              </div>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}

// ==========================================
// STEP 3: PAYMENT with Dynamic Data
// ==========================================
function Step3Payment({ 
  paymentData, 
  applicationId,
  onPaymentSuccess,
  showToast,
  initiatePayment
}: { 
  paymentData: any;
  applicationId: string | null;
  onPaymentSuccess: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  initiatePayment: (applicationId: string, paymentMode?: string) => Promise<any>;
}) {
  const [selectedMode, setSelectedMode] = useState<string>('credit');
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    {
      id: 'credit',
      labelEn: 'Credit Card',
      labelHi: 'क्रेडिट कार्ड',
      icon: <CreditCard className="w-6 h-6 text-slate-600" />,
    },
    {
      id: 'debit',
      labelEn: 'Debit Card',
      labelHi: 'डेबिट कार्ड',
      icon: <CreditCard className="w-6 h-6 text-slate-600" />,
    },
    {
      id: 'upi',
      labelEn: 'UPI',
      labelHi: 'यूपीआई',
      icon: <Smartphone className="w-6 h-6 text-slate-600" />,
    },
    {
      id: 'netbanking',
      labelEn: 'Net Banking',
      labelHi: 'नेट बैंकिंग',
      icon: <Building2 className="w-6 h-6 text-slate-600" />,
    },
  ];

  const handleProceed = async () => {
    if (!isAcknowledged || !applicationId) return;
    
    setIsProcessing(true);
    try {
      const response = await initiatePayment(applicationId, selectedMode);

      if (response.success) {
        // Redirect to payment gateway
        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          // If no redirect URL, assume payment is complete
          showToast('Payment initiated successfully!', 'success');
          onPaymentSuccess();
        }
      } else {
        showToast(response.message || 'Payment initiation failed', 'error');
      }
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Payment initiation failed. Please try again.';
      showToast(serverMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const feeAmount = paymentData?.amount || 500;
  const isFeePaid = paymentData?.status === 'paid' || paymentData?.status === 'completed' || paymentData?.status === 'completed';

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Section 1: Applicable Fee Header & Banner */}
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Your applicable fee <span className="font-normal text-slate-700">· आपका लागू शुल्क</span>
          </h2>

          <div className={`border rounded-xl p-4 flex items-center space-x-3 ${isFeePaid ? 'bg-[#ebf6f0] border-[#d1ebd9]' : 'bg-[#fef3c7] border-[#fcd34d]'}`}>
            <div className="flex-shrink-0">
              <CheckCircle2 className={`w-6 h-6 ${isFeePaid ? 'text-[#15803d]' : 'text-[#b45309]'}`} />
            </div>
            <div>
              <div className={`text-xl sm:text-2xl font-bold leading-none mb-1 ${isFeePaid ? 'text-[#15803d]' : 'text-[#b45309]'}`}>
                ₹{feeAmount}
              </div>
              <div className={`text-xs sm:text-sm font-medium ${isFeePaid ? 'text-[#166534]' : 'text-[#92400e]'}`}>
                {isFeePaid ? 'Fee already paid for this application' : 'Fee to be paid for this application'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Mode Selection */}
        {!isFeePaid && (
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              <span className="text-red-500 mr-1">*</span>Select payment mode
              <div className="text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
                भुगतान का तरीका चुनें
              </div>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {paymentOptions.map((option) => {
                const isSelected = selectedMode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedMode(option.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-2">{option.icon}</div>
                    <span className="text-sm font-bold text-slate-900">
                      {option.labelEn}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {option.labelHi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Redirection Notice Box */}
        <div className={`border rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${isFeePaid ? 'bg-[#ebf6f0] border-[#d1ebd9] text-[#166534]' : 'bg-[#fff8f0] border-[#fde2cb] text-[#9a3412]'}`}>
          {isFeePaid ? (
            'Payment has already been completed for this application. You can proceed to the next step.'
          ) : (
            'You will be redirected to the BSSC official payment gateway. After successful payment, your status updates to "Fee Paid" and a receipt is generated. · आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।'
          )}
        </div>

        {/* Section 4: Acknowledgment Checkbox */}
        {!isFeePaid && (
          <div className="flex items-start space-x-3 pt-1">
            <input
              id="acknowledgement"
              type="checkbox"
              checked={isAcknowledged}
              onChange={(e) => setIsAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800 cursor-pointer accent-slate-900"
            />
            <label 
              htmlFor="acknowledgement" 
              className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer leading-snug"
            >
              I acknowledge the examination fee is non-refundable and non-transferable. <span className="font-bold text-slate-900">· मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।</span>
            </label>
          </div>
        )}
      </div>

      {/* Bottom Button Action */}
      <div className="flex justify-end">
        {isFeePaid ? (
          <button
            type="button"
            onClick={onPaymentSuccess}
            className="px-6 py-2.5 rounded-full font-medium text-sm text-white flex items-center space-x-2 bg-[#15803d] hover:bg-[#166534] cursor-pointer shadow-sm"
          >
            <span>Proceed to Review</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProceed}
            disabled={!isAcknowledged || isProcessing}
            className={`px-6 py-2.5 rounded-full font-medium text-sm text-white flex items-center space-x-2 transition-all ${
              isAcknowledged && !isProcessing
                ? 'bg-[#0f1d38] hover:bg-[#1a2e54] cursor-pointer shadow-sm'
                : 'bg-[#0f1d38]/60 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <span>Proceed to Pay</span>
            )}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// STEP 4: REVIEW with Document URLs
// ==========================================
function Step4Review({ 
  data, 
  uploadedDocuments = {},
  isSubmitted = false
}: { 
  data: FormState;
  uploadedDocuments?: Record<string, string>;
  isSubmitted?: boolean;
}) {
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

  // Check if a document is uploaded (either as File or URL)
  const isDocumentUploaded = (key: string, fileValue: File | null) => {
    // Check if there's a File object
    if (fileValue) return true;
    // Check if there's a URL in uploadedDocuments
    if (uploadedDocuments[key]) return true;
    return false;
  };

  // Get document display name
  const getDocumentDisplayName = (key: string, fileValue: File | null) => {
    if (fileValue) return fileValue.name;
    if (uploadedDocuments[key]) {
      // Extract filename from URL
      const url = uploadedDocuments[key];
      const filename = url.split('/').pop()?.split('?')[0] || 'Uploaded';
      return filename;
    }
    return null;
  };

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

      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: theme.textMuted }}>
          CORRESPONDENCE ADDRESS
        </p>
        <InfoGrid obj={data.address.correspond} />
      </div>

      <FormSection number={3} title="Education">
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

      <FormSection number={4} title="Teacher Eligibility">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.teacherEligibility).map(([key, val]) => {
            // Skip File objects in this view
            if (val instanceof File) return null;
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
      </FormSection>

      <FormSection number={5} title="Documents">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.documents).map(([key, val]) => {
            // Skip hidden documents in review
            if (key === 'reservationCert' && (data.personalInfo.reservationCategory === 'General' || data.personalInfo.reservationCategory === 'Other')) return null;
            if (key === 'nocCert' && data.personalInfo.stateGovEmployee !== 'yes') return null;
            if (key === 'pwdCert' && data.personalInfo.pwdStatus !== 'yes') return null;
            
            const isUploaded = isDocumentUploaded(key, val);
            const displayName = getDocumentDisplayName(key, val);
            
            return (
              <div key={key} className="flex flex-col">
                <span className="text-xs font-bold mb-1" style={{ color: theme.textPrimary }}>
                  {labelFor(key)}
                </span>
                <span
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: isUploaded ? theme.success : theme.error }}
                >
                  {isUploaded ? (
                    <>
                      <CheckCircle size={13} /> 
                      <span className="truncate max-w-[150px]" title={displayName || undefined}>
                        {displayName || 'Uploaded'}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} /> Not uploaded
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </FormSection>

      <FormSection number={6} title="Work Experience">
        {data.experience.length === 0 ? (
          <p className="text-sm" style={{ color: theme.textMuted }}>
            No experience added.
          </p>
        ) : (
          <div className="space-y-3">
            {data.experience.map((exp, idx) => {
              const isExpCertUploaded = exp.certificate || uploadedDocuments[`experienceCert_${idx}`];
              const expCertName = exp.certificate?.name || (uploadedDocuments[`experienceCert_${idx}`] ? 'Uploaded' : null);
              
              return (
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
                        style={{ color: isExpCertUploaded ? theme.success : theme.error }}
                      >
                        {isExpCertUploaded ? (
                          <>
                            <CheckCircle size={13} /> 
                            <span className="truncate max-w-[120px]" title={expCertName || undefined}>
                              {expCertName || 'Uploaded'}
                            </span>
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
              );
            })}
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