"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle2, FileEdit, Loader2 } from "lucide-react";
import { SettingsLinkItem, SettingsDestructiveItem } from "./settings-item";

import { ProfileService, ProfileData } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";

// Container chung cho Section
const SettingsSection = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden mb-4">
    <div className="divide-y divide-gray-100 dark:divide-slate-800">
      {children}
    </div>
  </div>
);

// Component Profile Custom (Đã fix Dark Mode)
const ProfileInfoItem = () => {
  const router = useRouter();
  const { user } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      ProfileService.getProfile()
        .then((res) => setProfileData(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const displayData = profileData || {
    username: user?.username || "Người dùng",
    email: user?.email || "Chưa cập nhật",
    phone: "---",
  };

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm">
            {/* Avatar Placeholder */}
            <UserCircle2
              size={40}
              className="text-gray-400 dark:text-gray-300"
            />
          </div>
          <div>
            {loading ? (
              <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            ) : (
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {displayData.username}
              </h3>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {displayData.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              SĐT: {displayData.phone}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/user/profile")}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-slate-700 transition-colors"
          title="Chỉnh sửa thông tin"
        >
          <FileEdit size={18} />
        </button>
      </div>
    </div>
  );
};

export const GeneralSettings = () => {
  const router = useRouter();
  const { logout } = useSession();

  const handleLogout = async () => {
    // Logic logout cũ...
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      if (logout) await logout();
      router.push("/login");
    }
  };

  return (
    <div>
      <h3 className="px-1 mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Tài khoản
      </h3>

      <SettingsSection>
        {/* Profile Card được đặt trên cùng */}
        <ProfileInfoItem />

        {/* Các mục điều hướng */}
        <SettingsLinkItem
          title="Đổi mật khẩu"
          description="Cập nhật mật khẩu mới"
          buttonLabel="Thay đổi"
          onClick={() => router.push("/user/change-password")}
        />

        <SettingsDestructiveItem
          title="Đăng xuất"
          description="Thoát tài khoản khỏi thiết bị"
          buttonLabel="Đăng xuất"
          onClick={handleLogout}
        />
      </SettingsSection>
    </div>
  );
};
