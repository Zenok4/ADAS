"use client";

import { useState } from "react";

// (Giả sử) Import layout chung của bạn
import { UserHeader } from "../../../(main)/components/user-header";
import { UserSidebar } from "../../../(main)/components/user-sidebar";

// Import component ô nhập mật khẩu
import { PasswordInput } from "./components/password-input";

// === IMPORTS MỚI (TỪ FILE BẠN CUNG CẤP) ===
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { ProfileService } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";

// {* THAY ĐỔI: Đã xoá component 'AlertMessage' vì không cần nữa *}

export default function ChangePasswordPage() {
  const [collapsed, setCollapsed] = useState(false);

  // State cho các ô mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho việc gọi API
  const [isLoading, setIsLoading] = useState(false);

  // {* THAY ĐỔI: Xoá state 'error' và 'success' *}
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  // {* THAY ĐỔI: Thêm hook NotifyDialog *}
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

  // (Giả sử) Lấy user ID từ Context
  const { user } = useSession(); 

  /**
   * Xử lý khi nhấn nút Đổi mật khẩu
   */
  const handleSubmit = async () => {
    // 1. Reset state
    // {* THAY ĐỔI: Xoá 'setError(null)' và 'setSuccess(null)' *}
    setIsLoading(true);

    try {
      // 2. Validate phía frontend
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Vui lòng điền đầy đủ thông tin.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      }
      if (!user || !user.id) {
        throw new Error("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      }

      // 3. Chuẩn bị payload
      const payload = {
        old_password: currentPassword,
        new_password: newPassword,
      };

      // 4. Gọi API
      await ProfileService.changePassword(user.id, payload);

      // 5. {* THAY ĐỔI: Xử lý thành công bằng NotifyDialog *}
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đổi mật khẩu thành công!",
        primaryActionText: "OK",
      });
      
      // Xóa nội dung các ô
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err: any) {
      // 6. {* THAY ĐỔI: Xử lý lỗi bằng NotifyDialog *}
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      // Lỗi trả về từ API (ví dụ: mật khẩu cũ sai)
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        // Lỗi validate (ví dụ: mật khẩu không khớp)
        errorMessage = err.message;
      }
      
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: errorMessage,
        primaryActionText: "Thử lại",
      });

    } finally {
      // 7. Dừng loading
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* (Giả sử) Header */}
      <UserHeader />

      {/* (Giả sử) Sidebar + Content */}
      <div className="flex flex-1">
        <UserSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* Main Content */}
        <main
          className={`flex-1 p-8 pt-20 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* Div căn giữa chung */}
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
            <p className="text-gray-500 mb-6">
              Cập nhật mật khẩu của bạn để bảo vệ tài khoản
            </p>

            {/* Card chính */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Form Fields */}
              <div className="p-6 space-y-6">
                <PasswordInput
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <PasswordInput
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <PasswordInput
                  label="Xác nhận mật khẩu mới"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Security Tips */}
              <div className="p-6 bg-gray-50 border-t border-b border-gray-200">
                <h4 className="font-semibold text-gray-800">Lưu ý bảo mật</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Sử dụng ít nhất 8 ký tự.</li>
                  <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
                </ul>
              </div>

              {/* {* THAY ĐỔI: Footer của Card *}
              /* Xóa vùng hiển thị lỗi/thành công
              /* Căn chỉnh các nút sang bên phải 'justify-end'
              */}
              <div className="p-6 flex items-center justify-end">
                {/* Vùng nút (bên phải) */}
                <div className="flex gap-3">
                  <button 
                    className="px-5 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Kết thúc div bọc căn giữa */}
          
        </main>
      </div> {/* Đóng thẻ <div className="flex flex-1"> */}

      {/* Thêm NotifyDialog component */}
      <NotifyDialog
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
        onClose={hideNotify}
      />
    </div> /* Đóng thẻ <div className="min-h-screen..."> */
  );
}