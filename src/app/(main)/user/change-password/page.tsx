"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { AuthService } from "@/services/authService";
import NotifyDialog from "@/components/NotifyDialog";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import { NotifyType } from "@/type/notify";
import FullScreenLoader from "@/helper/loader";

// === COMPONENT: Hiển thị từng dòng yêu cầu bảo mật ===
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

// === HELPER: XỬ LÝ LỖI API TRÁNH CRASH REACT ===
const getErrorMessage = (
  error: any,
  defaultMsg: string = "Đã có lỗi xảy ra"
): string => {
  if (error?.response?.data) {
    const apiError = error.response.data;

    // Ưu tiên lấy message từ backend
    if (apiError.error?.message) return apiError.error.message;
    if (apiError.message && typeof apiError.message === "string")
      return apiError.message;
    if (apiError.error && typeof apiError.error === "string")
      return apiError.error;

    // Nếu backend trả về "User not found" -> Dịch sang tiếng Việt
    const rawError = JSON.stringify(apiError.error || apiError);
    if (rawError.includes("User not found"))
      return "Email này chưa được đăng ký trong hệ thống.";

    return rawError;
  }
  return error.message || (typeof error === "string" ? error : defaultMsg);
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showNotify, hideNotify, ...notifyProps } = useNotifyDialog();

  // === State (CHỈ CÒN EMAIL) ===
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trạng thái xử lý
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // === Logic Validate Password (New UI) ===
  const isLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isComplexityValid =
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  // const isDifferentFromOld = ... (Không check được vì chưa login)
  const isNewPasswordTouched = password.length > 0;

  // === Handler: Gửi OTP (Chỉ Email) ===
  const handleSendOtp = async () => {
    if (!email.trim()) {
      showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập Email trước khi lấy mã.",
      });
      return;
    }

    setLoading(true);
    try {
      // Gọi API gửi OTP Email
      await AuthService.forgotPasswordEmailSendOtp(email);

      setIsOtpSent(true);
      showNotify({
        type: NotifyType.Success,
        title: "Đã gửi mã",
        message: `Mã OTP đã được gửi tới email ${email} của bạn.`,
      });
    } catch (error: any) {
      const msg = getErrorMessage(
        error,
        "Không tìm thấy tài khoản này trong hệ thống."
      );
      showNotify({
        type: NotifyType.Error,
        title: "Gửi thất bại",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // === Handler: Submit Reset Password ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Client
    if (!email || !otp || !password) {
      showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
      return;
    }

    if (password !== confirmPassword) {
      showNotify({
        type: NotifyType.Warning,
        title: "Lỗi mật khẩu",
        message: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    // Validate độ mạnh mật khẩu
    if (!isLengthValid || !isComplexityValid) {
      showNotify({
        type: NotifyType.Warning,
        title: "Mật khẩu yếu",
        message: "Mật khẩu chưa đáp ứng đủ yêu cầu bảo mật.",
      });
      return;
    }

    setLoading(true);

    try {
      // 2. Gọi API Reset Password (Email)
      await AuthService.forgotPasswordEmailReset(email, otp, password);

      // 3. Thành công -> Thông báo & Chuyển trang
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message:
          "Mật khẩu đã được đặt lại. Vui lòng đăng nhập với mật khẩu mới.",
        primaryActionText: "Về đăng nhập",
        onPrimaryAction: () => router.push("/login/username"),
      });
    } catch (error: any) {
      const msg = getErrorMessage(error, "Mã OTP không đúng hoặc đã hết hạn.");
      showNotify({
        type: NotifyType.Error,
        title: "Đặt lại thất bại",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#F6F9FD] p-8">
            <div className="flex flex-col items-center">
              <img
                src="https://img.icons8.com/fluency/96/steering-wheel.png"
                alt="logo"
                className="w-20 h-20 mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">ADAS</h2>
              <p className="text-sm text-gray-600 mt-1">
                Hệ thống hỗ trợ lái xe tiên tiến
              </p>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                <strong>Quên mật khẩu</strong>
              </h3>

              {/* Email Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  readOnly={isOtpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isOtpSent
                      ? "bg-gray-100 border-gray-200 text-gray-500"
                      : "border-gray-300"
                  }`}
                />
              </div>

              {/* OTP Input & Send Button */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nhập mã OTP
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1 text-xs font-semibold"
                  >
                    {loading ? "..." : isOtpSent ? "Gửi lại" : "Lấy mã"}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* === PHẦN YÊU CẦU BẢO MẬT (Đã thêm) === */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <h4 className="font-semibold text-xs text-gray-500 uppercase mb-2">
                  Yêu cầu bảo mật
                </h4>
                <ul className="space-y-1">
                  <RequirementItem
                    isValid={isLengthValid}
                    text="Sử dụng ít nhất 8 ký tự."
                    isTouched={isNewPasswordTouched}
                  />
                  <RequirementItem
                    isValid={isComplexityValid}
                    text="Kết hợp chữ hoa, thường, số và ký tự đặc biệt."
                    isTouched={isNewPasswordTouched}
                  />
                </ul>
              </div>
              {/* ======================================= */}

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Xác nhận lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {loading ? "Đang xử lý..." : "Tiếp tục"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <NotifyDialog onClose={hideNotify} {...notifyProps} />
      <FullScreenLoader show={loading} message="Đang xử lý..." />
    </div>
  );
}
