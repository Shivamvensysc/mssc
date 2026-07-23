// import React, { useState, useEffect, useRef } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import api from "../api/interceptor";

// import { days, months, years } from "../schemas/registrationSchema";
// import { getDistricts } from "../api/registrationApi";

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
//   email: string;
//   district: string;
//   captchaInput: string;
//   govEmployee: string;
//   fatherName: string;
//   motherName: string;
//   identificationMarks: string;

//   // New Address Fields
//   permVillage: string;
//   permCity: string;
//   permState: string;
//   permDistrict: string;
//   permPincode: string;
//   corrVillage: string;
//   corrCity: string;
//   corrState: string;
//   corrDistrict: string;
//   corrPincode: string;

//   sameAsPermanent: boolean;
//   sponsored: string;
//   nationality: string;
//   education10thSchool: string;
//   education10thBoard: string;
//   education10thYear: string;
//   education10thPercentage: string;
//   education12thSchool: string;
//   education12thBoard: string;
//   education12thYear: string;
//   education12thPercentage: string;
//   educationGraduationSchool: string;
//   educationGraduationBoard: string;
//   educationGraduationYear: string;
//   educationGraduationPercentage: string;
//   educationPostGraduationSchool: string;
//   educationPostGraduationBoard: string;
//   educationPostGraduationYear: string;
//   educationPostGraduationPercentage: string;
//   hasWorkExperience: string;
//   exam_city: string; // <-- ADDED HERE

//   // Teacher Qualification Fields
//   qualificationTrack10Plus2: string;
//   dedDeledQualification: string;
//   dedDeledInstitute: string;
//   rciCrrNumber: string;
//   trainingPeriodMonths: string;
//   trainingDeferment: boolean;
//   passedTET1: boolean;
// }

// type RegistrationFormErrors = Partial<
//   Record<keyof RegistrationFormData, string>
// >;

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

// // Each row of the "Work Experience" table is its own independent record now
// interface ExperienceRow {
//   id: number;
//   employerDesignation: string;
//   servicePeriodMonths: string;
//   reasonForLeaving: string;
//   certFile: File | null;
//   certPreview: string; // object URL, only set for image files
// }

// const newExperienceRow = (id: number): ExperienceRow => ({
//   id,
//   employerDesignation: "",
//   servicePeriodMonths: "",
//   reasonForLeaving: "",
//   certFile: null,
//   certPreview: "",
// });

// // Single-file upload slots (photo/signature/certificates). Keyed by the same
// // names used in `document.*` on the payload.
// type DocumentKey =
//   | "photo"
//   | "signature"
//   | "eligibilityCert"
//   | "permanentResidentCert"
//   | "domicileCert"
//   | "hslcMarksheet"
//   | "hslcProvisionalCert"
//   | "reservationCategoryCert"
//   | "nocCert";

// interface DocumentSlot {
//   file: File | null;
//   preview: string; // object URL for images, '' otherwise
// }

// const emptyDocumentSlots: Record<DocumentKey, DocumentSlot> = {
//   photo: { file: null, preview: "" },
//   signature: { file: null, preview: "" },
//   eligibilityCert: { file: null, preview: "" },
//   permanentResidentCert: { file: null, preview: "" },
//   domicileCert: { file: null, preview: "" },
//   hslcMarksheet: { file: null, preview: "" },
//   hslcProvisionalCert: { file: null, preview: "" },
//   reservationCategoryCert: { file: null, preview: "" },
//   nocCert: { file: null, preview: "" },
// };

// const initialFormData: RegistrationFormData = {
//   name: "",
//   citizen: "",
//   dialect: "",
//   residencyConfirmed: false,
//   gender: "",
//   maritalStatus: "",
//   reservationCategory: "",
//   ph: "",
//   dobDay: "",
//   dobMonth: "",
//   dobYear: "",
//   mobile: "",
//   email: "",
//   district: "",
//   captchaInput: "",
//   govEmployee: "",
//   fatherName: "",
//   motherName: "",
//   identificationMarks: "",
//   permVillage: "",
//   permCity: "",
//   permState: "",
//   permDistrict: "",
//   permPincode: "",
//   corrVillage: "",
//   corrCity: "",
//   corrState: "",
//   corrDistrict: "",
//   corrPincode: "",
//   sameAsPermanent: false,
//   sponsored: "",
//   nationality: "India",
//   education10thSchool: "",
//   education10thBoard: "",
//   education10thYear: "",
//   education10thPercentage: "",
//   education12thSchool: "",
//   education12thBoard: "",
//   education12thYear: "",
//   education12thPercentage: "",
//   educationGraduationSchool: "",
//   educationGraduationBoard: "",
//   educationGraduationYear: "",
//   educationGraduationPercentage: "",
//   educationPostGraduationSchool: "",
//   educationPostGraduationBoard: "",
//   educationPostGraduationYear: "",
//   educationPostGraduationPercentage: "",
//   hasWorkExperience: "no",
//   exam_city: "", // <-- ADDED HERE
//   qualificationTrack10Plus2: "",
//   dedDeledQualification: "",
//   dedDeledInstitute: "",
//   rciCrrNumber: "",
//   trainingPeriodMonths: "",
//   trainingDeferment: false,
//   passedTET1: false,
// };

// // Payment mode options (used on Step 2 - Payment)
// const paymentModes = [
//   {
//     id: "credit",
//     icon: "credit_card",
//     titleEn: "Credit Card",
//     titleHi: "क्रेडिट कार्ड",
//   },
//   {
//     id: "debit",
//     icon: "credit_score",
//     titleEn: "Debit Card",
//     titleHi: "डेबिट कार्ड",
//   },
//   { id: "upi", icon: "qr_code_scanner", titleEn: "UPI", titleHi: "यूपीआई" },
//   {
//     id: "netbanking",
//     icon: "account_balance",
//     titleEn: "Net Banking",
//     titleHi: "नेट बैंकिंग",
//   },
// ];

// // ---------------------------------------------------------------------------
// // Reusable upload card
// // ---------------------------------------------------------------------------
// function UploadCard({
//   label,
//   hint,
//   icon,
//   accept,
//   file,
//   preview,
//   onSelect,
//   onRemove,
//   compact = false,
// }: {
//   label: string;
//   hint?: string;
//   icon: string;
//   accept?: string;
//   file: File | null;
//   preview: string;
//   onSelect: (file: File) => void;
//   onRemove: () => void;
//   compact?: boolean;
// }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [dragOver, setDragOver] = useState(false);

//   const formatSize = (bytes: number) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };

//   const handleFiles = (files: FileList | null) => {
//     const f = files && files[0];
//     if (f) onSelect(f);
//   };

//   return (
//     <div className="space-y-1.5">
//       <label className="block font-label-md text-[14px] text-on-surface-variant">
//         {label}
//       </label>
//       <div
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setDragOver(false);
//           handleFiles(e.dataTransfer.files);
//         }}
//         onClick={() => inputRef.current?.click()}
//         className={`relative flex items-center gap-3 w-full ${compact ? "p-2.5 min-h-[64px]" : "p-3 min-h-[76px]"} rounded-xl border-2 border-dashed cursor-pointer transition-all
//           ${dragOver ? "border-primary bg-primary/5" : "border-outline-variant/60 bg-surface-container-low hover:border-primary/50 hover:bg-white"}
//         `}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           accept={accept}
//           className="hidden"
//           onChange={(e) => handleFiles(e.target.files)}
//         />

//         {/* Thumbnail / icon */}
//         <div
//           className={`shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-white border border-outline-variant/50 ${
//             compact ? "w-11 h-11" : "w-14 h-14"
//           }`}
//         >
//           {preview ? (
//             <img
//               src={preview}
//               alt={`${label} preview`}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <span className="material-symbols-outlined text-primary/70">
//               {icon}
//             </span>
//           )}
//         </div>

//         {/* Text */}
//         <div className="min-w-0 flex-1">
//           {file ? (
//             <>
//               <p className="text-[13px] font-medium text-on-surface truncate">
//                 {file.name}
//               </p>
//               <p className="text-[11px] text-on-surface-variant/70">
//                 {formatSize(file.size)} &middot; tap to replace
//               </p>
//             </>
//           ) : (
//             <>
//               <p className="text-[13px] font-medium text-primary">
//                 Click or drag file to upload
//               </p>
//               {hint && (
//                 <p className="text-[11px] text-on-surface-variant/70">{hint}</p>
//               )}
//             </>
//           )}
//         </div>

//         {/* Remove */}
//         {file && (
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onRemove();
//               if (inputRef.current) inputRef.current.value = "";
//             }}
//             className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-white hover:bg-red-500 transition-colors"
//             aria-label={`Remove ${label}`}
//           >
//             <span className="material-symbols-outlined text-[16px]">close</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Small read-only "label / value" pair used on the Review step
// // ---------------------------------------------------------------------------
// function ReviewField({
//   label,
//   value,
// }: {
//   label: string;
//   value: React.ReactNode;
// }) {
//   return (
//     <div>
//       <p className="text-on-surface-variant/60 text-[12px] mb-0.5">{label}</p>
//       <p className="font-medium text-[14px] text-on-surface break-words">
//         {value}
//       </p>
//     </div>
//   );
// }

// export default function ApplicationForm() {
//   const [formData, setFormData] =
//     useState<RegistrationFormData>(initialFormData);
//   const [errors, setErrors] = useState<RegistrationFormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // 1 = Application, 2 = Payment, 3 = Review & Submit, 4 = Completed
//   const [currentStep, setCurrentStep] = useState(1);

//   // State for API data
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   // States for dynamic Address APIs
//   const [statesList, setStatesList] = useState<any[]>([]);
//   const [permDistrictsList, setPermDistrictsList] = useState<any[]>([]);
//   const [corrDistrictsList, setCorrDistrictsList] = useState<any[]>([]);

//   const [loading, setLoading] = useState({
//     districts: false,
//     categories: false,
//   });
//   const [, setError] = useState({
//     districts: "",
//     categories: "",
//   });

//   const [documents, setDocuments] =
//     useState<Record<DocumentKey, DocumentSlot>>(emptyDocumentSlots);
//   const [experienceRows, setExperienceRows] = useState<ExperienceRow[]>([
//     newExperienceRow(1),
//   ]);
//   const nextRowId = useRef(2);

//   // Payment step state
//   // Final submission state
//   const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
//   const [referenceNumber] = useState<string>("");
//   const [submissionDate] = useState<string>("");
//   const [paymentMode, setPaymentMode] = useState<string>("");
//   const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);
//   const [applicationId, setApplicationId] = useState<string>("");
//   const [, setPaymentOrderId] = useState<string>("");
//   const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<string>("");
//   const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
//   const [isFetchingAmount, setIsFetchingAmount] = useState(false);

//   const [, setSavedApplicationData] = useState<any>(null);
//   const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
//   const [isAlreadySubmittedPage, setIsAlreadySubmittedPage] = useState(false);
//   const [isSubmittedSuccessPage, setIsSubmittedSuccessPage] = useState(false);

//   // =========================================================================
//   // Auto-redirect to Review Page after returning from Payment Gateway
//   // =========================================================================
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const isFromPaymentGateway =
//       sessionStorage.getItem("paymentRedirect") === "true" ||
//       urlParams.has("payment_status") ||
//       urlParams.has("status") ||
//       urlParams.has("order_id");

//     if (isFromPaymentGateway) {
//       sessionStorage.removeItem("paymentRedirect");
//       // Coming back from the payment gateway means the user already completed
//       // Step 1 (Application) and went through Step 2 (Payment) — so send them
//       // straight to Step 3 (Review & Submit) instead of defaulting back to
//       // Step 1. The fetchApplicationData effect below still runs afterwards
//       // and can correctly override this, e.g. showing the "Already Registered"
//       // page if the backend confirms the application was already submitted.
//       setCurrentStep(3);

//       // Clean up URL parameters
//       if (window.history.replaceState && urlParams.toString()) {
//         const cleanUrl =
//           window.location.protocol +
//           "//" +
//           window.location.host +
//           window.location.pathname;
//         window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
//       }
//     }
//   }, []);

//   const setDocumentFile = (key: DocumentKey, file: File) => {
//     setDocuments((prev) => {
//       if (prev[key].preview) URL.revokeObjectURL(prev[key].preview);
//       const isImage = file.type.startsWith("image/");
//       return {
//         ...prev,
//         [key]: { file, preview: isImage ? URL.createObjectURL(file) : "" },
//       };
//     });
//   };

//   const removeDocumentFile = (key: DocumentKey) => {
//     setDocuments((prev) => {
//       if (prev[key].preview) URL.revokeObjectURL(prev[key].preview);
//       return { ...prev, [key]: { file: null, preview: "" } };
//     });
//   };

//   const updateExperienceRow = (id: number, patch: Partial<ExperienceRow>) => {
//     setExperienceRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
//     );
//   };

//   const setExperienceCert = (id: number, file: File) => {
//     setExperienceRows((prev) =>
//       prev.map((row) => {
//         if (row.id !== id) return row;
//         if (row.certPreview) URL.revokeObjectURL(row.certPreview);
//         const isImage = file.type.startsWith("image/");
//         return {
//           ...row,
//           certFile: file,
//           certPreview: isImage ? URL.createObjectURL(file) : "",
//         };
//       }),
//     );
//   };

//   const removeExperienceCert = (id: number) => {
//     setExperienceRows((prev) =>
//       prev.map((row) => {
//         if (row.id !== id) return row;
//         if (row.certPreview) URL.revokeObjectURL(row.certPreview);
//         return { ...row, certFile: null, certPreview: "" };
//       }),
//     );
//   };

//   const addExperienceRow = () => {
//     setExperienceRows((prev) => [
//       ...prev,
//       newExperienceRow(nextRowId.current++),
//     ]);
//   };

//   const removeExperienceRow = (id: number) => {
//     setExperienceRows((prev) => {
//       const row = prev.find((r) => r.id === id);
//       if (row?.certPreview) URL.revokeObjectURL(row.certPreview);
//       const next = prev.filter((r) => r.id !== id);
//       return next.length ? next : [newExperienceRow(nextRowId.current++)];
//     });
//   };

//   useEffect(() => {
//     return () => {
//       Object.values(documents).forEach(
//         (slot) => slot.preview && URL.revokeObjectURL(slot.preview),
//       );
//       experienceRows.forEach(
//         (row) => row.certPreview && URL.revokeObjectURL(row.certPreview),
//       );
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Fetch standard reference data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading((prev) => ({ ...prev, categories: true }));
//       try {
//         const response = await api.get("/categories");
//         if (response.data.success) {
//           setCategories(response.data.data);
//           setError((prev) => ({ ...prev, categories: "" }));
//         } else {
//           setError((prev) => ({
//             ...prev,
//             categories: "Failed to load categories",
//           }));
//         }
//       } catch (err) {
//         setError((prev) => ({
//           ...prev,
//           categories: "Failed to load categories",
//         }));
//       } finally {
//         setLoading((prev) => ({ ...prev, categories: false }));
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading((prev) => ({ ...prev, districts: true }));
//       try {
//         const data = await getDistricts();
//         if (data && Array.isArray(data)) {
//           setDistricts(data);
//           setError((prev) => ({ ...prev, districts: "" }));
//         } else if (data?.data && Array.isArray(data.data)) {
//           setDistricts(data.data);
//           setError((prev) => ({ ...prev, districts: "" }));
//         } else if (data?.districts && Array.isArray(data.districts)) {
//           setDistricts(data.districts);
//           setError((prev) => ({ ...prev, districts: "" }));
//         } else {
//           setError((prev) => ({
//             ...prev,
//             districts: "Invalid data format received",
//           }));
//         }
//       } catch (err) {
//         setError((prev) => ({
//           ...prev,
//           districts: "Failed to load districts",
//         }));
//       } finally {
//         setLoading((prev) => ({ ...prev, districts: false }));
//       }
//     };
//     fetchData();
//   }, []);

//   // =========================================================================
//   // Fetch States & Districts dynamically for Addresses
//   // =========================================================================
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await api.get("/countries/1/states");
//         if (response.data && response.data.success) {
//           setStatesList(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching states:", err);
//       }
//     };
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     const fetchPermDistricts = async () => {
//       if (!formData.permState) {
//         setPermDistrictsList([]);
//         return;
//       }
//       const selectedState = statesList.find(
//         (s) => s.stateName === formData.permState,
//       );
//       if (selectedState) {
//         try {
//           const response = await api.get(
//             `/states/${selectedState.stateId}/districts`,
//           );
//           if (response.data && response.data.success) {
//             setPermDistrictsList(response.data.data);
//           }
//         } catch (err) {
//           console.error("Error fetching permanent districts:", err);
//         }
//       }
//     };
//     if (statesList.length > 0) {
//       fetchPermDistricts();
//     }
//   }, [formData.permState, statesList]);

//   useEffect(() => {
//     const fetchCorrDistricts = async () => {
//       if (!formData.corrState || formData.sameAsPermanent) {
//         setCorrDistrictsList([]);
//         return;
//       }
//       const selectedState = statesList.find(
//         (s) => s.stateName === formData.corrState,
//       );
//       if (selectedState) {
//         try {
//           const response = await api.get(
//             `/states/${selectedState.stateId}/districts`,
//           );
//           if (response.data && response.data.success) {
//             setCorrDistrictsList(response.data.data);
//           }
//         } catch (err) {
//           console.error("Error fetching correspondence districts:", err);
//         }
//       }
//     };
//     if (statesList.length > 0 && !formData.sameAsPermanent) {
//       fetchCorrDistricts();
//     }
//   }, [formData.corrState, statesList, formData.sameAsPermanent]);

//   // =========================================================================

//   useEffect(() => {
//     const fetchApplicationData = async () => {
//       try {
//         const response = await api.get("/application/steps/all");
//         if (response.data.success && response.data.data) {
//           const appData = response.data.data;

//           if (appData.isSubmitted) {
//             setIsAlreadySubmittedPage(true);
//             return;
//           }

//           const step0 = appData.steps?.step0;

//           // Detect app ID and verify if payment is already complete
//           const fetchedAppId =
//             appData.applicationId || appData._id || step0?.applicationId;
//           const hasCompletedStep1 =
//             Array.isArray(appData.completedSteps) &&
//             appData.completedSteps.includes(1);

//           if (fetchedAppId) {
//             setApplicationId(fetchedAppId);
//             if (hasCompletedStep1) {
//               fetchPaymentAmount(fetchedAppId).then((res) => {
//                 if (res === "already_completed") {
//                   setCurrentStep(3);
//                 } else if (res === "application_submitted") {
//                   setIsAlreadySubmittedPage(true);
//                 }
//               });
//             }
//           }

//           if (step0) {
//             let dobDay = "";
//             let dobMonth = "";
//             let dobYear = "";
//             if (step0.dateOfBirth) {
//               const dateParts = step0.dateOfBirth.split("-");
//               if (dateParts.length === 3) {
//                 dobDay = dateParts[0];
//                 dobMonth = dateParts[1];
//                 dobYear = dateParts[2];
//               }
//             }

//             setFormData((prev) => ({
//               ...prev,
//               name: step0.fullName || "",
//               citizen: step0.citizenOfIndia ? "Yes" : "No",
//               dialect: step0.motherTongue || "",
//               residencyConfirmed: step0.manipurResident || false,
//               gender: step0.gender || "",
//               maritalStatus: step0.maritalStatus || "",
//               reservationCategory: step0.reservationCategory || "",
//               ph: step0.isPwd ? "yes" : "no",
//               dobDay,
//               dobMonth,
//               dobYear,
//               mobile: step0.mobileNumber || "",
//               email: step0.emailId || "",
//               district: step0.selectDistrict || "",
//               captchaInput: "",
//               govEmployee: step0.govEmployee ? "Yes" : "No",
//               permVillage: step0.permanentAddress || "",
//               corrVillage: step0.correspondenceAddress || "",
//               exam_city: step0.exam_city || "",
//             }));
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching application data:", err);
//       }
//     };
//     fetchApplicationData();
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => {
//         const updatedData = { ...prev, [name]: value };
//         // Reset specific district when its state changes
//         if (name === "permState") {
//           updatedData.permDistrict = "";
//         }
//         if (name === "corrState") {
//           updatedData.corrDistrict = "";
//         }
//         return updatedData;
//       });
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   // Scroll-to-top helper used whenever we move between steps
//   const goToStep = (step: number) => {
//     setCurrentStep(step);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Basic required-field validation before leaving Step 1
//   const validateStep1 = () => {
//     const newErrors: RegistrationFormErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
//       newErrors.mobile = "Enter a valid 10-digit mobile number";
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
//       newErrors.email = "Enter a valid email address";
//     }
//     if (!formData.district) newErrors.district = "District is required";

//     if (!formData.passedTET1) {
//       newErrors.passedTET1 = "You must pass TET-1 to proceed.";
//       toast.error("You must check the TET-1 passed checkbox to proceed.");
//     }

//     setErrors((prev) => ({ ...prev, ...newErrors }));
//     return Object.keys(newErrors).length === 0;
//   };

//   const fetchPaymentAmount = async (appId: string) => {
//     setIsFetchingAmount(true);
//     try {
//       const response = await api.post("/payment/initiate", {
//         applicationId: appId,
//       });

//       if (response.data.success) {
//         const data = response.data.data || {};
//         const orderId = data.paymentOrderId || data.orderId || "";
//         const amount =
//           data.amount ?? data.fee ?? data.applicationFee ?? data.payableAmount;
//         const status = data.paymentStatus;

//         if (orderId) setPaymentOrderId(orderId);
//         if (amount !== undefined && amount !== null) {
//           setPaymentAmount(Number(amount));
//         }

//         if (status === "completed" || data.isFree) {
//           setPaymentStatus("completed");
//           return "already_completed";
//         } else if (status) {
//           setPaymentStatus(status);
//         }

//         return "success";
//       } else {
//         if (
//           response.data.message
//             ?.toLowerCase()
//             .includes("already been completed") ||
//           response.data.message?.toLowerCase().includes("already completed")
//         ) {
//           setPaymentStatus("completed");
//           return "application_submitted";
//         }
//         return "error";
//       }
//     } catch (err: any) {
//       if (
//         err.response?.data?.message
//           ?.toLowerCase()
//           .includes("already been completed") ||
//         err.message?.toLowerCase().includes("already completed")
//       ) {
//         setPaymentStatus("completed");
//         return "application_submitted";
//       }
//       return "error";
//     } finally {
//       setIsFetchingAmount(false);
//     }
//   };

//   const handleSaveApplication = async () => {
//     if (!validateStep1()) {
//       toast.error("Please fill all required fields correctly.");
//       return false;
//     }

//     setIsSubmitting(true);
//     try {
//       const {
//         personalDetails,
//         document,
//         education,
//         experience,
//         teacherQualification,
//       } = preparePayload();

//        // 🔍 ADD THESE LOGS HERE - RIGHT AFTER preparePayload()
//     console.log('🔍 FULL PAYLOAD BEFORE SENDING:');
//     console.log('Personal Details:', personalDetails);
//     console.log('Address:', personalDetails.address);
//     console.log('Education:', education);
//     console.log('Experience:', experience);
//     console.log('Teacher Qualification:', teacherQualification);
//     console.log('Documents:', document);

//       const jsonPayload = {
//         personalDetails,
//         education,
//         experience: {
//           has_work_experience: experience.has_work_experience,
//           entries: experience.entries.map(
//             ({ experience_certificate, ...rest }) => rest,
//           ),
//         },
//         teacherQualification,
//       };

//           console.log('🔍 JSON PAYLOAD (without files):', jsonPayload);


//       const formDataObj = new FormData();
//       formDataObj.append("payload", JSON.stringify(jsonPayload));

//       formDataObj.forEach((value, key) => {
//         console.log(key, value);
//       });
      
//       Object.entries(document).forEach(([key, file]) => {
//         if (file) formDataObj.append(`document.${key}`, file as File);
//       });

//       experience.entries.forEach((entry, index) => {
//         if (entry.experience_certificate) {
//           formDataObj.append(
//             `experience.entries[${index}].experience_certificate`,
//             entry.experience_certificate,
//           );
//         }
//       });

//       const response = await api.patch("/auth/candidate/step-1", formDataObj, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log('🔍 SENDING REQUEST TO:', '/auth/candidate/step-1');
//       console.log('🔍 WITH PAYLOAD:', jsonPayload);
//       console.log('🔍 WITH FILES:', formDataObj);

//       if (response.data.success) {
//         toast.success("Application data saved successfully!");

//         const newApplicationId = response.data.data?.applicationId;
//         if (newApplicationId) {
//           setApplicationId(newApplicationId);
//         }
//         setSavedApplicationData(response.data.data);

//         if (newApplicationId) {
//           const paymentResult = await fetchPaymentAmount(newApplicationId);
//           if (
//             paymentResult === "already_completed" ||
//             paymentResult === "application_submitted"
//           ) {
//             if (paymentResult === "application_submitted")
//               setIsApplicationSubmitted(true);
//             return "already_completed";
//           }
//         }

//         return true;
//       } else {
//         toast.error(response.data.message || "Failed to save application");
//         return false;
//       }
//     } catch (err: any) {
//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to save application. Please try again.";

//       if (message.toLowerCase().includes("already")) {
//         // Backend refused to save because it's already registered/completed.
//         // We can just act as if it saved successfully and let them proceed to payment.
//         return true;
//       }

//       toast.error(message);
//       return false;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleNextFromStep1 = async () => {
//     const saved = await handleSaveApplication();
//     if (saved) {
//       goToStep(2);
//     }
//   };

//   // =========================================================================
//   // handleFinalSubmit: Shows success toast, waits 3 seconds, then redirects.
//   // =========================================================================
//   const handleFinalSubmit = async () => {
//     if (!applicationId) {
//       toast.error("Application ID not found. Please try again.");
//       return;
//     }

//     if (isApplicationSubmitted) {
//       setIsSubmittedSuccessPage(true);
//       return;
//     }

//     setIsFinalSubmitting(true);
//     try {
//       const response = await api.post(`/application/${applicationId}/submit`);

//       if (response.data.success) {
//         setIsSubmittedSuccessPage(true);
//       } else {
//         toast.error(response.data.message || "Failed to submit application");
//       }
//     } catch (err: any) {
//       const status = err.response?.status;
//       const serverMessage = err.response?.data?.message || err.message || "";

//       // HTTP 409 Conflict means the application is already submitted on the backend
//       if (status === 409 || serverMessage.toLowerCase().includes("already")) {
//         setIsSubmittedSuccessPage(true);
//       } else {
//         toast.error(
//           serverMessage || "Failed to submit application. Please try again.",
//         );
//       }
//     } finally {
//       setIsFinalSubmitting(false);
//     }
//   };

//   const handleInitiatePayment = async () => {
//     if (!paymentMode) {
//       toast.error("Please select a payment mode");
//       return;
//     }
//     if (!paymentAcknowledged) {
//       toast.error("Please acknowledge the payment terms");
//       return;
//     }

//     setIsPaymentInitiated(true);
//     try {
//       if (!applicationId) {
//         const saved = await handleSaveApplication();
//         if (!saved) {
//           setIsPaymentInitiated(false);
//           return;
//         }
//         if (saved === "already_completed") {
//           toast.info("Application already submitted");
//           goToStep(3);
//           setIsPaymentInitiated(false);
//           return;
//         }
//       }

//       const response = await api.post("/payment/initiate", {
//         applicationId: applicationId,
//         paymentMode: paymentMode,
//       });

//       if (response.data.success) {
//         const {
//           paymentOrderId: newPaymentOrderId,
//           amount,
//           paymentUrl,
//           paymentStatus: newPaymentStatus,
//           isFree,
//         } = response.data.data;

//         if (newPaymentOrderId) setPaymentOrderId(newPaymentOrderId);
//         if (amount !== undefined && amount !== null)
//           setPaymentAmount(Number(amount));

//         setPaymentStatus(newPaymentStatus || "pending");

//         if (paymentUrl) {
//           toast.success("Redirecting to payment gateway...");
//           sessionStorage.setItem("paymentRedirect", "true");
//           window.location.href = paymentUrl;
//         } else if (isFree) {
//           setPaymentStatus("completed");
//           toast.success("Payment completed. Please submit your application.");
//           goToStep(3);
//         } else {
//           toast.error("Payment URL not received");
//           setIsPaymentInitiated(false);
//         }
//       } else {
//         if (
//           response.data.message
//             ?.toLowerCase()
//             .includes("already been completed") ||
//           response.data.message?.toLowerCase().includes("already completed")
//         ) {
//           setPaymentStatus("completed");
//           setIsApplicationSubmitted(true);
//           toast.info("Application already submitted");
//           goToStep(3);
//           setIsPaymentInitiated(false);
//           return;
//         }
//         toast.error(response.data.message || "Failed to initiate payment");
//         setIsPaymentInitiated(false);
//       }
//     } catch (err: any) {
//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to initiate payment";
//       if (
//         message.toLowerCase().includes("already been completed") ||
//         message.toLowerCase().includes("already completed")
//       ) {
//         setPaymentStatus("completed");
//         setIsApplicationSubmitted(true);
//         toast.info("Application already submitted");
//         goToStep(3);
//         setIsPaymentInitiated(false);
//         return;
//       }
//       toast.error(message);
//       setIsPaymentInitiated(false);
//     }
//   };

//   const preparePayload = () => {
//     const address = {
//       permanent: {
//         city: formData.permCity || "",
//         post: formData.permCity || "",
//         state: formData.permState || "",
//         street: formData.permVillage || "",
//         country: "India",
//         pincode: formData.permPincode || "",
//         district: formData.permDistrict || "",
//       },
//       correspondence: {
//         city: formData.sameAsPermanent
//           ? formData.permCity || ""
//           : formData.corrCity || "",
//         post: formData.sameAsPermanent
//           ? formData.permCity || ""
//           : formData.corrCity || "",
//         state: formData.sameAsPermanent
//           ? formData.permState || ""
//           : formData.corrState || "",
//         street: formData.sameAsPermanent
//           ? formData.permVillage || ""
//           : formData.corrVillage || "",
//         country: "India",
//         pincode: formData.sameAsPermanent
//           ? formData.permPincode || ""
//           : formData.corrPincode || "",
//         district: formData.sameAsPermanent
//           ? formData.permDistrict || ""
//           : formData.corrDistrict || "",
//         sameAsPermanent: !!formData.sameAsPermanent,
//       },
//     };

//     const personalDetails = {
//       candidate_name: formData.name || "",
//       citizen_of_india: formData.citizen || "",
//       mother_tongue: formData.dialect || "",
//       manipur_resident: !!formData.residencyConfirmed,
//       date_of_birth:
//         formData.dobDay && formData.dobMonth && formData.dobYear
//           ? `${formData.dobDay}-${formData.dobMonth}-${formData.dobYear}`
//           : "",
//       gender: formData.gender
//         ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)
//         : "",
//       district: formData.district || "",
//       mobile_no: formData.mobile || "",
//       marital_status: formData.maritalStatus
//         ? formData.maritalStatus.charAt(0).toUpperCase() +
//           formData.maritalStatus.slice(1)
//         : "",
//       email: formData.email || "",
//       father_name: formData.fatherName || "",
//       mother_name: formData.motherName || "",
//       identification_marks: formData.identificationMarks || "",
//       address: address, // NEW NESTED ADDRESS PAYLOAD
//       nationality: formData.nationality || "",
//       reservation_category: formData.reservationCategory || "",
//       ph_status: formData.ph === "yes",
//       state_gov_employee: formData.govEmployee === "Yes",
//       employment_exchange_sponsored: formData.sponsored === "Yes",
//       exam_city: formData.exam_city || "", // <-- ADDED HERE TO PAYLOAD
//     };

//     const document = {
//       photo: documents.photo.file,
//       signature: documents.signature.file,
//       eligibility_certificate: documents.eligibilityCert.file,
//       permanent_resident_certificate: documents.permanentResidentCert.file,
//       domicile_certificate: documents.domicileCert.file,
//       hslc_marksheet: documents.hslcMarksheet.file,
//       hslc_provisional_certificate: documents.hslcProvisionalCert.file,

//       // FIX: Only include the file if a reserved category is actually selected
//       reservation_category_certificate:
//         formData.reservationCategory && formData.reservationCategory !== "UR"
//           ? documents.reservationCategoryCert.file
//           : null,

//       noc_certificate:
//         formData.govEmployee === "Yes" ? documents.nocCert.file : null,
//     };

//     const education = [
//       {
//         tenth: {
//           school: formData.education10thSchool || "",
//           board: formData.education10thBoard || "",
//           year: formData.education10thYear || "",
//           percentage: formData.education10thPercentage
//             ? parseFloat(formData.education10thPercentage) || 0
//             : 0,
//         },
//       },
//       {
//         twelfth: {
//           school: formData.education12thSchool || "",
//           board: formData.education12thBoard || "",
//           year: formData.education12thYear || "",
//           percentage: formData.education12thPercentage
//             ? parseFloat(formData.education12thPercentage) || 0
//             : 0,
//         },
//       },
//       {
//         graduation: {
//           school: formData.educationGraduationSchool || "",
//           board: formData.educationGraduationBoard || "",
//           year: formData.educationGraduationYear || "",
//           percentage: formData.educationGraduationPercentage
//             ? parseFloat(formData.educationGraduationPercentage) || 0
//             : 0,
//         },
//       },
//       {
//         post_graduation: {
//           school: formData.educationPostGraduationSchool || "",
//           board: formData.educationPostGraduationBoard || "",
//           year: formData.educationPostGraduationYear || "",
//           percentage: formData.educationPostGraduationPercentage
//             ? parseFloat(formData.educationPostGraduationPercentage) || 0
//             : 0,
//         },
//       },
//     ];

//     const experience = {
//       has_work_experience: formData.hasWorkExperience === "yes",
//       entries:
//         formData.hasWorkExperience === "yes"
//           ? experienceRows.map((row) => ({
//               employer_designation: row.employerDesignation || "",
//               service_period_months: row.servicePeriodMonths
//                 ? parseInt(row.servicePeriodMonths, 10) || 0
//                 : 0,
//               reason_for_leaving: row.reasonForLeaving || "",
//               experience_certificate: row.certFile,
//             }))
//           : [],
//     };

//     const teacherQualification = {
//       qualification_track_10_plus_2: formData.qualificationTrack10Plus2 || "",
//       ded_deled_qualification: formData.dedDeledQualification || "",
//       ded_deled_institute: formData.dedDeledInstitute || "",
//       rci_crr_number: formData.rciCrrNumber || "",
//       training_period_months: formData.trainingPeriodMonths || "",
//       training_deferment: !!formData.trainingDeferment,
//       passed_tet_1: !!formData.passedTET1,
//     };

//     // 🔍 ADD CONSOLE LOGS HERE - RIGHT BEFORE RETURN
//     console.log("🔍 FORM DATA STATE:", {
//       permVillage: formData.permVillage,
//       permCity: formData.permCity,
//       permState: formData.permState,
//       permDistrict: formData.permDistrict,
//       permPincode: formData.permPincode,
//       corrVillage: formData.corrVillage,
//       corrCity: formData.corrCity,
//       corrState: formData.corrState,
//       corrDistrict: formData.corrDistrict,
//       corrPincode: formData.corrPincode,
//       sameAsPermanent: formData.sameAsPermanent,
//     });

//     console.log("🔍 PERSONAL DETAILS being sent:", personalDetails);
//     console.log("🔍 ADDRESS being sent:", personalDetails.address);
//     console.log("🔍 EDUCATION being sent:", education);
//     console.log("🔍 EXPERIENCE being sent:", experience);
//     console.log("🔍 TEACHER QUALIFICATION being sent:", teacherQualification);
//     console.log("🔍 DOCUMENTS being sent:", document);

//     return {
//       personalDetails,
//       document,
//       education,
//       experience,
//       teacherQualification,
//     };
//   };

//   // =========================================================================
//   // Central Review-step submit handler.
//   // This is the single source of truth for what happens when the user
//   // presses the button on Step 3, and is used for BOTH the native form
//   // submit (Enter key) and the button click below, so the two can never
//   // drift apart again.
//   //
//   //   paymentStatus === 'completed' -> actually finalize the application
//   //   paymentStatus === 'pending'   -> a payment is already in flight, wait
//   //   otherwise                     -> send the user to the real payment
//   //                                    gateway via handleInitiatePayment()
//   // =========================================================================
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (currentStep !== 3) return;

//     if (paymentStatus === "completed") {
//       await handleFinalSubmit();
//       return;
//     }

//     if (paymentStatus === "pending") {
//       toast.info(
//         "Payment is already in progress. Please complete the payment.",
//       );
//       return;
//     }

//     await handleInitiatePayment();
//   };

//   const stepNames = ["Application", "Payment", "Review"];

//   const fieldLabel =
//     "block font-label-md text-[14px] text-on-surface-variant mb-1.5";
//   const fieldInput =
//     "w-full h-[46px] px-3.5 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-[14px] transition-colors";

//   const educationRows: {
//     label: string;
//     letter: string;
//     school: keyof RegistrationFormData;
//     board: keyof RegistrationFormData;
//     year: keyof RegistrationFormData;
//     percentage: keyof RegistrationFormData;
//   }[] = [
//     {
//       label: "10th / Equivalent",
//       letter: "A",
//       school: "education10thSchool",
//       board: "education10thBoard",
//       year: "education10thYear",
//       percentage: "education10thPercentage",
//     },
//     {
//       label: "Intermediate / Equi.",
//       letter: "B",
//       school: "education12thSchool",
//       board: "education12thBoard",
//       year: "education12thYear",
//       percentage: "education12thPercentage",
//     },
//     {
//       label: "Graduation",
//       letter: "C",
//       school: "educationGraduationSchool",
//       board: "educationGraduationBoard",
//       year: "educationGraduationYear",
//       percentage: "educationGraduationPercentage",
//     },
//     {
//       label: "Post Graduation",
//       letter: "D",
//       school: "educationPostGraduationSchool",
//       board: "educationPostGraduationBoard",
//       year: "educationPostGraduationYear",
//       percentage: "educationPostGraduationPercentage",
//     },
//   ];

//   const displayVal = (v?: string) => (v && v.trim() ? v : "—");

//   const documentReviewList: [DocumentKey, string][] = [
//     ["photo", "Photograph"],
//     ["signature", "Signature"],
//     ["eligibilityCert", "Certificate of Eligibility"],
//     ["permanentResidentCert", "Permanent Resident Certificate"],
//     ["domicileCert", "Domicile Certificate"],
//     ["hslcMarksheet", "H.S.L.C. Marksheet"],
//     ["hslcProvisionalCert", "H.S.L.C. Provisional Certificate"],
//     // Only listed on the Review step when the candidate picked a reserved category (not UR)
//     ...(formData.reservationCategory && formData.reservationCategory !== "UR"
//       ? ([["reservationCategoryCert", "Reservation Category Certificate"]] as [
//           DocumentKey,
//           string,
//         ][])
//       : []),
//   ];

//   if (isSubmittedSuccessPage) {
//     return (
//       <div className="bg-background min-h-screen flex items-center justify-center font-body-md text-on-surface p-4">
//         <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 text-center max-w-md w-full animate-[fadeIn_0.3s_ease-out]">
//           <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
//             <span className="material-symbols-outlined text-green-600 text-4xl">
//               check_circle
//             </span>
//           </div>
//           <h2 className="text-2xl font-bold text-on-surface mb-2">
//             Application Submitted!
//           </h2>
//           <p className="text-on-surface-variant text-[15px] mb-8">
//             Your application for MSSC 2026 has been successfully submitted. A
//             confirmation will be sent to your registered email address.
//           </p>
//           <button
//             type="button"
//             onClick={() => (window.location.href = "/")}
//             className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white px-8 py-3 rounded-full font-label-md text-[13px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
//           >
//             <span className="material-symbols-outlined text-[18px]">home</span>
//             Go to Home Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isAlreadySubmittedPage) {
//     return (
//       <div className="bg-background min-h-screen flex items-center justify-center font-body-md text-on-surface p-4">
//         <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 text-center max-w-md w-full animate-[fadeIn_0.3s_ease-out]">
//           <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
//             <span className="material-symbols-outlined text-green-600 text-4xl">
//               check_circle
//             </span>
//           </div>
//           <h2 className="text-2xl font-bold text-on-surface mb-2">
//             Already Registered
//           </h2>
//           <p className="text-on-surface-variant text-[15px] mb-8">
//             You have already successfully registered your application for MSSC
//             2026. You do not need to submit it again.
//           </p>
//           <button
//             type="button"
//             onClick={() => (window.location.href = "/")}
//             className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white px-8 py-3.5 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 w-full flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined text-[18px]">home</span>
//             Go to Home Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-background min-h-screen font-body-md text-on-surface">
//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         newestOnTop
//         pauseOnHover
//       />

//       <header className="pt-24 pb-48 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 relative overflow-hidden">
//         <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-white relative z-10">
//           <h1 className="text-6xl font-bold text-white mb-6">
//             {currentStep === 1
//               ? "Application Form"
//               : currentStep === 2
//                 ? "Payment"
//                 : currentStep === 3
//                   ? "Review & Submit"
//                   : "Application Completed"}
//           </h1>
//           <p className="text-white/80 text-xl max-w-2xl mx-auto">
//             {currentStep === 1
//               ? "Join the MSSC 2026 initiative. Fill in your personal details, documents, and educational background to submit your application."
//               : currentStep === 2
//                 ? "Step 2: Select your payment mode for the application fee."
//                 : currentStep === 3
//                   ? "Step 3: Review everything carefully, then submit your application."
//                   : "Your application has been submitted successfully."}
//           </p>

//           <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-12">
//             {[1, 2, 3].map((step, idx) => {
//               const isActive = currentStep === step;
//               const isPast = currentStep > step;
//               return (
//                 <React.Fragment key={step}>
//                   <div
//                     className={`flex items-center gap-3 ${!isActive && !isPast ? "opacity-60" : ""}`}
//                   >
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                         isActive
//                           ? "bg-white text-primary shadow-lg"
//                           : isPast
//                             ? "bg-white text-primary border-2 border-white"
//                             : "border-2 border-white/50 text-white"
//                       }`}
//                     >
//                       {isPast ? (
//                         <span className="material-symbols-outlined text-sm">
//                           check
//                         </span>
//                       ) : (
//                         step
//                       )}
//                     </div>
//                     <span
//                       className={`font-label-md text-[14px] ${isActive ? "font-bold text-white" : "font-medium text-white"}`}
//                     >
//                       {stepNames[step - 1]}
//                     </span>
//                   </div>
//                   {idx < 2 && (
//                     <div className="hidden md:block w-16 h-px bg-white/30"></div>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-32 pb-24 relative z-20">
//         <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 transition-transform duration-300 hover:shadow-xl">
//           <form onSubmit={handleSubmit} noValidate>
//             {/* ================================================================ */}
//             {/* STEP 1 — Application                                             */}
//             {/* ================================================================ */}
//             {currentStep === 1 && (
//               <div className="space-y-14 animate-[fadeIn_0.3s_ease-out]">
//                 {/* ============================================================ */}
//                 {/* 1. Personal Details                                          */}
//                 {/* ============================================================ */}
//                 <section>
//                   <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
//                     <span className="material-symbols-outlined">person</span>
//                     Personal Details
//                   </h2>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
//                     <div>
//                       <label className={fieldLabel}>Name of Candidate</label>
//                       <input
//                         className={fieldInput}
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                       {errors.name && (
//                         <p className="text-red-500 text-[12px] mt-1">
//                           {errors.name}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Date of Birth</label>
//                       <div className="grid grid-cols-3 gap-2">
//                         {[
//                           {
//                             label: "Day",
//                             field: "dobDay" as const,
//                             options: days,
//                           },
//                           {
//                             label: "Month",
//                             field: "dobMonth" as const,
//                             options: months,
//                           },
//                           {
//                             label: "Year",
//                             field: "dobYear" as const,
//                             options: years,
//                           },
//                         ].map((item) => (
//                           <div key={item.field} className="relative">
//                             <select
//                               name={item.field}
//                               value={formData[item.field]}
//                               onChange={handleInputChange}
//                               className={`${fieldInput} appearance-none pr-7 text-on-surface-variant`}
//                             >
//                               <option value="">{item.label}</option>
//                               {item.options.map((opt) => (
//                                 <option key={opt} value={opt}>
//                                   {opt}
//                                 </option>
//                               ))}
//                             </select>
//                             <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">
//                               expand_more
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Gender</label>
//                       <select
//                         className={fieldInput}
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>District</label>
//                       <select
//                         className={fieldInput}
//                         disabled={loading.districts}
//                         name="district"
//                         value={formData.district}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">
//                           {loading.districts ? "Loading..." : "Select District"}
//                         </option>
//                         {districts.map((district) => (
//                           <option
//                             key={district.districtId}
//                             value={district.districtName}
//                           >
//                             {district.districtName}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.district && (
//                         <p className="text-red-500 text-[12px] mt-1">
//                           {errors.district}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Mobile No.</label>
//                       <input
//                         className={fieldInput}
//                         type="tel"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleInputChange}
//                         maxLength={10}
//                       />
//                       {errors.mobile && (
//                         <p className="text-red-500 text-[12px] mt-1">
//                           {errors.mobile}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Marital Status</label>
//                       <select
//                         className={fieldInput}
//                         name="maritalStatus"
//                         value={formData.maritalStatus}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select Status</option>
//                         <option value="unmarried">Unmarried</option>
//                         <option value="married">Married</option>
//                         <option value="divorced">Divorced/Widow</option>
//                       </select>
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className={fieldLabel}>E-mail Address</label>
//                       <input
//                         className={fieldInput}
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                       />
//                       {errors.email && (
//                         <p className="text-red-500 text-[12px] mt-1">
//                           {errors.email}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Father's Name</label>
//                       <input
//                         className={fieldInput}
//                         type="text"
//                         name="fatherName"
//                         value={formData.fatherName}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Mother's Name</label>
//                       <input
//                         className={fieldInput}
//                         type="text"
//                         name="motherName"
//                         value={formData.motherName}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className={fieldLabel}>Identification Marks</label>
//                       <input
//                         className={fieldInput}
//                         type="text"
//                         placeholder="e.g. A mole on the left cheek"
//                         name="identificationMarks"
//                         value={formData.identificationMarks}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     {/* ========================================================= */}
//                     {/* PERMANENT ADDRESS                                         */}
//                     {/* ========================================================= */}
//                     <div className="sm:col-span-2 mt-4">
//                       <h3 className="text-[16px] font-bold text-on-surface mb-4">
//                         Permanent Address
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
//                         <div>
//                           <label className={fieldLabel}>Village / Street</label>
//                           <input
//                             className={fieldInput}
//                             type="text"
//                             name="permVillage"
//                             value={formData.permVillage}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>
//                             City / Post Office
//                           </label>
//                           <input
//                             className={fieldInput}
//                             type="text"
//                             name="permCity"
//                             value={formData.permCity}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>State</label>
//                           <select
//                             className={fieldInput}
//                             name="permState"
//                             value={formData.permState}
//                             onChange={handleInputChange}
//                           >
//                             <option value="">Select State</option>
//                             {statesList.map((s, idx) => (
//                               <option
//                                 key={idx}
//                                 value={s.stateName || s.name || s}
//                               >
//                                 {s.stateName || s.name || s}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>District</label>
//                           <select
//                             className={fieldInput}
//                             name="permDistrict"
//                             value={formData.permDistrict}
//                             onChange={handleInputChange}
//                             disabled={
//                               !formData.permState ||
//                               permDistrictsList.length === 0
//                             }
//                           >
//                             <option value="">Select District</option>
//                             {permDistrictsList.map((d, idx) => (
//                               <option
//                                 key={idx}
//                                 value={d.districtName || d.name || d}
//                               >
//                                 {d.districtName || d.name || d}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>Pincode</label>
//                           <input
//                             className={fieldInput}
//                             type="text"
//                             name="permPincode"
//                             value={formData.permPincode}
//                             onChange={handleInputChange}
//                             maxLength={6}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* ========================================================= */}
//                     {/* CORRESPONDENCE ADDRESS                                    */}
//                     {/* ========================================================= */}
//                     <div className="sm:col-span-2 mt-2">
//                       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
//                         <h3 className="text-[16px] font-bold text-on-surface">
//                           Correspondence Address
//                         </h3>
//                         <label className="flex items-center gap-2 text-[13px] font-medium text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
//                           <input
//                             type="checkbox"
//                             className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
//                             name="sameAsPermanent"
//                             checked={formData.sameAsPermanent}
//                             onChange={handleInputChange}
//                           />
//                           Same as Permanent
//                         </label>
//                       </div>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
//                         <div>
//                           <label className={fieldLabel}>Village / Street</label>
//                           <input
//                             className={`${fieldInput} ${formData.sameAsPermanent ? "bg-surface-container-low text-on-surface-variant" : ""}`}
//                             type="text"
//                             name="corrVillage"
//                             value={
//                               formData.sameAsPermanent
//                                 ? formData.permVillage
//                                 : formData.corrVillage
//                             }
//                             onChange={handleInputChange}
//                             disabled={formData.sameAsPermanent}
//                           />
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>
//                             City / Post Office
//                           </label>
//                           <input
//                             className={`${fieldInput} ${formData.sameAsPermanent ? "bg-surface-container-low text-on-surface-variant" : ""}`}
//                             type="text"
//                             name="corrCity"
//                             value={
//                               formData.sameAsPermanent
//                                 ? formData.permCity
//                                 : formData.corrCity
//                             }
//                             onChange={handleInputChange}
//                             disabled={formData.sameAsPermanent}
//                           />
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>State</label>
//                           <select
//                             className={`${fieldInput} ${formData.sameAsPermanent ? "bg-surface-container-low text-on-surface-variant" : ""}`}
//                             name="corrState"
//                             value={
//                               formData.sameAsPermanent
//                                 ? formData.permState
//                                 : formData.corrState
//                             }
//                             onChange={handleInputChange}
//                             disabled={formData.sameAsPermanent}
//                           >
//                             <option value="">Select State</option>
//                             {statesList.map((s, idx) => (
//                               <option
//                                 key={idx}
//                                 value={s.stateName || s.name || s}
//                               >
//                                 {s.stateName || s.name || s}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>District</label>
//                           <select
//                             className={`${fieldInput} ${formData.sameAsPermanent ? "bg-surface-container-low text-on-surface-variant" : ""}`}
//                             name="corrDistrict"
//                             value={
//                               formData.sameAsPermanent
//                                 ? formData.permDistrict
//                                 : formData.corrDistrict
//                             }
//                             onChange={handleInputChange}
//                             disabled={
//                               formData.sameAsPermanent ||
//                               (!formData.sameAsPermanent &&
//                                 (!formData.corrState ||
//                                   corrDistrictsList.length === 0))
//                             }
//                           >
//                             <option value="">Select District</option>
//                             {(formData.sameAsPermanent
//                               ? permDistrictsList
//                               : corrDistrictsList
//                             ).map((d, idx) => (
//                               <option
//                                 key={idx}
//                                 value={d.districtName || d.name || d}
//                               >
//                                 {d.districtName || d.name || d}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className={fieldLabel}>Pincode</label>
//                           <input
//                             className={`${fieldInput} ${formData.sameAsPermanent ? "bg-surface-container-low text-on-surface-variant" : ""}`}
//                             type="text"
//                             name="corrPincode"
//                             value={
//                               formData.sameAsPermanent
//                                 ? formData.permPincode
//                                 : formData.corrPincode
//                             }
//                             onChange={handleInputChange}
//                             disabled={formData.sameAsPermanent}
//                             maxLength={6}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Nationality</label>
//                       <select
//                         className={fieldInput}
//                         name="nationality"
//                         value={formData.nationality}
//                         onChange={handleInputChange}
//                       >
//                         <option value="India">India</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>Reservation Category</label>
//                       <select
//                         className={fieldInput}
//                         disabled={loading.categories}
//                         name="reservationCategory"
//                         value={formData.reservationCategory}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">
//                           {loading.categories
//                             ? "Loading..."
//                             : "Select Category"}
//                         </option>
//                         {categories.map((category) => (
//                           <option key={category.value} value={category.label}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>PH Status</label>
//                       <select
//                         className={fieldInput}
//                         name="ph"
//                         value={formData.ph}
//                         onChange={handleInputChange}
//                       >
//                         <option value="no">No</option>
//                         <option value="yes">Yes</option>
//                       </select>
//                     </div>

//                     <div className="flex flex-col justify-center">
//                       <p className="font-label-md text-[14px] text-on-surface-variant mb-2">
//                         State Gov. Employee?
//                       </p>
//                       <div className="flex gap-5">
//                         {["Yes", "No"].map((val) => (
//                           <label
//                             key={val}
//                             className="flex items-center gap-2 cursor-pointer"
//                           >
//                             <input
//                               type="radio"
//                               name="govEmployee"
//                               value={val}
//                               checked={formData.govEmployee === val}
//                               onChange={handleInputChange}
//                               className="text-primary"
//                             />
//                             <span className="text-[14px]">{val}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex flex-col justify-center">
//                       <p className="font-label-md text-[14px] text-on-surface-variant mb-2">
//                         Sponsored by Employment Exch.?
//                       </p>
//                       <div className="flex gap-5">
//                         {["Yes", "No"].map((val) => (
//                           <label
//                             key={val}
//                             className="flex items-center gap-2 cursor-pointer"
//                           >
//                             <input
//                               type="radio"
//                               name="sponsored"
//                               value={val}
//                               checked={formData.sponsored === val}
//                               onChange={handleInputChange}
//                               className="text-primary"
//                             />
//                             <span className="text-[14px]">{val}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </section>

//                 {/* ============================================================ */}
//                 {/* 2. Documents & Eligibility                                   */}
//                 {/* ============================================================ */}
//                 <section>
//                   <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
//                     <span className="material-symbols-outlined">
//                       cloud_upload
//                     </span>
//                     Documents &amp; Eligibility
//                   </h2>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                     <UploadCard
//                       label="Photograph"
//                       hint="JPEG only · 20–50 KB"
//                       icon="add_a_photo"
//                       accept=".jpg,.jpeg"
//                       file={documents.photo.file}
//                       preview={documents.photo.preview}
//                       onSelect={(f) => setDocumentFile("photo", f)}
//                       onRemove={() => removeDocumentFile("photo")}
//                     />
//                     <UploadCard
//                       label="Signature"
//                       hint="JPEG only · 20–50 KB"
//                       icon="draw"
//                       accept=".jpg,.jpeg"
//                       file={documents.signature.file}
//                       preview={documents.signature.preview}
//                       onSelect={(f) => setDocumentFile("signature", f)}
//                       onRemove={() => removeDocumentFile("signature")}
//                     />
//                     <UploadCard
//                       label="Certificate of Eligibility (PAN, Aadhaar, etc.)"
//                       icon="badge"
//                       file={documents.eligibilityCert.file}
//                       preview={documents.eligibilityCert.preview}
//                       onSelect={(f) => setDocumentFile("eligibilityCert", f)}
//                       onRemove={() => removeDocumentFile("eligibilityCert")}
//                     />
//                     <UploadCard
//                       label="Permanent Resident Certificate"
//                       icon="home_pin"
//                       file={documents.permanentResidentCert.file}
//                       preview={documents.permanentResidentCert.preview}
//                       onSelect={(f) =>
//                         setDocumentFile("permanentResidentCert", f)
//                       }
//                       onRemove={() =>
//                         removeDocumentFile("permanentResidentCert")
//                       }
//                     />
//                     <UploadCard
//                       label="Domicile Certificate"
//                       icon="apartment"
//                       file={documents.domicileCert.file}
//                       preview={documents.domicileCert.preview}
//                       onSelect={(f) => setDocumentFile("domicileCert", f)}
//                       onRemove={() => removeDocumentFile("domicileCert")}
//                     />
//                     <UploadCard
//                       label="H.S.L.C. / Matriculate Marksheet"
//                       icon="description"
//                       file={documents.hslcMarksheet.file}
//                       preview={documents.hslcMarksheet.preview}
//                       onSelect={(f) => setDocumentFile("hslcMarksheet", f)}
//                       onRemove={() => removeDocumentFile("hslcMarksheet")}
//                     />
//                     <UploadCard
//                       label="H.S.L.C. / Matriculate Provisional Certificate"
//                       icon="verified"
//                       file={documents.hslcProvisionalCert.file}
//                       preview={documents.hslcProvisionalCert.preview}
//                       onSelect={(f) =>
//                         setDocumentFile("hslcProvisionalCert", f)
//                       }
//                       onRemove={() => removeDocumentFile("hslcProvisionalCert")}
//                     />

//                     {formData.govEmployee === "Yes" && (
//                       <UploadCard
//                         label="NOC Certificate"
//                         icon="assignment"
//                         file={documents.nocCert.file}
//                         preview={documents.nocCert.preview}
//                         onSelect={(f) => setDocumentFile("nocCert", f)}
//                         onRemove={() => removeDocumentFile("nocCert")}
//                       />
//                     )}

//                     {/* Only shown when the candidate selects a Reservation Category
//                         other than UR (Unreserved) in the Personal Details section above. */}
//                     {formData.reservationCategory &&
//                       formData.reservationCategory !== "UR" && (
//                         <UploadCard
//                           label="Reservation Category Certificate"
//                           hint="Required for reserved category candidates"
//                           icon="workspace_premium"
//                           file={documents.reservationCategoryCert.file}
//                           preview={documents.reservationCategoryCert.preview}
//                           onSelect={(f) =>
//                             setDocumentFile("reservationCategoryCert", f)
//                           }
//                           onRemove={() =>
//                             removeDocumentFile("reservationCategoryCert")
//                           }
//                         />
//                       )}
//                   </div>
//                   <p className="text-[11px] text-on-surface-variant/70 italic mt-4 px-2">
//                     * For Photograph and Signature: Only jpeg, jpg allowed. File
//                     size: 20kb – 50kb
//                   </p>
//                 </section>

//                 {/* ============================================================ */}
//                 {/* 3. Educational Details                                       */}
//                 {/* ============================================================ */}
//                 <section>
//                   <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
//                     <span className="material-symbols-outlined">school</span>
//                     Educational Details
//                   </h2>

//                   <div className="overflow-x-auto border border-outline-variant rounded-lg">
//                     <table className="w-full text-left border-collapse min-w-[800px]">
//                       <thead className="bg-surface-container-low border-b border-outline-variant">
//                         <tr>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-12 text-center">
//                             Sr.No
//                           </th>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">
//                             Examination
//                           </th>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">
//                             School / College / Institution
//                           </th>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">
//                             Board / University
//                           </th>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">
//                             Year
//                           </th>
//                           <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">
//                             % Marks
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-outline-variant/30">
//                         {educationRows.map((row) => (
//                           <tr
//                             key={row.letter}
//                             className="hover:bg-surface-bright transition-colors"
//                           >
//                             <td className="p-3 text-center text-[14px] font-medium text-on-surface-variant">
//                               {row.letter}
//                             </td>
//                             <td className="p-3 text-[14px] font-medium whitespace-nowrap">
//                               {row.label}
//                             </td>
//                             <td className="p-2">
//                               <input
//                                 type="text"
//                                 className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
//                                 name={row.school}
//                                 value={formData[row.school] as string}
//                                 onChange={handleInputChange}
//                               />
//                             </td>
//                             <td className="p-2">
//                               <input
//                                 type="text"
//                                 className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
//                                 name={row.board}
//                                 value={formData[row.board] as string}
//                                 onChange={handleInputChange}
//                               />
//                             </td>
//                             <td className="p-2">
//                               <input
//                                 type="text"
//                                 className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
//                                 name={row.year}
//                                 value={formData[row.year] as string}
//                                 onChange={handleInputChange}
//                               />
//                             </td>
//                             <td className="p-2">
//                               <input
//                                 type="text"
//                                 className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
//                                 placeholder="99.99"
//                                 name={row.percentage}
//                                 value={formData[row.percentage] as string}
//                                 onChange={handleInputChange}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </section>

//                 {/* ============================================================ */}
//                 {/* 4b. Teacher Qualifications (Added Section)                   */}
//                 {/* ============================================================ */}
//                 <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
//                   <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 pb-3 border-b border-outline-variant/40">
//                     <span className="material-symbols-outlined">
//                       cast_for_education
//                     </span>
//                     Teacher Eligibility & Qualifications
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
//                     <div>
//                       <label className={fieldLabel}>
//                         10+2 / Equivalent Qualification Track:
//                       </label>
//                       <select
//                         className={fieldInput}
//                         name="qualificationTrack10Plus2"
//                         value={formData.qualificationTrack10Plus2}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select</option>
//                         <option value="10+2 / equivalent with at least 50% marks">
//                           10+2 / equivalent with at least 50% marks
//                         </option>
//                         <option value="10+2 / equivalent under NCTE Regulations, 2002 with at least 45% marks">
//                           10+2 / equivalent under NCTE Regulations, 2002 with at
//                           least 45% marks
//                         </option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className={fieldLabel}>
//                         D.Ed. / D.El.Ed. Qualification:
//                       </label>
//                       <select
//                         className={fieldInput}
//                         name="dedDeledQualification"
//                         value={formData.dedDeledQualification}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Select</option>
//                         <option value="D.Ed. in Special Education from RCI approved institute">
//                           D.Ed. in Special Education from RCI approved institute
//                         </option>
//                         <option value="D.El.Ed. equivalent recognized RCI qualification">
//                           D.El.Ed. equivalent recognized RCI qualification
//                         </option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>
//                         D.Ed. / D.El.Ed. Institute:
//                       </label>
//                       <input
//                         type="text"
//                         className={fieldInput}
//                         name="dedDeledInstitute"
//                         value={formData.dedDeledInstitute}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div>
//                       <label className={fieldLabel}>RCI CRR Number:</label>
//                       <input
//                         type="text"
//                         className={fieldInput}
//                         name="rciCrrNumber"
//                         value={formData.rciCrrNumber}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div>
//                       <label className={fieldLabel}>
//                         Cross-disability Inclusive Education Training Period
//                         (Months):
//                       </label>
//                       <input
//                         type="number"
//                         className={fieldInput}
//                         name="trainingPeriodMonths"
//                         value={formData.trainingPeriodMonths}
//                         onChange={handleInputChange}
//                       />
//                       <p className="text-[11px] text-on-surface-variant/70 mt-1">
//                         Minimum 6 months required unless deferment
//                         acknowledgement is selected.
//                       </p>
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="flex items-start gap-3 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           name="passedTET1"
//                           checked={formData.passedTET1}
//                           onChange={handleInputChange}
//                           className="mt-1 rounded accent-red-600 border-red-600 focus:ring-red-600 w-4 h-4 cursor-pointer"
//                         />
//                         <span className="text-[14px] font-bold text-red-600">
//                           Yes, passed Teacher Eligibility Test-1 (TET-1)
//                           conducted by the State Government or an NCTE-approved
//                           agency.
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                 </section>
//                 <div>
//                   <label className={fieldLabel}>
//                     Choose centre city/district
//                   </label>
//                   <select
//                     className={fieldInput}
//                     name="exam_city"
//                     value={formData.exam_city}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select Status</option>
//                     <option value="Imphal">Imphal</option>
//                     <option value="Churachandpur">Churachandpur</option>
//                     <option value="Senapati">Senapati</option>
//                   </select>
//                 </div>

//                 {/* ============================================================ */}
//                 {/* 4. Work Experience Details                                   */}
//                 {/* ============================================================ */}
//                 <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
//                   <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//                     <h2 className="text-xl font-bold text-primary flex items-center gap-2">
//                       <span className="material-symbols-outlined">work</span>
//                       Work Experience Details
//                     </h2>
//                     <div className="flex items-center gap-4">
//                       {["yes", "no"].map((val) => (
//                         <label
//                           key={val}
//                           className="flex items-center gap-2 cursor-pointer group"
//                         >
//                           <input
//                             type="radio"
//                             name="hasWorkExperience"
//                             value={val}
//                             className="text-primary focus:ring-primary"
//                             checked={formData.hasWorkExperience === val}
//                             onChange={handleInputChange}
//                           />
//                           <span className="font-label-md text-[14px] text-on-surface group-hover:text-primary transition-colors capitalize">
//                             {val}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {formData.hasWorkExperience === "yes" && (
//                     <div className="space-y-6">
//                       {experienceRows.map((row, index) => (
//                         <div
//                           key={row.id}
//                           className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr_1fr_auto] gap-4 items-start ${
//                             index > 0
//                               ? "pt-6 border-t border-outline-variant/50"
//                               : ""
//                           }`}
//                         >
//                           <div>
//                             <label className={fieldLabel}>
//                               Employer / Designation
//                             </label>
//                             <input
//                               className={fieldInput}
//                               placeholder="Employer / Designation"
//                               type="text"
//                               value={row.employerDesignation}
//                               onChange={(e) =>
//                                 updateExperienceRow(row.id, {
//                                   employerDesignation: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div>
//                             <label className={fieldLabel}>
//                               Service Period (Months)
//                             </label>
//                             <input
//                               className={fieldInput}
//                               placeholder="Total Months"
//                               type="number"
//                               value={row.servicePeriodMonths}
//                               onChange={(e) =>
//                                 updateExperienceRow(row.id, {
//                                   servicePeriodMonths: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div>
//                             <UploadCard
//                               label="Experience Certificate"
//                               icon="workspace_premium"
//                               file={row.certFile}
//                               preview={row.certPreview}
//                               onSelect={(f) => setExperienceCert(row.id, f)}
//                               onRemove={() => removeExperienceCert(row.id)}
//                               compact
//                             />
//                           </div>
//                           <div>
//                             <label className={fieldLabel}>
//                               Reason of Leaving
//                             </label>
//                             <input
//                               className={fieldInput}
//                               placeholder="Remark"
//                               type="text"
//                               value={row.reasonForLeaving}
//                               onChange={(e) =>
//                                 updateExperienceRow(row.id, {
//                                   reasonForLeaving: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                           <div className="flex md:items-end h-full pb-0.5">
//                             {experienceRows.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeExperienceRow(row.id)}
//                                 className="w-[46px] h-[46px] mt-6 md:mt-0 rounded-lg border border-outline-variant/60 text-on-surface-variant/70 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors flex items-center justify-center"
//                                 aria-label="Remove this row"
//                               >
//                                 <span className="material-symbols-outlined text-[18px]">
//                                   delete
//                                 </span>
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={addExperienceRow}
//                         className="border border-primary text-primary bg-white px-8 py-3.5 rounded-full font-label-md text-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5 transition-all active:scale-95 flex items-center gap-2"
//                       >
//                         <span className="material-symbols-outlined text-sm">
//                           add
//                         </span>
//                         Add More
//                       </button>
//                     </div>
//                   )}
//                 </section>

//                 {/* ============================================================ */}
//                 {/* 5. Step 1 navigation — Next only                             */}
//                 {/* ============================================================ */}
//                 <div className="flex flex-col items-center justify-center pt-12 border-t border-outline-variant/30 space-y-4">
//                   <button
//                     type="button"
//                     onClick={handleNextFromStep1}
//                     disabled={isSubmitting || isFetchingAmount}
//                     className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white px-16 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting
//                       ? "Saving..."
//                       : isFetchingAmount
//                         ? "Fetching Fee..."
//                         : "Next: Payment"}
//                     <span className="material-symbols-outlined text-[18px]">
//                       arrow_forward
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ================================================================ */}
//             {/* STEP 2 — Payment                                                 */}
//             {/* ================================================================ */}
//             {currentStep === 2 && (
//               <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
//                 <section>
//                   <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
//                     <span className="material-symbols-outlined">payments</span>
//                     Payment
//                   </h2>

//                   <div className="border border-outline-variant rounded-2xl p-6 md:p-8 bg-white">
//                     {/* Fee */}
//                     <div className="mb-8">
//                       <h3 className="text-[15px] font-bold text-on-surface mb-3">
//                         Your applicable fee · आपका लागू शुल्क
//                       </h3>
//                       <div className="bg-[#f0f9f3] border border-[#c3e6cb] rounded-xl p-4 flex items-center gap-4">
//                         <span className="material-symbols-outlined text-green-700 text-2xl font-light">
//                           check_circle
//                         </span>
//                         <div>
//                           <p className="text-2xl font-bold text-green-800 leading-none mb-1">
//                             {isFetchingAmount
//                               ? "Loading..."
//                               : paymentAmount !== null
//                                 ? `₹${paymentAmount}`
//                                 : "—"}
//                           </p>
//                           <p className="text-[13px] text-on-surface-variant/80 font-medium">
//                             Application fee for MSSC 2026
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Payment Mode */}
//                     <div className="mb-6">
//                       <h3 className="text-[15px] font-bold text-on-surface mb-0.5">
//                         <span className="text-red-500">*</span> Select payment
//                         mode
//                       </h3>
//                       <p className="text-[13px] text-on-surface-variant/70 font-medium mb-4">
//                         भुगतान का तरीका चुनें
//                       </p>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                         {paymentModes.map((mode) => (
//                           <div
//                             key={mode.id}
//                             onClick={() => setPaymentMode(mode.id)}
//                             className={`border rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
//                               paymentMode === mode.id
//                                 ? "border-primary bg-primary/5 ring-1 ring-primary"
//                                 : "border-outline-variant hover:border-primary/40"
//                             }`}
//                           >
//                             <span className="material-symbols-outlined text-on-surface-variant text-[28px] mb-2 font-light">
//                               {mode.icon}
//                             </span>
//                             <p className="font-bold text-on-surface text-[14px]">
//                               {mode.titleEn}
//                             </p>
//                             <p className="text-[12px] text-on-surface-variant/70 mt-0.5">
//                               {mode.titleHi}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Info Banner */}
//                     <div className="bg-[#fdf8f3] border border-[#fce8d5] rounded-xl p-4 mb-8">
//                       <p className="text-[13.5px] text-[#9a3412] leading-relaxed">
//                         After you click "Proceed to Pay", you will be redirected
//                         to the official payment gateway. Once payment succeeds,
//                         you'll be brought back here to review your application
//                         before final submission. · भुगतान सफल होने के बाद आप
//                         अपने आवेदन की समीक्षा के लिए वापस आएँगे।
//                       </p>
//                     </div>

//                     {/* Acknowledgement */}
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         id="acknowledge"
//                         className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
//                         checked={paymentAcknowledged}
//                         onChange={(e) =>
//                           setPaymentAcknowledged(e.target.checked)
//                         }
//                       />
//                       <label
//                         htmlFor="acknowledge"
//                         className="text-[14px] text-on-surface font-semibold cursor-pointer select-none"
//                       >
//                         I acknowledge the examination fee is non-refundable and
//                         non-transferable. · मैं स्वीकार करता/करती हूँ कि शुल्क
//                         अप्रतिदेय है।
//                       </label>
//                     </div>
//                   </div>
//                 </section>

//                 <div className="flex items-center justify-center gap-4 pt-8 border-t border-outline-variant/30">
//                   <button
//                     type="button"
//                     onClick={() => goToStep(1)}
//                     className="px-8 py-4 border-2 border-outline-variant text-on-surface-variant rounded-full font-label-md text-[14px] font-bold hover:bg-surface-container-low transition-all active:scale-95"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleInitiatePayment}
//                     disabled={
//                       !paymentMode || !paymentAcknowledged || isPaymentInitiated
//                     }
//                     className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white px-16 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isPaymentInitiated ? "Redirecting..." : "Proceed to Pay"}
//                     <span className="material-symbols-outlined text-[18px]">
//                       {isPaymentInitiated ? "hourglass_top" : "arrow_forward"}
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ================================================================ */}
//             {/* STEP 3 — Review & Submit                                         */}
//             {/* ================================================================ */}
//             {currentStep === 3 && (
//               <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
//                 <section>
//                   <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/40">
//                     <h2 className="text-xl font-bold text-primary flex items-center gap-2">
//                       <span className="material-symbols-outlined">
//                         fact_check
//                       </span>
//                       Review Your Application
//                     </h2>
//                   </div>
//                   <p className="text-on-surface-variant text-[14px] mb-8">
//                     Please review all the details carefully before submitting.
//                     Click "Edit" next to any section to make changes.
//                   </p>

//                   {/* Personal Details */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Personal Details
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
//                       <ReviewField
//                         label="Name"
//                         value={displayVal(formData.name)}
//                       />
//                       <ReviewField
//                         label="Date of Birth"
//                         value={
//                           formData.dobDay &&
//                           formData.dobMonth &&
//                           formData.dobYear
//                             ? `${formData.dobDay}-${formData.dobMonth}-${formData.dobYear}`
//                             : "—"
//                         }
//                       />
//                       <ReviewField
//                         label="Gender"
//                         value={
//                           <span className="capitalize">
//                             {displayVal(formData.gender)}
//                           </span>
//                         }
//                       />
//                       <ReviewField
//                         label="Marital Status"
//                         value={
//                           <span className="capitalize">
//                             {displayVal(formData.maritalStatus)}
//                           </span>
//                         }
//                       />
//                       <ReviewField
//                         label="Mobile No."
//                         value={displayVal(formData.mobile)}
//                       />
//                       <ReviewField
//                         label="Email"
//                         value={displayVal(formData.email)}
//                       />
//                       <ReviewField
//                         label="Father's Name"
//                         value={displayVal(formData.fatherName)}
//                       />
//                       <ReviewField
//                         label="Mother's Name"
//                         value={displayVal(formData.motherName)}
//                       />
//                       <ReviewField
//                         label="District"
//                         value={displayVal(formData.district)}
//                       />
//                       <ReviewField
//                         label="Nationality"
//                         value={displayVal(formData.nationality)}
//                       />
//                       <ReviewField
//                         label="Reservation Category"
//                         value={displayVal(formData.reservationCategory)}
//                       />
//                       <ReviewField
//                         label="PH Status"
//                         value={formData.ph === "yes" ? "Yes" : "No"}
//                       />
//                       <ReviewField
//                         label="State Gov. Employee"
//                         value={displayVal(formData.govEmployee)}
//                       />
//                       <ReviewField
//                         label="Sponsored by Employment Exch."
//                         value={displayVal(formData.sponsored)}
//                       />
//                       <ReviewField
//                         label="Identification Marks"
//                         value={displayVal(formData.identificationMarks)}
//                       />
//                       <ReviewField
//                         label="Exam City"
//                         value={displayVal(formData.exam_city)}
//                       />
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Address
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <ReviewField
//                         label="Permanent Address"
//                         value={
//                           [
//                             formData.permVillage,
//                             formData.permCity,
//                             formData.permState,
//                             formData.permDistrict,
//                             formData.permPincode,
//                           ]
//                             .filter(Boolean)
//                             .join(", ") || "—"
//                         }
//                       />
//                       <ReviewField
//                         label="Correspondence Address"
//                         value={
//                           formData.sameAsPermanent
//                             ? [
//                                 formData.permVillage,
//                                 formData.permCity,
//                                 formData.permState,
//                                 formData.permDistrict,
//                                 formData.permPincode,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ") || "—"
//                             : [
//                                 formData.corrVillage,
//                                 formData.corrCity,
//                                 formData.corrState,
//                                 formData.corrDistrict,
//                                 formData.corrPincode,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ") || "—"
//                         }
//                       />
//                     </div>
//                   </div>

//                   {/* Documents */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Documents
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
//                       {documentReviewList.map(([key, label]) => (
//                         <li key={key} className="flex items-center gap-2">
//                           <span
//                             className={`material-symbols-outlined text-[18px] ${documents[key].file ? "text-green-600" : "text-red-400"}`}
//                           >
//                             {documents[key].file ? "check_circle" : "error"}
//                           </span>
//                           <span className="text-on-surface-variant/80">
//                             {label}:
//                           </span>
//                           <span className="font-medium truncate">
//                             {documents[key].file
//                               ? documents[key].file!.name
//                               : "Not uploaded"}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Education */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Educational Details
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-left border-collapse min-w-[600px] text-[14px]">
//                         <thead>
//                           <tr className="border-b border-outline-variant/40">
//                             <th className="p-2 text-on-surface-variant/70 font-medium">
//                               Examination
//                             </th>
//                             <th className="p-2 text-on-surface-variant/70 font-medium">
//                               School / Institution
//                             </th>
//                             <th className="p-2 text-on-surface-variant/70 font-medium">
//                               Board
//                             </th>
//                             <th className="p-2 text-on-surface-variant/70 font-medium">
//                               Year
//                             </th>
//                             <th className="p-2 text-on-surface-variant/70 font-medium">
//                               % Marks
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {educationRows.map((row) => (
//                             <tr
//                               key={row.letter}
//                               className="border-b border-outline-variant/20 last:border-b-0"
//                             >
//                               <td className="p-2 font-medium">{row.label}</td>
//                               <td className="p-2">
//                                 {displayVal(formData[row.school] as string)}
//                               </td>
//                               <td className="p-2">
//                                 {displayVal(formData[row.board] as string)}
//                               </td>
//                               <td className="p-2">
//                                 {displayVal(formData[row.year] as string)}
//                               </td>
//                               <td className="p-2">
//                                 {displayVal(formData[row.percentage] as string)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Work Experience */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Work Experience
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     {formData.hasWorkExperience === "yes" ? (
//                       <div className="space-y-4">
//                         {experienceRows.map((row) => (
//                           <div
//                             key={row.id}
//                             className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-4 border-b border-outline-variant/20 last:border-b-0 last:pb-0"
//                           >
//                             <ReviewField
//                               label="Employer / Designation"
//                               value={displayVal(row.employerDesignation)}
//                             />
//                             <ReviewField
//                               label="Service Period"
//                               value={
//                                 row.servicePeriodMonths
//                                   ? `${row.servicePeriodMonths} months`
//                                   : "—"
//                               }
//                             />
//                             <ReviewField
//                               label="Reason of Leaving"
//                               value={displayVal(row.reasonForLeaving)}
//                             />
//                             <ReviewField
//                               label="Certificate"
//                               value={
//                                 row.certFile
//                                   ? row.certFile.name
//                                   : "Not uploaded"
//                               }
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-[14px] text-on-surface-variant/70">
//                         No work experience declared.
//                       </p>
//                     )}
//                   </div>

//                   {/* Teacher Qualification Review */}
//                   <div className="border border-outline-variant rounded-xl p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Teacher Qualifications
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(1)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
//                       <ReviewField
//                         label="10+2 Qualification Track"
//                         value={displayVal(formData.qualificationTrack10Plus2)}
//                       />
//                       <ReviewField
//                         label="D.Ed. / D.El.Ed. Qualification"
//                         value={displayVal(formData.dedDeledQualification)}
//                       />
//                       <ReviewField
//                         label="D.Ed. / D.El.Ed. Institute"
//                         value={displayVal(formData.dedDeledInstitute)}
//                       />
//                       <ReviewField
//                         label="RCI CRR Number"
//                         value={displayVal(formData.rciCrrNumber)}
//                       />
//                       <ReviewField
//                         label="Training Period (Months)"
//                         value={displayVal(formData.trainingPeriodMonths)}
//                       />
//                       <ReviewField
//                         label="Training Deferment"
//                         value={formData.trainingDeferment ? "Yes" : "No"}
//                       />
//                       <ReviewField
//                         label="Passed TET-1"
//                         value={formData.passedTET1 ? "Yes" : "No"}
//                       />
//                     </div>
//                   </div>

//                   {/* Payment */}
//                   <div className="border border-outline-variant rounded-xl p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-[16px] font-bold text-on-surface">
//                         Payment
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => goToStep(2)}
//                         className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-[16px]">
//                           edit
//                         </span>{" "}
//                         Edit
//                       </button>
//                     </div>
//                     <div className="flex items-center gap-3 text-[14px]">
//                       <span className="text-on-surface-variant/70">
//                         Payment Mode:
//                       </span>
//                       <span className="font-medium">
//                         {paymentModes.find((m) => m.id === paymentMode)
//                           ?.titleEn || "Not selected"}
//                       </span>
//                       <span className="text-on-surface-variant/40">|</span>
//                       <span className="font-bold text-green-700">
//                         {paymentAmount !== null ? `₹${paymentAmount}` : "₹135"}
//                       </span>
//                     </div>
//                     {paymentStatus === "pending" && (
//                       <div className="mt-3 text-amber-600 text-[13px] flex items-center gap-2">
//                         <span className="material-symbols-outlined text-[18px]">
//                           pending
//                         </span>
//                         Payment is being processed...
//                       </div>
//                     )}
//                     {paymentStatus === "completed" && (
//                       <div className="mt-3 text-green-600 text-[13px] flex items-center gap-2">
//                         <span className="material-symbols-outlined text-[18px]">
//                           check_circle
//                         </span>
//                         Payment completed successfully!
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 <div className="flex items-center justify-center gap-4 pt-8 border-t border-outline-variant/30">
//                   <button
//                     type="button"
//                     onClick={() => goToStep(2)}
//                     className="px-8 py-4 border-2 border-outline-variant text-on-surface-variant rounded-full font-label-md text-[14px] font-bold hover:bg-surface-container-low transition-all active:scale-95"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isFinalSubmitting || isPaymentInitiated}
//                     className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white px-16 py-4 rounded-full font-label-md text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     {isFinalSubmitting
//                       ? "Submitting..."
//                       : isPaymentInitiated
//                         ? "Redirecting..."
//                         : paymentStatus === "completed"
//                           ? "Submit Application"
//                           : "Proceed to Payment"}
//                     <span className="material-symbols-outlined text-[18px]">
//                       {isFinalSubmitting || isPaymentInitiated
//                         ? "hourglass_top"
//                         : "send"}
//                     </span>
//                   </button>
//                 </div>
//                 <p className="text-on-surface-variant font-label-sm text-[12px] text-center">
//                   By submitting, you agree to the{" "}
//                   <a
//                     className="text-primary font-bold hover:underline"
//                     href="#"
//                   >
//                     Terms and Conditions
//                   </a>{" "}
//                   of MSSC 2026.
//                 </p>
//               </div>
//             )}
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }
import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, FileText, CreditCard, CheckCircle, Upload, Loader2 } from 'lucide-react';

// --- TYPES & INTERFACES ---
type Address = { village: string; city: string; state: string; district: string; pincode: string; policeStation: string };
type EducationLevel = { college: string; board: string; year: string; percentage: string };
type Experience = { designation: string; duration: string; certificate: File | null; reasonLeaving: string };

interface FormState {
  personalDetails: {
    name: string; dob: string; gender: string; district: string; maritalStatus: string;
    mobile: string; email: string; fatherName: string; motherName: string; nationality: string;
    reservationCategory: string; pwdStatus: string; typeOfDisability: string; is40Percent: string;
    stateGovEmployee: string; sponsoredExchange: string; identificationMarks: string;
  };
  address: { permanent: Address; correspond: Address; sameAsPermanent: boolean };
  documents: {
    photograph: File | null; signature: File | null; eligibilityCert: File | null;
    permanentResCert: File | null; domicileCert: File | null; hslcMarksheet: File | null;
    hslcProvCert: File | null; nocCert: File | null; reservationCert: File | null;
  };
  education: { '10th': EducationLevel; '12th': EducationLevel; graduation: EducationLevel; postGraduation: EducationLevel };
  teacherEligibility: { tenPlusTwoCert: File | null; dedQual: string; dedInstitution: string; crossDisabilityPeriod: string; rciNumber: string; };
  experience: Experience[];
}

const emptyAddress: Address = { village: '', city: '', state: '', district: '', pincode: '', policeStation: '' };
const emptyEducation: EducationLevel = { college: '', board: '', year: '', percentage: '' };

const initialState: FormState = {
  personalDetails: {
    name: '', dob: '', gender: '', district: '', maritalStatus: '', mobile: '', email: '', fatherName: '', motherName: '', nationality: '',
    reservationCategory: '', pwdStatus: 'no', typeOfDisability: '', is40Percent: 'no', stateGovEmployee: 'no', sponsoredExchange: 'no', identificationMarks: ''
  },
  address: { permanent: { ...emptyAddress }, correspond: { ...emptyAddress }, sameAsPermanent: false },
  documents: {
    photograph: null, signature: null, eligibilityCert: null, permanentResCert: null, domicileCert: null,
    hslcMarksheet: null, hslcProvCert: null, nocCert: null, reservationCert: null
  },
  education: { '10th': { ...emptyEducation }, '12th': { ...emptyEducation }, graduation: { ...emptyEducation }, postGraduation: { ...emptyEducation } },
  teacherEligibility: { tenPlusTwoCert: null, dedQual: '', dedInstitution: '', crossDisabilityPeriod: '', rciNumber: '' },
  experience: [{ designation: '', duration: '', certificate: null, reasonLeaving: '' }]
};

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialState);
  
  // API Integration States
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; // Replace with your actual env var

  // --- HANDLERS ---
  const handleNext = async () => {
    // 🔴 FETCH TOKEN SAVED BY LOGIN PAGE
    const token = localStorage.getItem('accessToken');

    if (step === 1) {
      try {
        setIsProcessing(true);

        // 1. Prepare FormData (Allows mixing JSON with binary Files)
        const payload = new FormData();
        payload.append('personaldetails', JSON.stringify(formData.personalDetails));
        payload.append('address', JSON.stringify(formData.address));
        payload.append('education', JSON.stringify(formData.education));
        payload.append('teachereligibilit', JSON.stringify({
          dedQual: formData.teacherEligibility.dedQual,
          dedInstitution: formData.teacherEligibility.dedInstitution,
          crossDisabilityPeriod: formData.teacherEligibility.crossDisabilityPeriod,
          rciNumber: formData.teacherEligibility.rciNumber
        }));
        
        // Map experience without the File object, append files separately below
        const experienceJson = formData.experience.map(exp => ({
           designation: exp.designation,
           duration: exp.duration,
           reasonLeaving: exp.reasonLeaving
        }));
        payload.append('experience', JSON.stringify(experienceJson));

        // Append Binary Files
        Object.entries(formData.documents).forEach(([key, file]) => {
          if (file) payload.append(key, file);
        });
        if (formData.teacherEligibility.tenPlusTwoCert) {
          payload.append('tenPlusTwoCert', formData.teacherEligibility.tenPlusTwoCert);
        }
        formData.experience.forEach((exp, index) => {
          if (exp.certificate) payload.append(`experienceCert_${index}`, exp.certificate);
        });

        // 2. Call Step 1 API (🔴 ADDED TOKEN TO HEADERS)
        const step1Response = await axios.patch(`${BASE_URL}/auth/candidate/step-1`, payload, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        if (step1Response.data.success) {
          const appId = step1Response.data.data.applicationId;
          setApplicationId(appId);

          // 3. Call Payment Initiate API (🔴 ADDED TOKEN TO HEADERS)
          const paymentResponse = await axios.post(`${BASE_URL}/payment/initiate`, {
            applicationId: appId
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (paymentResponse.data.success) {
            const paymentUrl = paymentResponse.data.data.paymentUrl;
            // 4. Redirect user to payment gateway
            window.location.href = paymentUrl; 
            return; // Stop execution here as page unloads
          }
        }
      } catch (error) {
        console.error('Error in Step 1 or Payment Initiation:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else if (step === 2) {
      // In a real flow, they are redirected. This is just for UI progression if skipping payment.
      setStep(3);
    } else if (step === 3) {
      // FINAL SUBMIT API
      try {
        setIsProcessing(true);
        if (!applicationId) {
            alert('Application ID is missing.');
            return;
        }

        // 🔴 ADDED TOKEN TO HEADERS
        const submitResponse = await axios.post(`${BASE_URL}/final-submit`, {
          applicationId: applicationId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (submitResponse.data?.success || submitResponse.status === 200) {
          alert('Application Successfully Submitted!');
          console.log('Final Submit Response:', submitResponse.data);
        }
      } catch (error) {
        console.error('Final Submit Error:', error);
        alert('Failed to submit application.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  // --- RENDER HELPERS ---
  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 pb-4 border-b">
      {[
        { num: 1, label: 'Application', icon: FileText },
        { num: 2, label: 'Payment', icon: CreditCard },
        { num: 3, label: 'Review', icon: CheckCircle }
      ].map((s, idx) => (
        <div key={idx} className={`flex flex-col items-center flex-1 ${step >= s.num ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= s.num ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
            <s.icon size={20} />
          </div>
          <span className="text-sm font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg my-10">
      {renderStepIndicator()}

      <div className="min-h-[500px]">
        {step === 1 && <Step1Application data={formData} setData={setFormData} />}
        {step === 2 && <Step2Payment />}
        {step === 3 && <Step3Review data={formData} />}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={handlePrev}
          disabled={step === 1 || isProcessing}
          className={`px-6 py-2 rounded-md font-medium transition ${step === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isProcessing}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition flex items-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={18} /> : null}
          {step === 3 ? 'Submit Application' : 'Save & Next'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// STEP 1: APPLICATION
// ==========================================
function Step1Application({ data, setData }: { data: FormState, setData: React.Dispatch<React.SetStateAction<FormState>> }) {
  
  const updateField = (category: keyof FormState, field: string, value: any, subCategory?: string) => {
    setData(prev => {
      if (subCategory) {
        return { ...prev, [category]: { ...prev[category], [subCategory]: { ...(prev[category] as any)[subCategory], [field]: value } } };
      }
      return { ...prev, [category]: { ...prev[category], [field]: value } };
    });
  };

  const handleAddressToggle = (checked: boolean) => {
    setData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        sameAsPermanent: checked,
        correspond: checked ? { ...prev.address.permanent } : { ...emptyAddress }
      }
    }));
  };

  const addExperience = () => {
    setData(prev => ({ ...prev, experience: [...prev.experience, { designation: '', duration: '', certificate: null, reasonLeaving: '' }] }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const Input = ({ label, value, onChange, type = "text" }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input type={type} value={value || ''} onChange={onChange} className="border p-2 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none" />
    </div>
  );

  const FileInput = ({ label, onChange }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="border border-dashed border-gray-300 p-2 rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm overflow-hidden">
        <Upload size={16} className="mr-2 text-gray-500 shrink-0" />
        <input type="file" onChange={onChange} className="w-full text-xs" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>

      {/* PERSONAL DETAILS */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-green-700">1. Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Candidate Name" value={data.personalDetails.name} onChange={(e: any) => updateField('personalDetails', 'name', e.target.value)} />
          <Input label="Date of Birth" type="date" value={data.personalDetails.dob} onChange={(e: any) => updateField('personalDetails', 'dob', e.target.value)} />
          <Input label="Gender" value={data.personalDetails.gender} onChange={(e: any) => updateField('personalDetails', 'gender', e.target.value)} />
          <Input label="Mobile Number" value={data.personalDetails.mobile} onChange={(e: any) => updateField('personalDetails', 'mobile', e.target.value)} />
          <Input label="Email Address" type="email" value={data.personalDetails.email} onChange={(e: any) => updateField('personalDetails', 'email', e.target.value)} />
          <Input label="Father's Name" value={data.personalDetails.fatherName} onChange={(e: any) => updateField('personalDetails', 'fatherName', e.target.value)} />
          <Input label="Mother's Name" value={data.personalDetails.motherName} onChange={(e: any) => updateField('personalDetails', 'motherName', e.target.value)} />
          <Input label="District" value={data.personalDetails.district} onChange={(e: any) => updateField('personalDetails', 'district', e.target.value)} />
          <Input label="Nationality" value={data.personalDetails.nationality} onChange={(e: any) => updateField('personalDetails', 'nationality', e.target.value)} />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">PWD Status</label>
            <select value={data.personalDetails.pwdStatus} onChange={(e) => updateField('personalDetails', 'pwdStatus', e.target.value)} className="border p-2 rounded text-sm">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {data.personalDetails.pwdStatus === 'yes' && (
            <>
              <Input label="Type of Disability" value={data.personalDetails.typeOfDisability} onChange={(e: any) => updateField('personalDetails', 'typeOfDisability', e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Is 40% or more?</label>
                <select value={data.personalDetails.is40Percent} onChange={(e) => updateField('personalDetails', 'is40Percent', e.target.value)} className="border p-2 rounded text-sm">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ADDRESS SECTION */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-green-700">2. Address Details</h3>
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Permanent Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(emptyAddress).map((key) => (
              <Input key={`perm-${key}`} label={key.toUpperCase()} value={(data.address.permanent as any)[key]} 
                onChange={(e: any) => updateField('address', key, e.target.value, 'permanent')} />
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" id="sameAddress" checked={data.address.sameAsPermanent} onChange={(e) => handleAddressToggle(e.target.checked)} className="w-4 h-4 text-green-600" />
          <label htmlFor="sameAddress" className="text-sm font-semibold">Same as Permanent Address</label>
        </div>

        {!data.address.sameAsPermanent && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Correspondence Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(emptyAddress).map((key) => (
                <Input key={`corr-${key}`} label={key.toUpperCase()} value={(data.address.correspond as any)[key]} 
                  onChange={(e: any) => updateField('address', key, e.target.value, 'correspond')} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* EDUCATION */}
      <section className="bg-gray-50 p-4 rounded-lg border overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-green-700">3. Educational Qualifications</h3>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Level</th>
              <th className="p-2 border">School/College/Institution</th>
              <th className="p-2 border">Board/University</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {['10th', '12th', 'graduation', 'postGraduation'].map((level) => (
              <tr key={level}>
                <td className="p-2 border font-medium capitalize">{level}</td>
                <td className="p-2 border"><input className="w-full p-1 border rounded text-sm" value={(data.education as any)[level].college} onChange={(e) => updateField('education', 'college', e.target.value, level)} /></td>
                <td className="p-2 border"><input className="w-full p-1 border rounded text-sm" value={(data.education as any)[level].board} onChange={(e) => updateField('education', 'board', e.target.value, level)} /></td>
                <td className="p-2 border"><input className="w-full p-1 border rounded text-sm" type="number" value={(data.education as any)[level].year} onChange={(e) => updateField('education', 'year', e.target.value, level)} /></td>
                <td className="p-2 border"><input className="w-full p-1 border rounded text-sm" type="number" value={(data.education as any)[level].percentage} onChange={(e) => updateField('education', 'percentage', e.target.value, level)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* DOCUMENTS */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-green-700">4. Documents Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(data.documents).map((docKey) => (
            <FileInput key={docKey} label={docKey.replace(/([A-Z])/g, ' $1').toUpperCase()} 
              onChange={(e: any) => updateField('documents', docKey, e.target.files?.[0])} />
          ))}
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-green-700">5. Work Experience</h3>
          <button type="button" onClick={addExperience} className="text-sm flex items-center bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
            <Plus size={16} className="mr-1"/> Add Experience
          </button>
        </div>
        
        {data.experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border bg-white rounded relative group">
            <Input label="Designation" value={exp.designation} onChange={(e: any) => { const newExp = [...data.experience]; newExp[index].designation = e.target.value; setData({...data, experience: newExp}); }} />
            <Input label="Duration (Months/Years)" value={exp.duration} onChange={(e: any) => { const newExp = [...data.experience]; newExp[index].duration = e.target.value; setData({...data, experience: newExp}); }} />
            <Input label="Reason for Leaving" value={exp.reasonLeaving} onChange={(e: any) => { const newExp = [...data.experience]; newExp[index].reasonLeaving = e.target.value; setData({...data, experience: newExp}); }} />
            <FileInput label="Experience Certificate" onChange={(e: any) => { const newExp = [...data.experience]; newExp[index].certificate = e.target.files?.[0]; setData({...data, experience: newExp}); }} />
            
            {data.experience.length > 1 && (
              <button onClick={() => removeExperience(index)} className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </section>

    </div>
  );
}

// ==========================================
// STEP 2: PAYMENT
// ==========================================
function Step2Payment() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
      <div className="bg-gray-50 p-8 rounded-xl border max-w-md w-full text-center">
        <CreditCard size={48} className="mx-auto mb-4 text-green-600" />
        <h2 className="text-2xl font-bold mb-2">Redirecting to Payment...</h2>
        <p className="text-gray-500 mb-6">You are being securely transferred to the payment gateway to complete your transaction.</p>
        <Loader2 className="animate-spin mx-auto text-green-600" size={32} />
      </div>
    </div>
  );
}

// ==========================================
// STEP 3: REVIEW
// ==========================================
function Step3Review({ data }: { data: FormState }) {
  const SectionInfo = ({ title, obj }: { title: string, obj: any }) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold border-b pb-2 mb-3 text-gray-800">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(obj).map(([key, val]) => {
          if (typeof val === 'object' || typeof val === 'boolean') return null; 
          return (
            <div key={key} className="flex flex-col">
              <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-sm font-medium text-gray-900">{String(val) || 'N/A'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Application</h2>
      <div className="bg-gray-50 p-6 rounded-lg border">
        <SectionInfo title="Personal Details" obj={data.personalDetails} />
        <SectionInfo title="Permanent Address" obj={data.address.permanent} />
        {!data.address.sameAsPermanent && <SectionInfo title="Correspondence Address" obj={data.address.correspond} />}
        
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b pb-2 mb-3 text-gray-800">Experience Highlights</h3>
          {data.experience.map((exp, idx) => (
             <div key={idx} className="text-sm mb-2 text-gray-700">
                <span className="font-semibold">{exp.designation || 'Role'}</span> • {exp.duration || '0 months'} • {exp.reasonLeaving || 'No reason specified'}
             </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 flex gap-3 items-start">
           <CheckCircle className="shrink-0 mt-0.5" size={18} />
           <p>Please review all information carefully. Clicking <b>Submit Application</b> below will finalize your registration.</p>
        </div>
      </div>
    </div>
  );
}