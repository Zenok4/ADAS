// services/userService.ts (PHIÊN BẢN ĐÃ SỬA LỖI)

import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";
import {
  PaginatedUsersResponse,
  UserCreatePayload,
  UserData,
  UserResponse,
  UserToggleStatusPayload,
  RolesResponse,
  AssignRolesPayload,
  UserUpdatePayload,
} from "./type/user.type"; // Giữ nguyên đường dẫn tương đối này

/**
 * Service xử lý các nghiệp vụ liên quan đến User Management.
 */
export const UserService = {
  /**
   * API: Lấy danh sách user (phân trang, lọc)
   * Tương ứng với: UserService.get_all_users()
   */
  // ===================================
  // == BẮT ĐẦU SỬA: getAllUsers() ==
  // ===================================
  getAllUsers: (
    page = 1,
    limit = 20,
    search: string, // Tham số cho tìm kiếm
    status: string, // Tham số cho trạng thái
    role: string // Tham số cho vai trò
  ) => {
    // Xây dựng query params tự động
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search) {
      params.append("search", search);
    }

    if (status && status !== "all") {
      // Giả định backend nhận 'true'/'false' cho trạng thái
      const isActive = status === "active" ? "true" : "false";
      params.append("is_active", isActive);
    }

    if (role && role !== "all") {
      // Giả định backend nhận 'role_id'
      params.append("role_id", role);
    }

    // Gửi request với các params đã được xây dựng
    return api.get<PaginatedUsersResponse>(ApiUrls.users.list, {
      params: params,
    });
  },
  // ===================================
  // == KẾT THÚC SỬA: getAllUsers() ==
  // ===================================

  /**
   * API: Lấy chi tiết user
   * Tương ứng với: UserService.get_user_by_id()
   *
   */
  getUserDetail: (userId: number | string, includeRoles = false) =>
    api.get<UserResponse>(ApiUrls.users.detail(userId), {
      params: { include_roles: includeRoles }, 
    }),

  /**
   * API: Tạo user mới
   * Tương ứng với: UserService.create_user()
   *
   */
  createUser: (payload: UserCreatePayload) =>
    api.post<UserResponse>(ApiUrls.users.create, payload),

  /**
   * API: Xóa user
   * Tương ứng với: UserService.delete_user()
   *
   */
  deleteUser: (userId: number | string) =>
    api.delete(ApiUrls.users.delete(userId)),

  /**
   * API: Thay đổi trạng thái (active/inactive)
   * Tương ứng với: UserService.toggle_status()
   *
   */
  toggleUserStatus: (
    userId: number | string,
    payload: UserToggleStatusPayload
  ) =>
    api.patch<UserResponse>(ApiUrls.users.toggleStatus(userId), payload),

  /**
   * API: Cập nhật thông tin user (username, email, phone...)
   * Tương ứng với: UserService.update_user()
   */
  updateUser: (userId: number | string, payload: UserUpdatePayload) =>
    api.put<UserResponse>(ApiUrls.users.update(userId), payload),
};

/**
 * Service xử lý phân quyền (Tách riêng)
 * Tương ứng với author_enpoints.py
 */
export const AuthorService = {
  /**
   * API: Lấy danh sách tất cả role
   * Tương ứng với: RoleService.list_roles()
   *
   */
  getAllRoles: () => api.get<RolesResponse | any>(ApiUrls.author.listRoles),

  /**
   * API: Gán vai trò cho User
   * Tương ứng với: RoleService.assign_roles_to_user()
   *
   */
  assignRolesToUser: (
    userId: number | string,
    payload: AssignRolesPayload
  ) => api.post(ApiUrls.author.assignRolesToUser(userId), payload),
};