


// import { jsPDF } from "jspdf";

// /* ============================================================
//  * TYPES
//  * These mirror the `ApplicationData` shape used by
//  * ShowallDeatilsPage.tsx, i.e. the *already unwrapped*
//  * `data` object from the `/application/steps/all` response
//  * ============================================================ */

// export interface AddressData {
//   street?: string;
//   village?: string;
//   post?: string;
//   city?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
//   country?: string;
//   policeStation?: string;
//   sameAsPermanent?: boolean;
// }

// export interface CandidateDetails {
//   id?: string;
//   registrationNumber?: string;
//   mobileNumber?: string;
//   alternateNumber?: string | null;
//   mobileVerified?: boolean;
//   emailVerified?: boolean;
//   dateOfBirth?: string;
// }

// export interface StepZero {
//   age?: number;
//   isPwd?: boolean;
//   gender?: string;
//   address?: { permanent?: AddressData; correspondence?: AddressData };
//   emailId?: string;
//   fullName?: string;
//   fatherName?: string;
//   motherName?: string;
//   dateOfBirth?: string;
//   govEmployee?: boolean;
//   nationality?: string;
//   identityType?: string;
//   mobileNumber?: string;
//   motherTongue?: string;
//   maritalStatus?: string;
//   citizenOfIndia?: boolean;
//   identityNumber?: string;
//   selectDistrict?: string;
//   alternateNumber?: string;
//   manipurResident?: boolean;
//   identificationMark1?: string;
//   identificationMark2?: string;
//   reservationCategory?: string;
// }

// export interface EducationRow {
//   college?: string;
//   board?: string;
//   year?: string;
//   percentage?: string;
// }

// export interface ExperienceRow {
//   duration?: string;
//   designation?: string;
//   reasonLeaving?: string;
//   // Fallbacks for the older flat format, just in case
//   hasExperience?: boolean;
//   employerDesignation?: string;
//   servicePeriodMonths?: number | null;
//   reasonForLeaving?: string;
// }

// export interface StepOne {
//   personalInfo?: {
//     name?: string;
//     dob?: string;
//     gender?: string;
//     district?: string;
//     maritalStatus?: string;
//     mobile?: string;
//     email?: string;
//     fatherName?: string;
//     motherName?: string;
//     nationality?: string;
//     reservationCategory?: string;
//     pwdStatus?: string;
//     typeOfDisability?: string;
//     is40Percent?: string;
//     stateGovEmployee?: string;
//     sponsoredExchange?: string;
//     identificationMarks?: string;
//   };
//   address?: { 
//     permanent?: AddressData; 
//     correspond?: AddressData; // Added to match API
//     correspondence?: AddressData; 
//   };
//   education?: {
//     "10th"?: EducationRow;
//     "12th"?: EducationRow;
//     graduation?: EducationRow;
//     postGraduation?: EducationRow;
//   };
//   teachereligibilit?: {
//     dedQual?: string;
//     dedInstitution?: string;
//     crossDisabilityPeriod?: string | number;
//     rciNumber?: string;
//   };
//   // Accepts both the array format from the API and the old flat object fallback
//   experience?: ExperienceRow[] | ExperienceRow;
// }

// export type StepTwo = Record<string, string | null | undefined>;

// export interface StepThree {
//   paymentOrderId?: string;
//   amount?: string;
//   currency?: string;
//   transactionId?: string | null;
//   status?: string;
//   paymentMode?: string | null;
//   bankName?: string | null;
//   paymentUrl?: string;
//   createdAt?: string;
// }

// export interface ApiData {
//   applicationId?: string;
//   status?: string;
//   currentStep?: number;
//   completedSteps?: number[];
//   isSubmitted?: boolean;
//   applicationReferenceNumber?: string;
//   submissionDate?: string;
//   candidateDetails?: CandidateDetails;
//   steps?: {
//     step0?: StepZero;
//     step1?: StepOne;
//     step2?: StepTwo;
//     step3?: StepThree;
//   };
// }

// export interface PDFOptions {
//   save?: boolean;
//   filename?: string;
// }

// /* ============================================================
//  * LAYOUT CONSTANTS
//  * ============================================================ */

// const PAGE_W = 210;
// const PAGE_H = 297;
// const MARGIN = 10;
// const CONTENT_W = PAGE_W - MARGIN * 2;
// const LABEL_W = 70;
// const FOOTER_SPACE = 8;

// // Updated to requested logo file format
// const LOGO_URL = "/mssc.png";

// const COMMISSION_NAME = "MANIPUR STAFF SELECTION COMMISSION (MSSC)";
// const COMMISSION_ADDRESS_LINE = "GOVERNMENT OF MANIPUR";

// const PHOTO_W = 28;
// const PHOTO_H = 24;
// const PHOTO_GAP = 1.5;

// const DOC_LABELS: Record<string, string> = {
//   photograph: "Photograph",
//   signature: "Signature",
//   livePhoto: "Live Photo",
//   eligibilityCert: "Eligibility Certificate",
//   permanentResCert: "Permanent Residence Certificate",
//   domicileCert: "Domicile Certificate",
//   hslcMarksheet: "HSLC Marksheet",
//   hslcProvCert: "HSLC Provisional Certificate",
//   nocCert: "No Objection Certificate",
//   reservationCert: "Reservation Certificate",
//   pwdCert: "PWD Certificate",
//   tenPlusTwoCert: "10+2 / Equivalent Certificate",
// };

// const EXPERIENCE_CERT_PREFIX = "experienceCert_";
// const PHOTO_PANEL_KEYS = new Set(["photograph", "signature", "livePhoto"]);

// const EDUCATION_LEVELS: Array<{
//   key: "10th" | "12th" | "graduation" | "postGraduation";
//   label: string;
// }> = [
//   { key: "10th", label: "10TH" },
//   { key: "12th", label: "12TH" },
//   { key: "graduation", label: "GRADUATION" },
//   { key: "postGraduation", label: "POST-GRADUATION" },
// ];

// /* ============================================================
//  * HELPERS
//  * ============================================================ */

// const dash = (v: unknown): string =>
//   v === undefined || v === null || v === "" ? "-" : String(v);

// const titleCase = (s?: string): string =>
//   s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "-";

// const yn = (v: string | boolean | undefined): string => {
//   if (typeof v === "boolean") return v ? "YES" : "NO";
//   if (typeof v === "string") {
//     const upper = v.toUpperCase();
//     if (["YES", "Y", "TRUE"].includes(upper)) return "YES";
//     if (["NO", "N", "FALSE"].includes(upper)) return "NO";
//   }
//   return v ? "YES" : "NO";
// };

// const formatDate = (raw?: string, withTime = false): string => {
//   if (!raw) return "-";
//   const d = new Date(raw);
//   if (isNaN(d.getTime())) return raw;
//   const dateStr = d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
//   if (!withTime) return dateStr;
//   const timeStr = d.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   return `${dateStr} - ${timeStr}`;
// };

// const getFileName = (url?: string | null): string | null => {
//   if (!url) return null;
//   try {
//     const clean = url.split("?")[0];
//     const last = clean.split("/").pop();
//     return last ? decodeURIComponent(last) : "document";
//   } catch {
//     return "document";
//   }
// };

// async function urlToDataURL(
//   url: string | null | undefined,
// ): Promise<{ dataUrl: string; format: string } | null> {
//   if (!url) return null;
//   try {
//     const res = await fetch(url, { mode: "cors" });
//     if (!res.ok) return null;
//     const blob = await res.blob();
//     if (!/^image\//.test(blob.type)) return null;
//     const format = blob.type.includes("png") ? "PNG" : "JPEG";
//     const dataUrl = await new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//     return { dataUrl, format };
//   } catch {
//     return null;
//   }
// }

// /* ============================================================
//  * DATA SHAPING
//  * ============================================================ */

// export interface DocRow {
//   key: string;
//   label: string;
//   url: string | null;
// }

// export interface SlipData {
//   registrationNumber: string;
//   applicationReferenceNumber: string;
//   submissionDate: string;
//   status: string;
//   fullName: string;
//   fatherName: string;
//   motherName: string;
//   dob: string;
//   age: string;
//   gender: string;
//   maritalStatus: string;
//   mobile: string;
//   mobileVerified: string;
//   alternateMobile: string;
//   email: string;
//   emailVerified: string;
//   nationality: string;
//   motherTongue: string;
//   district: string;
//   reservationCategory: string;
//   pwdStatus: string;
//   typeOfDisability: string;
//   is40Percent: string;
//   stateGovEmployee: string;
//   sponsoredExchange: string;
//   identificationMarks: string;
//   identityType: string;
//   identityNumber: string;
//   citizenOfIndia: string;
//   manipurResident: string;
//   permanentAddress: AddressData;
//   correspondenceAddress: AddressData;
//   sameAsPermanent: boolean;
//   education: Array<{ label: string; row: EducationRow }>;
//   dedQual: string;
//   dedInstitution: string;
//   crossDisabilityPeriod: string;
//   rciNumber: string;

//   // New multi-experience structure
//   hasExperience: boolean;
//   experiences: Array<{ designation: string; duration: string; reason: string }>;

//   photograph: string | null;
//   signature: string | null;
//   livePhoto: string | null;
//   documents: DocRow[];

//   payment: {
//     amount: string;
//     currency: string;
//     status: string;
//     paymentMode: string;
//     bankName: string;
//     transactionId: string;
//     paymentOrderId: string;
//     createdAt: string;
//   };
//   generatedOn: string;
// }

// function shapeSlipData(apiData: ApiData): SlipData {
//   const candidate = apiData?.candidateDetails || {};
//   const step0 = apiData?.steps?.step0 || {};
//   const step1 = apiData?.steps?.step1 || {};
//   const step2 = apiData?.steps?.step2 || {};
//   const step3 = apiData?.steps?.step3 || {};
//   const personalInfo = step1.personalInfo || {};

//   const permanentAddress: AddressData =
//     step1.address?.permanent || step0.address?.permanent || {};
    
//   // Fixed mapping check to include API's "correspond" 
//   const correspondenceAddress: AddressData =
//     step1.address?.correspond || step1.address?.correspondence || step0.address?.correspondence || {};

//   const education = EDUCATION_LEVELS.map(({ key, label }) => ({
//     label,
//     row: step1.education?.[key] || {},
//   }));

//   const knownDocKeys = Object.keys(DOC_LABELS).filter(
//     (k) => k in step2 && !PHOTO_PANEL_KEYS.has(k),
//   );
  
//   const experienceCertKeys = Object.keys(step2)
//     .filter((k) => k.startsWith(EXPERIENCE_CERT_PREFIX))
//     .sort();

//   const documents: DocRow[] = [
//     ...knownDocKeys.map((key) => ({
//       key,
//       label: DOC_LABELS[key],
//       url: step2[key] || null,
//     })),
//     ...experienceCertKeys.map((key, idx) => ({
//       key,
//       label: `Experience Certificate ${idx + 1}`,
//       url: step2[key] || null,
//     })),
//   ];

//   // Dynamic Array Parsing for Work Experience
//   const rawExp = step1.experience;
//   const isExpArray = Array.isArray(rawExp);
  
//   let experiences: Array<{ designation: string, duration: string, reason: string }> = [];
//   let hasExperience = false;

//   if (isExpArray && rawExp.length > 0) {
//     hasExperience = true;
//     experiences = rawExp.map((exp: any) => ({
//       designation: dash(exp.designation || exp.employerDesignation),
//       duration: exp.duration ? `${exp.duration} MONTHS` : (exp.servicePeriodMonths ? `${exp.servicePeriodMonths} MONTHS` : "-"),
//       reason: dash(exp.reasonLeaving || exp.reasonForLeaving)
//     }));
//   } else if (!isExpArray && rawExp && (rawExp as any).hasExperience) {
//     hasExperience = true;
//     const exp = rawExp as any;
//     experiences = [{
//       designation: dash(exp.employerDesignation),
//       duration: exp.servicePeriodMonths ? `${exp.servicePeriodMonths} MONTHS` : "-",
//       reason: dash(exp.reasonForLeaving)
//     }];
//   }

//   return {
//     registrationNumber: dash(candidate.registrationNumber),
//     applicationReferenceNumber: dash(apiData?.applicationReferenceNumber),
//     submissionDate: formatDate(apiData?.submissionDate, true),
//     status: titeCaseStatus(apiData?.status, apiData?.isSubmitted),
//     fullName: dash(personalInfo.name || step0.fullName),
//     fatherName: dash(personalInfo.fatherName || step0.fatherName),
//     motherName: dash(personalInfo.motherName || step0.motherName),
//     dob: dash(personalInfo.dob || step0.dateOfBirth),
//     age: step0.age !== undefined ? String(step0.age) : "-",
//     gender: titleCase(personalInfo.gender || step0.gender),
//     maritalStatus: titleCase(personalInfo.maritalStatus || step0.maritalStatus),
//     mobile: dash(personalInfo.mobile || step0.mobileNumber || candidate.mobileNumber),
//     mobileVerified: yn(candidate.mobileVerified),
//     alternateMobile: dash(step0.alternateNumber || candidate.alternateNumber),
//     email: dash(personalInfo.email || step0.emailId),
//     emailVerified: yn(candidate.emailVerified),
//     nationality: dash(personalInfo.nationality || step0.nationality),
//     motherTongue: dash(step0.motherTongue),
//     district: dash(personalInfo.district || step0.selectDistrict),
//     reservationCategory: dash(
//       personalInfo.reservationCategory || step0.reservationCategory,
//     ),
//     pwdStatus: yn(
//       personalInfo.pwdStatus ? personalInfo.pwdStatus === "yes" : step0.isPwd,
//     ),
//     typeOfDisability: dash(personalInfo.typeOfDisability),
//     is40Percent: yn(personalInfo.is40Percent === "yes"),
//     stateGovEmployee: yn(
//       personalInfo.stateGovEmployee
//         ? personalInfo.stateGovEmployee === "yes"
//         : step0.govEmployee,
//     ),
//     sponsoredExchange: yn(personalInfo.sponsoredExchange === "yes"),
//     identificationMarks: dash(
//       personalInfo.identificationMarks ||
//         [step0.identificationMark1, step0.identificationMark2]
//           .filter(Boolean)
//           .join(", "),
//     ),
//     identityType: dash(step0.identityType).toUpperCase(),
//     identityNumber: dash(step0.identityNumber),
//     citizenOfIndia: yn(step0.citizenOfIndia),
//     manipurResident: yn(step0.manipurResident),
//     permanentAddress,
//     correspondenceAddress,
//     sameAsPermanent: !!correspondenceAddress.sameAsPermanent,
//     education,
//     dedQual: dash(step1.teachereligibilit?.dedQual),
//     dedInstitution: dash(step1.teachereligibilit?.dedInstitution),
//     crossDisabilityPeriod: step1.teachereligibilit?.crossDisabilityPeriod
//       ? `${step1.teachereligibilit.crossDisabilityPeriod} MONTHS`
//       : "-",
//     rciNumber: dash(step1.teachereligibilit?.rciNumber),

//     hasExperience,
//     experiences,

//     photograph: step2.photograph || null,
//     signature: step2.signature || null,
//     livePhoto: step2.livePhoto || null,
//     documents,

//     payment: {
//       amount: step3.amount ? `RS. ${step3.amount}` : "-",
//       currency: dash(step3.currency),
//       status: titleCase(step3.status),
//       paymentMode: dash(step3.paymentMode),
//       bankName: dash(step3.bankName),
//       transactionId: dash(step3.transactionId),
//       paymentOrderId: dash(step3.paymentOrderId),
//       createdAt: formatDate(step3.createdAt, true),
//     },

//     generatedOn: new Date().toLocaleString("en-IN").replace(",", ""),
//   };
// }

// function titeCaseStatus(status?: string, isSubmitted?: boolean): string {
//   if (isSubmitted && status === "submitted") return "SUBMITTED";
//   return status ? status.toUpperCase() : "-";
// }

// /* ============================================================
//  * DRAWING HELPERS
//  * ============================================================ */

// function drawWatermark(pdf: jsPDF, logoImg: { dataUrl: string; format: string }) {
//   try {
//     const wmW = 100;
//     const wmH = 100;
//     const x = (PAGE_W - wmW) / 2;
//     const y = (PAGE_H - wmH) / 2;
    
//     // Safely attempt GState application for opacity
//     let gStateObj: any;
//     if (typeof (pdf as any).GState === "function") {
//         gStateObj = new (pdf as any).GState({ opacity: 0.08 });
//     } else if (typeof (window as any)?.jsPDF?.GState === "function") {
//         gStateObj = new (window as any).jsPDF.GState({ opacity: 0.08 });
//     }
    
//     if (gStateObj) {
//         pdf.setGState(gStateObj);
//     }
    
//     // Draw the image
//     pdf.addImage(logoImg.dataUrl, logoImg.format, x, y, wmW, wmH);
    
//     // Reset opacity back to 1.0 immediately
//     if (gStateObj) {
//         let resetObj: any;
//         if (typeof (pdf as any).GState === "function") {
//            resetObj = new (pdf as any).GState({ opacity: 1.0 });
//         } else {
//            resetObj = new (window as any).jsPDF.GState({ opacity: 1.0 });
//         }
//         pdf.setGState(resetObj);
//     }
//   } catch (e) {
//     // If GState fails completely on the user's jsPDF build, silently skip 
//     // the watermark rather than rendering a massive solid non-transparent image.
//   }
// }

// function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
//   if (y + needed > PAGE_H - MARGIN - FOOTER_SPACE) {
//     pdf.addPage();
//     // Re-draw watermark underneath new content if logo was loaded successfully
//     const logoImg = (pdf as any)._logoImg;
//     if (logoImg) {
//        drawWatermark(pdf, logoImg);
//     }
//     return MARGIN;
//   }
//   return y;
// }

// function sectionHeader(pdf: jsPDF, y: number, title: string): number {
//   y = ensureSpace(pdf, y, 8);
//   // Color updated to Blue (#0076b6 -> 0, 118, 182)
//   pdf.setFillColor(0, 118, 182); 
//   pdf.rect(MARGIN, y, CONTENT_W, 7, "F");
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.2);
//   pdf.rect(MARGIN, y, CONTENT_W, 7);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(9.5);
//   pdf.setTextColor(255, 255, 255);
//   pdf.text(title, MARGIN + 2, y + 5);
//   pdf.setTextColor(0, 0, 0);
//   return y + 7;
// }

// interface RowOptions {
//   labelW?: number;
//   rightInset?: number;
// }

// function measureRowHeight(
//   pdf: jsPDF,
//   label: string,
//   value: string,
//   labelW: number,
//   rowW: number,
// ): number {
//   pdf.setFontSize(7.6);
//   const valueW = rowW - labelW;
//   const valueLines = pdf.splitTextToSize(value, valueW - 4);
//   const labelLines = pdf.splitTextToSize(label, labelW - 4);
//   const lines = Math.max(valueLines.length, labelLines.length, 1);
//   return Math.max(6.2, lines * 3.4 + 2.6);
// }

// function labelValueRow(
//   pdf: jsPDF,
//   y: number,
//   label: string,
//   value: string,
//   opts: RowOptions = {},
// ): number {
//   const labelW = opts.labelW ?? LABEL_W;
//   const rightInset = opts.rightInset ?? 0;
//   const rowW = CONTENT_W - rightInset;
//   const valueW = rowW - labelW;

//   pdf.setFontSize(7.6);
//   const valueLines = pdf.splitTextToSize(value, valueW - 4);
//   const labelLines = pdf.splitTextToSize(label, labelW - 4);
//   const lineH = 3.4;
//   const lines = Math.max(valueLines.length, labelLines.length, 1);
//   const rowH = Math.max(6.2, lines * lineH + 2.6);

//   y = ensureSpace(pdf, y, rowH);

//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);

//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(MARGIN, y, labelW, rowH, "F");
//   pdf.rect(MARGIN, y, labelW, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.setTextColor(0);
//   pdf.text(labelLines, MARGIN + 1.5, y + 4);

//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(MARGIN + labelW, y, valueW, rowH, "F");
//   pdf.rect(MARGIN + labelW, y, valueW, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(valueLines, MARGIN + labelW + 1.5, y + 4);

//   return y + rowH;
// }

// function twoPairRow(
//   pdf: jsPDF,
//   y: number,
//   pairs: [string, string, string, string],
//   opts: { labelW1?: number; labelW2?: number } = {},
// ): number {
//   const halfW = CONTENT_W / 2;
//   const labelW1 = opts.labelW1 ?? 34;
//   const labelW2 = opts.labelW2 ?? 34;
//   const valueW1 = halfW - labelW1;
//   const valueW2 = halfW - labelW2;

//   pdf.setFontSize(7.6);
//   const v1Lines = pdf.splitTextToSize(pairs[1], valueW1 - 4);
//   const v2Lines = pdf.splitTextToSize(pairs[3], valueW2 - 4);
//   const lines = Math.max(v1Lines.length, v2Lines.length, 1);
//   const rowH = Math.max(6.2, lines * 3.4 + 2.6);

//   y = ensureSpace(pdf, y, rowH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);

//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(MARGIN, y, labelW1, rowH, "F");
//   pdf.rect(MARGIN, y, labelW1, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(pairs[0], MARGIN + 1.5, y + 4);

//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(MARGIN + labelW1, y, valueW1, rowH, "F");
//   pdf.rect(MARGIN + labelW1, y, valueW1, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(v1Lines, MARGIN + labelW1 + 1.5, y + 4);

//   const x2 = MARGIN + halfW;
//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(x2, y, labelW2, rowH, "F");
//   pdf.rect(x2, y, labelW2, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(pairs[2], x2 + 1.5, y + 4);

//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(x2 + labelW2, y, valueW2, rowH, "F");
//   pdf.rect(x2 + labelW2, y, valueW2, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(v2Lines, x2 + labelW2 + 1.5, y + 4);

//   return y + rowH;
// }

// async function drawPhotoPanel(
//   pdf: jsPDF,
//   x: number,
//   y: number,
//   data: SlipData,
//   boxHeight: number = PHOTO_H,
// ): Promise<void> {
//   const boxW = PHOTO_W;
//   const boxH = boxHeight;
//   const gap = PHOTO_GAP;
//   const items: Array<{ caption: string[]; url: string | null }> = [
//     { caption: ["LIVE", "PHOTO"], url: data.livePhoto },
//     { caption: ["PHOTOGRAPH"], url: data.photograph },
//     { caption: ["SIGNATURE"], url: data.signature },
//   ];

//   for (let i = 0; i < items.length; i++) {
//     const boxY = y + i * (boxH + gap);
//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);
//     pdf.setFillColor(246, 246, 246);
//     pdf.rect(x, boxY, boxW, boxH, "F");
//     pdf.rect(x, boxY, boxW, boxH);

//     const img = await urlToDataURL(items[i].url);
//     if (img) {
//       try {
//         pdf.addImage(img.dataUrl, img.format, x + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
//         continue;
//       } catch {
//         // fall through to caption-only box
//       }
//     }
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(6);
//     pdf.setTextColor(120);
//     const caption = items[i].caption;
//     const startY = boxY + boxH / 2 - ((caption.length - 1) * 2.6) / 2 + 1;
//     caption.forEach((line, li) => {
//       pdf.text(line, x + boxW / 2, startY + li * 2.8, { align: "center" });
//     });
//     pdf.setTextColor(0);
//   }
// }

// function twoColAddressTable(
//   pdf: jsPDF,
//   y: number,
//   perm: AddressData,
//   corr: AddressData,
// ): number {
//   const colW = CONTENT_W / 2;
//   y = ensureSpace(pdf, y, 7);
//   pdf.setFillColor(220, 220, 220);
//   pdf.rect(MARGIN, y, colW, 7, "F");
//   pdf.rect(MARGIN + colW, y, colW, 7, "F");
//   pdf.setDrawColor(0);
//   pdf.rect(MARGIN, y, colW, 7);
//   pdf.rect(MARGIN + colW, y, colW, 7);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(8);
//   pdf.text("PERMANENT ADDRESS", MARGIN + colW / 2, y + 4.8, { align: "center" });
//   pdf.text("CORRESPONDENCE ADDRESS", MARGIN + colW + colW / 2, y + 4.8, {
//     align: "center",
//   });
//   y += 7;

//   const rows: Array<[string, keyof AddressData]> = [
//     ["VILLAGE/STREET:", "street"],
//     ["CITY/TOWN:", "city"],
//     ["DISTRICT:", "district"],
//     ["STATE:", "state"],
//     ["PIN CODE:", "pincode"],  
//     ["POLICE STATION:", "policeStation"],
//   ];
//   const subLabelW = 32;
//   const valueW = colW - subLabelW;

//   for (const [label, key] of rows) {
//     pdf.setFontSize(7);
//     const permVal = dash(perm[key]);
//     const corrVal = dash(corr[key]);
//     const permLines = pdf.splitTextToSize(permVal, valueW - 3);
//     const corrLines = pdf.splitTextToSize(corrVal, valueW - 3);
//     const lines = Math.max(permLines.length, corrLines.length, 1);
//     const h = Math.max(6, lines * 3.2 + 2.4);

//     y = ensureSpace(pdf, y, h);

//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN, y, subLabelW, h, "F");
//     pdf.rect(MARGIN, y, subLabelW, h);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + subLabelW, y, valueW, h, "F");
//     pdf.rect(MARGIN + subLabelW, y, valueW, h);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(label, MARGIN + 1.5, y + 4);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(permLines, MARGIN + subLabelW + 1.5, y + 4);

//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN + colW, y, subLabelW, h, "F");
//     pdf.rect(MARGIN + colW, y, subLabelW, h);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h, "F");
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(label, MARGIN + colW + 1.5, y + 4);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(corrLines, MARGIN + colW + subLabelW + 1.5, y + 4);

//     y += h;
//   }

//   return y;
// }

// function educationTable(
//   pdf: jsPDF,
//   y: number,
//   education: SlipData["education"],
// ): number {
//   const headers = ["LEVEL", "INSTITUTION", "BOARD/UNIVERSITY", "YEAR", "PERCENTAGE"];
//   const widths = [26, 62, 52, 20, 30]; 

//   y = ensureSpace(pdf, y, 9);
//   let x = MARGIN;
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(7);
//   for (let i = 0; i < headers.length; i++) {
//     pdf.setFillColor(220, 220, 220);
//     pdf.rect(x, y, widths[i], 9, "F");
//     pdf.rect(x, y, widths[i], 9);
//     pdf.setTextColor(0);
//     const lines = pdf.splitTextToSize(headers[i], widths[i] - 2);
//     pdf.text(lines, x + widths[i] / 2, y + 4.5, { align: "center" });
//     x += widths[i];
//   }
//   y += 9;

//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(7);

//   for (const { label, row } of education) {
//     const cells = [
//       label,
//       dash(row.college),
//       dash(row.board),
//       dash(row.year),
//       row.percentage ? `${row.percentage}%` : "-",
//     ];
//     const wrapped = cells.map((c, i) => pdf.splitTextToSize(c, widths[i] - 2));
//     const rowH = Math.max(8, Math.max(...wrapped.map((w) => w.length)) * 3.2 + 2.6);

//     y = ensureSpace(pdf, y, rowH);
//     x = MARGIN;
//     for (let i = 0; i < headers.length; i++) {
//       pdf.setFillColor(255, 255, 255);
//       pdf.rect(x, y, widths[i], rowH, "F");
//       pdf.rect(x, y, widths[i], rowH);
//       pdf.setTextColor(0);
//       pdf.text(wrapped[i], x + widths[i] / 2, y + 4, { align: "center" });
//       x += widths[i];
//     }
//     y += rowH;
//   }

//   return y;
// }

// function documentsSection(pdf: jsPDF, y: number, documents: DocRow[]): number {
//   y = sectionHeader(pdf, y, "UPLOADED DOCUMENTS");

//   if (documents.length === 0) {
//     const rowH = 7;
//     y = ensureSpace(pdf, y, rowH);
//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);
//     pdf.rect(MARGIN, y, CONTENT_W, rowH);
//     pdf.setFont("helvetica", "italic");
//     pdf.setFontSize(7.6);
//     pdf.text("No additional documents on record.", MARGIN + 2, y + 4.6);
//     return y + rowH;
//   }

//   const statusW = 26;
//   const labelW = CONTENT_W - statusW;

//   for (const doc of documents) {
//     const uploaded = Boolean(doc.url);
//     const fileName = getFileName(doc.url) || "-";
//     const displayValue = uploaded ? fileName : "Not uploaded";

//     pdf.setFontSize(7.6);
//     const valueLines = pdf.splitTextToSize(displayValue, labelW - LABEL_W - 4);
//     const rowH = Math.max(6.5, valueLines.length * 3.4 + 2.6);
//     y = ensureSpace(pdf, y, rowH);

//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);

//     // label
//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN, y, LABEL_W, rowH, "F");
//     pdf.rect(MARGIN, y, LABEL_W, rowH);
//     pdf.setFont("helvetica", "normal");
//     pdf.setTextColor(0);
//     pdf.text(doc.label.toUpperCase(), MARGIN + 1.5, y + 4);

//     // filename / not-uploaded
//     const valueW = labelW - LABEL_W;
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + LABEL_W, y, valueW, rowH, "F");
//     pdf.rect(MARGIN + LABEL_W, y, valueW, rowH);
//     pdf.setFont("helvetica", uploaded ? "bold" : "italic");
//     pdf.setTextColor(uploaded ? 0 : 150);
//     pdf.text(valueLines, MARGIN + LABEL_W + 1.5, y + 4);

//     // status / link column
//     const statusX = MARGIN + labelW;
//     pdf.rect(statusX, y, statusW, rowH, "F");
//     pdf.rect(statusX, y, statusW, rowH);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(6.6);
//     if (uploaded && doc.url) {
//       // Custom Blue color link
//       pdf.setTextColor(0, 118, 182); 
//       pdf.textWithLink("VIEW \u2192", statusX + statusW / 2, y + rowH / 2 + 1.2, {
//         url: doc.url,
//         align: "center",
//       });
//     } else {
//       pdf.setTextColor(192, 57, 43);
//       pdf.text("MISSING", statusX + statusW / 2, y + rowH / 2 + 1.2, {
//         align: "center",
//       });
//     }
//     pdf.setTextColor(0);

//     y += rowH;
//   }

//   return y;
// }

// function paymentSection(pdf: jsPDF, y: number, payment: SlipData["payment"]): number {
//   y = sectionHeader(pdf, y, "PAYMENT DETAILS");
//   const rows: Array<[string, string]> = [
//     ["AMOUNT :", `${payment.amount} ${payment.currency !== "-" ? payment.currency : ""}`.trim()],
//     ["PAYMENT STATUS :", payment.status],
//     ["PAYMENT MODE :", payment.paymentMode],
//     ["BANK NAME :", payment.bankName],
//     ["TRANSACTION ID :", payment.transactionId],
//     ["ORDER ID :", payment.paymentOrderId],
//     ["PAID / INITIATED ON :", payment.createdAt],
//   ];
//   for (const [label, value] of rows) {
//     y = labelValueRow(pdf, y, label, value, { labelW: 55 });
//   }
//   return y;
// }

// function drawBarcode(pdf: jsPDF, x: number, y: number, w: number, h: number): void {
//   const pattern = [2, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 1, 2, 1, 1, 3, 1];
//   const unit = w / pattern.reduce((a, b) => a + b, 0) / 3;
//   let cx = x;
//   let black = true;
//   const totalUnits = pattern.reduce((a, b) => a + b, 0) * 3;
//   let unitsDrawn = 0;
//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(x, y, w, h, "F");
//   while (unitsDrawn < totalUnits && cx < x + w) {
//     const barUnits = pattern[unitsDrawn % pattern.length];
//     const barW = Math.min(barUnits * unit, x + w - cx);
//     if (black) {
//       pdf.setFillColor(0, 0, 0);
//       pdf.rect(cx, y, barW, h, "F");
//     }
//     cx += barW;
//     unitsDrawn += barUnits;
//     black = !black;
//   }
// }

// function drawPlaceholderLogo(pdf: jsPDF, cx: number, cy: number, r: number): void {
//   pdf.setDrawColor(0, 118, 182);
//   pdf.setLineWidth(0.6);
//   pdf.circle(cx, cy, r);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(6);
//   pdf.setTextColor(0, 118, 182);
//   pdf.text("MSSC", cx, cy + 1.5, { align: "center" });
//   pdf.setTextColor(0);
// }

// /* ============================================================
//  * MAIN EXPORT
//  * ============================================================ */

// export async function generateApplicationPDF(
//   apiData: ApiData,
//   opts: PDFOptions = {},
// ): Promise<jsPDF> {
//   const data = shapeSlipData(apiData);
//   const pdf = new jsPDF("p", "mm", "a4");

//   // Load logo early to draw watermark
//   const logoImg = await urlToDataURL(LOGO_URL);
//   if (logoImg) {
//       (pdf as any)._logoImg = logoImg;
//       drawWatermark(pdf, logoImg); // Draw on page 1
//   }

//   let y = MARGIN;

//   /* ---------- Header ---------- */
//   const logoR = 10;
//   if (logoImg) {
//     try {
//       pdf.addImage(logoImg.dataUrl, logoImg.format, MARGIN, y, logoR * 2, logoR * 2);
//     } catch {
//       drawPlaceholderLogo(pdf, MARGIN + logoR, y + logoR, logoR);
//     }
//   } else {
//     drawPlaceholderLogo(pdf, MARGIN + logoR, y + logoR, logoR);
//   }

//   const titleX1 = MARGIN + 26;
//   const titleX2 = PAGE_W - MARGIN - 46;
//   const titleCx = (titleX1 + titleX2) / 2;
//   pdf.setTextColor(0);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(13);
//   pdf.text(COMMISSION_NAME, titleCx, y + 6, { align: "center" });
//   pdf.setFontSize(8.5);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(COMMISSION_ADDRESS_LINE, titleCx, y + 11.5, { align: "center" });
//   pdf.setFont("helvetica", "bold");
//   pdf.text(
//     `APPLICATION REFERENCE: ${data.applicationReferenceNumber}`,
//     titleCx,
//     y + 16.5,
//     { align: "center" },
//   );

//   const barcodeW = 42;
//   const barcodeH = 9;
//   const barcodeX = PAGE_W - MARGIN - barcodeW;
//   drawBarcode(pdf, barcodeX, y, barcodeW, barcodeH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(barcodeX, y, barcodeW, barcodeH);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(7);
//   pdf.text(data.registrationNumber, barcodeX + barcodeW / 2, y + barcodeH + 4, {
//     align: "center",
//   });

//   y += 26;
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.4);
//   pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
//   y += 2;

//   // Status strip
//   const statusRowH = 7;
//   pdf.setFillColor(243, 231, 211); // theme.goldLight
//   pdf.rect(MARGIN, y, CONTENT_W, statusRowH, "F");
//   pdf.rect(MARGIN, y, CONTENT_W, statusRowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(8);
//   pdf.setTextColor(138, 100, 22);
//   pdf.text(`STATUS: ${data.status}`, MARGIN + 2, y + 4.8);
//   pdf.text(
//     `SUBMITTED: ${data.submissionDate}`,
//     PAGE_W - MARGIN - 2,
//     y + 4.8,
//     { align: "right" },
//   );
//   pdf.setTextColor(0);
//   y += statusRowH + 2;

//   /* ---------- Personal details ---------- */
//   y = sectionHeader(pdf, y, "PERSONAL DETAILS");

//   const PHOTO_INSET = PHOTO_W + 2;
//   const personalRows: Array<[string, string]> = [
//     ["REGISTRATION NO. :", data.registrationNumber],
//     ["APPLICATION REFERENCE NO. :", data.applicationReferenceNumber],
//     ["NAME OF APPLICANT :", data.fullName],
//     ["FATHER'S NAME :", data.fatherName],
//     ["MOTHER'S NAME :", data.motherName],
//     ["GENDER :", data.gender],
//     ["DATE OF BIRTH :", data.dob],
//     ["AGE :", data.age],
//     ["MARITAL STATUS :", data.maritalStatus],
//     ["MOBILE NO. :", `${data.mobile}  (${data.mobileVerified === "YES" ? "Verified" : "Unverified"})`],
//     ["EMAIL ID :", `${data.email}  (${data.emailVerified === "YES" ? "Verified" : "Unverified"})`],
//     ["NATIONALITY :", data.nationality],
//     ["DISTRICT :", data.district],
//     ["RESERVATION CATEGORY :", data.reservationCategory],
//   ];

//   const rowWWithPhoto = CONTENT_W - PHOTO_INSET;
//   let personalBlockHeight = 0;
//   for (const [label, value] of personalRows) {
//     personalBlockHeight += measureRowHeight(pdf, label, value, LABEL_W, rowWWithPhoto);
//   }
//   const photoBoxH = Math.max(PHOTO_H, (personalBlockHeight - PHOTO_GAP * 2) / 3);

//   const photoPanelX = PAGE_W - MARGIN - PHOTO_W;
//   await drawPhotoPanel(pdf, photoPanelX, y, data, photoBoxH);

//   for (const [label, value] of personalRows) {
//     y = labelValueRow(pdf, y, label, value, { rightInset: PHOTO_INSET });
//   }

//   // Disability block
//   y = twoPairRow(
//     pdf,
//     y,
//     ["PWD STATUS :", data.pwdStatus, "40% OR MORE? :", data.is40Percent],
//     { labelW1: 30, labelW2: 30 },
//   );
//   if (data.pwdStatus === "YES") {
//     y = labelValueRow(pdf, y, "TYPE OF DISABILITY :", data.typeOfDisability, {
//       labelW: 55,
//     });
//   }

//   // Employment / identity block
//   const WIDE_LABEL_W = 95;
//   y = twoPairRow(
//     pdf,
//     y,
//     [
//       "STATE GOVT. EMPLOYEE? :",
//       data.stateGovEmployee,
//       "SPONSORED CANDIDATE? :",
//       data.sponsoredExchange,
//     ],
//     { labelW1: 40, labelW2: 40 },
//   );
//   y = labelValueRow(pdf, y, "IDENTIFICATION MARKS :", data.identificationMarks, {
//     labelW: WIDE_LABEL_W,
//   });
  
//   y = twoPairRow(
//     pdf,
//     y,
//     ["CITIZEN OF INDIA? :", data.citizenOfIndia, "MANIPUR RESIDENT? :", data.manipurResident],
//     { labelW1: 34, labelW2: 34 },
//   );

//   /* ---------- Address ---------- */
//   y = sectionHeader(pdf, y, "ADDRESS DETAILS");
//   y = twoColAddressTable(pdf, y, data.permanentAddress, data.correspondenceAddress);

//   /* ---------- Education ---------- */
//   y = sectionHeader(pdf, y, "EDUCATIONAL QUALIFICATIONS");
//   y = educationTable(pdf, y, data.education);

//   /* ---------- Teacher eligibility ---------- */
//   y = sectionHeader(pdf, y, "TEACHER ELIGIBILITY");
//   y = labelValueRow(pdf, y, "D.ED. / D.EL.ED. QUALIFICATION :", data.dedQual, {
//     labelW: WIDE_LABEL_W,
//   });
//   y = labelValueRow(pdf, y, "D.ED. / D.EL.ED. INSTITUTION :", data.dedInstitution, {
//     labelW: WIDE_LABEL_W,
//   });
//   y = twoPairRow(
//     pdf,
//     y,
//     [
//       "CROSS-DISABILITY TRAINING :",
//       data.crossDisabilityPeriod,
//       "RCI CRR NUMBER :",
//       data.rciNumber,
//     ],
//     { labelW1: 42, labelW2: 30 },
//   );

//   /* ---------- Work experience ---------- */
//   y = sectionHeader(pdf, y, "WORK EXPERIENCE");
  
//   if (data.hasExperience && data.experiences.length > 0) {
//     data.experiences.forEach((exp, idx) => {
//       // Add a separator between array items
//       if (idx > 0) {
//         y = ensureSpace(pdf, y, 6);
//         pdf.setDrawColor(200, 200, 200);
//         pdf.setLineWidth(0.15);
//         pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
//         y += 4;
//       }
//       y = labelValueRow(pdf, y, "DESIGNATION :", exp.designation, { labelW: WIDE_LABEL_W });
//       y = labelValueRow(pdf, y, "SERVICE PERIOD :", exp.duration, { labelW: WIDE_LABEL_W });
//       y = labelValueRow(pdf, y, "REASON FOR LEAVING :", exp.reason, { labelW: WIDE_LABEL_W });
//     });
//   } else {
//     const rowH = 7;
//     y = ensureSpace(pdf, y, rowH);
//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);
//     pdf.rect(MARGIN, y, CONTENT_W, rowH);
//     pdf.setFont("helvetica", "italic");
//     pdf.setFontSize(7.6);
//     pdf.text("No prior work experience declared.", MARGIN + 2, y + 4.6);
//     y += rowH;
//   }

//   /* ---------- Documents ---------- */
//   y = documentsSection(pdf, y, data.documents);

//   /* ---------- Payment ---------- */
//   y = paymentSection(pdf, y, data.payment);

//   /* ---------- Declaration ---------- */
//   y = sectionHeader(pdf, y, "DECLARATION");
//   const declText =
//     "I HEREBY DECLARE THAT ALL THE INFORMATION FURNISHED ABOVE IS TRUE, CORRECT AND COMPLETE TO THE BEST OF MY " +
//     "KNOWLEDGE AND BELIEF. I UNDERSTAND THAT ANY FALSE OR MISLEADING INFORMATION MAY RESULT IN REJECTION OF MY " +
//     "APPLICATION OR CANCELLATION OF MY CANDIDATURE AT ANY STAGE OF THE RECRUITMENT PROCESS.";
//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(7.4);
//   pdf.setTextColor(0);
//   const declLines = pdf.splitTextToSize(declText, CONTENT_W - 4);
//   const declTextH = declLines.length * 3.4;
//   const declBoxH = Math.max(20, declTextH + 12);
//   y = ensureSpace(pdf, y, declBoxH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(MARGIN, y, CONTENT_W, declBoxH);
//   pdf.text(declLines, MARGIN + 2, y + 5);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(`GENERATED ON : ${data.generatedOn}`, MARGIN + 2, y + declTextH + 9);
//   y += declBoxH;

//   /* ---------- Footer note ---------- */
//   y = ensureSpace(pdf, y, 8);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(MARGIN, y, CONTENT_W, 8);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(7);
//   pdf.text(
//     "NOTE: PLEASE KEEP YOUR REGISTRATION NO., APPLICATION REFERENCE NO. AND MOBILE/EMAIL SAFE FOR FUTURE REFERENCE.",
//     PAGE_W / 2,
//     y + 5,
//     { align: "center" },
//   );

//   const filename =
//     opts.filename || `MSSC_Application_${data.applicationReferenceNumber}.pdf`;
//   if (opts.save !== false) {
//     pdf.save(filename);
//   }
//   return pdf;
// }
import { jsPDF } from "jspdf";

/* ============================================================
 * TYPES
 * These mirror the `ApplicationData` shape used by
 * ShowallDeatilsPage.tsx, i.e. the *already unwrapped*
 * `data` object from the `/application/steps/all` response
 * ============================================================ */

export interface AddressData {
  street?: string;
  village?: string;
  post?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
  policeStation?: string;
  sameAsPermanent?: boolean;
}

export interface CandidateDetails {
  id?: string;
  registrationNumber?: string;
  mobileNumber?: string;
  alternateNumber?: string | null;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  dateOfBirth?: string;
}

export interface StepZero {
  age?: number;
  isPwd?: boolean;
  gender?: string;
  address?: { permanent?: AddressData; correspondence?: AddressData };
  emailId?: string;
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  govEmployee?: boolean;
  nationality?: string;
  identityType?: string;
  mobileNumber?: string;
  motherTongue?: string;
  maritalStatus?: string;
  citizenOfIndia?: boolean;
  identityNumber?: string;
  selectDistrict?: string;
  alternateNumber?: string;
  manipurResident?: boolean;
  identificationMark1?: string;
  identificationMark2?: string;
  reservationCategory?: string;
}

export interface EducationRow {
  college?: string;
  board?: string;
  year?: string;
  percentage?: string;
}

export interface ExperienceRow {
  duration?: string;
  designation?: string;
  reasonLeaving?: string;
  // Fallbacks for the older flat format, just in case
  hasExperience?: boolean;
  employerDesignation?: string;
  servicePeriodMonths?: number | null;
  reasonForLeaving?: string;
}

export interface StepOne {
  personalInfo?: {
    name?: string;
    dob?: string;
    gender?: string;
    district?: string;
    maritalStatus?: string;
    mobile?: string;
    email?: string;
    fatherName?: string;
    motherName?: string;
    nationality?: string;
    reservationCategory?: string;
    pwdStatus?: string;
    typeOfDisability?: string;
    is40Percent?: string;
    stateGovEmployee?: string;
    sponsoredExchange?: string;
    identificationMarks?: string;
  };
  address?: { 
    permanent?: AddressData; 
    correspond?: AddressData; // Added to match API
    correspondence?: AddressData; 
  };
  education?: {
    "10th"?: EducationRow;
    "12th"?: EducationRow;
    graduation?: EducationRow;
    postGraduation?: EducationRow;
  };
  teachereligibilit?: {
    dedQual?: string;
    dedInstitution?: string;
    crossDisabilityPeriod?: string | number;
    rciNumber?: string;
  };
  // Accepts both the array format from the API and the old flat object fallback
  experience?: ExperienceRow[] | ExperienceRow;
}

export type StepTwo = Record<string, string | null | undefined>;

export interface StepThree {
  paymentOrderId?: string;
  amount?: string;
  currency?: string;
  transactionId?: string | null;
  status?: string;
  paymentMode?: string | null;
  bankName?: string | null;
  paymentUrl?: string;
  createdAt?: string;
}

export interface ApiData {
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
    step2?: StepTwo;
    step3?: StepThree;
  };
}

export interface PDFOptions {
  save?: boolean;
  filename?: string;
}

/* ============================================================
 * LAYOUT CONSTANTS
 * ============================================================ */

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LABEL_W = 70;
const FOOTER_SPACE = 8;

// Explicitly requested logo format
const LOGO_URL = "/mssc.png";

const COMMISSION_NAME = "MANIPUR STAFF SELECTION COMMISSION (MSSC)";
const COMMISSION_ADDRESS_LINE = "GOVERNMENT OF MANIPUR";

const PHOTO_W = 28;
const PHOTO_H = 24;
const PHOTO_GAP = 1.5;

const DOC_LABELS: Record<string, string> = {
  photograph: "Photograph",
  signature: "Signature",
  livePhoto: "Live Photo",
  eligibilityCert: "Eligibility Certificate",
  permanentResCert: "Permanent Residence Certificate",
  domicileCert: "Domicile Certificate",
  hslcMarksheet: "HSLC Marksheet",
  hslcProvCert: "HSLC Provisional Certificate",
  nocCert: "No Objection Certificate",
  reservationCert: "Reservation Certificate",
  pwdCert: "PWD Certificate",
  tenPlusTwoCert: "10+2 / Equivalent Certificate",
};

const EXPERIENCE_CERT_PREFIX = "experienceCert_";
const PHOTO_PANEL_KEYS = new Set(["photograph", "signature", "livePhoto"]);

const EDUCATION_LEVELS: Array<{
  key: "10th" | "12th" | "graduation" | "postGraduation";
  label: string;
}> = [
  { key: "10th", label: "10TH" },
  { key: "12th", label: "12TH" },
  { key: "graduation", label: "GRADUATION" },
  { key: "postGraduation", label: "POST-GRADUATION" },
];

/* ============================================================
 * HELPERS
 * ============================================================ */

const dash = (v: unknown): string =>
  v === undefined || v === null || v === "" ? "-" : String(v);

const titleCase = (s?: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "-";

const yn = (v: string | boolean | undefined): string => {
  if (typeof v === "boolean") return v ? "YES" : "NO";
  if (typeof v === "string") {
    const upper = v.toUpperCase();
    if (["YES", "Y", "TRUE"].includes(upper)) return "YES";
    if (["NO", "N", "FALSE"].includes(upper)) return "NO";
  }
  return v ? "YES" : "NO";
};

const formatDate = (raw?: string, withTime = false): string => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const dateStr = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!withTime) return dateStr;
  const timeStr = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} - ${timeStr}`;
};

const getFileName = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    const clean = url.split("?")[0];
    const last = clean.split("/").pop();
    return last ? decodeURIComponent(last) : "document";
  } catch {
    return "document";
  }
};

async function urlToDataURL(
  url: string | null | undefined,
): Promise<{ dataUrl: string; format: string } | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!/^image\//.test(blob.type)) return null;
    const format = blob.type.includes("png") ? "PNG" : "JPEG";
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return { dataUrl, format };
  } catch {
    return null;
  }
}

/* ============================================================
 * DATA SHAPING
 * ============================================================ */

export interface DocRow {
  key: string;
  label: string;
  url: string | null;
}

export interface SlipData {
  registrationNumber: string;
  applicationReferenceNumber: string;
  submissionDate: string;
  status: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  age: string;
  gender: string;
  maritalStatus: string;
  mobile: string;
  mobileVerified: string;
  alternateMobile: string;
  email: string;
  emailVerified: string;
  nationality: string;
  motherTongue: string;
  district: string;
  reservationCategory: string;
  pwdStatus: string;
  typeOfDisability: string;
  is40Percent: string;
  stateGovEmployee: string;
  sponsoredExchange: string;
  identificationMarks: string;
  identityType: string;
  identityNumber: string;
  citizenOfIndia: string;
  manipurResident: string;
  permanentAddress: AddressData;
  correspondenceAddress: AddressData;
  sameAsPermanent: boolean;
  education: Array<{ label: string; row: EducationRow }>;
  dedQual: string;
  dedInstitution: string;
  crossDisabilityPeriod: string;
  rciNumber: string;

  hasExperience: boolean;
  experiences: Array<{ designation: string; duration: string; reason: string }>;

  photograph: string | null;
  signature: string | null;
  livePhoto: string | null;
  documents: DocRow[];

  payment: {
    amount: string;
    currency: string;
    status: string;
    paymentMode: string;
    bankName: string;
    transactionId: string;
    paymentOrderId: string;
    createdAt: string;
  };
  generatedOn: string;
}

function shapeSlipData(apiData: ApiData): SlipData {
  const candidate = apiData?.candidateDetails || {};
  const step0 = apiData?.steps?.step0 || {};
  const step1 = apiData?.steps?.step1 || {};
  const step2 = apiData?.steps?.step2 || {};
  const step3 = apiData?.steps?.step3 || {};
  const personalInfo = step1.personalInfo || {};

  const permanentAddress: AddressData =
    step1.address?.permanent || step0.address?.permanent || {};
    
  const correspondenceAddress: AddressData =
    step1.address?.correspond || step1.address?.correspondence || step0.address?.correspondence || {};

  const education = EDUCATION_LEVELS.map(({ key, label }) => ({
    label,
    row: step1.education?.[key] || {},
  }));

  const knownDocKeys = Object.keys(DOC_LABELS).filter(
    (k) => k in step2 && !PHOTO_PANEL_KEYS.has(k),
  );
  
  const experienceCertKeys = Object.keys(step2)
    .filter((k) => k.startsWith(EXPERIENCE_CERT_PREFIX))
    .sort();

  const documents: DocRow[] = [
    ...knownDocKeys.map((key) => ({
      key,
      label: DOC_LABELS[key],
      url: step2[key] || null,
    })),
    ...experienceCertKeys.map((key, idx) => ({
      key,
      label: `Experience Certificate ${idx + 1}`,
      url: step2[key] || null,
    })),
  ];

  const rawExp = step1.experience;
  const isExpArray = Array.isArray(rawExp);
  
  let experiences: Array<{ designation: string, duration: string, reason: string }> = [];
  let hasExperience = false;

  if (isExpArray && rawExp.length > 0) {
    hasExperience = true;
    experiences = rawExp.map((exp: any) => ({
      designation: dash(exp.designation || exp.employerDesignation),
      duration: exp.duration ? `${exp.duration} MONTHS` : (exp.servicePeriodMonths ? `${exp.servicePeriodMonths} MONTHS` : "-"),
      reason: dash(exp.reasonLeaving || exp.reasonForLeaving)
    }));
  } else if (!isExpArray && rawExp && (rawExp as any).hasExperience) {
    hasExperience = true;
    const exp = rawExp as any;
    experiences = [{
      designation: dash(exp.employerDesignation),
      duration: exp.servicePeriodMonths ? `${exp.servicePeriodMonths} MONTHS` : "-",
      reason: dash(exp.reasonForLeaving)
    }];
  }

  return {
    registrationNumber: dash(candidate.registrationNumber),
    applicationReferenceNumber: dash(apiData?.applicationReferenceNumber),
    submissionDate: formatDate(apiData?.submissionDate, true),
    status: titeCaseStatus(apiData?.status, apiData?.isSubmitted),
    fullName: dash(personalInfo.name || step0.fullName),
    fatherName: dash(personalInfo.fatherName || step0.fatherName),
    motherName: dash(personalInfo.motherName || step0.motherName),
    dob: dash(personalInfo.dob || step0.dateOfBirth),
    age: step0.age !== undefined ? String(step0.age) : "-",
    gender: titleCase(personalInfo.gender || step0.gender),
    maritalStatus: titleCase(personalInfo.maritalStatus || step0.maritalStatus),
    mobile: dash(personalInfo.mobile || step0.mobileNumber || candidate.mobileNumber),
    mobileVerified: yn(candidate.mobileVerified),
    alternateMobile: dash(step0.alternateNumber || candidate.alternateNumber),
    email: dash(personalInfo.email || step0.emailId),
    emailVerified: yn(candidate.emailVerified),
    nationality: dash(personalInfo.nationality || step0.nationality),
    motherTongue: dash(step0.motherTongue),
    district: dash(personalInfo.district || step0.selectDistrict),
    reservationCategory: dash(
      personalInfo.reservationCategory || step0.reservationCategory,
    ),
    pwdStatus: yn(
      personalInfo.pwdStatus ? personalInfo.pwdStatus === "yes" : step0.isPwd,
    ),
    typeOfDisability: dash(personalInfo.typeOfDisability),
    is40Percent: yn(personalInfo.is40Percent === "yes"),
    stateGovEmployee: yn(
      personalInfo.stateGovEmployee
        ? personalInfo.stateGovEmployee === "yes"
        : step0.govEmployee,
    ),
    sponsoredExchange: yn(personalInfo.sponsoredExchange === "yes"),
    identificationMarks: dash(
      personalInfo.identificationMarks ||
        [step0.identificationMark1, step0.identificationMark2]
          .filter(Boolean)
          .join(", "),
    ),
    identityType: dash(step0.identityType).toUpperCase(),
    identityNumber: dash(step0.identityNumber),
    citizenOfIndia: yn(step0.citizenOfIndia),
    manipurResident: yn(step0.manipurResident),
    permanentAddress,
    correspondenceAddress,
    sameAsPermanent: !!correspondenceAddress.sameAsPermanent,
    education,
    dedQual: dash(step1.teachereligibilit?.dedQual),
    dedInstitution: dash(step1.teachereligibilit?.dedInstitution),
    crossDisabilityPeriod: step1.teachereligibilit?.crossDisabilityPeriod
      ? `${step1.teachereligibilit.crossDisabilityPeriod} MONTHS`
      : "-",
    rciNumber: dash(step1.teachereligibilit?.rciNumber),

    hasExperience,
    experiences,

    photograph: step2.photograph || null,
    signature: step2.signature || null,
    livePhoto: step2.livePhoto || null,
    documents,

    payment: {
      amount: step3.amount ? `RS. ${step3.amount}` : "-",
      currency: dash(step3.currency),
      status: titleCase(step3.status),
      paymentMode: dash(step3.paymentMode),
      bankName: dash(step3.bankName),
      transactionId: dash(step3.transactionId),
      paymentOrderId: dash(step3.paymentOrderId),
      createdAt: formatDate(step3.createdAt, true),
    },

    generatedOn: new Date().toLocaleString("en-IN").replace(",", ""),
  };
}

function titeCaseStatus(status?: string, isSubmitted?: boolean): string {
  if (isSubmitted && status === "submitted") return "SUBMITTED";
  return status ? status.toUpperCase() : "-";
}

/* ============================================================
 * DRAWING HELPERS
 * ============================================================ */

function drawWatermark(pdf: jsPDF, logoImg: { dataUrl: string; format: string }) {
  try {
    const wmW = 100;
    const wmH = 100;
    const x = (PAGE_W - wmW) / 2;
    const y = (PAGE_H - wmH) / 2;
    
    // Safely attempt GState application for opacity
    let gStateObj: any;
    if (typeof (pdf as any).GState === "function") {
        gStateObj = new (pdf as any).GState({ opacity: 0.08 });
    } else if (typeof (window as any)?.jsPDF?.GState === "function") {
        gStateObj = new (window as any).jsPDF.GState({ opacity: 0.08 });
    }
    
    if (gStateObj) {
        pdf.setGState(gStateObj);
    }
    
    // Draw the image
    pdf.addImage(logoImg.dataUrl, logoImg.format, x, y, wmW, wmH);
    
    // Reset opacity back to 1.0 immediately
    if (gStateObj) {
        let resetObj: any;
        if (typeof (pdf as any).GState === "function") {
           resetObj = new (pdf as any).GState({ opacity: 1.0 });
        } else {
           resetObj = new (window as any).jsPDF.GState({ opacity: 1.0 });
        }
        pdf.setGState(resetObj);
    }
  } catch (e) {
    // If GState fails completely on the user's jsPDF build, silently skip 
    // the watermark rather than rendering a massive solid non-transparent image.
  }
}

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN - FOOTER_SPACE) {
    pdf.addPage();
    // Re-draw watermark underneath new content if logo was loaded successfully
    const logoImg = (pdf as any)._logoImg;
    if (logoImg) {
       drawWatermark(pdf, logoImg);
    }
    return MARGIN;
  }
  return y;
}

function sectionHeader(pdf: jsPDF, y: number, title: string): number {
  y = ensureSpace(pdf, y, 8);
  // Color updated to Blue (#0076b6 -> 0, 118, 182)
  pdf.setFillColor(0, 118, 182); 
  pdf.rect(MARGIN, y, CONTENT_W, 7, "F");
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.2);
  pdf.rect(MARGIN, y, CONTENT_W, 7);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, MARGIN + 2, y + 5);
  pdf.setTextColor(0, 0, 0);
  return y + 7;
}

interface RowOptions {
  labelW?: number;
  rightInset?: number;
}

function measureRowHeight(
  pdf: jsPDF,
  label: string,
  value: string,
  labelW: number,
  rowW: number,
): number {
  pdf.setFontSize(7.6);
  const valueW = rowW - labelW;
  const valueLines = pdf.splitTextToSize(value, valueW - 4);
  const labelLines = pdf.splitTextToSize(label, labelW - 4);
  const lines = Math.max(valueLines.length, labelLines.length, 1);
  return Math.max(6.2, lines * 3.4 + 2.6);
}

function labelValueRow(
  pdf: jsPDF,
  y: number,
  label: string,
  value: string,
  opts: RowOptions = {},
): number {
  const labelW = opts.labelW ?? LABEL_W;
  const rightInset = opts.rightInset ?? 0;
  const rowW = CONTENT_W - rightInset;
  const valueW = rowW - labelW;

  pdf.setFontSize(7.6);
  const valueLines = pdf.splitTextToSize(value, valueW - 4);
  const labelLines = pdf.splitTextToSize(label, labelW - 4);
  const lineH = 3.4;
  const lines = Math.max(valueLines.length, labelLines.length, 1);
  const rowH = Math.max(6.2, lines * lineH + 2.6);

  y = ensureSpace(pdf, y, rowH);

  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);

  pdf.setFillColor(233, 233, 233);
  pdf.rect(MARGIN, y, labelW, rowH, "F");
  pdf.rect(MARGIN, y, labelW, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0);
  pdf.text(labelLines, MARGIN + 1.5, y + 4);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(MARGIN + labelW, y, valueW, rowH, "F");
  pdf.rect(MARGIN + labelW, y, valueW, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(valueLines, MARGIN + labelW + 1.5, y + 4);

  return y + rowH;
}

function twoPairRow(
  pdf: jsPDF,
  y: number,
  pairs: [string, string, string, string],
  opts: { labelW1?: number; labelW2?: number } = {},
): number {
  const halfW = CONTENT_W / 2;
  const labelW1 = opts.labelW1 ?? 34;
  const labelW2 = opts.labelW2 ?? 34;
  const valueW1 = halfW - labelW1;
  const valueW2 = halfW - labelW2;

  pdf.setFontSize(7.6);
  const v1Lines = pdf.splitTextToSize(pairs[1], valueW1 - 4);
  const v2Lines = pdf.splitTextToSize(pairs[3], valueW2 - 4);
  const lines = Math.max(v1Lines.length, v2Lines.length, 1);
  const rowH = Math.max(6.2, lines * 3.4 + 2.6);

  y = ensureSpace(pdf, y, rowH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);

  pdf.setFillColor(233, 233, 233);
  pdf.rect(MARGIN, y, labelW1, rowH, "F");
  pdf.rect(MARGIN, y, labelW1, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.text(pairs[0], MARGIN + 1.5, y + 4);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(MARGIN + labelW1, y, valueW1, rowH, "F");
  pdf.rect(MARGIN + labelW1, y, valueW1, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(v1Lines, MARGIN + labelW1 + 1.5, y + 4);

  const x2 = MARGIN + halfW;
  pdf.setFillColor(233, 233, 233);
  pdf.rect(x2, y, labelW2, rowH, "F");
  pdf.rect(x2, y, labelW2, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.text(pairs[2], x2 + 1.5, y + 4);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(x2 + labelW2, y, valueW2, rowH, "F");
  pdf.rect(x2 + labelW2, y, valueW2, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(v2Lines, x2 + labelW2 + 1.5, y + 4);

  return y + rowH;
}

async function drawPhotoPanel(
  pdf: jsPDF,
  x: number,
  y: number,
  data: SlipData,
  boxHeight: number = PHOTO_H,
): Promise<void> {
  const boxW = PHOTO_W;
  const boxH = boxHeight;
  const gap = PHOTO_GAP;
  const items: Array<{ caption: string[]; url: string | null }> = [
    { caption: ["LIVE", "PHOTO"], url: data.livePhoto },
    { caption: ["PHOTOGRAPH"], url: data.photograph },
    { caption: ["SIGNATURE"], url: data.signature },
  ];

  for (let i = 0; i < items.length; i++) {
    const boxY = y + i * (boxH + gap);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);
    pdf.setFillColor(246, 246, 246);
    pdf.rect(x, boxY, boxW, boxH, "F");
    pdf.rect(x, boxY, boxW, boxH);

    const img = await urlToDataURL(items[i].url);
    if (img) {
      try {
        pdf.addImage(img.dataUrl, img.format, x + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
        continue;
      } catch {
        // fall through to caption-only box
      }
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(120);
    const caption = items[i].caption;
    const startY = boxY + boxH / 2 - ((caption.length - 1) * 2.6) / 2 + 1;
    caption.forEach((line, li) => {
      pdf.text(line, x + boxW / 2, startY + li * 2.8, { align: "center" });
    });
    pdf.setTextColor(0);
  }
}

function twoColAddressTable(
  pdf: jsPDF,
  y: number,
  perm: AddressData,
  corr: AddressData,
): number {
  const colW = CONTENT_W / 2;
  y = ensureSpace(pdf, y, 7);
  pdf.setFillColor(220, 220, 220);
  pdf.rect(MARGIN, y, colW, 7, "F");
  pdf.rect(MARGIN + colW, y, colW, 7, "F");
  pdf.setDrawColor(0);
  pdf.rect(MARGIN, y, colW, 7);
  pdf.rect(MARGIN + colW, y, colW, 7);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("PERMANENT ADDRESS", MARGIN + colW / 2, y + 4.8, { align: "center" });
  pdf.text("CORRESPONDENCE ADDRESS", MARGIN + colW + colW / 2, y + 4.8, {
    align: "center",
  });
  y += 7;

  // FIXED: Using a function accessor to safely fallback to 'village' if 'street' isn't available
  const rows: Array<{ label: string; getVal: (a: AddressData) => string | undefined }> = [
    { label: "VILLAGE/STREET:", getVal: (a) => a.village || a.street },
    { label: "CITY/TOWN:", getVal: (a) => a.city },
    { label: "DISTRICT:", getVal: (a) => a.district },
    { label: "STATE:", getVal: (a) => a.state },
    { label: "PIN CODE:", getVal: (a) => a.pincode },  
    { label: "POLICE STATION:", getVal: (a) => a.policeStation },
  ];
  const subLabelW = 32;
  const valueW = colW - subLabelW;

  for (const row of rows) {
    pdf.setFontSize(7);
    const permVal = dash(row.getVal(perm));
    const corrVal = dash(row.getVal(corr));
    const permLines = pdf.splitTextToSize(permVal, valueW - 3);
    const corrLines = pdf.splitTextToSize(corrVal, valueW - 3);
    const lines = Math.max(permLines.length, corrLines.length, 1);
    const h = Math.max(6, lines * 3.2 + 2.4);

    y = ensureSpace(pdf, y, h);

    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN, y, subLabelW, h, "F");
    pdf.rect(MARGIN, y, subLabelW, h);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN + subLabelW, y, valueW, h, "F");
    pdf.rect(MARGIN + subLabelW, y, valueW, h);
    pdf.setFont("helvetica", "normal");
    pdf.text(row.label, MARGIN + 1.5, y + 4);
    pdf.setFont("helvetica", "bold");
    pdf.text(permLines, MARGIN + subLabelW + 1.5, y + 4);

    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN + colW, y, subLabelW, h, "F");
    pdf.rect(MARGIN + colW, y, subLabelW, h);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN + colW + subLabelW, y, valueW, h, "F");
    pdf.rect(MARGIN + colW + subLabelW, y, valueW, h);
    pdf.setFont("helvetica", "normal");
    pdf.text(row.label, MARGIN + colW + 1.5, y + 4);
    pdf.setFont("helvetica", "bold");
    pdf.text(corrLines, MARGIN + colW + subLabelW + 1.5, y + 4);

    y += h;
  }

  return y;
}

function educationTable(
  pdf: jsPDF,
  y: number,
  education: SlipData["education"],
): number {
  const headers = ["LEVEL", "INSTITUTION", "BOARD/UNIVERSITY", "YEAR", "PERCENTAGE"];
  const widths = [26, 62, 52, 20, 30]; 

  y = ensureSpace(pdf, y, 9);
  let x = MARGIN;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  for (let i = 0; i < headers.length; i++) {
    pdf.setFillColor(220, 220, 220);
    pdf.rect(x, y, widths[i], 9, "F");
    pdf.rect(x, y, widths[i], 9);
    pdf.setTextColor(0);
    const lines = pdf.splitTextToSize(headers[i], widths[i] - 2);
    pdf.text(lines, x + widths[i] / 2, y + 4.5, { align: "center" });
    x += widths[i];
  }
  y += 9;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);

  for (const { label, row } of education) {
    const cells = [
      label,
      dash(row.college),
      dash(row.board),
      dash(row.year),
      row.percentage ? `${row.percentage}%` : "-",
    ];
    const wrapped = cells.map((c, i) => pdf.splitTextToSize(c, widths[i] - 2));
    const rowH = Math.max(8, Math.max(...wrapped.map((w) => w.length)) * 3.2 + 2.6);

    y = ensureSpace(pdf, y, rowH);
    x = MARGIN;
    for (let i = 0; i < headers.length; i++) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x, y, widths[i], rowH, "F");
      pdf.rect(x, y, widths[i], rowH);
      pdf.setTextColor(0);
      pdf.text(wrapped[i], x + widths[i] / 2, y + 4, { align: "center" });
      x += widths[i];
    }
    y += rowH;
  }

  return y;
}

function documentsSection(pdf: jsPDF, y: number, documents: DocRow[]): number {
  y = sectionHeader(pdf, y, "UPLOADED DOCUMENTS");

  if (documents.length === 0) {
    const rowH = 7;
    y = ensureSpace(pdf, y, rowH);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);
    pdf.rect(MARGIN, y, CONTENT_W, rowH);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7.6);
    pdf.text("No additional documents on record.", MARGIN + 2, y + 4.6);
    return y + rowH;
  }

  const statusW = 26;
  const labelW = CONTENT_W - statusW;

  for (const doc of documents) {
    const uploaded = Boolean(doc.url);
    const fileName = getFileName(doc.url) || "-";
    const displayValue = uploaded ? fileName : "Not uploaded";

    pdf.setFontSize(7.6);
    const valueLines = pdf.splitTextToSize(displayValue, labelW - LABEL_W - 4);
    const rowH = Math.max(6.5, valueLines.length * 3.4 + 2.6);
    y = ensureSpace(pdf, y, rowH);

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);

    // label
    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN, y, LABEL_W, rowH, "F");
    pdf.rect(MARGIN, y, LABEL_W, rowH);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0);
    pdf.text(doc.label.toUpperCase(), MARGIN + 1.5, y + 4);

    // filename / not-uploaded
    const valueW = labelW - LABEL_W;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN + LABEL_W, y, valueW, rowH, "F");
    pdf.rect(MARGIN + LABEL_W, y, valueW, rowH);
    pdf.setFont("helvetica", uploaded ? "bold" : "italic");
    pdf.setTextColor(uploaded ? 0 : 150);
    pdf.text(valueLines, MARGIN + LABEL_W + 1.5, y + 4);

    // status / link column
    const statusX = MARGIN + labelW;
    pdf.rect(statusX, y, statusW, rowH, "F");
    pdf.rect(statusX, y, statusW, rowH);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.6);
    if (uploaded && doc.url) {
      // Custom Blue color link
      pdf.setTextColor(0, 118, 182); 
      pdf.textWithLink("VIEW \u2192", statusX + statusW / 2, y + rowH / 2 + 1.2, {
        url: doc.url,
        align: "center",
      });
    } else {
      pdf.setTextColor(192, 57, 43);
      pdf.text("MISSING", statusX + statusW / 2, y + rowH / 2 + 1.2, {
        align: "center",
      });
    }
    pdf.setTextColor(0);

    y += rowH;
  }

  return y;
}

function paymentSection(pdf: jsPDF, y: number, payment: SlipData["payment"]): number {
  y = sectionHeader(pdf, y, "PAYMENT DETAILS");
  const rows: Array<[string, string]> = [
    ["AMOUNT :", `${payment.amount} ${payment.currency !== "-" ? payment.currency : ""}`.trim()],
    ["PAYMENT STATUS :", payment.status],
    ["PAYMENT MODE :", payment.paymentMode],
    ["BANK NAME :", payment.bankName],
    ["TRANSACTION ID :", payment.transactionId],
    ["ORDER ID :", payment.paymentOrderId],
    ["PAID / INITIATED ON :", payment.createdAt],
  ];
  for (const [label, value] of rows) {
    y = labelValueRow(pdf, y, label, value, { labelW: 55 });
  }
  return y;
}

function drawBarcode(pdf: jsPDF, x: number, y: number, w: number, h: number): void {
  const pattern = [2, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 1, 2, 1, 1, 3, 1];
  const unit = w / pattern.reduce((a, b) => a + b, 0) / 3;
  let cx = x;
  let black = true;
  const totalUnits = pattern.reduce((a, b) => a + b, 0) * 3;
  let unitsDrawn = 0;
  pdf.setFillColor(255, 255, 255);
  pdf.rect(x, y, w, h, "F");
  while (unitsDrawn < totalUnits && cx < x + w) {
    const barUnits = pattern[unitsDrawn % pattern.length];
    const barW = Math.min(barUnits * unit, x + w - cx);
    if (black) {
      pdf.setFillColor(0, 0, 0);
      pdf.rect(cx, y, barW, h, "F");
    }
    cx += barW;
    unitsDrawn += barUnits;
    black = !black;
  }
}

function drawPlaceholderLogo(pdf: jsPDF, cx: number, cy: number, r: number): void {
  pdf.setDrawColor(0, 118, 182);
  pdf.setLineWidth(0.6);
  pdf.circle(cx, cy, r);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6);
  pdf.setTextColor(0, 118, 182);
  pdf.text("MSSC", cx, cy + 1.5, { align: "center" });
  pdf.setTextColor(0);
}

/* ============================================================
 * MAIN EXPORT
 * ============================================================ */

export async function generateApplicationPDF(
  apiData: ApiData,
  opts: PDFOptions = {},
): Promise<jsPDF> {
  const data = shapeSlipData(apiData);
  const pdf = new jsPDF("p", "mm", "a4");

  // Load logo early to draw watermark
  const logoImg = await urlToDataURL(LOGO_URL);
  if (logoImg) {
      (pdf as any)._logoImg = logoImg;
      drawWatermark(pdf, logoImg); // Draw on page 1
  }

  let y = MARGIN;

  /* ---------- Header ---------- */
  const logoR = 10;
  if (logoImg) {
    try {
      pdf.addImage(logoImg.dataUrl, logoImg.format, MARGIN, y, logoR * 2, logoR * 2);
    } catch {
      drawPlaceholderLogo(pdf, MARGIN + logoR, y + logoR, logoR);
    }
  } else {
    drawPlaceholderLogo(pdf, MARGIN + logoR, y + logoR, logoR);
  }

  const titleX1 = MARGIN + 26;
  const titleX2 = PAGE_W - MARGIN - 46;
  const titleCx = (titleX1 + titleX2) / 2;
  pdf.setTextColor(0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(COMMISSION_NAME, titleCx, y + 6, { align: "center" });
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  pdf.text(COMMISSION_ADDRESS_LINE, titleCx, y + 11.5, { align: "center" });
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `APPLICATION REFERENCE: ${data.applicationReferenceNumber}`,
    titleCx,
    y + 16.5,
    { align: "center" },
  );

  const barcodeW = 42;
  const barcodeH = 9;
  const barcodeX = PAGE_W - MARGIN - barcodeW;
  drawBarcode(pdf, barcodeX, y, barcodeW, barcodeH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(barcodeX, y, barcodeW, barcodeH);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.text(data.registrationNumber, barcodeX + barcodeW / 2, y + barcodeH + 4, {
    align: "center",
  });

  y += 26;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.4);
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 2;

  // Status strip
  const statusRowH = 7;
  pdf.setFillColor(243, 231, 211); // theme.goldLight
  pdf.rect(MARGIN, y, CONTENT_W, statusRowH, "F");
  pdf.rect(MARGIN, y, CONTENT_W, statusRowH);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(138, 100, 22);
  pdf.text(`STATUS: ${data.status}`, MARGIN + 2, y + 4.8);
  pdf.text(
    `SUBMITTED: ${data.submissionDate}`,
    PAGE_W - MARGIN - 2,
    y + 4.8,
    { align: "right" },
  );
  pdf.setTextColor(0);
  y += statusRowH + 2;

  /* ---------- Personal details ---------- */
  y = sectionHeader(pdf, y, "PERSONAL DETAILS");

  const PHOTO_INSET = PHOTO_W + 2;
  const personalRows: Array<[string, string]> = [
    ["REGISTRATION NO. :", data.registrationNumber],
    ["APPLICATION REFERENCE NO. :", data.applicationReferenceNumber],
    ["NAME OF APPLICANT :", data.fullName],
    ["FATHER'S NAME :", data.fatherName],
    ["MOTHER'S NAME :", data.motherName],
    ["GENDER :", data.gender],
    ["DATE OF BIRTH :", data.dob],
    ["AGE :", data.age],
    ["MARITAL STATUS :", data.maritalStatus],
    ["MOBILE NO. :", `${data.mobile}  (${data.mobileVerified === "YES" ? "Verified" : "Unverified"})`],
    ["EMAIL ID :", `${data.email}  (${data.emailVerified === "YES" ? "Verified" : "Unverified"})`],
    ["NATIONALITY :", data.nationality],
    ["DISTRICT :", data.district],
    ["RESERVATION CATEGORY :", data.reservationCategory],
  ];

  const rowWWithPhoto = CONTENT_W - PHOTO_INSET;
  let personalBlockHeight = 0;
  for (const [label, value] of personalRows) {
    personalBlockHeight += measureRowHeight(pdf, label, value, LABEL_W, rowWWithPhoto);
  }
  const photoBoxH = Math.max(PHOTO_H, (personalBlockHeight - PHOTO_GAP * 2) / 3);

  const photoPanelX = PAGE_W - MARGIN - PHOTO_W;
  await drawPhotoPanel(pdf, photoPanelX, y, data, photoBoxH);

  for (const [label, value] of personalRows) {
    y = labelValueRow(pdf, y, label, value, { rightInset: PHOTO_INSET });
  }

  // Disability block
  y = twoPairRow(
    pdf,
    y,
    ["PWD STATUS :", data.pwdStatus, "40% OR MORE? :", data.is40Percent],
    { labelW1: 30, labelW2: 30 },
  );
  if (data.pwdStatus === "YES") {
    y = labelValueRow(pdf, y, "TYPE OF DISABILITY :", data.typeOfDisability, {
      labelW: 55,
    });
  }

  // Employment / identity block
  const WIDE_LABEL_W = 95;
  y = twoPairRow(
    pdf,
    y,
    [
      "STATE GOVT. EMPLOYEE? :",
      data.stateGovEmployee,
      "SPONSORED CANDIDATE? :",
      data.sponsoredExchange,
    ],
    { labelW1: 40, labelW2: 40 },
  );
  y = labelValueRow(pdf, y, "IDENTIFICATION MARKS :", data.identificationMarks, {
    labelW: WIDE_LABEL_W,
  });
  
  y = twoPairRow(
    pdf,
    y,
    ["CITIZEN OF INDIA? :", data.citizenOfIndia, "MANIPUR RESIDENT? :", data.manipurResident],
    { labelW1: 34, labelW2: 34 },
  );

  /* ---------- Address ---------- */
  y = sectionHeader(pdf, y, "ADDRESS DETAILS");
  y = twoColAddressTable(pdf, y, data.permanentAddress, data.correspondenceAddress);

  /* ---------- Education ---------- */
  y = sectionHeader(pdf, y, "EDUCATIONAL QUALIFICATIONS");
  y = educationTable(pdf, y, data.education);

  /* ---------- Teacher eligibility ---------- */
  y = sectionHeader(pdf, y, "TEACHER ELIGIBILITY");
  y = labelValueRow(pdf, y, "D.ED. / D.EL.ED. QUALIFICATION :", data.dedQual, {
    labelW: WIDE_LABEL_W,
  });
  y = labelValueRow(pdf, y, "D.ED. / D.EL.ED. INSTITUTION :", data.dedInstitution, {
    labelW: WIDE_LABEL_W,
  });
  y = twoPairRow(
    pdf,
    y,
    [
      "CROSS-DISABILITY TRAINING :",
      data.crossDisabilityPeriod,
      "RCI CRR NUMBER :",
      data.rciNumber,
    ],
    { labelW1: 42, labelW2: 30 },
  );

  /* ---------- Work experience ---------- */
  y = sectionHeader(pdf, y, "WORK EXPERIENCE");
  
  if (data.hasExperience && data.experiences.length > 0) {
    data.experiences.forEach((exp, idx) => {
      // Add a separator between array items
      if (idx > 0) {
        y = ensureSpace(pdf, y, 6);
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.15);
        pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 4;
      }
      y = labelValueRow(pdf, y, "DESIGNATION :", exp.designation, { labelW: WIDE_LABEL_W });
      y = labelValueRow(pdf, y, "SERVICE PERIOD :", exp.duration, { labelW: WIDE_LABEL_W });
      y = labelValueRow(pdf, y, "REASON FOR LEAVING :", exp.reason, { labelW: WIDE_LABEL_W });
    });
  } else {
    const rowH = 7;
    y = ensureSpace(pdf, y, rowH);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);
    pdf.rect(MARGIN, y, CONTENT_W, rowH);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7.6);
    pdf.text("No prior work experience declared.", MARGIN + 2, y + 4.6);
    y += rowH;
  }

  /* ---------- Documents ---------- */
  y = documentsSection(pdf, y, data.documents);

  /* ---------- Payment ---------- */
  y = paymentSection(pdf, y, data.payment);

  /* ---------- Declaration ---------- */
  y = sectionHeader(pdf, y, "DECLARATION");
  const declText =
    "I HEREBY DECLARE THAT ALL THE INFORMATION FURNISHED ABOVE IS TRUE, CORRECT AND COMPLETE TO THE BEST OF MY " +
    "KNOWLEDGE AND BELIEF. I UNDERSTAND THAT ANY FALSE OR MISLEADING INFORMATION MAY RESULT IN REJECTION OF MY " +
    "APPLICATION OR CANCELLATION OF MY CANDIDATURE AT ANY STAGE OF THE RECRUITMENT PROCESS.";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.4);
  pdf.setTextColor(0);
  const declLines = pdf.splitTextToSize(declText, CONTENT_W - 4);
  const declTextH = declLines.length * 3.4;
  const declBoxH = Math.max(20, declTextH + 12);
  y = ensureSpace(pdf, y, declBoxH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(MARGIN, y, CONTENT_W, declBoxH);
  pdf.text(declLines, MARGIN + 2, y + 5);
  pdf.setFont("helvetica", "bold");
  pdf.text(`GENERATED ON : ${data.generatedOn}`, MARGIN + 2, y + declTextH + 9);
  y += declBoxH;

  /* ---------- Footer note ---------- */
  y = ensureSpace(pdf, y, 8);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(MARGIN, y, CONTENT_W, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.text(
    "NOTE: PLEASE KEEP YOUR REGISTRATION NO., APPLICATION REFERENCE NO. AND MOBILE/EMAIL SAFE FOR FUTURE REFERENCE.",
    PAGE_W / 2,
    y + 5,
    { align: "center" },
  );

  const filename =
    opts.filename || `MSSC_Application_${data.applicationReferenceNumber}.pdf`;
  if (opts.save !== false) {
    pdf.save(filename);
  }
  return pdf;
}