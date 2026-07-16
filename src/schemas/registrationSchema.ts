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
  errorMap: () => ({ message: "Please select Yes or No" }),
});

/* ---------------------------------------------------------------
   Registration (Step 1) schema — every field is mandatory.
--------------------------------------------------------------- */
export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be under 100 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

    citizen: yesNo,
    dialect: yesNo,

    residencyConfirmed: z.literal(true, {
      errorMap: () => ({ message: "You must confirm residency eligibility" }),
    }),

    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),

    maritalStatus: z.enum(["single", "married"], {
      errorMap: () => ({ message: "Please select a marital status" }),
    }),

    reservationCategory: z.string().trim().min(1, "Please select a reservation category"),

    ph: yesNo,

    dobDay: z.string().min(1, "Day is required"),
    dobMonth: z.string().min(1, "Month is required"),
    dobYear: z.string().min(1, "Year is required"),

    mobile: z.string().min(1, "Mobile number is required"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    district: z.string().trim().min(1, "Please select a district"),

    captchaInput: z.string().trim().min(1, "Please enter the security code"),

    govEmployee: yesNo,
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
    } else if (!/^\d{10}$/.test(mobile)) {
      ctx.addIssue({
        path: ["mobile"],
        code: z.ZodIssueCode.custom,
        message: "Enter a valid 10-digit mobile number.",
      });
    }

    // ---- Date of birth rules ----
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

    const today = new Date();
    if (dob > today) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message: "Date of birth cannot be in the future",
      });
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > monthIndex || (today.getMonth() === monthIndex && today.getDate() >= day);
    if (!hasHadBirthdayThisYear) age -= 1;

    if (age < 18) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message: "Candidate must be at least 18 years old",
      });
    } else if (age > 60) {
      ctx.addIssue({
        path: ["dobYear"],
        code: z.ZodIssueCode.custom,
        message: "Please check the date of birth entered",
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
