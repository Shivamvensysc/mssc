
import { z } from "zod";

/* ---------------------------------------------------------------
   Shared static options (also used by the RegistrationForm UI so
   the dropdown values and the validation rules never drift apart).
--------------------------------------------------------------- */
export const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

const yesNo = z.enum(["Yes", "No"], {
  message: "Please select Yes or No",
});

/* ---------------------------------------------------------------
   Shared regexes — exported so the UI (RegistrationForm) can reuse
   the exact same pattern for live inline hints. Single source of
   truth, same idea as `days` / `months` / `years` above.
--------------------------------------------------------------- */

// Standard, widely-used email pattern (WHATWG HTML5-spec style).
// Rejects things like "a@b", "a@b..com", "a@.com", "@b.com", etc.
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Standard 10-digit Indian mobile number — must start with 6, 7, 8, or 9.
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

// Cognito's default password policy: min 8 chars, at least one uppercase,
// one lowercase, one number, and one special character.
// NOTE: if your User Pool's actual password policy differs, update this
// regex (and the helper text shown under "New Password") to match it.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/* ---------------------------------------------------------------
   Age-limit rules — sourced from the MSSC Special Primary Teacher
   advertisement, clause 3(iv) "Age Limit":

     "Shall not be less than 18 years and not more than 38 years as
      on the date of notification of advertisement for the
      recruitment. Upper age limit is relaxable for Government
      servants ... to the extent of the period of continuous
      services put in the post/service and by 5 years for SC/ST
      candidates and by 3 years for OBC candidates and a government
      servant who belongs to SC/ST will get the facility admissible
      to a government servant in addition to the relaxation
      admissible to SC/ST candidates."

   The advertisement is dated 20/07/2026 — that is the fixed
   reference date age must be computed against, NOT "today"/the
   date the candidate happens to be filling the form.
--------------------------------------------------------------- */

// Fixed reference date printed on the advertisement ("Dated: 20/07/2026").
// Age is computed AS ON this date, not the current date.
export const NOTIFICATION_DATE = new Date(2026, 6, 20); // months are 0-indexed → 6 = July

export const MIN_AGE = 18; // not relaxable per the advertisement
const BASE_MAX_AGE = 38; // before any relaxation

const SC_ST_AGE_RELAXATION = 5;
const OBC_AGE_RELAXATION = 3;

/**
 * Category-based relaxation (added to the base 38-year upper limit).
 * Matches on the category label returned by the categories API
 * (per the advertisement's category table: UR, ST, SC, OBC(M), OBC(MP)).
 * NOTE: adjust the prefixes below if the live API ever returns
 * differently-worded labels.
 */
const getCategoryAgeRelaxation = (reservationCategory: string): number => {
  const category = (reservationCategory || "").trim().toUpperCase();
  if (category.startsWith("SC") || category.startsWith("ST")) return SC_ST_AGE_RELAXATION;
  if (category.startsWith("OBC")) return OBC_AGE_RELAXATION;
  return 0;
};

/**
 * Government-servant relaxation: "to the extent of the period of
 * continuous services put in the post/service" — i.e. equal to the
 * number of years of experience the candidate has declared. This
 * stacks on top of any SC/ST/OBC relaxation above.
 */
const getGovEmployeeAgeRelaxation = (
  govEmployee: string,
  experience: string | undefined,
  reservationCategory: string
): number => {
  if (govEmployee !== "Yes") return 0;

  const category = (reservationCategory || "").trim().toUpperCase();
  if (category.startsWith("OBC")) return 0; // OBC gets no experience-based relaxation

  const years = parseInt(experience ?? "", 10);
  return Number.isFinite(years) && years > 0 ? years : 0;
};

/**
 * Computes the effective upper age limit (in years) for a given
 * applicant, i.e. 38 + applicable relaxations.
 */
export const getMaxAgeLimit = (data: {
  reservationCategory: string;
  govEmployee: string;
  experience?: string;
}): number => {
  return (
    BASE_MAX_AGE +
    getCategoryAgeRelaxation(data.reservationCategory) +
    getGovEmployeeAgeRelaxation(data.govEmployee, data.experience, data.reservationCategory)
  );
};

/**
 * Calculates a candidate's age in completed years as on a given
 * reference date (defaults to NOTIFICATION_DATE).
 */
export const calculateAgeAsOfNotification = (
  dobDay: string,
  dobMonth: string,
  dobYear: string,
  referenceDate: Date = NOTIFICATION_DATE
): number | null => {
  const day = parseInt(dobDay, 10);
  const monthIndex = months.indexOf(dobMonth);
  const year = parseInt(dobYear, 10);

  if (monthIndex === -1 || !day || !year) return null;

  const dob = new Date(year, monthIndex, day);
  const isRealCalendarDate =
    dob.getFullYear() === year && dob.getMonth() === monthIndex && dob.getDate() === day;
  if (!isRealCalendarDate) return null;

  let age = referenceDate.getFullYear() - dob.getFullYear();
  const hasHadBirthdayByReference =
    referenceDate.getMonth() > monthIndex ||
    (referenceDate.getMonth() === monthIndex && referenceDate.getDate() >= day);
  if (!hasHadBirthdayByReference) age -= 1;

  return age;
};

/* ---------------------------------------------------------------
   Registration (Step 1) schema — every field is mandatory.
--------------------------------------------------------------- */
export const registrationSchema = z
  .object({
    postName: z.string().trim().min(1, "Please select a post"),

    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be under 50 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

    citizen: yesNo,
    dialect: z.string().refine((val) => val === 'Yes', {
      message: "You are not eligible for this post.",
    }),

    residencyConfirmed: z.literal(true, {
      message: "You must confirm residency eligibility",
    }),

    gender: z.enum(["male", "female"], {
      message: "Please select a gender",
    }),

    maritalStatus: z.enum(["single", "married","divorced"], {
      message: "Please select a marital status",
    }),

    reservationCategory: z.string().trim().min(1, "Please select a reservation category"),

    ph: yesNo,

    dobDay: z.string().min(1, "Day is required"),
    dobMonth: z.string().min(1, "Month is required"),
    dobYear: z.string().min(1, "Year is required"),

    mobile: z.string().trim().min(1, "Mobile number is required"),



    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .regex(EMAIL_REGEX, "Enter a valid email address"),



    district: z.string().trim().min(1, "Please select a district"),

    captchaInput: z.string().trim().min(1, "Please enter the security code"),

    govEmployee: yesNo,
   department: z.string().optional(),
    experience: z.string().optional(),
    disabilityType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // ---- Mobile number rules ----
    const mobile = data.mobile;
    if (mobile.startsWith("0") || mobile.startsWith("+91") || mobile.startsWith("91")) {
      ctx.addIssue({
        path: ["mobile"],
        code: z.ZodIssueCode.custom,
        message: "Do not prefix '0' or '+91' before the mobile no.",
      });
    } else if (!MOBILE_REGEX.test(mobile)) {
      ctx.addIssue({
        path: ["mobile"],
        code: z.ZodIssueCode.custom,
        message: "Enter a valid 10-digit mobile number starting with 6-9.",
      });
    }

    // ---- Date of birth / Age rules ----
    // Per advertisement clause 3(iv): age must be between 18 and 38
    // (plus applicable relaxation) AS ON the date of notification of
    // the advertisement (20/07/2026) — not the current date.
    const day = parseInt(data.dobDay, 10);
    const monthIndex = months.indexOf(data.dobMonth);
    const year = parseInt(data.dobYear, 10);

    if (monthIndex === -1 || !day || !year) {
      ctx.addIssue({
        path: ["dobDay"],
        code: z.ZodIssueCode.custom,
        message: "Please select a valid date of birth",
      });
      return;
    }

    const dob = new Date(year, monthIndex, day);
    const isRealCalendarDate =
      dob.getFullYear() === year && dob.getMonth() === monthIndex && dob.getDate() === day;

    if (!isRealCalendarDate) {
      ctx.addIssue({
        path: ["dobDay"],
        code: z.ZodIssueCode.custom,
        message: "Please select a valid date of birth",
      });
      return;
    }

    if (dob > NOTIFICATION_DATE) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message: "Date of birth cannot be after the date of notification (20-07-2026)",
      });
      return;
    }

    const age = calculateAgeAsOfNotification(data.dobDay, data.dobMonth, data.dobYear);
    const maxAgeLimit = getMaxAgeLimit(data);

    if (age === null) {
      ctx.addIssue({
        path: ["dobDay"],
        code: z.ZodIssueCode.custom,
        message: "Please select a valid date of birth",
      });
      return;
    }

    if (age < MIN_AGE) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message: `Candidate must be at least ${MIN_AGE} years old as on the date of notification (20-07-2026)`,
      });
    } else if (age > maxAgeLimit) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message:
          maxAgeLimit > BASE_MAX_AGE
            ? `Age cannot exceed ${maxAgeLimit} years (including applicable relaxation) as on the date of notification (20-07-2026)`
            : `Age cannot exceed ${BASE_MAX_AGE} years as on the date of notification (20-07-2026)`,
      });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/* ---------------------------------------------------------------
   OTP verification schema (used after Cognito sends the code).
--------------------------------------------------------------- */
export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "Verification code is required")
    .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

/* ---------------------------------------------------------------
   Set-password schema — used right after OTP/email verification,
   when the candidate sets the real password they'll log in with.
--------------------------------------------------------------- */
export const setPasswordSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Verification code is required")
      .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must include an uppercase letter, a lowercase letter, a number, and a special character"
      ),
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        path: ["confirmNewPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

/* ---------------------------------------------------------------
   Helper: turns a ZodError into a simple { field: message } map
   so components can show one inline message per field.
--------------------------------------------------------------- */
export const flattenZodErrors = <T extends Record<string, unknown>>(
  error: z.ZodError<T>
): Partial<Record<keyof T, string>> => {
  const fieldErrors: Partial<Record<keyof T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
};