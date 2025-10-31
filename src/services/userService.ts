// services/userService.ts (ĐÃ SỬA)

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
  // THÊM IMPORT MỚI
  UserUpdatePayload,
} from "./type/user.type"; // Giữ nguyên đường dẫn tương đối này

/**
 * Service xử lý các nghiệp vụ liên quan đến User Management.
 * Được viết theo phong cách của authService.ts
 */
export const UserService = {
  /**
   * API: Lấy danh sách user (phân trang)
   * Tương ứng với: UserService.get_all_users()
   *
   */
  getAllUsers: (page = 1, limit = 20, keyword = "") =>
    api.get<PaginatedUsersResponse>(ApiUrls.users.list, {
      params: { page, limit, keyword },
    }),

  /**
   * API: Lấy chi tiết user
   * Tương ứng với: UserService.get_user_by_id()
   *
   */
  getUserDetail: (userId: number | string, includeRoles = false) =>
    // Lưu ý: Backend API này đọc body từ request GET
    // Nếu bạn đã sửa backend dùng query param, đổi 'data' thành 'params'
    api.get<UserResponse>(ApiUrls.users.detail(userId), {
      // SỬA ĐỔI: Đổi 'data' thành 'params' để gửi qua query string
      params: { include_roles: includeRoles },
    }),

  /**
   * API: Tạo user mới
   * Tương ứng với: UserService.create_user()
   *
   */
  createUser: (payload: UserCreatePayload) =>
    // API trả về { data: {user} }
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
    // API trả về { data: {user} }
    api.patch<UserResponse>(ApiUrls.users.toggleStatus(userId), payload),

  // ============ THÊM HÀM MỚI NÀY ============
  /**
   * API: Cập nhật thông tin user (username, email, phone...)
   * Tương ứng với: UserService.update_user()
   */
  updateUser: (userId: number | string, payload: UserUpdatePayload) =>
    // API trả về { data: {user} }
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
  // ===================================
  // == BẮT ĐẦU SỬA: getAllRoles() ==
  // ===================================
  getAllRoles: () => api.get<RolesResponse | any>(ApiUrls.author.listRoles),
  // ===================================
  // == KẾT THÚC SỬA: getAllRoles() ==
  // ===================================

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