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
  address?: string;
  vehicle_name?: string;
  license_plate?: string;
};

/**
 * Payload cho API đổi mật khẩu.
 * Phải khớp với backend (yêu cầu thêm OTP):
 */
export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  otp_code: string; // <-- [MỚI] Bắt buộc phải có OTP
};

// Kiểu trả về chung khi thành công
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
   */
  getProfile: () => {
    return api.get<ProfileResponse>(ApiUrls.authen.me);
  },

  /**
   * API: Cập nhật thông tin profile của user đang đăng nhập
   */
  updateProfile: (payload: ProfileUpdatePayload) => {
    return api.put<ProfileResponse>(ApiUrls.profile.update, payload);
  },

  // ===================================
  // == CÁC HÀM ĐỔI MẬT KHẨU (CÓ OTP) ==
  // ===================================

  /**
   * [BƯỚC 1] Gửi yêu cầu lấy OTP để đổi mật khẩu.
   * OTP sẽ được gửi về Email hoặc SĐT của user đang đăng nhập.
   */
  requestChangePasswordOtp: (channel: "email" | "phone") => {
    return api.post<SuccessResponse>(ApiUrls.users.sendOtpChangePassword, {
      channel,
    });
  },

  /**
   * [BƯỚC 2] Gửi request đổi mật khẩu kèm OTP.
   *
   * @param userId ID của người dùng
   * @param payload { old_password, new_password, otp_code }
   */
  changePassword: (userId: number | string, payload: ChangePasswordPayload) => {
    return api.patch<SuccessResponse>(
      ApiUrls.users.changePassword(userId),
      payload
    );
  },
};
