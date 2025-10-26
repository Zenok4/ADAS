export const ApiUrls = {
  authen: {
    loginUsername: "/authen/login/username",
    loginEmail: "/authen/login/email",
    loginPhoneOtp: "/authen/login/phone/otp",
    verifyPhoneOtp: "/authen/login/phone/verify",
    requestEmailOtp: "/authen/login/email/otp",
    refresh: "/authen/refresh",
    logout: "/authen/logout",
    me: "/authen/me",
  },
  author: {
    myPermissions: "/author/permissions/list",
  },
  users: {
    list: "/users",
    detail: (id: number | string) => `/users/${id}`,
  },
} as const;
