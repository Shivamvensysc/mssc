import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Copy,
  Check,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  ShieldCheck,
  CreditCard,
  User,
  Landmark,
  ExternalLink,
  BadgeCheck,
  Printer,
} from 'lucide-react';
import { generateApplicationPDF } from '../lib/Pdfgenerator';

// ==========================================
// DESIGN TOKENS — extends the existing portal theme
// (kept identical to MultiStepForm so this page feels
// like the natural conclusion of the same journey)
// ==========================================
const theme = {
  navy: '#1B5E3F',
  navyDark: '#0F3D28',
  navyLight: '#3D8A63',
  gold: '#B8873D',
  goldLight: '#F3E7D3',
  goldDeep: '#8A6416',
  success: '#2F7A55',
  successBg: '#E7F4EC',
  error: '#C0392B',
  errorBg: '#FDEEEC',
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E2E5EA',
  textPrimary: '#1A2233',
  textMuted: '#6B7684',
};

// ==========================================
// TYPES — mirrors the raw `/application/steps/all` response
// ==========================================
interface CandidateDetails {
  registrationNumber?: string;
  mobileNumber?: string;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  dateOfBirth?: string;
}

interface StepZero {
  fullName?: string;
  emailId?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  selectDistrict?: string;
  reservationCategory?: string;
  isPwd?: boolean;
  govEmployee?: boolean;
  identificationMark1?: string;
  address?: {
    permanent?: Record<string, any>;
    correspondence?: Record<string, any>;
  };
}

interface StepOne {
  personalInfo?: Record<string, any>;
  address?: {
    permanent?: Record<string, any>;
    correspondence?: Record<string, any>;
  };
  education?: Record<string, { college?: string; board?: string; year?: string; percentage?: string }>;
  teachereligibilit?: Record<string, any>;
  experience?: {
    hasExperience?: boolean;
    employerDesignation?: string;
    servicePeriodMonths?: number | null;
    reasonForLeaving?: string;
  };
}

interface StepThree {
  amount?: string;
  currency?: string;
  status?: string;
  paymentMode?: string;
  bankName?: string;
  transactionId?: string;
  paymentOrderId?: string;
  createdAt?: string;
}

export interface ApplicationData {
  applicationId?: string;
  status?: string;
  currentStep?: number;
  completedSteps?: number[];
  isSubmitted?: boolean;
  applicationReferenceNumber?: string;
  submissionDate?: string;
  candidateDetails?: CandidateDetails;
  steps?: {
    step0?: StepZero;
    step1?: StepOne;
    step2?: Record<string, string | null>;
    step3?: StepThree;
  };
}

// ==========================================
// SMALL HELPERS
// ==========================================
const DOC_LABELS: Record<string, string> = {
  photograph: 'Photograph',
  signature: 'Signature',
  livePhoto: 'Live Photo',
  eligibilityCert: 'Eligibility Certificate',
  permanentResCert: 'Permanent Residence Certificate',
  domicileCert: 'Domicile Certificate',
  hslcMarksheet: 'HSLC Marksheet',
  hslcProvCert: 'HSLC Provisional Certificate',
  nocCert: 'No Objection Certificate',
  reservationCert: 'Reservation Certificate',
  pwdCert: 'PWD Certificate',
  tenPlusTwoCert: '10+2 / Equivalent Certificate',
};

const EXPERIENCE_CERT_PREFIX = 'experienceCert_';

const titleCase = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '—');

const formatDate = (raw?: string, withTime = false) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  if (!withTime) return dateStr;
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} · ${timeStr}`;
};

const getFileName = (url?: string | null) => {
  if (!url) return null;
  try {
    const clean = url.split('?')[0];
    const last = clean.split('/').pop();
    return last ? decodeURIComponent(last) : 'document';
  } catch {
    return 'document';
  }
};

const fileKindColor = (name: string) => (/\.pdf$/i.test(name) ? '#D32F2F' : theme.navy);

// ==========================================
// SHARED PRESENTATIONAL PIECES
// ==========================================
function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl p-6 sm:p-7 mb-6 print-avoid-break"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, boxShadow: '0 1px 2px rgba(20,30,50,0.03)' }}
    >
      <div className="flex items-start gap-3 mb-6">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: theme.goldLight, color: theme.navyDark }}
        >
          <Icon size={19} />
        </span>
        <div>
          <h3 className="text-base font-bold" style={{ color: theme.textPrimary }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: theme.textMuted }}>
        {label}
      </span>
      <span className="text-sm font-semibold break-words" style={{ color: theme.textPrimary }}>
        {value === undefined || value === null || value === '' ? '—' : value}
      </span>
    </div>
  );
}

function VerifiedPill({ verified }: { verified?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 align-middle no-print"
      style={{
        backgroundColor: verified ? theme.successBg : theme.errorBg,
        color: verified ? theme.success : theme.error,
      }}
    >
      {verified ? <Check size={11} /> : null}
      {verified ? 'Verified' : 'Unverified'}
    </span>
  );
}

function DocumentCard({ label, url }: { label: string; url?: string | null }) {
  const fileName = getFileName(url);
  const uploaded = Boolean(url);

  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3.5"
      style={{
        border: `1px solid ${uploaded ? theme.border : '#F1C3BC'}`,
        backgroundColor: uploaded ? '#FBFCFD' : theme.errorBg,
      }}
    >
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: uploaded ? theme.goldLight : '#FDE3DE', color: uploaded ? fileKindColor(fileName || '') : theme.error }}
      >
        <FileText size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold truncate" style={{ color: theme.textPrimary }} title={label}>
          {label}
        </p>
        <p className="text-[11px] truncate" style={{ color: uploaded ? theme.textMuted : theme.error }} title={fileName || undefined}>
          {uploaded ? fileName : 'Not uploaded'}
        </p>
      </div>
      {uploaded && (
        <a
          href={url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="no-print shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:brightness-95"
          style={{ backgroundColor: theme.navy, color: '#fff' }}
          aria-label={`View ${label}`}
          title="View document"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

function AddressBlock({ title, address }: { title: string; address?: Record<string, any> }) {
  if (!address) return null;
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#FBFCFD', border: `1px solid ${theme.border}` }}>
      <p className="text-[11px] font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: theme.navyDark }}>
        <MapPin size={13} /> {title}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Village / Street" value={address.street || address.village} />
        <Field label="Post" value={address.post} />
        <Field label="City / Town" value={address.city} />
        <Field label="District" value={address.district} />
        <Field label="State" value={address.state} />
        <Field label="PIN Code" value={address.pincode} />
        <Field label="Country" value={address.country} />
        <Field label="Police Station" value={address.policeStation} />
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ShowallDeatilsPage({ applicationData }: { applicationData: ApplicationData }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const step0 = applicationData?.steps?.step0 || {};
  const step1 = applicationData?.steps?.step1 || {};
  const step2 = applicationData?.steps?.step2 || {};
  const step3 = applicationData?.steps?.step3 || {};
  const candidate = applicationData?.candidateDetails || {};
  const personalInfo = step1.personalInfo || {};

  // Merge step0 (initial registration) with step1 (detailed form) — step1 wins when present.
  const merged = useMemo(
    () => ({
      name: personalInfo.name || step0.fullName || '—',
      dob: personalInfo.dob || step0.dateOfBirth || candidate.dateOfBirth || '—',
      gender: titleCase(personalInfo.gender || step0.gender),
      maritalStatus: titleCase(personalInfo.maritalStatus || step0.maritalStatus),
      mobile: personalInfo.mobile || step0.mobileNumber || candidate.mobileNumber || '—',
      email: personalInfo.email || step0.emailId || '—',
      district: personalInfo.district || step0.selectDistrict || '—',
      nationality: personalInfo.nationality || step0.nationality || '—',
      reservationCategory: personalInfo.reservationCategory || step0.reservationCategory || '—',
      pwdStatus: personalInfo.pwdStatus ? personalInfo.pwdStatus === 'yes' : step0.isPwd,
      stateGovEmployee: personalInfo.stateGovEmployee ? personalInfo.stateGovEmployee === 'yes' : step0.govEmployee,
      identificationMarks: personalInfo.identificationMarks || step0.identificationMark1 || '—',
      fatherName: personalInfo.fatherName || '—',
      motherName: personalInfo.motherName || '—',
    }),
    [personalInfo, step0, candidate]
  );

  const permanentAddress = step1.address?.permanent || step0.address?.permanent;
  const correspondAddress = step1.address?.correspondence || step0.address?.correspondence;

  const educationRows = ['10th', '12th', 'graduation', 'postGraduation'] as const;
  const educationLabels: Record<(typeof educationRows)[number], string> = {
    '10th': '10th',
    '12th': '12th',
    graduation: 'Graduation',
    postGraduation: 'Post-Graduation',
  };

  const teacherEligibility = step1.teachereligibilit || {};
  const hasExperience = step1.experience?.hasExperience;

  // Document keys: fixed known list first, then any experienceCert_N found dynamically.
  const knownDocKeys = Object.keys(DOC_LABELS).filter((k) => k in step2);
  const experienceCertKeys = Object.keys(step2)
    .filter((k) => k.startsWith(EXPERIENCE_CERT_PREFIX))
    .sort();

  const referenceNumber = applicationData?.applicationReferenceNumber || '—';
  const isFinal = applicationData?.status === 'submitted' && applicationData?.isSubmitted === true;

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // applicationData is the "data" object from your API response, 
      // which perfectly matches the ApiData interface expected by the generator.
      await generateApplicationPDF(applicationData as any); 
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: theme.bg }}>
      {/* Print-only styling */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .print-sheet { box-shadow: none !important; border: none !important; }
          .print-avoid-break { break-inside: avoid; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* ============ HERO / STATUS BANNER ============ */}
        <div
          className="print-sheet rounded-2xl overflow-hidden mb-6"
          style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, boxShadow: '0 1px 2px rgba(20,30,50,0.04), 0 12px 32px -12px rgba(20,30,50,0.12)' }}
        >
          <div className="px-7 sm:px-9 pt-8 pb-7" style={{ backgroundColor: theme.navy }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                >
                  <CheckCircle2 size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: theme.goldLight }}>
                    Teacher Recruitment Portal
                  </p>
                  <h1 className="text-2xl font-bold text-white mt-1">
                    {isFinal ? 'Application Submitted' : 'Application Summary'}
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Submitted on {formatDate(applicationData?.submissionDate, true)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="no-print shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-70"
                style={{ backgroundColor: theme.gold, color: '#fff' }}
              >
                {isDownloading ? <Printer size={16} className="animate-pulse" /> : <Download size={16} />}
                Download Application
              </button>
            </div>
          </div>

          {/* Reference number strip */}
          <div className="px-7 sm:px-9 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ backgroundColor: theme.goldLight }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: theme.goldDeep }}>
                Application Reference Number
              </p>
              <p className="text-xl font-bold tracking-wide" style={{ color: theme.navyDark }}>
                {referenceNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: theme.goldDeep }}>
                  Registration No.
                </p>
                <p className="text-sm font-semibold" style={{ color: theme.navyDark }}>
                  {candidate.registrationNumber || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="no-print shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors shadow-sm"
                style={{ backgroundColor: theme.navy, color: '#fff' }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* ============ PERSONAL DETAILS ============ */}
        <SectionCard icon={User} title="Personal Details" subtitle="As provided in the application form">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <Field label="Candidate Name" value={merged.name} />
            <Field label="Date of Birth" value={merged.dob} />
            <Field label="Gender" value={merged.gender} />
            <Field label="Marital Status" value={merged.maritalStatus} />
            <Field
              label="Mobile Number"
              value={
                <span className="inline-flex items-center">
                  <Phone size={12} className="mr-1" style={{ color: theme.textMuted }} />
                  {merged.mobile}
                  <VerifiedPill verified={candidate.mobileVerified} />
                </span>
              }
            />
            <Field
              label="Email Address"
              value={
                <span className="inline-flex items-center">
                  <Mail size={12} className="mr-1" style={{ color: theme.textMuted }} />
                  {merged.email}
                  <VerifiedPill verified={candidate.emailVerified} />
                </span>
              }
            />
            <Field label="Father's Name" value={merged.fatherName} />
            <Field label="Mother's Name" value={merged.motherName} />
            <Field label="Nationality" value={merged.nationality} />
            <Field label="District" value={merged.district} />
            <Field label="Reservation Category" value={merged.reservationCategory} />
            <Field label="PWD Status" value={merged.pwdStatus ? 'Yes' : 'No'} />
            <Field label="State Govt. Employee" value={merged.stateGovEmployee ? 'Yes' : 'No'} />
            <Field label="Identification Marks" value={merged.identificationMarks} />
          </div>
        </SectionCard>

        {/* ============ ADDRESS ============ */}
        <SectionCard icon={MapPin} title="Address Details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AddressBlock title="Permanent Address" address={permanentAddress} />
            <AddressBlock title="Correspondence Address" address={correspondAddress} />
          </div>
        </SectionCard>

        {/* ============ EDUCATION ============ */}
        <SectionCard icon={GraduationCap} title="Educational Qualifications">
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${theme.border}` }}>
            <table className="w-full text-left border-collapse min-w-[560px]">
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
                {educationRows.map((level, idx) => {
                  const row = step1.education?.[level] || {};
                  return (
                    <tr key={level} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFCFD' }}>
                      <td className="p-3 text-sm font-semibold" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                        {educationLabels[level]}
                      </td>
                      <td className="p-3 text-sm" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                        {row.college || '—'}
                      </td>
                      <td className="p-3 text-sm" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                        {row.board || '—'}
                      </td>
                      <td className="p-3 text-sm" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                        {row.year || '—'}
                      </td>
                      <td className="p-3 text-sm" style={{ color: theme.textPrimary, borderTop: `1px solid ${theme.border}` }}>
                        {row.percentage ? `${row.percentage}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ============ TEACHER ELIGIBILITY ============ */}
        <SectionCard icon={ShieldCheck} title="Teacher Eligibility">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <Field label="D.Ed. / D.El.Ed. Qualification" value={teacherEligibility.dedQual} />
            <Field label="D.Ed. / D.El.Ed. Institute" value={teacherEligibility.dedInstitution} />
            <Field label="RCI CRR Number" value={teacherEligibility.rciNumber} />
            <Field label="Cross-Disability Training Period" value={teacherEligibility.crossDisabilityPeriod ? `${teacherEligibility.crossDisabilityPeriod} months` : undefined} />
          </div>
        </SectionCard>

        {/* ============ WORK EXPERIENCE ============ */}
        <SectionCard icon={Briefcase} title="Work Experience">
          {hasExperience ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Designation" value={step1.experience?.employerDesignation} />
              <Field label="Service Period" value={step1.experience?.servicePeriodMonths ? `${step1.experience.servicePeriodMonths} months` : undefined} />
              <Field label="Reason for Leaving" value={step1.experience?.reasonForLeaving} />
            </div>
          ) : (
            <p className="text-sm" style={{ color: theme.textMuted }}>
              No prior work experience declared.
            </p>
          )}
        </SectionCard>

        {/* ============ DOCUMENTS ============ */}
        <SectionCard icon={FileText} title="Uploaded Documents" subtitle="Click the icon to view a document in a new tab">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {knownDocKeys.map((key) => (
              <DocumentCard key={key} label={DOC_LABELS[key]} url={step2[key]} />
            ))}
            {experienceCertKeys.map((key, idx) => (
              <DocumentCard key={key} label={`Experience Certificate ${idx + 1}`} url={step2[key]} />
            ))}
          </div>
        </SectionCard>

        {/* ============ PAYMENT ============ */}
        <SectionCard icon={CreditCard} title="Payment Details">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <Field
              label="Amount"
              value={
                step3.amount ? (
                  <span className="inline-flex items-center gap-1">
                    <Landmark size={12} style={{ color: theme.textMuted }} />
                    ₹{step3.amount} {step3.currency || ''}
                  </span>
                ) : undefined
              }
            />
            <Field
              label="Payment Status"
              value={
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: step3.status === 'success' || step3.status === 'paid' ? theme.successBg : theme.goldLight,
                    color: step3.status === 'success' || step3.status === 'paid' ? theme.success : theme.goldDeep,
                  }}
                >
                  <BadgeCheck size={12} /> {titleCase(step3.status)}
                </span>
              }
            />
            <Field label="Payment Mode" value={step3.paymentMode ? titleCase(step3.paymentMode) : undefined} />
            <Field label="Bank" value={step3.bankName} />
            <Field label="Transaction ID" value={step3.transactionId} />
            <Field label="Order ID" value={step3.paymentOrderId} />
            <Field
              label="Paid On"
              value={
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} style={{ color: theme.textMuted }} />
                  {formatDate(step3.createdAt, true)}
                </span>
              }
            />
          </div>
        </SectionCard>

        {/* ============ FOOTER NOTE ============ */}
        <div
          className="no-print flex gap-3 items-start p-4 rounded-xl text-sm mb-2"
          style={{ backgroundColor: theme.successBg, border: `1px solid #BEE3CC`, color: theme.success }}
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <p>
            Your application has been received and locked for editing. Keep your reference number{' '}
            <b>{referenceNumber}</b> safe — you'll need it for all future correspondence and admit card download.
          </p>
        </div>

        <div className="no-print flex justify-center pb-4">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-70"
            style={{ backgroundColor: theme.navy, color: '#fff' }}
          >
            {isDownloading ? <Printer size={16} className="animate-pulse" /> : <Download size={16} />}
            Download Application
          </button>
        </div>
      </div>
    </div>
  );
}