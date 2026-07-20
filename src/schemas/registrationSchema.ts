// import { z } from "zod";

// /* ---------------------------------------------------------------
//    Shared static options (also used by the RegistrationForm UI so
//    the dropdown values and the validation rules never drift apart).
// --------------------------------------------------------------- */
// export const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

// export const months = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// const currentYear = new Date().getFullYear();
// export const years = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

// const yesNo = z.enum(["Yes", "No"], {
//   errorMap: () => ({ message: "Please select Yes or No" }),
// });

// /* ---------------------------------------------------------------
//    Shared regexes — exported so the UI (RegistrationForm) can reuse
//    the exact same pattern for live inline hints. Single source of
//    truth, same idea as `days` / `months` / `years` above.
// --------------------------------------------------------------- */

// // Standard, widely-used email pattern (WHATWG HTML5-spec style).
// // Rejects things like "a@b", "a@b..com", "a@.com", "@b.com", etc.
// export const EMAIL_REGEX =
//   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// // Standard 10-digit Indian mobile number — must start with 6, 7, 8, or 9.
// export const MOBILE_REGEX = /^[6-9]\d{9}$/;

// // Cognito's default password policy: min 8 chars, at least one uppercase,
// // one lowercase, one number, and one special character.
// // NOTE: if your User Pool's actual password policy differs, update this
// // regex (and the helper text shown under "New Password") to match it.
// export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// /* ---------------------------------------------------------------
//    Registration (Step 1) schema — every field is mandatory.
// --------------------------------------------------------------- */
// export const registrationSchema = z
//   .object({
//     name: z
//       .string()
//       .trim()
//       .min(1, "Name is required")
//       .min(3, "Name must be at least 3 characters")
//       .max(50, "Name must be under 50 characters")
//       .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

//     citizen: yesNo,
//     dialect: yesNo,

//     residencyConfirmed: z.literal(true, {
//       errorMap: () => ({ message: "You must confirm residency eligibility" }),
//     }),

//     gender: z.enum(["male", "female"], {
//       errorMap: () => ({ message: "Please select a gender" }),
//     }),

//     maritalStatus: z.enum(["single", "married"], {
//       errorMap: () => ({ message: "Please select a marital status" }),
//     }),

//     reservationCategory: z.string().trim().min(1, "Please select a reservation category"),

//     ph: yesNo,

//     dobDay: z.string().min(1, "Day is required"),
//     dobMonth: z.string().min(1, "Month is required"),
//     dobYear: z.string().min(1, "Year is required"),

//     mobile: z.string().trim().min(1, "Mobile number is required"),
//     confirmMobile: z.string().trim().min(1, "Please confirm your mobile number"),

//     email: z
//       .string()
//       .trim()
//       .min(1, "Email is required")
//       .regex(EMAIL_REGEX, "Enter a valid email address"),
//     confirmEmail: z.string().trim().min(1, "Please confirm your email address"),

//     district: z.string().trim().min(1, "Please select a district"),

//     captchaInput: z.string().trim().min(1, "Please enter the security code"),

//     govEmployee: yesNo,
//   })
//   .superRefine((data, ctx) => {
//     // ---- Mobile number rules ----
//     const mobile = data.mobile;
//     if (mobile.startsWith("0") || mobile.startsWith("+91") || mobile.startsWith("91")) {
//       ctx.addIssue({
//         path: ["mobile"],
//         code: z.ZodIssueCode.custom,
//         message: "Do not prefix '0' or '+91' before the mobile no.",
//       });
//     } else if (!MOBILE_REGEX.test(mobile)) {
//       ctx.addIssue({
//         path: ["mobile"],
//         code: z.ZodIssueCode.custom,
//         message: "Enter a valid 10-digit mobile number starting with 6-9.",
//       });
//     }

//     // ---- Confirm mobile must match exactly ----
//     if (data.confirmMobile && data.mobile.trim() !== data.confirmMobile.trim()) {
//       ctx.addIssue({
//         path: ["confirmMobile"],
//         code: z.ZodIssueCode.custom,
//         message: "Mobile numbers do not match.",
//       });
//     }

//     // ---- Confirm email must match (case-insensitive) ----
//     if (
//       data.confirmEmail &&
//       data.email.trim().toLowerCase() !== data.confirmEmail.trim().toLowerCase()
//     ) {
//       ctx.addIssue({
//         path: ["confirmEmail"],
//         code: z.ZodIssueCode.custom,
//         message: "Email addresses do not match.",
//       });
//     }

//     // ---- Date of birth rules ----
//     const day = parseInt(data.dobDay, 10);
//     const monthIndex = months.indexOf(data.dobMonth);
//     const year = parseInt(data.dobYear, 10);

//     if (monthIndex === -1 || !day || !year) {
//       ctx.addIssue({
//         path: ["dobDay"],
//         code: z.ZodIssueCode.custom,
//         message: "Please select a valid date of birth",
//       });
//       return;
//     }

//     const dob = new Date(year, monthIndex, day);
//     const isRealCalendarDate =
//       dob.getFullYear() === year && dob.getMonth() === monthIndex && dob.getDate() === day;

//     if (!isRealCalendarDate) {
//       ctx.addIssue({
//         path: ["dobDay"],
//         code: z.ZodIssueCode.custom,
//         message: "Please select a valid date of birth",
//       });
//       return;
//     }

//     const today = new Date();
//     if (dob > today) {
//       ctx.addIssue({
//         path: ["dobYear"],
//         code: z.ZodIssueCode.custom,
//         message: "Date of birth cannot be in the future",
//       });
//       return;
//     }

//     let age = today.getFullYear() - dob.getFullYear();
//     const hasHadBirthdayThisYear =
//       today.getMonth() > monthIndex || (today.getMonth() === monthIndex && today.getDate() >= day);
//     if (!hasHadBirthdayThisYear) age -= 1;

//     if (age < 18) {
//       ctx.addIssue({
//         path: ["dobYear"],
//         code: z.ZodIssueCode.custom,
//         message: "Candidate must be at least 18 years old",
//       });
//     } else if (age > 60) {
//       ctx.addIssue({
//         path: ["dobYear"],
//         code: z.ZodIssueCode.custom,
//         message: "Please check the date of birth entered",
//       });
//     }
//   });

// export type RegistrationFormValues = z.infer<typeof registrationSchema>;

// /* ---------------------------------------------------------------
//    OTP verification schema (used after Cognito sends the code).
// --------------------------------------------------------------- */
// export const otpSchema = z.object({
//   otp: z
//     .string()
//     .trim()
//     .min(1, "Verification code is required")
//     .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
// });

// export type OtpFormValues = z.infer<typeof otpSchema>;

// /* ---------------------------------------------------------------
//    Set-password schema — used right after OTP/email verification,
//    when the candidate sets the real password they'll log in with.
// --------------------------------------------------------------- */
// export const setPasswordSchema = z
//   .object({
//     code: z
//       .string()
//       .trim()
//       .min(1, "Verification code is required")
//       .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
//     newPassword: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(
//         PASSWORD_REGEX,
//         "Password must include an uppercase letter, a lowercase letter, a number, and a special character"
//       ),
//     confirmNewPassword: z.string().min(1, "Please confirm your password"),
//   })
//   .superRefine((data, ctx) => {
//     if (data.newPassword !== data.confirmNewPassword) {
//       ctx.addIssue({
//         path: ["confirmNewPassword"],
//         code: z.ZodIssueCode.custom,
//         message: "Passwords do not match",
//       });
//     }
//   });

// export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

// /* ---------------------------------------------------------------
//    Helper: turns a ZodError into a simple { field: message } map
//    so components can show one inline message per field.
// --------------------------------------------------------------- */
// export const flattenZodErrors = <T extends Record<string, unknown>>(
//   error: z.ZodError<T>
// ): Partial<Record<keyof T, string>> => {
//   const fieldErrors: Partial<Record<keyof T, string>> = {};
//   for (const issue of error.issues) {
//     const key = issue.path[0] as keyof T;
//     if (key && !fieldErrors[key]) {
//       fieldErrors[key] = issue.message;
//     }
//   }
//   return fieldErrors;
// };


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
   Registration (Step 1) schema — every field is mandatory.
--------------------------------------------------------------- */
export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be under 50 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

    citizen: yesNo,
    dialect: yesNo,

    residencyConfirmed: z.literal(true, {
      message: "You must confirm residency eligibility",
    }),

    gender: z.enum(["male", "female"], {
      message: "Please select a gender",
    }),

    maritalStatus: z.enum(["single", "married"], {
      message: "Please select a marital status",
    }),

    reservationCategory: z.string().trim().min(1, "Please select a reservation category"),

    ph: yesNo,

    dobDay: z.string().min(1, "Day is required"),
    dobMonth: z.string().min(1, "Month is required"),
    dobYear: z.string().min(1, "Year is required"),

    mobile: z.string().trim().min(1, "Mobile number is required"),
    confirmMobile: z.string().trim().min(1, "Please confirm your mobile number"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .regex(EMAIL_REGEX, "Enter a valid email address"),
    confirmEmail: z.string().trim().min(1, "Please confirm your email address"),

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
    } else if (!MOBILE_REGEX.test(mobile)) {
      ctx.addIssue({
        path: ["mobile"],
        code: z.ZodIssueCode.custom,
        message: "Enter a valid 10-digit mobile number starting with 6-9.",
      });
    }

    // ---- Confirm mobile must match exactly ----
    if (data.confirmMobile && data.mobile.trim() !== data.confirmMobile.trim()) {
      ctx.addIssue({
        path: ["confirmMobile"],
        code: z.ZodIssueCode.custom,
        message: "Mobile numbers do not match.",
      });
    }

    // ---- Confirm email must match (case-insensitive) ----
    if (
      data.confirmEmail &&
      data.email.trim().toLowerCase() !== data.confirmEmail.trim().toLowerCase()
    ) {
      ctx.addIssue({
        path: ["confirmEmail"],
        code: z.ZodIssueCode.custom,
        message: "Email addresses do not match.",
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