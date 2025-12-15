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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showNotify, hideNotify, ...notifyProps } = useNotifyDialog();

  // === State ===
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trạng thái xử lý
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // === Helper: Xác định loại input (Email hay Phone) ===
  const getInputType = (input: string): "email" | "phone" => {
    return input.includes("@") ? "email" : "phone";
  };

  // === Handler: Gửi OTP ===
  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập Email hoặc Số điện thoại trước khi lấy mã.",
      });
      return;
    }

    setLoading(true);
    const type = getInputType(emailOrPhone);

    try {
      if (type === "email") {
        await AuthService.forgotPasswordEmailSendOtp(emailOrPhone);
      } else {
        await AuthService.forgotPasswordPhoneSendOtp(emailOrPhone);
      }

      setIsOtpSent(true);
      showNotify({
        type: NotifyType.Success,
        title: "Đã gửi mã",
        message: `Mã OTP đã được gửi tới ${
          type === "email" ? "email" : "số điện thoại"
        } của bạn.`,
      });
    } catch (error: any) {
      showNotify({
        type: NotifyType.Error,
        title: "Gửi thất bại",
        message:
          error?.response?.data?.error ||
          "Không tìm thấy tài khoản này trong hệ thống.",
      });
    } finally {
      setLoading(false);
    }
  };

  // === Handler: Submit Reset Password ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Client
    if (!emailOrPhone || !otp || !password) {
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

    setLoading(true);
    const type = getInputType(emailOrPhone);

    try {
      // 2. Gọi API Reset Password tương ứng
      if (type === "email") {
        await AuthService.forgotPasswordEmailReset(emailOrPhone, otp, password);
      } else {
        await AuthService.forgotPasswordPhoneReset(emailOrPhone, otp, password);
      }

      // 3. Thành công -> Thông báo & Chuyển trang
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message:
          "Mật khẩu đã được đặt lại. Vui lòng đăng nhập với mật khẩu mới.",
        primaryActionText: "Về đăng nhập",
        onPrimaryAction: () => router.push("/login"),
      });
    } catch (error: any) {
      showNotify({
        type: NotifyType.Error,
        title: "Đặt lại thất bại",
        message:
          error?.response?.data?.error || "Mã OTP không đúng hoặc đã hết hạn.",
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

              {/* Email / Phone Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email hoặc số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={emailOrPhone}
                  readOnly={isOtpSent}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
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
                    disabled={loading || !emailOrPhone}
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

      {/* SỬA LỖI Ở ĐÂY: Xóa 'open={notifyProps.open}' */}
      <NotifyDialog onClose={hideNotify} {...notifyProps} />
      <FullScreenLoader show={loading} message="Đang xử lý..." />
    </div>
  );
}
