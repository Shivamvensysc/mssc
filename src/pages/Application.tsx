import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import api from '../api/interceptor';

import {
  days,
  months,
  years,
} from '../schemas/registrationSchema';
import { getDistricts } from '../api/registrationApi';

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
  fatherName: string;
  motherName: string;
  identificationMarks: string;
  permanentAddress: string;
  correspondenceAddress: string;
  sameAsPermanent: boolean;
  sponsored: string;
  nationality: string;
  education10thSchool: string;
  education10thBoard: string;
  education10thYear: string;
  education10thPercentage: string;
  education12thSchool: string;
  education12thBoard: string;
  education12thYear: string;
  education12thPercentage: string;
  educationGraduationSchool: string;
  educationGraduationBoard: string;
  educationGraduationYear: string;
  educationGraduationPercentage: string;
  educationPostGraduationSchool: string;
  educationPostGraduationBoard: string;
  educationPostGraduationYear: string;
  educationPostGraduationPercentage: string;
  hasWorkExperience: string;
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

// Each row of the "Work Experience" table is its own independent record now
// (previously every row shared the same formData fields, which meant typing
// in row 2 silently overwrote row 1). Each row also carries its own
// certificate file + preview.
interface ExperienceRow {
  id: number;
  employerDesignation: string;
  servicePeriodMonths: string;
  reasonForLeaving: string;
  certFile: File | null;
  certPreview: string; // object URL, only set for image files
}

const newExperienceRow = (id: number): ExperienceRow => ({
  id,
  employerDesignation: '',
  servicePeriodMonths: '',
  reasonForLeaving: '',
  certFile: null,
  certPreview: '',
});

// Single-file upload slots (photo/signature/certificates). Keyed by the same
// names used in `document.*` on the payload.
type DocumentKey =
  | 'photo'
  | 'signature'
  | 'eligibilityCert'
  | 'permanentResidentCert'
  | 'domicileCert'
  | 'hslcMarksheet'
  | 'hslcProvisionalCert';

interface DocumentSlot {
  file: File | null;
  preview: string; // object URL for images, '' otherwise
}

const emptyDocumentSlots: Record<DocumentKey, DocumentSlot> = {
  photo: { file: null, preview: '' },
  signature: { file: null, preview: '' },
  eligibilityCert: { file: null, preview: '' },
  permanentResidentCert: { file: null, preview: '' },
  domicileCert: { file: null, preview: '' },
  hslcMarksheet: { file: null, preview: '' },
  hslcProvisionalCert: { file: null, preview: '' },
};

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
  fatherName: '',
  motherName: '',
  identificationMarks: '',
  permanentAddress: '',
  correspondenceAddress: '',
  sameAsPermanent: false,
  sponsored: '',
  nationality: 'India',
  education10thSchool: '',
  education10thBoard: '',
  education10thYear: '',
  education10thPercentage: '',
  education12thSchool: '',
  education12thBoard: '',
  education12thYear: '',
  education12thPercentage: '',
  educationGraduationSchool: '',
  educationGraduationBoard: '',
  educationGraduationYear: '',
  educationGraduationPercentage: '',
  educationPostGraduationSchool: '',
  educationPostGraduationBoard: '',
  educationPostGraduationYear: '',
  educationPostGraduationPercentage: '',
  hasWorkExperience: 'no',
};

// ---------------------------------------------------------------------------
// Reusable upload card: shows an image thumbnail when the picked file is a
// photo, otherwise a file-type icon, plus filename, size and a remove button.
// Used for every certificate/photo/signature slot so the whole "Documents"
// section looks and behaves consistently.
// ---------------------------------------------------------------------------
function UploadCard({
  label,
  hint,
  icon,
  accept,
  file,
  preview,
  onSelect,
  onRemove,
  compact = false,
}: {
  label: string;
  hint?: string;
  icon: string;
  accept?: string;
  file: File | null;
  preview: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files: FileList | null) => {
    const f = files && files[0];
    if (f) onSelect(f);
  };

  return (
    <div className="space-y-1.5">
      <label className="block font-label-md text-[14px] text-on-surface-variant">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative flex items-center gap-3 w-full ${compact ? 'p-2.5 min-h-[64px]' : 'p-3 min-h-[76px]'} rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${dragOver ? 'border-primary bg-primary/5' : 'border-outline-variant/60 bg-surface-container-low hover:border-primary/50 hover:bg-white'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Thumbnail / icon */}
        <div
          className={`shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-white border border-outline-variant/50 ${
            compact ? 'w-11 h-11' : 'w-14 h-14'
          }`}
        >
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-primary/70">{icon}</span>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <p className="text-[13px] font-medium text-on-surface truncate">{file.name}</p>
              <p className="text-[11px] text-on-surface-variant/70">{formatSize(file.size)} &middot; tap to replace</p>
            </>
          ) : (
            <>
              <p className="text-[13px] font-medium text-primary">Click or drag file to upload</p>
              {hint && <p className="text-[11px] text-on-surface-variant/70">{hint}</p>}
            </>
          )}
        </div>

        {/* Remove */}
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-white hover:bg-red-500 transition-colors"
            aria-label={`Remove ${label}`}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // State for API data
  const [districts, setDistricts] = useState<District[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState({
    districts: false,
    categories: false,
  });
  const [error, setError] = useState({
    districts: '',
    categories: '',
  });

  // All single-file document uploads live here (file + preview together),
  // keyed exactly the way they're sent under `document.*` in the payload.
  const [documents, setDocuments] = useState<Record<DocumentKey, DocumentSlot>>(emptyDocumentSlots);

  // Work-experience rows, each with its own fields + certificate.
  const [experienceRows, setExperienceRows] = useState<ExperienceRow[]>([newExperienceRow(1)]);
  const nextRowId = useRef(2);

  const setDocumentFile = (key: DocumentKey, file: File) => {
    setDocuments((prev) => {
      // release any previous preview URL to avoid leaking memory
      if (prev[key].preview) URL.revokeObjectURL(prev[key].preview);
      const isImage = file.type.startsWith('image/');
      return {
        ...prev,
        [key]: { file, preview: isImage ? URL.createObjectURL(file) : '' },
      };
    });
  };

  const removeDocumentFile = (key: DocumentKey) => {
    setDocuments((prev) => {
      if (prev[key].preview) URL.revokeObjectURL(prev[key].preview);
      return { ...prev, [key]: { file: null, preview: '' } };
    });
  };

  const updateExperienceRow = (id: number, patch: Partial<ExperienceRow>) => {
    setExperienceRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const setExperienceCert = (id: number, file: File) => {
    setExperienceRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (row.certPreview) URL.revokeObjectURL(row.certPreview);
        const isImage = file.type.startsWith('image/');
        return { ...row, certFile: file, certPreview: isImage ? URL.createObjectURL(file) : '' };
      })
    );
  };

  const removeExperienceCert = (id: number) => {
    setExperienceRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (row.certPreview) URL.revokeObjectURL(row.certPreview);
        return { ...row, certFile: null, certPreview: '' };
      })
    );
  };

  const addExperienceRow = () => {
    setExperienceRows((prev) => [...prev, newExperienceRow(nextRowId.current++)]);
  };

  const removeExperienceRow = (id: number) => {
    setExperienceRows((prev) => {
      const row = prev.find((r) => r.id === id);
      if (row?.certPreview) URL.revokeObjectURL(row.certPreview);
      const next = prev.filter((r) => r.id !== id);
      return next.length ? next : [newExperienceRow(nextRowId.current++)];
    });
  };

  // Clean up any outstanding object URLs when the component unmounts.
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((slot) => slot.preview && URL.revokeObjectURL(slot.preview));
      experienceRows.forEach((row) => row.certPreview && URL.revokeObjectURL(row.certPreview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch districts and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, categories: true }));
      try {
        const response = await api.get('/categories'); // TODO: confirm this matches your real endpoint
        if (response.data.success) {
          setCategories(response.data.data);
          setError((prev) => ({ ...prev, categories: '' }));
        } else {
          setError((prev) => ({ ...prev, categories: 'Failed to load categories' }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, categories: 'Failed to load categories' }));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    fetchData();
  }, []);

  

useEffect(() => {
  const fetchData = async () => {
    // Fetch Districts using the imported function
    setLoading((prev) => ({ ...prev, districts: true }));
    try {
      const data = await getDistricts();
      console.log('Districts data:', data); // Debug: check the response structure
      
      // Handle different response structures
      if (data && Array.isArray(data)) {
        setDistricts(data);
        setError((prev) => ({ ...prev, districts: '' }));
      } else if (data?.data && Array.isArray(data.data)) {
        setDistricts(data.data);
        setError((prev) => ({ ...prev, districts: '' }));
      } else if (data?.districts && Array.isArray(data.districts)) {
        setDistricts(data.districts);
        setError((prev) => ({ ...prev, districts: '' }));
      } else {
        console.error('Unexpected districts data format:', data);
        setError((prev) => ({ ...prev, districts: 'Invalid data format received' }));
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError((prev) => ({ ...prev, districts: 'Failed to load districts' }));
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }

    
  };

  fetchData();
}, []);

  // Fetch application data and autofill form
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await api.get('/application/steps/all');
        if (response.data.success && response.data.data.steps.step0) {
          const step0 = response.data.data.steps.step0;

          let dobDay = '';
          let dobMonth = '';
          let dobYear = '';
          if (step0.dateOfBirth) {
            const dateParts = step0.dateOfBirth.split('-');
            if (dateParts.length === 3) {
              dobDay = dateParts[0];
              dobMonth = dateParts[1];
              dobYear = dateParts[2];
            }
          }

          setFormData((prev) => ({
            ...prev,
            name: step0.fullName || '',
            citizen: step0.citizenOfIndia ? 'Yes' : 'No',
            dialect: step0.motherTongue || '',
            residencyConfirmed: step0.manipurResident || false,
            gender: step0.gender || '',
            maritalStatus: step0.maritalStatus || '',
            reservationCategory: step0.reservationCategory || '',
            ph: step0.isPwd ? 'yes' : 'no',
            dobDay,
            dobMonth,
            dobYear,
            mobile: step0.mobileNumber || '',
            email: step0.emailId || '',
            district: step0.selectDistrict || '',
            captchaInput: '',
            govEmployee: step0.govEmployee ? 'Yes' : 'No',
          }));
        }
      } catch (err) {
        console.error('Error fetching application data:', err);
      }
    };

    fetchApplicationData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // -------------------------------------------------------------------------
  // Payload builder — grouped exactly as requested:
  // { personalDetails, document, education, experience }
  // `document` holds the actual File objects (sent as binary/multipart data);
  // everything else is plain JSON.
  // -------------------------------------------------------------------------
  const preparePayload = () => {
    const personalDetails = {
      candidate_name: formData.name || '',
      citizen_of_india: formData.citizen || '',
      mother_tongue: formData.dialect || '',
      manipur_resident: !!formData.residencyConfirmed,
      date_of_birth:
        formData.dobDay && formData.dobMonth && formData.dobYear
          ? `${formData.dobDay}-${formData.dobMonth}-${formData.dobYear}`
          : '',
      gender: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : '',
      district: formData.district || '',
      mobile_no: formData.mobile || '',
      marital_status: formData.maritalStatus
        ? formData.maritalStatus.charAt(0).toUpperCase() + formData.maritalStatus.slice(1)
        : '',
      email: formData.email || '',
      father_name: formData.fatherName || '',
      mother_name: formData.motherName || '',
      identification_marks: formData.identificationMarks || '',
      permanent_address: formData.permanentAddress || '',
      correspondence_address: formData.sameAsPermanent
        ? formData.permanentAddress || ''
        : formData.correspondenceAddress || '',
      same_as_permanent: !!formData.sameAsPermanent,
      nationality: formData.nationality || '',
      reservation_category: formData.reservationCategory || '',
      ph_status: formData.ph === 'yes',
      state_gov_employee: formData.govEmployee === 'Yes',
      employment_exchange_sponsored: formData.sponsored === 'Yes',
    };

    // Binary/file fields — kept separate so they can be appended to FormData
    // as actual file blobs rather than JSON.
    const document = {
      photo: documents.photo.file,
      signature: documents.signature.file,
      eligibility_certificate: documents.eligibilityCert.file,
      permanent_resident_certificate: documents.permanentResidentCert.file,
      domicile_certificate: documents.domicileCert.file,
      hslc_marksheet: documents.hslcMarksheet.file,
      hslc_provisional_certificate: documents.hslcProvisionalCert.file,
    };

    const education = {
      tenth: {
        school: formData.education10thSchool || '',
        board: formData.education10thBoard || '',
        year: formData.education10thYear || '',
        percentage: formData.education10thPercentage ? parseFloat(formData.education10thPercentage) || 0 : 0,
      },
      twelfth: {
        school: formData.education12thSchool || '',
        board: formData.education12thBoard || '',
        year: formData.education12thYear || '',
        percentage: formData.education12thPercentage ? parseFloat(formData.education12thPercentage) || 0 : 0,
      },
      graduation: {
        school: formData.educationGraduationSchool || '',
        board: formData.educationGraduationBoard || '',
        year: formData.educationGraduationYear || '',
        percentage: formData.educationGraduationPercentage
          ? parseFloat(formData.educationGraduationPercentage) || 0
          : 0,
      },
      post_graduation: {
        school: formData.educationPostGraduationSchool || '',
        board: formData.educationPostGraduationBoard || '',
        year: formData.educationPostGraduationYear || '',
        percentage: formData.educationPostGraduationPercentage
          ? parseFloat(formData.educationPostGraduationPercentage) || 0
          : 0,
      },
    };

    const experience = {
      has_work_experience: formData.hasWorkExperience === 'yes',
      entries:
        formData.hasWorkExperience === 'yes'
          ? experienceRows.map((row) => ({
              employer_designation: row.employerDesignation || '',
              service_period_months: row.servicePeriodMonths ? parseInt(row.servicePeriodMonths, 10) || 0 : 0,
              reason_for_leaving: row.reasonForLeaving || '',
              experience_certificate: row.certFile, // binary
            }))
          : [],
    };

    return { personalDetails, document, education, experience };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const { personalDetails, document, education, experience } = preparePayload();

      // JSON part: everything except the raw File objects.
      const jsonPayload = {
        personalDetails,
        education,
        experience: {
          has_work_experience: experience.has_work_experience,
          entries: experience.entries.map(({ experience_certificate, ...rest }) => rest),
        },
      };

      const formDataObj = new FormData();
      formDataObj.append('payload', JSON.stringify(jsonPayload));

      // Binary document fields go in under document.<field>
      Object.entries(document).forEach(([key, file]) => {
        if (file) formDataObj.append(`document.${key}`, file as File);
      });

      // Binary experience certificates, one per row, indexed so the backend
      // can line them back up with jsonPayload.experience.entries[i].
      experience.entries.forEach((entry, index) => {
        if (entry.experience_certificate) {
          formDataObj.append(`experience.entries[${index}].experience_certificate`, entry.experience_certificate);
        }
      });

      const response = await api.patch('/candidate/step-1', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Application step 1 submitted successfully!');
        setCurrentStep(2);
      } else {
        toast.error(response.data.message || 'Failed to submit step 1');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to submit application. Please try again.';
      toast.error(message);
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepNames = ['Application', 'Payment', 'Completed'];

  // Small shared classes so every text/select field lines up identically.
  const fieldLabel = 'block font-label-md text-[14px] text-on-surface-variant mb-1.5';
  const fieldInput =
    'w-full h-[46px] px-3.5 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-[14px] transition-colors';

  const educationRows: {
    label: string;
    letter: string;
    school: keyof RegistrationFormData;
    board: keyof RegistrationFormData;
    year: keyof RegistrationFormData;
    percentage: keyof RegistrationFormData;
  }[] = [
    { label: '10th / Equivalent', letter: 'A', school: 'education10thSchool', board: 'education10thBoard', year: 'education10thYear', percentage: 'education10thPercentage' },
    { label: 'Intermediate / Equi.', letter: 'B', school: 'education12thSchool', board: 'education12thBoard', year: 'education12thYear', percentage: 'education12thPercentage' },
    { label: 'Graduation', letter: 'C', school: 'educationGraduationSchool', board: 'educationGraduationBoard', year: 'educationGraduationYear', percentage: 'educationGraduationPercentage' },
    { label: 'Post Graduation', letter: 'D', school: 'educationPostGraduationSchool', board: 'educationPostGraduationBoard', year: 'educationPostGraduationYear', percentage: 'educationPostGraduationPercentage' },
  ];

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface">
      <ToastContainer position="top-right" autoClose={4000} newestOnTop pauseOnHover />

      <Header />

      <header className="pt-24 pb-48 hero-gradient relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center text-white relative z-10">
          <h1 className="text-6xl font-bold text-white mb-6">
            {currentStep === 1 ? 'Application Form' : currentStep === 2 ? 'Payment' : 'Application Completed'}
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            {currentStep === 1
              ? 'Join the MSSC 2026 initiative. Fill in your personal details, documents, and educational background to submit your application.'
              : currentStep === 2
              ? 'Step 2: Complete the payment to finalize your application submission.'
              : 'Your application has been submitted successfully.'}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-12">
            {[1, 2, 3].map((step, idx) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;
              return (
                <React.Fragment key={step}>
                  <div className={`flex items-center gap-3 ${!isActive && !isPast ? 'opacity-60' : ''}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-white text-primary shadow-lg'
                          : isPast
                          ? 'bg-white text-primary border-2 border-white'
                          : 'border-2 border-white/50 text-white'
                      }`}
                    >
                      {isPast ? <span className="material-symbols-outlined text-sm">check</span> : step}
                    </div>
                    <span className={`font-label-md text-[14px] ${isActive ? 'font-bold text-white' : 'font-medium text-white'}`}>
                      {stepNames[step - 1]}
                    </span>
                  </div>
                  {idx < 2 && <div className="hidden md:block w-16 h-px bg-white/30"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-32 pb-24 relative z-20">
        <div className="bg-white shadow-island rounded-[16px] p-8 md:p-12 transition-transform duration-300 hover:shadow-xl">
          <form className={currentStep === 1 ? 'space-y-14' : ''} onSubmit={handleSubmit} noValidate>
            {currentStep === 1 && (
              <div className="space-y-14 animate-[fadeIn_0.3s_ease-out]">
                {/* ============================================================ */}
                {/* 1. Personal Details                                          */}
                {/* ============================================================ */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
                    <span className="material-symbols-outlined">person</span>
                    Personal Details
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
                    {/* Left: text fields in a clean, evenly-spaced grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                        <label className={fieldLabel}>Name of Candidate</label>
                        <input className={fieldInput} type="text" name="name" value={formData.name} onChange={handleInputChange} />
                      </div>

                      <div>
                        <label className={fieldLabel}>Date of Birth</label>
                        <div className="grid grid-cols-3 gap-2">
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
                                className={`${fieldInput} appearance-none pr-7 text-on-surface-variant`}
                              >
                                <option value="">{item.label}</option>
                                {item.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xs">
                                expand_more
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={fieldLabel}>Gender</label>
                        <select className={fieldInput} name="gender" value={formData.gender} onChange={handleInputChange}>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className={fieldLabel}>District</label>
                        <select
                          className={fieldInput}
                          disabled={loading.districts}
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                        >
                          <option value="">{loading.districts ? 'Loading...' : 'Select District'}</option>
                          {districts.map((district) => (
                            <option key={district.districtId} value={district.districtName}>
                              {district.districtName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={fieldLabel}>Mobile No.</label>
                        <input className={fieldInput} type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} />
                      </div>

                      <div>
                        <label className={fieldLabel}>Marital Status</label>
                        <select className={fieldInput} name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                          <option value="">Select Status</option>
                          <option value="unmarried">Unmarried</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className={fieldLabel}>E-mail Address</label>
                        <input className={fieldInput} type="email" name="email" value={formData.email} onChange={handleInputChange} />
                      </div>

                      <div>
                        <label className={fieldLabel}>Father's Name</label>
                        <input className={fieldInput} type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                      </div>

                      <div>
                        <label className={fieldLabel}>Mother's Name</label>
                        <input className={fieldInput} type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={fieldLabel}>Identification Marks</label>
                        <input
                          className={fieldInput}
                          type="text"
                          placeholder="e.g. A mole on the left cheek"
                          name="identificationMarks"
                          value={formData.identificationMarks}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className={fieldLabel}>Permanent Address</label>
                        <textarea
                          className="w-full p-3.5 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[110px] outline-none text-[14px]"
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="flex items-center justify-between font-label-md text-[14px] text-on-surface-variant mb-1.5">
                          Correspondence Address
                          <span className="text-[11px] flex items-center gap-1 font-normal">
                            <input
                              type="checkbox"
                              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                              name="sameAsPermanent"
                              checked={formData.sameAsPermanent}
                              onChange={handleInputChange}
                            />
                            Same as Permanent
                          </span>
                        </label>
                        <textarea
                          className="w-full p-3.5 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[110px] outline-none text-[14px] disabled:bg-surface-container-low disabled:text-on-surface-variant/70"
                          name="correspondenceAddress"
                          value={formData.sameAsPermanent ? formData.permanentAddress : formData.correspondenceAddress}
                          onChange={handleInputChange}
                          disabled={formData.sameAsPermanent}
                        />
                      </div>

                      <div>
                        <label className={fieldLabel}>Nationality</label>
                        <div className="relative">
                          <select
                            className={`${fieldInput} appearance-none pr-8`}
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                          >
                            <option value="India">India</option>
                            <option value="Other">Other</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className={fieldLabel}>Reservation Category</label>
                        <select
                          className={fieldInput}
                          disabled={loading.categories}
                          name="reservationCategory"
                          value={formData.reservationCategory}
                          onChange={handleInputChange}
                        >
                          <option value="">{loading.categories ? 'Loading...' : 'Select Category'}</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.label}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={fieldLabel}>PH Status</label>
                        <select className={fieldInput} name="ph" value={formData.ph} onChange={handleInputChange}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>

                      {/* Yes/No radio groups, aligned in their own row */}
                      <div className="flex flex-col justify-center">
                        <p className="font-label-md text-[14px] text-on-surface-variant mb-2">State Gov. Employee?</p>
                        <div className="flex gap-5">
                          {['Yes', 'No'].map((val) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="govEmployee"
                                value={val}
                                checked={formData.govEmployee === val}
                                onChange={handleInputChange}
                                className="text-primary"
                              />
                              <span className="text-[14px]">{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <p className="font-label-md text-[14px] text-on-surface-variant mb-2">Sponsored by Employment Exch.?</p>
                        <div className="flex gap-5">
                          {['Yes', 'No'].map((val) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="sponsored"
                                value={val}
                                checked={formData.sponsored === val}
                                onChange={handleInputChange}
                                className="text-primary"
                              />
                              <span className="text-[14px]">{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Photo + Signature, pinned to a fixed-width column so
                        it never fights the text-field grid for space. */}
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 space-y-5 h-fit">
                      <UploadCard
                        label="Photograph"
                        hint="JPEG only · 20–50 KB"
                        icon="add_a_photo"
                        accept=".jpg,.jpeg"
                        file={documents.photo.file}
                        preview={documents.photo.preview}
                        onSelect={(f) => setDocumentFile('photo', f)}
                        onRemove={() => removeDocumentFile('photo')}
                      />
                      <UploadCard
                        label="Signature"
                        hint="JPEG only · 20–50 KB"
                        icon="draw"
                        accept=".jpg,.jpeg"
                        file={documents.signature.file}
                        preview={documents.signature.preview}
                        onSelect={(f) => setDocumentFile('signature', f)}
                        onRemove={() => removeDocumentFile('signature')}
                      />
                      <p className="text-[10px] text-on-surface-variant/70 text-center leading-tight italic pt-2 border-t border-outline-variant/20">
                        Only jpeg, jpg allowed. File size: 20kb – 50kb
                      </p>
                    </div>
                  </div>
                </section>

                {/* ============================================================ */}
                {/* 2. Documents                                                 */}
                {/* ============================================================ */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
                    <span className="material-symbols-outlined">cloud_upload</span>
                    Documents &amp; Eligibility
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <UploadCard
                      label="Certificate of Eligibility (PAN, Aadhaar, etc.)"
                      icon="badge"
                      file={documents.eligibilityCert.file}
                      preview={documents.eligibilityCert.preview}
                      onSelect={(f) => setDocumentFile('eligibilityCert', f)}
                      onRemove={() => removeDocumentFile('eligibilityCert')}
                    />
                    <UploadCard
                      label="Permanent Resident Certificate"
                      icon="home_pin"
                      file={documents.permanentResidentCert.file}
                      preview={documents.permanentResidentCert.preview}
                      onSelect={(f) => setDocumentFile('permanentResidentCert', f)}
                      onRemove={() => removeDocumentFile('permanentResidentCert')}
                    />
                    <UploadCard
                      label="Domicile Certificate"
                      icon="apartment"
                      file={documents.domicileCert.file}
                      preview={documents.domicileCert.preview}
                      onSelect={(f) => setDocumentFile('domicileCert', f)}
                      onRemove={() => removeDocumentFile('domicileCert')}
                    />
                    <UploadCard
                      label="H.S.L.C. / Matriculate Marksheet"
                      icon="description"
                      file={documents.hslcMarksheet.file}
                      preview={documents.hslcMarksheet.preview}
                      onSelect={(f) => setDocumentFile('hslcMarksheet', f)}
                      onRemove={() => removeDocumentFile('hslcMarksheet')}
                    />
                    <UploadCard
                      label="H.S.L.C. / Matriculate Provisional Certificate"
                      icon="verified"
                      file={documents.hslcProvisionalCert.file}
                      preview={documents.hslcProvisionalCert.preview}
                      onSelect={(f) => setDocumentFile('hslcProvisionalCert', f)}
                      onRemove={() => removeDocumentFile('hslcProvisionalCert')}
                    />
                  </div>
                </section>

                {/* ============================================================ */}
                {/* 3. Educational Details                                       */}
                {/* ============================================================ */}
                <section>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 pb-3 border-b border-outline-variant/40">
                    <span className="material-symbols-outlined">school</span>
                    Educational Details
                  </h2>

                  <div className="overflow-x-auto border border-outline-variant rounded-lg">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-12 text-center">Sr.No</th>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Examination</th>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">School / College / Institution</th>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant">Board / University</th>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">Year</th>
                          <th className="p-3 font-label-sm text-[12px] text-on-surface-variant w-24">% Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {educationRows.map((row) => (
                          <tr key={row.letter} className="hover:bg-surface-bright transition-colors">
                            <td className="p-3 text-center text-[14px] font-medium text-on-surface-variant">{row.letter}</td>
                            <td className="p-3 text-[14px] font-medium whitespace-nowrap">{row.label}</td>
                            <td className="p-2">
                              <input
                                type="text"
                                className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
                                name={row.school}
                                value={formData[row.school] as string}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
                                name={row.board}
                                value={formData[row.board] as string}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
                                name={row.year}
                                value={formData[row.year] as string}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                className="w-full h-10 px-2.5 border border-outline-variant rounded bg-white focus:border-primary text-sm outline-none"
                                placeholder="99.99"
                                name={row.percentage}
                                value={formData[row.percentage] as string}
                                onChange={handleInputChange}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* ============================================================ */}
                {/* 4. Work Experience Details                                   */}
                {/* ============================================================ */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined">work</span>
                      Work Experience Details
                    </h2>
                    <div className="flex items-center gap-4">
                      {['yes', 'no'].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="hasWorkExperience"
                            value={val}
                            className="text-primary focus:ring-primary"
                            checked={formData.hasWorkExperience === val}
                            onChange={handleInputChange}
                          />
                          <span className="font-label-md text-[14px] text-on-surface group-hover:text-primary transition-colors capitalize">
                            {val}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.hasWorkExperience === 'yes' && (
                    <div className="space-y-6">
                      {experienceRows.map((row, index) => (
                        <div
                          key={row.id}
                          className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr_1fr_auto] gap-4 items-start ${
                            index > 0 ? 'pt-6 border-t border-outline-variant/50' : ''
                          }`}
                        >
                          <div>
                            <label className={fieldLabel}>Employer / Designation</label>
                            <input
                              className={fieldInput}
                              placeholder="Employer / Designation"
                              type="text"
                              value={row.employerDesignation}
                              onChange={(e) => updateExperienceRow(row.id, { employerDesignation: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={fieldLabel}>Service Period (Months)</label>
                            <input
                              className={fieldInput}
                              placeholder="Total Months"
                              type="number"
                              value={row.servicePeriodMonths}
                              onChange={(e) => updateExperienceRow(row.id, { servicePeriodMonths: e.target.value })}
                            />
                          </div>
                          <div>
                            <UploadCard
                              label="Experience Certificate"
                              icon="workspace_premium"
                              file={row.certFile}
                              preview={row.certPreview}
                              onSelect={(f) => setExperienceCert(row.id, f)}
                              onRemove={() => removeExperienceCert(row.id)}
                              compact
                            />
                          </div>
                          <div>
                            <label className={fieldLabel}>Reason of Leaving</label>
                            <input
                              className={fieldInput}
                              placeholder="Remark"
                              type="text"
                              value={row.reasonForLeaving}
                              onChange={(e) => updateExperienceRow(row.id, { reasonForLeaving: e.target.value })}
                            />
                          </div>
                          <div className="flex md:items-end h-full pb-0.5">
                            {experienceRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExperienceRow(row.id)}
                                className="w-[46px] h-[46px] mt-6 md:mt-0 rounded-lg border border-outline-variant/60 text-on-surface-variant/70 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors flex items-center justify-center"
                                aria-label="Remove this row"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addExperienceRow}
                        className="border border-primary text-primary bg-white px-8 py-3.5 rounded-full font-label-md text-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/5 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add More
                      </button>
                    </div>
                  )}
                </section>

                {/* ============================================================ */}
                {/* 5. Final Actions                                             */}
                {/* ============================================================ */}
                <div className="flex flex-col items-center justify-center pt-12 border-t border-outline-variant/30 space-y-8">
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
                      By submitting, you agree to the{' '}
                      <a className="text-primary font-bold hover:underline" href="#">
                        Terms and Conditions
                      </a>{' '}
                      of MSSC 2026.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}