"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  CheckCircle,
  FileEdit,
  Lock, // <-- THÊM MỚI
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  RectangleHorizontal,
  ShieldCheck,
  Loader2, // Icon loading
  AlertCircle, // Icon lỗi
} from "lucide-react";

// Import Header và Sidebar (Giữ nguyên)
import { UserHeader } from "../../../(main)/components/user-header";
import { UserSidebar } from "../../../(main)/components/user-sidebar";

// Import Service và Context
import { ProfileService, ProfileData } from "@/services/profileService"; //
import { useSession } from "@/context/SessionContext"; //

// Component con (Giữ nguyên)
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <Icon size={20} className="text-gray-400 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">
        {value || (
          <span className="text-gray-400 italic text-sm">Chưa cập nhật</span>
        )}
      </p>
    </div>
  </div>
);

export default function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  // === 1. THÊM STATE ĐỂ QUẢN LÝ DỮ LIỆU ===
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy session để đảm bảo user đã được load
  const { user: sessionUser, loading: sessionLoading } = useSession(); //

  // === 2. THÊM EFFECT ĐỂ LẤY DỮ LIỆU TỪ BACKEND ===
  useEffect(() => {
    // Chỉ fetch khi session đã được load
    if (sessionLoading) {
      return;
    }

    // Nếu session load xong mà không có user, báo lỗi
    if (!sessionUser) {
      setError("Không thể tải thông tin. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // Gọi API
    ProfileService.getProfile() //
      .then((res) => {
        // API /me trả về { message: "...", data: { ... } }
        setProfileData(res.data.data); //
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError("Đã có lỗi xảy ra khi tải thông tin cá nhân.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionUser, sessionLoading]); // Chạy lại khi session thay đổi

  // === 3. THÊM TRẠNG THÁI LOADING ===
  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 p-6 transition-all duration-300 items-center justify-center">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="ml-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // === 4. THÊM TRẠNG THÁI LỖI ===
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50  dark:bg-gray-900">
        <div className="flex flex-1 p-6 transition-all duration-300 items-center justify-center">
          <AlertCircle size={32} className="text-red-500" />
          <p className="ml-2 text-red-600">
            {error || "Không thể tải dữ liệu."}
          </p>
        </div>
      </div>
    );
  }

  // === 5. HIỂN THỊ DỮ LIỆU ĐỘNG ===
  return (
    <div className="flex flex-col bg-gray-50  dark:bg-gray-900">
      <div className="flex">
        <main className={`flex-1 p-6 transition-all duration-300`}>
          <h1 className="text-2xl font-bold text-gray-900">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-500 mb-6">Thông tin người dùng</p>

          {}

          {/* Card 1: Card Header (Đã cập nhật) */}
          <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="bg-gray-100 rounded-full p-4">
              <UserCircle2 size={48} className="text-gray-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              {/* === DỮ LIỆU ĐỘNG === */}
              <h2 className="text-xl font-bold">{profileData.username}</h2>
              <p className="text-sm text-gray-500">Driver</p>
              <div className="flex justify-center md:justify-start gap-2 mt-2">
                {/* === DỮ LIỆU ĐỘNG === */}
                {profileData.vehicle_name && profileData.license_plate && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {profileData.vehicle_name} - {profileData.license_plate}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Hệ thống hoạt động
                </span>
              </div>
              {/* (Giữ nguyên điểm an toàn) */}
            </div>

            {/* === KHỐI NÚT ĐÃ THAY ĐỔI === */}
            <div className="flex-shrink-0 ml-auto flex flex-col gap-3 w-full md:w-auto">
              {/* Nút Chỉnh sửa */}
              <button
                onClick={() => router.push("/user/profile/edit")}
                className="w-full px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
              >
                <FileEdit size={16} />
                <span>Chỉnh sửa</span>
              </button>

              {/* Nút Đổi mật khẩu (MỚI) */}
              <button
                onClick={() => router.push("/user/change-password")}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Lock size={16} />
                <span>Đổi mật khẩu</span>
              </button>
            </div>
            {/* === KẾT THÚC KHỐI NÚT === */}
          </div>

          {/* Lưới chứa 2 card (Đã cập nhật) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
            {/* Card 2: Thông tin cá nhân (Đã cập nhật) */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>
              {/* === DỮ LIỆU ĐỘNG === */}
              <InfoItem icon={Mail} label="Email" value={profileData.email} />
              <InfoItem
                icon={Phone}
                label="Số điện thoại"
                value={profileData.phone}
              />
              <InfoItem
                icon={MapPin}
                label="Địa chỉ"
                value={profileData.address}
              />
              {/* (Trường này không có trong ProfileData, giữ nguyên) */}
              <InfoItem
                icon={Calendar}
                label="Ngày đăng ký"
                value="15 tháng 9, 2024"
              />
            </div>

            {/* Card 3: Thông tin xe & ADAS (Đã cập nhật) */}
            <div className="rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin xe & ADAS
              </h3>
              {/* === DỮ LIỆU ĐỘNG === */}
              <InfoItem
                icon={Car}
                label="Phương tiện"
                value={profileData.vehicle_name}
              />
              <InfoItem
                icon={RectangleHorizontal}
                label="Biển số"
                value={profileData.license_plate}
              />
              {/* (Các trường này không có trong ProfileData, giữ nguyên) */}
              <InfoItem
                icon={ShieldCheck}
                label="Phiên bản ADAS"
                value="ADAS v1.1.1"
              />
              <InfoItem
                icon={Calendar}
                label="Kích hoạt từ"
                value="15 tháng 9, 2024"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
