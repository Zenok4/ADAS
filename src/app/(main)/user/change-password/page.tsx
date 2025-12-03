"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./components/password-input";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { ProfileService } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";

// Component con hiển thị từng dòng yêu cầu bảo mật
const RequirementItem = ({
  isValid,
  text,
  isTouched,
}: {
  isValid: boolean;
  text: string;
  isTouched: boolean;
}) => {
  // Logic màu sắc:
  // - Chưa nhập gì (isTouched = false): Màu xám, icon tròn
  // - Đã nhập và Đúng (isValid = true): Màu xanh, icon Check
  // - Đã nhập và Sai (isValid = false): Màu đỏ, icon X

  let icon;
  let textColor;

  if (!isTouched) {
    textColor = "text-gray-400";
    icon = (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>
    );
  } else if (isValid) {
    textColor = "text-green-600";
    icon = (
      <svg
        className="w-4 h-4 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  } else {
    textColor = "text-red-500";
    icon = (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  }

  return (
    <li
      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${textColor}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{text}</span>
    </li>
  );
};

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

  const { user } = useSession();

  // === LOGIC KIỂM TRA REAL-TIME ===
  // Kiểm tra độ dài
  const isLengthValid = newPassword.length >= 8;

  // Kiểm tra độ phức tạp
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isComplexityValid =
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

  // Kiểm tra khác mật khẩu cũ
  const isDifferentFromOld =
    currentPassword && newPassword ? newPassword !== currentPassword : true;

  // Kiểm tra xem người dùng đã bắt đầu nhập password mới chưa
  const isNewPasswordTouched = newPassword.length > 0;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // === TÁI SỬ DỤNG LOGIC KIỂM TRA ===
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Vui lòng điền đầy đủ thông tin.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      }

      if (!isDifferentFromOld) {
        throw new Error("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      }

      if (!isLengthValid) {
        throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      }

      if (!isComplexityValid) {
        throw new Error(
          "Mật khẩu mới phải bao gồm: chữ hoa, chữ thường, số và ký tự đặc biệt."
        );
      }

      if (!user || !user.id) {
        throw new Error(
          "Không thể xác thực người dùng. Vui lòng đăng nhập lại."
        );
      }

      const payload = {
        old_password: currentPassword,
        new_password: newPassword,
      };

      await ProfileService.changePassword(user.id, payload);

      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message:
          "Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang cá nhân.",
        primaryActionText: "OK",
        onPrimaryAction: () => {
          hideNotify();
          router.push("/user/profile");
        },
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

      if (err.response) {
        const apiError = err.response.data;
        let serverMessage = "";

        if (apiError) {
          if (
            apiError.error &&
            typeof apiError.error === "object" &&
            apiError.error.message
          ) {
            serverMessage = apiError.error.message;
          } else if (apiError.message && typeof apiError.message === "string") {
            serverMessage = apiError.message;
          } else if (apiError.error && typeof apiError.error === "string") {
            serverMessage = apiError.error;
          }
        }
        if (serverMessage === "Old password is incorrect") {
          errorMessage = "Mật khẩu hiện tại không chính xác.";
        } else if (serverMessage) {
          errorMessage = serverMessage;
        } else if (err.response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ.";
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: errorMessage,
        primaryActionText: "Thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
        <p className="text-gray-500 mb-6">
          Cập nhật mật khẩu của bạn để bảo vệ tài khoản
        </p>

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

          {/* Security Tips - Đã sửa đổi */}
          <div className="p-6 bg-gray-50 border-t border-b border-gray-200 transition-colors">
            <h4 className="font-semibold text-gray-800 mb-3">
              Yêu cầu bảo mật mật khẩu
            </h4>
            <ul className="space-y-2">
              <RequirementItem
                isValid={isLengthValid}
                text="Sử dụng ít nhất 8 ký tự."
                isTouched={isNewPasswordTouched}
              />
              <RequirementItem
                isValid={isComplexityValid}
                text="Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt."
                isTouched={isNewPasswordTouched}
              />
              <RequirementItem
                isValid={isDifferentFromOld}
                text="Không trùng với mật khẩu hiện tại."
                isTouched={isNewPasswordTouched && currentPassword.length > 0}
              />
            </ul>
          </div>

          {/* Footer của Card */}
          <div className="p-6 flex items-center justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/user/profile")}
                className="px-5 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                // Disable nút submit nếu các điều kiện chưa thỏa mãn
                disabled={
                  isLoading ||
                  !isLengthValid ||
                  !isComplexityValid ||
                  !isDifferentFromOld ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotifyDialog
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
        onClose={hideNotify}
      />
    </main>
  );
}
