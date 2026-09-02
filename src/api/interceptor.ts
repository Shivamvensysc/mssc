// import api from "./api";

// let redirecting = false;

// const clearSession = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("idToken");
//   localStorage.removeItem("refreshToken");
// };

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       clearSession();

//       if (!redirecting) {
//         redirecting = true;

//         window.location.replace("/login");
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import api from "./api";

let redirecting = false;

/**
 * Authentication configuration
 *
 * Candidate:
 *   - Token storage: accessToken, idToken, refreshToken
 *   - Login route: /login
 *
 * Admin:
 *   - Token storage: adminAccessToken, adminIdToken, adminRefreshToken
 *   - Login route: /admin-login
 *
 * NOTE (fix): The admin app (see Dashboard.tsx) actually reads/writes its
 * tokens under "adminAccessToken" / "adminIdToken" (admin-prefixed keys),
 * NOT the generic "accessToken" / "idToken" keys. clearSession() below is
 * now scoped per authType so it removes the exact keys each app uses.
 */
const AUTH_CONFIG = {
  candidate: {
    loginPath: "/login",
    tokenKeys: ["accessToken", "idToken", "refreshToken"],
  },

  admin: {
    loginPath: "/admin-login",
    tokenKeys: ["adminAccessToken", "adminIdToken", "adminRefreshToken"],
  },
} as const;

/**
 * Detect which application is currently running.
 *
 * If the current URL starts with /admin, we consider it
 * an admin session. Otherwise, it is considered candidate.
 */
const getAuthType = (): "candidate" | "admin" => {
  const pathname = window.location.pathname;

  if (
    pathname === "/admin-login" ||
    pathname.startsWith("/admin/")
  ) {
    return "admin";
  }

  return "candidate";
};

/**
 * Clear authentication session.
 *
 * Fixed: previously this always removed the generic
 * "accessToken" / "idToken" / "refreshToken" keys only, which meant an
 * admin session (stored under "adminAccessToken" / "adminIdToken" /
 * "adminRefreshToken") never actually got cleared on a 401. Now it clears
 * exactly the keys used by the given authType, so both candidate and
 * admin sessions are correctly wiped out.
 */
const clearSession = (authType: "candidate" | "admin") => {
  AUTH_CONFIG[authType].tokenKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      /**
       * Detect whether this request belongs to
       * candidate or admin application.
       */
      const authType = getAuthType();

      /**
       * Clear current session (correct keys for this authType).
       */
      clearSession(authType);

      /**
       * Prevent multiple redirects when several APIs
       * return 401 at the same time.
       */
      if (!redirecting) {
        redirecting = true;

        /**
         * Candidate:
         *   /login
         *
         * Admin:
         *   /admin-login
         */
        const loginPath = AUTH_CONFIG[authType].loginPath;

        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error);
  }
);

export default api;