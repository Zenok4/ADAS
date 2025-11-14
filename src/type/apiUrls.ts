// services/type/apiUrls.ts

export const ApiUrls = {
  authen: {
    loginUsername: "/authen/login/username",
    loginEmail: "/authen/login/email",
    loginPhoneOtp: "/authen/login/phone/otp",
    verifyPhoneOtp: "/authen/login/phone/verify",
    requestEmailOtp: "/authen/login/email/otp",
    refresh: "/authen/refresh",
    logout: "/authen/logout",
    me: "/authen/me", // Dùng để lấy thông tin profile

    // register
    registerWithUsername: "/authen/register/username",
    registerWithEmail: "/authen/register/email",
    registerWithPhone: "/authen/register/phone",
  },

  profile: {
    // Backend cho endpoint này là file 'services/user/update-profile.py'
    update: "/profile/update",
  },

  author: {
    // ... (Giữ nguyên phần author của bạn)
    roles: {
      list: "/author/roles/list",
      create: "/author/roles/create",
      // ...
    },
    permissions: {
      list: "/author/permissions/list",
      // ...
    },
    myPermissions: "/author/permissions/list",
    assignRolesToUser: (userId: number | string) =>
      `/author/users/${userId}/roles/assign`,
    listRoles: "/author/roles/list",
  },
  users: {
    // ... (Giữ nguyên phần users của bạn)
    list: "/users/list",
    create: "/users/create",
    detail: (id: number | string) => `/users/id/${id}`,
    delete: (id: number | string) => `/users/delete/${id}`,
    toggleStatus: (id: number | string) => `/users/status/${id}`,
    update: (id: number | string) => `/users/update/${id}`,

    // === THÊM MỚI TẠI ĐÂY ===
    /**
     * API: Đổi mật khẩu của người dùng (tự đổi)
     * Backend: usermanage_endpoints.py -> change_password()
     */
    changePassword: (id: number | string) => `/users/change-password/${id}`,
    // === KẾT THÚC THÊM MỚI ===
  },
  core_functions: {
    drowsy: "/drowsy/detect",
  },
} as const;