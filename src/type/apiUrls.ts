// services/apiUrls.ts

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
    // THÊM MỚI: URL gán vai trò
    assignRolesToUser: (userId: number | string) =>
      `/author/users/${userId}/roles/assign`,
    // (Bạn có thể thêm URL lấy danh sách roles ở đây nếu cần)
    listRoles: "/author/roles/list",
  },
  users: {
    // SỬA LẠI: Đường dẫn đầy đủ
    list: "/users/list",
    // THÊM MỚI
    create: "/users/create",
    // SỬA LẠI: Đường dẫn đầy đủ
    detail: (id: number | string) => `/users/id/${id}`,
    // THÊM MỚI
    delete: (id: number | string) => `/users/delete/${id}`,
    // THÊM MỚI
    toggleStatus: (id: number | string) => `/users/status/${id}`,
    // THÊM MỚI: ĐƯỜNG DẪN UPDATE
    update: (id: number | string) => `/users/update/${id}`,
  },
} as const;