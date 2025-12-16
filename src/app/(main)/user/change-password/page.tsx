"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./components/password-input"; // Đảm bảo đường dẫn đúng
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { ProfileService } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";
import { UserData } from "@/services/type/user.type";

// === COMPONENTS CON ===
const RequirementItem = ({
  isValid,
  text,
  isTouched,
}: {
  isValid: boolean;
  text: string;
  isTouched: boolean;
}) => {
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

// === HELPER: XỬ LÝ LỖI API ===
const getErrorMessage = (
  error: any,
  defaultMsg: string = "Đã có lỗi xảy ra"
): string => {
  if (error?.response?.data) {
    const apiError = error.response.data;
    if (apiError.error?.message) return apiError.error.message;
    if (apiError.message && typeof apiError.message === "string")
      return apiError.message;
    if (apiError.error && typeof apiError.error === "string")
      return apiError.error;
    return JSON.stringify(apiError.error || apiError);
  }
  return error.message || defaultMsg;
};

// === MAIN COMPONENT ===
export default function ChangePasswordPage() {
  const router = useRouter();
  const { user: sessionUser } = useSession();

  const user = sessionUser as unknown as UserData;

  // === State Form ===
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Đã bỏ state otpChannel vì mặc định là email

  // === State UI ===
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // === Notify Dialog ===
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

  // === LOGIC VALIDATION ===
  const isLengthValid = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isComplexityValid =
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  const isDifferentFromOld =
    currentPassword && newPassword ? newPassword !== currentPassword : true;
  const isNewPasswordTouched = newPassword.length > 0;

  // === HANDLER: GỬI OTP (CHỈ EMAIL) ===
  const handleSendOtp = async () => {
    if (!user?.email) {
      showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message:
          "Tài khoản của bạn chưa cập nhật Email. Vui lòng cập nhật hồ sơ trước.",
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      // Mặc định gửi 'email'
      await ProfileService.requestChangePasswordOtp("email");
      setOtpSent(true);
      showNotify({
        type: NotifyType.Success,
        title: "Đã gửi mã",
        message: `Mã OTP đã được gửi đến Email: ${user.email}`,
      });
    } catch (error: any) {
      const msg = getErrorMessage(error, "Không thể gửi OTP lúc này.");
      showNotify({ type: NotifyType.Error, title: "Lỗi gửi mã", message: msg });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // === HANDLER: SUBMIT ===
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!currentPassword || !newPassword || !confirmPassword)
        throw new Error("Vui lòng điền đầy đủ thông tin.");
      if (newPassword !== confirmPassword)
        throw new Error("Mật khẩu mới và xác nhận không khớp.");
      if (!isDifferentFromOld)
        throw new Error("Mật khẩu mới không được trùng với mật khẩu cũ.");
      if (!isLengthValid)
        throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      if (!isComplexityValid) throw new Error("Mật khẩu mới chưa đủ mạnh.");
      if (!otpCode || otpCode.length < 6)
        throw new Error("Vui lòng nhập mã OTP hợp lệ.");
      if (!user || !user.id) throw new Error("Vui lòng đăng nhập lại.");

      const payload = {
        old_password: currentPassword,
        new_password: newPassword,
        otp_code: otpCode,
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

      // Reset
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setOtpSent(false);
    } catch (err: any) {
      let msg = getErrorMessage(err);
      if (msg === "Old password is incorrect")
        msg = "Mật khẩu hiện tại không chính xác.";
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: msg,
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

            {/* OTP Section (Đã sửa giao diện chỉ hiện Email) */}
            <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã xác thực sẽ được gửi đến Email:
                </label>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="font-medium">
                    {user?.email || "Đang tải..."}
                  </span>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập mã xác thực (OTP)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center tracking-widest font-bold text-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || otpSent}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors min-w-[100px] ${
                    otpSent
                      ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                      : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  {isSendingOtp
                    ? "Đang gửi..."
                    : otpSent
                    ? "Gửi lại mã"
                    : "Lấy mã"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Mã OTP có hiệu lực trong 5 phút.
              </p>
            </div>
          </div>

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
                className="px-5 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !isLengthValid ||
                  !isComplexityValid ||
                  !isDifferentFromOld ||
                  !newPassword ||
                  !confirmPassword ||
                  !otpCode
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
