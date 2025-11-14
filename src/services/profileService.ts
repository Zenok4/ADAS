// lib/services/profileService.ts

import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

// ===================================
// == ĐỊNH NGHĨA TYPE (MỚI) ==
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

// ===================================
// == PROFILE SERVICE (MỚI) ==
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
};