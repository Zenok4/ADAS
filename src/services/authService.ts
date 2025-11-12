import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";
import { List } from "lucide-react";

export interface ListRolesParams {
  page?: number;
  limit?: number;
  name?: string;
  discription?: string;
  is_active?: boolean | null;
  list_permissions?: boolean;
}

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

  registerWithUsername: (username: string, password: string) =>
    api.post(ApiUrls.authen.registerWithUsername, { username, password }),

  registerWithEmail: (email: string, password: string) =>
    api.post(ApiUrls.authen.registerWithEmail, { email, password }),

  registerWithPhone: (phone: string, password: string) =>
    api.post(ApiUrls.authen.registerWithPhone, { phone, password }),
  
    // ===== Roles =====
  // listRoles: (includePermissions: boolean = false) =>
  //   api.get(ApiUrls.author.roles.list, {
  //     data:{list_permissions: includePermissions},
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }),
    ListRoles: (params: ListRolesParams = {}) =>
      api.get(ApiUrls.author.roles.list, {
        params: params,
      }),

//  getRole: (id: number) => api.get(ApiUrls.author.roles.detail(id)),
    getRole: (id: number, includePermissions: boolean = false) =>
      api.get(ApiUrls.author.roles.detail(id), {
        params:{
          list_permissions: includePermissions 
        }

      }),

  createRole: (data: { name: string; description?: string }) =>
    api.post(ApiUrls.author.roles.create, data),

  updateRole: (id: number, data: any) =>
    api.put(ApiUrls.author.roles.update(id), data),

  deleteRole: (id: number) => api.delete(ApiUrls.author.roles.delete(id)),

  // ===== Permissions =====
  listPermissions: () => api.get(ApiUrls.author.permissions.list),

  rolePermissions: (roleId: number) =>
    api.get(ApiUrls.author.permissions.rolePermissions(roleId)),

  getPermission: (id: number) =>
    api.get(ApiUrls.author.permissions.detail(id)),

  createPermission: (data: any) =>
    api.post(ApiUrls.author.permissions.create, data),

  updatePermission: (id: number, data: any) =>
    api.put(ApiUrls.author.permissions.update(id), data),

  deletePermission: (id: number) =>
    api.delete(ApiUrls.author.permissions.delete(id)),

  assignPermissionToRole: (roleId: number, permIds: number[]) =>
    api.post(ApiUrls.author.permissions.assignToRole(roleId), { perm_ids: permIds },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ),

  removePermissionFromRole: (roleId: number, permId: number) =>
    api.delete(ApiUrls.author.permissions.removeFromRole(roleId, permId)),
};
    