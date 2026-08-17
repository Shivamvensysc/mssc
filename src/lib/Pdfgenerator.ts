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

// // Explicitly requested logo format
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

//   permanentResCert: "Permanent Residence Certificate",
//   domicileCert: "Domicile Certificate",
//   nocCert: "No Objection Certificate",
//   reservationCert: "Reservation Certificate",
//   pwdCert: "PWD Certificate",

  
//   // --- NEW KEYS ADDED BELOW BASED ON API RESPONSE ---
//   "10thmarksheet": "10th Marksheet",
//   "12thmarksheet": "12th Marksheet",
//   graduationMarksheet: "Graduation Marksheet",
//   tet1Cert: "TET 1 Certificate",
//   dedCert: "D.Ed Certificate",
//   experienceCert: "Experience Certificate ", // Catches the base key, dynamic _0, _1 are handled below it
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
//   manipurResident: string;
//   permanentAddress: AddressData;
//   correspondenceAddress: AddressData;
//   sameAsPermanent: boolean;
//   education: Array<{ label: string; row: EducationRow }>;
//   dedQual: string;
//   dedInstitution: string;
//   crossDisabilityPeriod: string;
//   rciNumber: string;

 
  
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
    
    
//   ];


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

//   // FIXED: Using a function accessor to safely fallback to 'village' if 'street' isn't available
//   const rows: Array<{ label: string; getVal: (a: AddressData) => string | undefined }> = [
//     { label: "VILLAGE/STREET:", getVal: (a) => a.village || a.street },
//     { label: "CITY/TOWN:", getVal: (a) => a.city },
//     { label: "DISTRICT:", getVal: (a) => a.district },
//     { label: "STATE:", getVal: (a) => a.state },
//     { label: "PIN CODE:", getVal: (a) => a.pincode },  
//     { label: "POLICE STATION:", getVal: (a) => a.policeStation },
//   ];
//   const subLabelW = 32;
//   const valueW = colW - subLabelW;

//   for (const row of rows) {
//     pdf.setFontSize(7);
//     const permVal = dash(row.getVal(perm));
//     const corrVal = dash(row.getVal(corr));
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
//     pdf.text(row.label, MARGIN + 1.5, y + 4);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(permLines, MARGIN + subLabelW + 1.5, y + 4);

//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN + colW, y, subLabelW, h, "F");
//     pdf.rect(MARGIN + colW, y, subLabelW, h);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h, "F");
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(row.label, MARGIN + colW + 1.5, y + 4);
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
//   const headers = ["LEVEL", "INSTITUTION", "BOARD/UNIVERSITY", "YEAR", "PERCENTAGE/CGPA"];
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

//   // 1. Define two columns: Status on the right, Label takes the rest
//   const statusColW = 45; 
//   const labelColW = CONTENT_W - statusColW;

//   for (const doc of documents) {
//     const uploaded = Boolean(doc.url);

//     pdf.setFontSize(7.6);
    
//     // We only need to wrap the label text now
//     const labelText = doc.label.toUpperCase();
//     const labelLines = pdf.splitTextToSize(labelText, labelColW - 4);
    
//     // Calculate row height based on label lines
//     const rowH = Math.max(6.5, labelLines.length * 3.4 + 2.6);
//     y = ensureSpace(pdf, y, rowH);

//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);

//     // --- COLUMN 1: LABEL (Grey Background) ---
//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN, y, labelColW, rowH, "F");
//     pdf.rect(MARGIN, y, labelColW, rowH);
//     pdf.setFont("helvetica", "normal");
//     pdf.setTextColor(0);
//     pdf.text(labelLines, MARGIN + 1.5, y + 4);

//     // --- COLUMN 2: STATUS (White Background) ---
//     const statusX = MARGIN + labelColW;
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(statusX, y, statusColW, rowH, "F");
//     pdf.rect(statusX, y, statusColW, rowH);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(7);
    
//     if (uploaded) {
//       pdf.setTextColor(39, 174, 96); // Green color
//       pdf.text("UPLOADED", statusX + statusColW / 2, y + rowH / 2 + 1.2, {
//         align: "center",
//       });
//     } else {
//       pdf.setTextColor(192, 57, 43); // Red color
//       pdf.text("NOT UPLOADED", statusX + statusColW / 2, y + rowH / 2 + 1.2, {
//         align: "center",
//       });
//     }
    
//     // Reset text color for the next loop
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
  post?: string;
  department?: string;
  experience?: string;
  citizenOfIndia?: boolean;
  disabilityType?: string;
  type_of_disability?: string;
  gov_experience_y?: string;
  depart_of_service?: string;
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
    examCity?: string;
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
    sponsorNo?: string;
    isScribe?: string;
    identificationMarks?: string;
  };
  address?: { 
    permanent?: AddressData; 
    correspond?: AddressData; // Added to match API
    correspondence?: AddressData; 
    sameAsPermanent?: boolean;
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
    tet1Passed?: boolean;
    tenPlusTwoTrack?: string;
    trainingNotAvailable?: boolean;
  };
  isScribe?: string;
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
  nocCert: "No Objection Certificate",
  reservationCert: "Reservation Certificate",
  pwdCert: "PWD Certificate",
  "10thmarksheet": "10th Marksheet",
  "12thmarksheet": "12th Marksheet",
  hslcMarksheet: "HSLC Marksheet",
  hslcProvCert: "HSLC Prov Certificate",
  tenPlusTwoCert: "10+2 Certificate",
  graduationMarksheet: "Graduation Marksheet",
  tet1Cert: "TET 1 Certificate",
  dedCert: "D.Ed Certificate",
  experienceCert: "Experience Certificate",
  experienceCert_0: "Experience Certificate 1",
  experienceCert_1: "Experience Certificate 2",
  experienceCert_2: "Experience Certificate 3"
};

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

const yn = (v: string | boolean | undefined | null): string => {
  if (v === undefined || v === null || v === "") return "-";
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
  post: string;
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
  citizenOfIndia: string;
  motherTongue: string;
  district: string;
  examCity: string;
  reservationCategory: string;
  pwdStatus: string;
  typeOfDisability: string;
  is40Percent: string;
  isScribe: string;
  stateGovEmployee: string;
  govExperience: string;
  departmentOfService: string;
  sponsoredExchange: string;
  sponsorNo: string;
  identificationMarks: string;
  identityType: string;
  identityNumber: string;
  manipurResident: string;
  permanentAddress: AddressData;
  correspondenceAddress: AddressData;
  sameAsPermanent: boolean;
  education: Array<{ label: string; row: EducationRow }>;
  dedQual: string;
  dedInstitution: string;
  crossDisabilityPeriod: string;
  rciNumber: string;
  tet1Passed: string;
  tenPlusTwoTrack: string;
  trainingNotAvailable: string;
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

  const sameAsPermanent = step1.address?.sameAsPermanent ?? false;

  const education = EDUCATION_LEVELS.map(({ key, label }) => ({
    label,
    row: step1.education?.[key] || {},
  }));

  // Dynamically grab all uploaded document keys excluding the photo panel keys
  // const docKeys = Object.keys(step2).filter(
  //   (k) => !PHOTO_PANEL_KEYS.has(k) && step2[k] // Ensure URL is truthy
  // );

  const docKeys = Object.keys(step2).filter(
    (k) => !PHOTO_PANEL_KEYS.has(k) && k !== "applicationId" && step2[k] // Ensure URL is truthy and ignore applicationId
  );

  const documents: DocRow[] = docKeys.map((key) => ({
    key,
    label: DOC_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    url: step2[key] as string,
  }));

  return {
    registrationNumber: dash(candidate.registrationNumber),
    applicationReferenceNumber: dash(apiData?.applicationReferenceNumber),
    submissionDate: formatDate(apiData?.submissionDate, true),
    status: titeCaseStatus(apiData?.status, apiData?.isSubmitted),
    post: dash(step0.post),
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
    citizenOfIndia: step0.citizenOfIndia !== undefined ? yn(step0.citizenOfIndia) : "-",
    motherTongue: dash(step0.motherTongue),
    district: dash(personalInfo.district || step0.selectDistrict),
    examCity: dash(personalInfo.examCity),
    reservationCategory: dash(personalInfo.reservationCategory || step0.reservationCategory),
    pwdStatus: yn(personalInfo.pwdStatus ? personalInfo.pwdStatus === "yes" : step0.isPwd),
    typeOfDisability: dash(personalInfo.typeOfDisability || step0.disabilityType || step0.type_of_disability),
    is40Percent: yn(personalInfo.is40Percent === "yes"),
    isScribe: dash(personalInfo.isScribe || step1.isScribe).toUpperCase(),
    stateGovEmployee: yn(
      personalInfo.stateGovEmployee
        ? personalInfo.stateGovEmployee === "yes"
        : step0.govEmployee,
    ),
    govExperience: dash(step0.gov_experience_y || step0.experience),
    departmentOfService: dash(step0.depart_of_service || step0.department),
    sponsoredExchange: yn(personalInfo.sponsoredExchange === "yes"),
    sponsorNo: dash(personalInfo.sponsorNo),
    identificationMarks: dash(
      personalInfo.identificationMarks ||
        [step0.identificationMark1, step0.identificationMark2]
          .filter(Boolean)
          .join(", "),
    ),
    identityType: dash(step0.identityType).toUpperCase(),
    identityNumber: dash(step0.identityNumber),
    manipurResident: yn(step0.manipurResident),
    permanentAddress,
    correspondenceAddress,
    sameAsPermanent,
    education,
    dedQual: dash(step1.teachereligibilit?.dedQual),
    dedInstitution: dash(step1.teachereligibilit?.dedInstitution),
    crossDisabilityPeriod: step1.teachereligibilit?.crossDisabilityPeriod
      ? `${step1.teachereligibilit.crossDisabilityPeriod} MONTHS`
      : "-",
    rciNumber: dash(step1.teachereligibilit?.rciNumber),
    tet1Passed: step1.teachereligibilit?.tet1Passed !== undefined ? yn(step1.teachereligibilit.tet1Passed) : "-",
    tenPlusTwoTrack: dash(step1.teachereligibilit?.tenPlusTwoTrack),
    trainingNotAvailable: step1.teachereligibilit?.trainingNotAvailable !== undefined ? yn(step1.teachereligibilit.trainingNotAvailable) : "-",
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
    
    let gStateObj: any;
    if (typeof (pdf as any).GState === "function") {
        gStateObj = new (pdf as any).GState({ opacity: 0.08 });
    } else if (typeof (window as any)?.jsPDF?.GState === "function") {
        gStateObj = new (window as any).jsPDF.GState({ opacity: 0.08 });
    }
    
    if (gStateObj) {
        pdf.setGState(gStateObj);
    }
    
    pdf.addImage(logoImg.dataUrl, logoImg.format, x, y, wmW, wmH);
    
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
    // Fail silently on GState missing
  }
}

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN - FOOTER_SPACE) {
    pdf.addPage();
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
  const rows = [
    { label: "VILLAGE/STREET:", getVal: (a: AddressData) => a.village || a.street },
    { label: "CITY/TOWN:", getVal: (a: AddressData) => a.city },
    { label: "DISTRICT:", getVal: (a: AddressData) => a.district },
    { label: "STATE:", getVal: (a: AddressData) => a.state },
    { label: "PIN CODE:", getVal: (a: AddressData) => a.pincode },  
    { label: "POLICE STATION:", getVal: (a: AddressData) => a.policeStation },
  ];

  // Filter out completely empty rows
  const activeRows = rows.filter(r => dash(r.getVal(perm)) !== "-" || dash(r.getVal(corr)) !== "-");
  
  if (activeRows.length === 0) return y;

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

  const subLabelW = 32;
  const valueW = colW - subLabelW;

  for (const row of activeRows) {
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
  const activeEducation = education.filter(e => 
    (e.row.college && e.row.college !== "-") || 
    (e.row.board && e.row.board !== "-") || 
    (e.row.year && e.row.year !== "-") || 
    (e.row.percentage && e.row.percentage !== "-")
  );

  if (activeEducation.length === 0) return y;

  const headers = ["LEVEL", "INSTITUTION", "BOARD/UNIVERSITY", "YEAR", "PERCENTAGE/CGPA"];
  const widths = [26, 62, 52, 20, 30]; 

  y = sectionHeader(pdf, y, "EDUCATIONAL QUALIFICATIONS");

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

  for (const { label, row } of activeEducation) {
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
  // Only process documents that have an uploaded URL
  const uploadedDocs = documents.filter(doc => doc.url);
  
  if (uploadedDocs.length === 0) return y;

  y = sectionHeader(pdf, y, "UPLOADED DOCUMENTS");

  const statusColW = 45; 
  const labelColW = CONTENT_W - statusColW;

  for (const doc of uploadedDocs) {
    pdf.setFontSize(7.6);
    
    const labelText = doc.label.toUpperCase();
    const labelLines = pdf.splitTextToSize(labelText, labelColW - 4);
    const rowH = Math.max(6.5, labelLines.length * 3.4 + 2.6);
    
    y = ensureSpace(pdf, y, rowH);

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);

    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN, y, labelColW, rowH, "F");
    pdf.rect(MARGIN, y, labelColW, rowH);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0);
    pdf.text(labelLines, MARGIN + 1.5, y + 4);

    const statusX = MARGIN + labelColW;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(statusX, y, statusColW, rowH, "F");
    pdf.rect(statusX, y, statusColW, rowH);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    
    pdf.setTextColor(39, 174, 96); 
    pdf.text("UPLOADED", statusX + statusColW / 2, y + rowH / 2 + 1.2, {
      align: "center",
    });
    
    pdf.setTextColor(0); 

    y += rowH;
  }

  return y;
}

function paymentSection(pdf: jsPDF, y: number, payment: SlipData["payment"]): number {
  const paymentRows = [
    ["AMOUNT :", `${payment.amount} ${payment.currency !== "-" ? payment.currency : ""}`.trim()],
    ["PAYMENT STATUS :", payment.status],
    ["PAYMENT MODE :", payment.paymentMode],
    ["BANK NAME :", payment.bankName],
    ["TRANSACTION ID :", payment.transactionId],
    ["ORDER ID :", payment.paymentOrderId],
    ["PAID / INITIATED ON :", payment.createdAt],
  ].filter(r => r[1] && r[1] !== "-" && !r[1].startsWith("-") && r[1] !== "N/A" && r[1] !== "");

  if (paymentRows.length === 0) return y;

  y = sectionHeader(pdf, y, "PAYMENT DETAILS");
  for (const [label, value] of paymentRows) {
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

  const logoImg = await urlToDataURL(LOGO_URL);
  if (logoImg) {
      (pdf as any)._logoImg = logoImg;
      drawWatermark(pdf, logoImg); 
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

  const statusRowH = 7;
  pdf.setFillColor(243, 231, 211);
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
  const rawPersonalRows: Array<[string, string]> = [
    ["REGISTRATION NO. :", data.registrationNumber],
    ["APPLICATION REFERENCE NO. :", data.applicationReferenceNumber],
    ["POST APPLIED FOR :", data.post],
    ["NAME OF APPLICANT :", data.fullName],
    ["FATHER'S NAME :", data.fatherName],
    ["MOTHER'S NAME :", data.motherName],
    ["GENDER :", data.gender],
    ["DATE OF BIRTH :", data.dob],
    ["MARITAL STATUS :", data.maritalStatus],
    ["MOBILE NO. :", data.mobile !== "-" ? `${data.mobile}  (${data.mobileVerified === "YES" ? "Verified" : "Unverified"})` : "-"],

    ["EMAIL ID :", data.email !== "-" ? `${data.email}  (${data.emailVerified === "YES" ? "Verified" : "Unverified"})` : "-"],
  
    ["DISTRICT :", data.district],
    ["EXAM CITY :", data.examCity],
    ["RESERVATION CATEGORY :", data.reservationCategory],
    // ["MANIPUR RESIDENT? :", data.manipurResident],
    
    
  ];

  // Filter out any missing data
  const personalRows = rawPersonalRows.filter(r => r[1] && r[1] !== "-" && r[1] !== " (Unverified)" && r[1] !== "  (Unverified)");

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
  const pwdArr = [];
  if (data.pwdStatus !== "-") pwdArr.push(["PWD STATUS :", data.pwdStatus]);
  if (data.is40Percent !== "-") pwdArr.push(["40% OR MORE? :", data.is40Percent]);
  
  if (pwdArr.length === 2) {
      y = twoPairRow(pdf, y, [pwdArr[0][0], pwdArr[0][1], pwdArr[1][0], pwdArr[1][1]], { labelW1: 30, labelW2: 30 });
  } else if (pwdArr.length === 1) {
      y = labelValueRow(pdf, y, pwdArr[0][0], pwdArr[0][1], { labelW: 30 });
  }

  if (data.pwdStatus === "YES" && data.typeOfDisability !== "-") {
    y = labelValueRow(pdf, y, "TYPE OF DISABILITY :", data.typeOfDisability, { labelW: 55 });
  }
  if (data.isScribe && data.isScribe !== "-") {
    y = labelValueRow(pdf, y, "SCRIBE REQUIRED? :", data.isScribe, { labelW: 55 });
  }

  // Employment / identity block
  const empArr = [];
  if (data.stateGovEmployee !== "-") empArr.push(["STATE GOVT. EMPLOYEE? :", data.stateGovEmployee]);
  if (data.govExperience !== "-") empArr.push(["EXPERIENCE (YRS) :", data.govExperience]);
  if (data.departmentOfService !== "-") empArr.push(["DEPARTMENT :", data.departmentOfService]);
  if (data.sponsoredExchange !== "-") empArr.push(["SPONSORED CANDIDATE? :", data.sponsoredExchange]);
  if (data.sponsorNo !== "-") empArr.push(["SPONSOR NO. :", data.sponsorNo]);

  for (let i = 0; i < empArr.length; i += 2) {
    if (i + 1 < empArr.length) {
      y = twoPairRow(pdf, y, [empArr[i][0], empArr[i][1], empArr[i+1][0], empArr[i+1][1]], { labelW1: 45, labelW2: 45 });
    } else {
      y = labelValueRow(pdf, y, empArr[i][0], empArr[i][1], { labelW: 45 });
    }
  }

  if (data.identificationMarks !== "-") {
    y = labelValueRow(pdf, y, "IDENTIFICATION MARKS :", data.identificationMarks, { labelW: 65 });
  }

  /* ---------- Address ---------- */
  const addressCheck = [
    data.permanentAddress.village, data.permanentAddress.street, data.permanentAddress.city, 
    data.permanentAddress.district, data.permanentAddress.state, data.permanentAddress.pincode, data.permanentAddress.policeStation,
    data.correspondenceAddress.village, data.correspondenceAddress.street, data.correspondenceAddress.city, 
    data.correspondenceAddress.district, data.correspondenceAddress.state, data.correspondenceAddress.pincode, data.correspondenceAddress.policeStation
  ].filter(v => dash(v) !== "-");
  
  if (addressCheck.length > 0) {
    y = sectionHeader(pdf, y, "ADDRESS DETAILS");
    y = twoColAddressTable(pdf, y, data.permanentAddress, data.correspondenceAddress);
  }

  /* ---------- Education ---------- */
  y = educationTable(pdf, y, data.education);

  /* ---------- Teacher eligibility ---------- */
  const tetArr = [];
  if (data.dedQual !== "-") tetArr.push(["D.ED. / D.EL.ED. QUALIFICATION :", data.dedQual]);
  if (data.dedInstitution !== "-") tetArr.push(["D.ED. / D.EL.ED. INSTITUTION :", data.dedInstitution]);
  if (data.tet1Passed !== "-") tetArr.push(["TET 1 PASSED? :", data.tet1Passed]);
  if (data.tenPlusTwoTrack !== "-") tetArr.push(["10+2 TRACK :", data.tenPlusTwoTrack]);
  if (data.trainingNotAvailable !== "-") tetArr.push(["TRAINING NOT AVAILABLE? :", data.trainingNotAvailable]);

  if (tetArr.length > 0) {
    y = sectionHeader(pdf, y, "TEACHER ELIGIBILITY");
    for (const [l, v] of tetArr) {
      y = labelValueRow(pdf, y, l, v, { labelW: 75 });
    }
  }

  const cdArr = [];
  if (data.crossDisabilityPeriod !== "-") cdArr.push(["CROSS-DISABILITY TRAINING :", data.crossDisabilityPeriod]);
  if (data.rciNumber !== "-") cdArr.push(["RCI CRR NUMBER :", data.rciNumber]);
  
  if (cdArr.length === 2) {
    y = twoPairRow(pdf, y, [cdArr[0][0], cdArr[0][1], cdArr[1][0], cdArr[1][1]], { labelW1: 50, labelW2: 35 });
  } else if (cdArr.length === 1) {
    y = labelValueRow(pdf, y, cdArr[0][0], cdArr[0][1], { labelW: 50 });
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
    opts.filename || `MSSC_Application_${data.applicationReferenceNumber || data.registrationNumber}.pdf`;
  if (opts.save !== false) {
    pdf.save(filename);
  }
  return pdf;
}