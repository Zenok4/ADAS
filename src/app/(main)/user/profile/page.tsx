"use client";

import { useRouter } from "next/navigation";
import {
  UserCircle2,
  FileEdit,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  RectangleHorizontal,
  ShieldCheck,
} from "lucide-react";

// Import Custom Hooks & Components đã tách
import { useProfile } from "@/hooks/useProfile";
import {
  Card,
  InfoRow,
  SectionTitle,
  PageLoader,
  ErrorView,
} from "./components/ProfileComponents";

export default function ProfilePage() {
  const router = useRouter();
  const { profileData, loading, error } = useProfile();

  // Xử lý Loading/Error ngay đầu
  if (loading) return <PageLoader />;
  if (error || !profileData)
    return <ErrorView message={error || "Lỗi không xác định"} />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý hồ sơ lái xe của bạn
          </p>
        </div>

        {/* --- SECTION 1: HEADER CARD (Avatar + Actions) --- */}
        <Card className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4">
            <UserCircle2
              size={48}
              className="text-gray-500 dark:text-gray-300"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {profileData.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Driver Account
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {profileData.vehicle_name && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {profileData.vehicle_name} - {profileData.license_plate}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Hệ thống hoạt động
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full md:w-auto gap-3">
            <ActionButton
              icon={FileEdit}
              label="Chỉnh sửa"
              onClick={() => router.push("/user/profile/edit")}
              variant="primary"
            />
            <ActionButton
              icon={Lock}
              label="Đổi mật khẩu"
              onClick={() => router.push("/user/change-password")}
              variant="secondary"
            />
          </div>
        </Card>

        {/* --- SECTION 2: DETAILS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1: Thông tin liên hệ */}
          <Card>
            <SectionTitle>Thông tin cá nhân</SectionTitle>
            <div className="space-y-5">
              <InfoRow icon={Mail} label="Email" value={profileData.email} />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={profileData.phone}
              />
              <InfoRow
                icon={MapPin}
                label="Địa chỉ"
                value={profileData.address}
              />
              <InfoRow
                icon={Calendar}
                label="Ngày tham gia"
                value="15/09/2024"
              />
            </div>
          </Card>

          {/* Cột 2: Thông tin xe */}
          <Card>
            <SectionTitle>Thông tin xe & ADAS</SectionTitle>
            <div className="space-y-5">
              <InfoRow
                icon={Car}
                label="Phương tiện"
                value={profileData.vehicle_name}
              />
              <InfoRow
                icon={RectangleHorizontal}
                label="Biển số"
                value={profileData.license_plate}
              />
              <InfoRow
                icon={ShieldCheck}
                label="Phiên bản ADAS"
                value="v1.1.1 (Stable)"
              />
              <InfoRow
                icon={Calendar}
                label="Kích hoạt từ"
                value="15/09/2024"
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Helper nhỏ cho Button để đỡ lặp code trong file chính
// Bạn có thể đưa cái này vào file Components luôn nếu muốn
const ActionButton = ({ icon: Icon, label, onClick, variant }: any) => {
  const baseStyle =
    "w-full px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors";
  const variants = {
    primary:
      "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]}`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
};
