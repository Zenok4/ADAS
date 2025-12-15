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
    me: "/authen/me",

    // === REGISTER ===
    registerEmailOtp: "/authen/register/email/otp", // Gửi OTP đăng ký
    registerWithUsername: "/authen/register/username",

    // [THÊM MỚI] Bổ sung các endpoint còn thiếu
    registerWithEmail: "/authen/register/email",
    registerWithPhone: "/authen/register/phone", // (Dự phòng nếu sau này dùng lại)

    // === QUÊN MẬT KHẨU ===
    forgotPassword: {
      email: {
        sendOtp: "/authen/forgot-password/email/send-otp",
        reset: "/authen/forgot-password/email/reset",
      },
      phone: {
        sendOtp: "/authen/forgot-password/phone/send-otp",
        reset: "/authen/forgot-password/phone/reset",
      },
    },
  },

  profile: {
    update: "/profile/update",
  },

  author: {
    roles: {
      list: "/author/roles/list",
      create: "/author/roles/create",
      detail: (id: number | string) => `/author/roles/${id}/get`,
      update: (id: number | string) => `/author/roles/${id}/update`,
      delete: (id: number | string) => `/author/roles/${id}/delete`,
      userRoles: (userId: number | string) =>
        `/author/users/${userId}/roles/list`,
      assignToUser: (userId: number | string, roleId: number | string) =>
        `/author/users/${userId}/roles/${roleId}/assign`,
    },
    permissions: {
      list: "/author/permissions/list",
      detail: (id: number | string) => `/author/permissions/${id}/get`,
      create: "/author/permissions/create",
      update: (id: number | string) => `/author/permissions/${id}/update`,
      delete: (id: number | string) => `/author/permissions/${id}/delete`,
      rolePermissions: (roleId: number | string) =>
        `/author/roles/${roleId}/permissions/list`,
      assignToRole: (roleId: number | string) =>
        `/author/roles/${roleId}/permissions/assign`,
      removeFromRole: (roleId: number | string, permId: number | string) =>
        `/author/roles/${roleId}/permissions/${permId}/remove`,
    },
    myPermissions: "/author/permissions/list",
    assignRolesToUser: (userId: number | string) =>
      `/author/users/${userId}/roles/assign`,
    listRoles: "/author/roles/list",
  },

  users: {
    list: "/users/list",
    create: "/users/create",
    detail: (id: number | string) => `/users/id/${id}`,
    delete: (id: number | string) => `/users/delete/${id}`,
    toggleStatus: (id: number | string) => `/users/status/${id}`,
    update: (id: number | string) => `/users/update/${id}`,

    // === API Đổi mật khẩu ===
    changePassword: (id: number | string) => `/users/change-password/${id}`,
    // API Gửi OTP để đổi mật khẩu
    sendOtpChangePassword: "/users/change-password/send-otp",
  },

  core_functions: {
    drowsy: "/drowsy/detect",
  },
} as const;
