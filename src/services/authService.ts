import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

export const AuthService = {
  loginWithUsername: (username: string, password: string) =>
    api.post(ApiUrls.authen.loginUsername, { username, password }),

  loginWithEmail: (email: string, password: string, otp_code?: string) =>
    api.post(ApiUrls.authen.loginEmail, { email, password, otp_code }),

  logout: () => api.post(ApiUrls.authen.logout),

  me: (access_token: string) =>
    api.get(ApiUrls.authen.me, {
      headers: { Authorization: `Bearer ${access_token}` },
  }),


  refresh: () => api.post<{ access_token: string }>(ApiUrls.authen.refresh, {}),

  permission: () => api.get(ApiUrls.author.permissions.list),
  
    // ===== Roles =====
  listRoles: () => api.get(ApiUrls.author.roles.list),

  getRole: (id: number) => api.get(ApiUrls.author.roles.detail(id)),

  createRole: (data: { name: string; description?: string }) =>
    api.post(ApiUrls.author.roles.create, data),

  updateRole: (id: number, data: any) =>
    api.put(ApiUrls.author.roles.update(id), data),

  deleteRole: (id: number) => api.delete(ApiUrls.author.roles.delete(id)),

  // ===== Permissions =====
  listPermissions: () => api.get(ApiUrls.author.permissions.list),

  getPermission: (id: number) =>
    api.get(ApiUrls.author.permissions.detail(id)),

  createPermission: (data: any) =>
    api.post(ApiUrls.author.permissions.create, data),

  updatePermission: (id: number, data: any) =>
    api.put(ApiUrls.author.permissions.update(id), data),

  deletePermission: (id: number) =>
    api.delete(ApiUrls.author.permissions.delete(id)),

  // ===== Mapping =====
  assignPermissionToRole: (roleId: number, permId: number) =>
    api.post(ApiUrls.author.permissions.assignToRole(roleId, permId)),

  removePermissionFromRole: (roleId: number, permId: number) =>
    api.delete(ApiUrls.author.permissions.removeFromRole(roleId, permId)),
};
