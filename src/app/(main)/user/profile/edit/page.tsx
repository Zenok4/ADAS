// app/(main)/user/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  UserCircle2,
  Mail,
  Phone,
  MapPin,
  Car,
  RectangleHorizontal,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import Header và Sidebar
import { UserHeader } from "../../../../(main)/components/user-header";
import { UserSidebar } from "../../../../(main)/components/user-sidebar";

// Import service
import {
  ProfileService,
  ProfileUpdatePayload,
} from "@/services/profileService"; 

// Import Notify Dialog
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";

// Component con cho Input (Giữ nguyên)
const FormInputItem = ({
  icon: Icon,
  label,
  value,
  onChange,
  name,
  type = "text",
  placeholder,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  placeholder: string;
}) => (
  <div className="flex items-start gap-4">
    <Icon size={20} className="text-gray-400 mt-3 flex-shrink-0" />
    <div className="flex-1">
      <label htmlFor={name} className="text-sm text-gray-500">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full font-medium text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-1"
      />
    </div>
  </div>
);

export default function ProfileEditPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  // Khởi tạo Notify hook
  const {
    open,
    type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = useNotifyDialog();

  // State cho form
  const [formData, setFormData] = useState<ProfileUpdatePayload>({
    email: "",
    phone: "",
    address: "",
    vehicle_name: "",
    license_plate: "",
  });

  // State cho thông tin tĩnh
  const [staticInfo, setStaticInfo] = useState({
    username: "Đang tải...",
    role: "Driver",
    registrationDate: "Đang tải...",
  });

  // 1. Tải dữ liệu profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const response = await ProfileService.getProfile();

        // ===================================
        // == SỬA LỖI TẠI ĐÂY (DÒNG 114-123) ==
        // ===================================
        // `response.data` là ProfileResponse { message, data }
        const profileResponse = response.data;
        // `profileResponse.data` là ProfileData { email, phone, ... }
        const profileData = profileResponse.data; 

        setFormData({
          email: profileData.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          vehicle_name: profileData.vehicle_name || "",
          license_plate: profileData.license_plate || "",
        });

        setStaticInfo({
          username: profileData.username || "Không có tên",
          role: "Driver", 
          registrationDate: "N/A",
        });
      } catch (error) {
        console.error(error);
        showNotify({
          type: NotifyType.Error,
          title: "Lỗi tải dữ liệu",
          message: "Không thể tải thông tin cá nhân. Vui lòng thử tải lại trang.",
          primaryActionText: "OK",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Xử lý khi input thay đổi
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: ProfileUpdatePayload) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v)
    ) as ProfileUpdatePayload;

    try {
      await ProfileService.updateProfile(payload);
      
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Cập nhật thông tin thành công!",
        primaryActionText: "OK",
        onPrimaryAction: () => {
          router.push("/user/profile"); // Quay về trang xem profile
        }
      });

    } catch (error) {
      console.error(error);
      
      showNotify({
        type: NotifyType.Error,
        title: "Cập nhật thất bại",
        message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        primaryActionText: "Đã hiểu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="flex flex-1">
        <UserSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          <form onSubmit={handleSubmit}>
             {/* Header của trang */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chỉnh sửa thông tin
                </h1>
                <p className="text-gray-500">
                  Cập nhật thông tin cá nhân và xe của bạn
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/user/profile")} 
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                  <span>Hủy</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>

            {/* Hiển thị loading */}
            {isFetching ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={32} className="animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Card 1: Header */}
                <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto p-6 flex flex-col md:flex-row items-center gap-4">
                  <div className="bg-gray-100 rounded-full p-4">
                    <UserCircle2 size={48} className="text-gray-500" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold">
                      {staticInfo.username}
                    </h2>
                    <p className="text-sm text-gray-500">{staticInfo.role}</p>
                  </div>
                </div>

                {/* Lưới chứa 2 card thông tin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
                  {/* Card 2: Thông tin cá nhân */}
                  <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Thông tin cá nhân
                    </h3>
                    <FormInputItem
                      icon={Mail}
                      label="Email"
                      name="email"
                      value={formData.email!}
                      onChange={handleInputChange}
                      placeholder="vidu@gmail.com"
                    />
                    <FormInputItem
                      icon={Phone}
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone!}
                      onChange={handleInputChange}
                      placeholder="+84 123 456 789"
                    />
                    <FormInputItem
                      icon={MapPin}
                      label="Địa chỉ"
                      name="address"
                      value={formData.address!}
                      onChange={handleInputChange}
                      placeholder="Đà Nẵng, Việt Nam"
                    />
                  </div>

                  {/* Card 3: Thông tin xe */}
                  <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Thông tin xe & ADAS
                    </h3>
                    <FormInputItem
                      icon={Car}
                      label="Phương tiện"
                      name="vehicle_name"
                      value={formData.vehicle_name!}
                      onChange={handleInputChange}
                      placeholder="Honda City 2023"
                    />
                    <FormInputItem
                      icon={RectangleHorizontal}
                      label="Biển số"
                      name="license_plate"
                      value={formData.license_plate!}
                      onChange={handleInputChange}
                      placeholder="43E1-11111"
                    />
                  </div>
                </div>
              </>
            )}
          </form>
        </main>
      </div>

      {/* Render Notify Dialog */}
      <NotifyDialog
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
        onClose={hideNotify}
      />
    </div>
  );
}