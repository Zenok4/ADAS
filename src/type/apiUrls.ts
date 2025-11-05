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

    // register
    registerWithUsername: "/authen/register/username",
    registerWithEmail: "/authen/register/email",
    registerWithPhone: "/authen/register/phone",
  },
  author: {
    //  myPermissions: "/author/permissions/list",
    // Quyền & vai trò
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
      assignToRole: (roleId: number | string, permId: number | string) =>
        `/author/roles/${roleId}/permissions/${permId}/assign`,
      removeFromRole: (roleId: number | string, permId: number | string) =>
        `/author/roles/${roleId}/permissions/${permId}/remove`,
    },
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
  core_functions: {
    drowsy: "/drowsy/detect",
  },
} as const;
