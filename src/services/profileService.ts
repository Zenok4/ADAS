// lib/services/profileService.ts

import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

// ===================================
// == ĐỊNH NGHĨA TYPE ==
// ===================================

export interface ProfileData {
  id: string | number;
  username: string;
  email: string;
  phone: string;
  display_name: string | null; // <--- ĐÃ THÊM: Có thể là string hoặc null
  address: string;
  vehicle_name: string;
  license_plate: string;
  // ... các trường khác
}

export interface ProfileResponse {
  message: string;
  data: ProfileData;
}

export type ProfileUpdatePayload = {
  email?: string;
  phone?: string;
  display_name?: string; // <--- ĐÃ THÊM: Cho phép cập nhật tên hiển thị
  address?: string;
  vehicle_name?: string;
  license_plate?: string;
};

// ===================================
// == CÁC TYPE KHÁC ==
// ===================================

/**
 * Payload cho API đổi mật khẩu.
 */
export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};

// Kiểu trả về chung khi thành công (không có data)
export interface SuccessResponse {
  success: boolean;
  message: string;
  code: number;
  data: any;
}

// ===================================
// == PROFILE SERVICE ==
// ===================================

export const ProfileService = {
  /**
   * API: Lấy thông tin profile của user đang đăng nhập
   * Sử dụng: ApiUrls.authen.me
   */
  getProfile: () => {
    return api.get<ProfileResponse>(ApiUrls.authen.me);
  },

  /**
   * API: Cập nhật thông tin profile của user đang đăng nhập
   * Sử dụng: ApiUrls.profile.update
   */
  updateProfile: (payload: ProfileUpdatePayload) => {
    return api.put<ProfileResponse>(ApiUrls.profile.update, payload);
  },

  /**
   * API: Đổi mật khẩu của người dùng (tự đổi)
   * Tương ứng với: UserService.change_password()
   *
   * @param userId ID của người dùng (lấy từ session/context)
   * @param payload Dữ liệu (mật khẩu cũ, mật khẩu mới)
   */
  changePassword: (userId: number | string, payload: ChangePasswordPayload) => {
    // Backend API là PATCH /users/change-password/<int:user_id>
    return api.patch<SuccessResponse>(
      ApiUrls.users.changePassword(userId),
      payload
    );
  },
};
