"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  FileEdit,
  KeyRound, // Icon cho mật khẩu
} from "lucide-react";
import {
  SettingsToggleItem,
  SettingsSelectItem,
  SettingsLinkItem, // Dùng cho nút "Đổi mật khẩu"
  SettingsDestructiveItem, // Dùng cho nút "Logout"
} from "./settings-item";

// Component khung (Giữ nguyên)
const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <div className="divide-y divide-gray-200">{children}</div>
  </div>
);

// Component tùy chỉnh cho Thông tin cá nhân (dựa trên ảnh)
const ProfileInfoSection = () => {
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push("/main/user/profile");
  };

  return (
    <div className="p-6">
      {/* Hàng 1: Header (Giống trong ảnh) */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserCircle2 size={20} className="text-blue-600" />
          </div>
          <span className="font-medium text-gray-800">Thông tin cá nhân</span>
        </div>
        <button
          onClick={handleGoToProfile}
          className="flex-shrink-0 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <FileEdit size={16} />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      {/* Hàng 2: Nội dung (Giống trong ảnh) */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="bg-gray-100 rounded-full p-4">
          <UserCircle2 size={48} className="text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-1">
          <div>
            <p className="text-sm text-gray-500">Họ và tên</p>
            <p className="font-semibold text-gray-900">Lê Văn A</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="font-semibold text-gray-900">0123456789</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">levana@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FILE CHÍNH ĐÃ CẬP NHẬT ---
export const GeneralSettings = () => {
  const router = useRouter();
  const [autoSave, setAutoSave] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [units, setUnits] = useState("kmh");

  const handleChangePassword = () => {
    router.push("/user/change-password");
  };

  const handleLogout = () => {
    // Xử lý logic logout ở đây
    console.log("Đăng xuất...");
  };

  return (
    <div>
      {/* Nhóm 1: Tài khoản */}
      <SettingsSection
        title="Tài khoản"
        description="Quản lý thông tin cá nhân, bảo mật và đăng xuất"
      >
        {/* Mục 1: Thông tin cá nhân (Layout mới theo ảnh) */}
        <ProfileInfoSection />

        {/* Mục 2: Đổi mật khẩu (Mục mới) */}
        <SettingsLinkItem
          title="Đổi mật khẩu"
          description="Bảo mật tài khoản của bạn bằng mật khẩu mạnh"
          buttonLabel="Thay đổi"
          onClick={handleChangePassword}
        />

        {/* Mục 3: Đăng xuất (Giữ nguyên) */}
        <SettingsDestructiveItem
          title="Đăng xuất"
          description="Đăng xuất khỏi tài khoản của bạn trên thiết bị này"
          buttonLabel="Logout"
          onClick={handleLogout}
        />
      </SettingsSection>

      {/* Nhóm 2: Hệ thống (Giữ nguyên) */}
      <SettingsSection
        title="Hệ thống & Dữ liệu"
        description="Tùy chỉnh các cài đặt chung của hệ thống"
      >
        <SettingsToggleItem
          title="Sao lưu tự động"
          description="Tự động sao lưu cài đặt và dữ liệu mỗi ngày"
          toggled={autoSave}
          onToggle={setAutoSave}
        />
        <SettingsSelectItem
          title="Đơn vị đo"
          description="Chọn đơn vị đo tốc độ và khoảng cách"
          value={units}
          onChange={setUnits}
          options={[
            { value: "kmh", label: "Kilômét (km/h)" },
            { value: "mph", label: "Dặm (mph)" },
          ]}
        />
        <SettingsToggleItem
          title="Chế độ bảo trì"
          description="Tạm dừng tất cả cảnh báo để bảo trì hệ thống"
          toggled={maintenanceMode}
          onToggle={setMaintenanceMode}
        />
      </SettingsSection>
    </div>
  );
};