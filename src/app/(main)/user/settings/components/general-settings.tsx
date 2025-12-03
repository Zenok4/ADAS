"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle2, FileEdit, Loader2 } from "lucide-react";
import {
  SettingsToggleItem,
  SettingsSelectItem,
  SettingsLinkItem,
  SettingsDestructiveItem,
} from "./settings-item";

import { ProfileService, ProfileData } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";
import { AuthService } from "@/services/authService";

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

const ProfileInfoSection = () => {
  const router = useRouter();
  const { user } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleGoToProfile = () => {
    router.push("/user/profile");
  };

  useEffect(() => {
    if (user) {
      ProfileService.getProfile()
        .then((res) => {
          setProfileData(res.data.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  const displayData = profileData || {
    username: user?.username || "Người dùng",
    email: user?.email || "Chưa cập nhật",
    phone: "Chưa cập nhật",
  };

  return (
    <div className="p-6">
      {/* Hàng 1: Header */}
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
          <span>Truy cập</span>
        </button>
      </div>

      {/* Hàng 2: Nội dung dynamic */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="bg-gray-100 rounded-full p-4">
          <UserCircle2 size={48} className="text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-1 w-full">
          <div>
            <p className="text-sm text-gray-500">Tên hiển thị</p>
            <p className="font-semibold text-gray-900">
              {displayData.username}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="font-semibold text-gray-900">
              {displayData.phone || "---"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">{displayData.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GeneralSettings = () => {
  const router = useRouter();
  const { logout } = useSession();
  const [autoSave, setAutoSave] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [units, setUnits] = useState("kmh");

  const handleChangePassword = () => {
    router.push("/user/change-password");
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      try {
        if (logout) await logout();
        router.push("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <div>
      {/* Nhóm 1: Tài khoản */}
      <SettingsSection
        title="Tài khoản"
        description="Quản lý thông tin cá nhân, bảo mật và đăng xuất"
      >
        {/* Mục 1: Thông tin cá nhân (Dynamic) */}
        <ProfileInfoSection />

        {/* Mục 2: Đổi mật khẩu */}
        <SettingsLinkItem
          title="Đổi mật khẩu"
          description="Bảo mật tài khoản của bạn bằng mật khẩu mạnh"
          buttonLabel="Thay đổi"
          onClick={handleChangePassword}
        />

        {/* Mục 3: Đăng xuất */}
        <SettingsDestructiveItem
          title="Đăng xuất"
          description="Đăng xuất khỏi tài khoản của bạn trên thiết bị này"
          buttonLabel="Logout"
          onClick={handleLogout}
        />
      </SettingsSection>
    </div>
  );
};
