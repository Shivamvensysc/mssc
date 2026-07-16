// import {
//   CognitoUserPool,
//   CognitoUser,
//   CognitoUserAttribute,
//   AuthenticationDetails,
// } from "amazon-cognito-identity-js";
// import type { ISignUpResult, CognitoUserSession } from "amazon-cognito-identity-js";

// const poolData = {
//   UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
//   ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
// };

// export const userPool = new CognitoUserPool(poolData);

// /** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
// export interface RegistrationFormData {
//   applicantName: string;
//   gender: string;
//   isManipurResident: string;
//   category: string;
//   isPwD: string;
//   isGovEmployee: string;
//   nameOfPost: string;
//   emailId: string;
//   dobDay: string;
//   dobMonth: string;
//   dobYear: string;
//   isCitizenOfIndia: string;
//   motherTongue: string;
//   maritalStatus: string;
//   district: string;
// }

// export interface SendOtpResponse {
//   userSub: string;
//   username: string;
//   codeDeliveryDetails?: unknown;
//   rawResult: ISignUpResult;
// }

// export interface VerifyOtpResponse {
//   status: string;
//   message: string;
// }

// export interface DurationParts {
//   years: number;
//   months: number;
//   days: number;
// }

// /**
//  * Every custom attribute this app ever sends to Cognito.
//  * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
//  * as String / Mutable = true, or signUp() will throw InvalidParameterException with
//  * "Type for attribute {custom:xxx} could not be determined".
//  * Keep this list and the pool schema in sync — it's the single source of truth in code.
//  */
// const REQUIRED_CUSTOM_ATTRIBUTES = [
//   "custom:post",
//   "custom:citizen_of_india",
//   "custom:mother_tongue",
//   "custom:manipur_resident",
//   "custom:gender",
//   "custom:marital_status",
//   "custom:reservation_category",
//   "custom:is_pwd",
//   "custom:gov_employee",
//   "custom:select_district",
// ] as const;

// const pad2 = (v: string): string => v.padStart(2, "0");

// /** true if all DOB parts are present and form a real calendar date */
// const isValidDob = (day: string, month: string, year: string): boolean => {
//   const d = parseInt(day, 10);
//   const m = parseInt(month, 10);
//   const y = parseInt(year, 10);
//   if (!d || !m || !y) return false;
//   const dt = new Date(y, m - 1, d);
//   return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
// };

// /**
//  * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
//  * Returns null if either date is missing/invalid, or `to` is before `from`.
//  * Exported for reuse elsewhere in the app (e.g. age-on-cutoff-date calculations).
//  */
// export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
//   if (!fromIso || !toIso) return null;
//   const from = new Date(fromIso);
//   const to = new Date(toIso);
//   if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

//   let years = to.getFullYear() - from.getFullYear();
//   let months = to.getMonth() - from.getMonth();
//   let days = to.getDate() - from.getDate();

//   if (days < 0) {
//     months -= 1;
//     days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
//   }
//   if (months < 0) {
//     years -= 1;
//     months += 12;
//   }
//   return { years, months, days };
// };

// /**
//  * Maps form fields -> Cognito attributes.
//  * Standard attributes are used where Cognito has a matching field
//  * (email, name, birthdate); everything else goes out as a
//  * `custom:` attribute that must already exist in the pool schema.
//  */
// const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
//   const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
//     ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
//     : "";

//   const attrs: Record<string, string> = {
//     // standard attributes
//     email: data.emailId,
//     name: data.applicantName,
//     birthdate,

//     // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
//     "custom:post": data.nameOfPost,
//     "custom:citizen_of_india": data.isCitizenOfIndia,
//     "custom:mother_tongue": data.motherTongue,
//     "custom:manipur_resident": data.isManipurResident,
//     "custom:gender": data.gender,
//     "custom:marital_status": data.maritalStatus,
//     "custom:reservation_category": data.category,
//     "custom:is_pwd": data.isPwD,
//     "custom:gov_employee": data.isGovEmployee,
//     "custom:select_district": data.district,
//   };

//   // Cognito rejects attributes sent as an empty string, so drop blanks
//   // (this also means truly-optional fields are fine unfilled).
//   return Object.entries(attrs)
//     .filter(([, value]) => value !== undefined && value !== null && value !== "")
//     .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
// };

// /**
//  * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
//  * We turn it into something a developer can act on immediately, instead of
//  * surfacing raw AWS text to the end user.
//  */
// class SchemaMisconfiguredError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "SchemaMisconfiguredError";
//   }
// }

// export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
//   return new Promise((resolve, reject) => {
//     const attributeList = buildAttributeList(data);

//     // Cognito requires a password at signUp time even though candidates
//     // only ever authenticate via the email OTP — this one is never shown
//     // to the user and never reused.
//     const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

//     userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
//       if (err) {
//         if (
//           err.name === "InvalidParameterException" &&
//           /could not be determined/i.test(err.message || "")
//         ) {
//           const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
//             (err.message || "").includes(a)
//           );
//           reject(
//             new SchemaMisconfiguredError(
//               missing
//                 ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
//                 : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
//             )
//           );
//           return;
//         }
//         reject(err);
//         return;
//       }
//       if (!result) {
//         reject(new Error("Signup failed"));
//         return;
//       }
//       resolve({
//         userSub: result.userSub,
//         username: result.user?.getUsername?.() || data.emailId,
//         codeDeliveryDetails: result.codeDeliveryDetails,
//         rawResult: result,
//       });
//     });
//   });
// };

// export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.confirmRegistration(otp, true, (err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
//     });
//   });
// };

// export const resendOtp = async (email: string): Promise<unknown> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.resendConfirmationCode((err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(result);
//     });
//   });
// };

// /* ---------------------------------------------------------------
//    SET PASSWORD (post-registration) — frontend + Cognito only, no backend.
//    register.ts signs candidates up with a random temporary password they
//    never see. Right after email OTP verification succeeds, we reuse
//    Cognito's built-in forgotPassword mechanism as a "set your first real
//    password" step: it emails a code to the same (already verified) address,
//    and confirmPassword() lets the candidate set the password they'll
//    actually log in with.
// --------------------------------------------------------------- */

// /** Step 1: ask Cognito to email a verification code so the candidate can set a real password. */
// export const triggerSetPassword = (email: string): Promise<unknown> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.forgotPassword({
//       onSuccess: (data) => resolve(data),
//       onFailure: (err) => reject(err),
//       // Some pool configs call this instead of onSuccess once the code is sent.
//       inputVerificationCode: (data) => resolve(data),
//     });
//   });
// };

// /** Step 2: candidate submits the emailed code + their chosen password. */
// export const confirmSetPassword = (
//   email: string,
//   code: string,
//   newPassword: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.confirmPassword(code, newPassword, {
//       onSuccess: () => resolve("Password set successfully"),
//       onFailure: (err) => reject(err),
//     });
//   });
// };

// /* ---------------------------------------------------------------
//    LOGIN — frontend + Cognito only, no backend.

//    `username` is whatever the candidate types into the "Registration
//    Number" field. This only resolves correctly if your Cognito User Pool
//    has `preferred_username` enabled as a sign-in alias (Console -> User
//    Pool -> Sign-in experience -> Cognito user pool sign-in options), AND
//    `preferred_username` is set to the same value as `custom:registration_no`
//    for each user. If that alias isn't configured yet, candidates need to
//    log in with their email instead until it is.
// --------------------------------------------------------------- */

// export interface LoginSuccessResponse {
//   status: "SUCCESS";
//   idToken: string;
//   accessToken: string;
//   refreshToken: string;
// }

// export interface NewPasswordRequiredResponse {
//   status: "NEW_PASSWORD_REQUIRED";
//   cognitoUser: CognitoUser;
//   userAttributes: Record<string, unknown>;
// }

// export type LoginResult = LoginSuccessResponse | NewPasswordRequiredResponse;

// export const login = (username: string, password: string): Promise<LoginResult> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
//     const authDetails = new AuthenticationDetails({ Username: username, Password: password });

//     cognitoUser.authenticateUser(authDetails, {
//       onSuccess: (session: CognitoUserSession) => {
//         resolve({
//           status: "SUCCESS",
//           idToken: session.getIdToken().getJwtToken(),
//           accessToken: session.getAccessToken().getJwtToken(),
//           refreshToken: session.getRefreshToken().getToken(),
//         });
//       },
//       onFailure: (err) => reject(err),
//       // Only fires for accounts created via AdminCreateUser that never went
//       // through the Set Password step — shouldn't normally happen for
//       // candidates who registered through the form, but handled just in case.
//       newPasswordRequired: (userAttributes) => {
//         delete userAttributes.email_verified;
//         delete userAttributes.phone_number_verified;
//         resolve({ status: "NEW_PASSWORD_REQUIRED", cognitoUser, userAttributes });
//       },
//     });
//   });
// };

// export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = userPool.getCurrentUser();
//     if (!cognitoUser) {
//       resolve(null);
//       return;
//     }
//     cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(session);
//     });
//   });
// };

// export const logout = (): void => {
//   userPool.getCurrentUser()?.signOut();
// };



import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import type { ISignUpResult, CognitoUserSession } from "amazon-cognito-identity-js";
import { months, type RegistrationFormValues } from "../schemas/registrationSchema"; // Adjust import path as needed

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

export interface SendOtpResponse {
  userSub: string;
  username: string;
  codeDeliveryDetails?: unknown;
  rawResult: ISignUpResult;
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
}

export interface DurationParts {
  years: number;
  months: number;
  days: number;
}

/**
 * Every custom attribute this app ever sends to Cognito.
 * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
 * as String / Mutable = true, or signUp() will throw InvalidParameterException with
 * "Type for attribute {custom:xxx} could not be determined".
 * Keep this list and the pool schema in sync — it's the single source of truth in code.
 */
const REQUIRED_CUSTOM_ATTRIBUTES = [
  "custom:post",
  "custom:citizen_of_india",
  "custom:mother_tongue",
  "custom:manipur_resident",
  "custom:gender",
  "custom:marital_status",
  "custom:reservation_category",
  "custom:is_pwd",
  "custom:gov_employee",
  "custom:select_district",
] as const;

// The post applied for is fixed by this recruitment drive and isn't a form field,
// so it's sent as a constant rather than read off `data`.
const DEFAULT_POST_NAME = "Multi Tasking Staff (MTS)";

const pad2 = (v: string): string => v.padStart(2, "0");

const monthNameToNumber = (monthName: string): number => {
  const idx = months.indexOf(monthName);
  return idx === -1 ? 0 : idx + 1;
};

/**
 * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
 * Returns null if either date is missing/invalid, or `to` is before `from`.
 * Exported for reuse elsewhere in the app (e.g. age-on-cutoff-date calculations).
 */
export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
  if (!fromIso || !toIso) return null;
  const from = new Date(fromIso);
  const to = new Date(toIso);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

  let years = to.getFullYear() - from.getFullYear();
  let months2 = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months2 -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months2 < 0) {
    years -= 1;
    months2 += 12;
  }
  return { years, months: months2, days };
};

/**
 * Maps the Zod-validated registration form -> Cognito attributes.
 * Standard attributes are used where Cognito has a matching field
 * (email, name, birthdate, phone_number); everything else goes out as a
 * `custom:` attribute that must already exist in the pool schema.
 *
 * Because `data` is `RegistrationFormValues` (the output of
 * registrationSchema.parse/safeParse), every field here is guaranteed to be
 * present and already validated — no defensive fallback logic is needed.
 */
const buildAttributeList = (data: RegistrationFormValues): CognitoUserAttribute[] => {
  const monthNum = monthNameToNumber(data.dobMonth);
  const birthdate = monthNum ? `${data.dobYear}-${pad2(String(monthNum))}-${pad2(data.dobDay)}` : "";

  const attrs: Record<string, string> = {
    // standard attributes
    email: data.email,
    name: data.name,
    birthdate,
    phone_number: `+91${data.mobile}`,

    // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
    "custom:post": DEFAULT_POST_NAME,
    "custom:citizen_of_india": data.citizen,
    "custom:mother_tongue": data.dialect,
    "custom:manipur_resident": data.residencyConfirmed ? "Yes" : "No",
    "custom:gender": data.gender,
    "custom:marital_status": data.maritalStatus,
    "custom:reservation_category": data.reservationCategory,
    "custom:is_pwd": data.ph,
    "custom:gov_employee": data.govEmployee,
    "custom:select_district": data.district,
  };

  // Cognito rejects attributes sent as an empty string, so drop blanks.
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
};

/**
 * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
 * We turn it into something a developer can act on immediately, instead of
 * surfacing raw AWS text to the end user.
 */
class SchemaMisconfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaMisconfiguredError";
  }
}

/**
 * Registers the candidate in Cognito (signUp) and triggers the email OTP.
 * `data` must already be validated by `registrationSchema` (see registrationSchema.ts) —
 * call `registrationSchema.parse(formData)` / `.safeParse(formData)` before calling this.
 */
export const sendOtp = async (data: RegistrationFormValues): Promise<SendOtpResponse> => {
  return new Promise((resolve, reject) => {
    const attributeList = buildAttributeList(data);

    // Cognito requires a password at signUp time even though candidates
    // only ever authenticate via the email OTP — this one is never shown
    // to the user and never reused.
    const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

    userPool.signUp(data.email, temporaryPassword, attributeList, [], (err, result) => {
      if (err) {
        if (
          err.name === "InvalidParameterException" &&
          /could not be determined/i.test(err.message || "")
        ) {
          const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
            (err.message || "").includes(a)
          );
          reject(
            new SchemaMisconfiguredError(
              missing
                ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
                : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
            )
          );
          return;
        }
        if (err.name === "UsernameExistsException") {
          reject(new Error("An account with this email already exists. Please log in instead."));
          return;
        }
        reject(err);
        return;
      }
      if (!result) {
        reject(new Error("Signup failed"));
        return;
      }
      resolve({
        userSub: result.userSub,
        username: result.user?.getUsername?.() || data.email,
        codeDeliveryDetails: result.codeDeliveryDetails,
        rawResult: result,
      });
    });
  });
};

export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(otp, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
    });
  });
};

export const resendOtp = async (email: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

/* ---------------------------------------------------------------
   SET PASSWORD (post-registration) — frontend + Cognito only, no backend.
   sendOtp() signs candidates up with a random temporary password they
   never see. Right after email OTP verification succeeds, we reuse
   Cognito's built-in forgotPassword mechanism as a "set your first real
   password" step: it emails a code to the same (already verified) address,
   and confirmPassword() lets the candidate set the password they'll
   actually log in with.
--------------------------------------------------------------- */

/** Step 1: ask Cognito to email a verification code so the candidate can set a real password. */
export const triggerSetPassword = (email: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
      // Some pool configs call this instead of onSuccess once the code is sent.
      inputVerificationCode: (data) => resolve(data),
    });
  });
};

/** Step 2: candidate submits the emailed code + their chosen password. */
export const confirmSetPassword = (
  email: string,
  code: string,
  newPassword: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve("Password set successfully"),
      onFailure: (err) => reject(err),
    });
  });
};

/* ---------------------------------------------------------------
   LOGIN — frontend + Cognito only, no backend.

   `username` is whatever the candidate types into the "Registration
   Number" field. This only resolves correctly if your Cognito User Pool
   has `preferred_username` enabled as a sign-in alias (Console -> User
   Pool -> Sign-in experience -> Cognito user pool sign-in options), AND
   `preferred_username` is set to the same value as `custom:registration_no`
   for each user. If that alias isn't configured yet, candidates need to
   log in with their email instead until it is.
--------------------------------------------------------------- */

export interface LoginSuccessResponse {
  status: "SUCCESS";
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface NewPasswordRequiredResponse {
  status: "NEW_PASSWORD_REQUIRED";
  cognitoUser: CognitoUser;
  userAttributes: Record<string, unknown>;
}

export type LoginResult = LoginSuccessResponse | NewPasswordRequiredResponse;

export const login = (username: string, password: string): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          status: "SUCCESS",
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => reject(err),
      // Only fires for accounts created via AdminCreateUser that never went
      // through the Set Password step — shouldn't normally happen for
      // candidates who registered through the form, but handled just in case.
      newPasswordRequired: (userAttributes) => {
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;
        resolve({ status: "NEW_PASSWORD_REQUIRED", cognitoUser, userAttributes });
      },
    });
  });
};

export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
};

export const logout = (): void => {
  userPool.getCurrentUser()?.signOut();
};