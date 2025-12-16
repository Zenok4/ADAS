"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/services/authService";
import NotifyDialog from "@/components/NotifyDialog";
import FullScreenLoader from "@/helper/loader";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import { NotifyType } from "@/type/notify";

// Loại bỏ "phone" khỏi type
type RegisterMethod = "username" | "email";

// === HELPER: XỬ LÝ LỖI API TRÁNH CRASH REACT ===
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

  return error.message || (typeof error === "string" ? error : defaultMsg);
};

export default function RegisterPage() {
  const router = useRouter();
  const { showNotify, hideNotify, ...notifyProps } = useNotifyDialog();

  // === State ===
  const [method, setMethod] = useState<RegisterMethod>("username");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // === Handlers ===

  const handleChangeMethod = (m: RegisterMethod) => {
    setMethod(m);
    setOtpSent(false);
    setOtpCode("");
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!email) {
      await showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập Email để nhận mã.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // === SỬA ĐỔI QUAN TRỌNG: Gọi API đăng ký ===
      await AuthService.requestRegisterOtp(email);

      setOtpSent(true);
      await showNotify({
        type: NotifyType.Success,
        title: "Đã gửi mã",
        message: "Mã OTP đã được gửi đến email của bạn.",
      });
    } catch (e: any) {
      const msg = getErrorMessage(e, "Không thể gửi OTP lúc này.");
      await showNotify({
        type: NotifyType.Error,
        title: "Lỗi gửi mã",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      await showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập mật khẩu.",
      });
      return;
    }
    if (password !== confirmPassword) {
      await showNotify({
        type: NotifyType.Warning,
        title: "Lỗi mật khẩu",
        message: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    if (method === "email" && !otpCode) {
      await showNotify({
        type: NotifyType.Warning,
        title: "Thiếu OTP",
        message: "Vui lòng nhập mã xác thực đã gửi về email.",
      });
      return;
    }

    setIsLoading(true);
    try {
      let res;

      if (method === "username") {
        if (!username) {
          throw {
            response: { data: { error: "Vui lòng nhập tên đăng nhập" } },
          };
        }
        res = await AuthService.registerWithUsername(username, password);
      } else {
        if (!email) {
          throw { response: { data: { error: "Vui lòng nhập email" } } };
        }
        res = await AuthService.registerWithEmail(email, password, otpCode);
      }

      await showNotify({
        type: NotifyType.Success,
        title: "Đăng ký thành công",
        message: "Tài khoản đã được tạo. Vui lòng đăng nhập.",
        primaryActionText: "Đăng nhập ngay",
        onPrimaryAction: () => router.push("/login/username"),
      });
    } catch (e: any) {
      const msg = getErrorMessage(e, "Đăng ký thất bại.");
      await showNotify({ type: NotifyType.Error, title: "Lỗi", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Banner */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#F6F9FD] p-8 border-r border-gray-100">
          <div className="flex flex-col items-center">
            <img
              src="https://img.icons8.com/fluency/96/steering-wheel.png"
              alt="logo"
              className="w-20 h-20 mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">ADAS</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Hệ thống hỗ trợ lái xe tiên tiến
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Đăng ký tài khoản
          </h3>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => handleChangeMethod("username")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                method === "username"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={16} /> Username
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleChangeMethod("email")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                method === "email"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} /> Email
              </div>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Input: Username */}
            {method === "username" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">
                  Tên đăng nhập
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập username"
                />
              </div>
            )}

            {/* Input: Email + OTP */}
            {method === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">
                    Địa chỉ Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      disabled={otpSent}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading || otpSent}
                      onClick={handleSendOtp}
                      className="whitespace-nowrap h-[46px]"
                    >
                      {otpSent ? "Đã gửi" : "Lấy mã"}
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                      Mã xác thực (OTP)
                    </label>
                    <input
                      className="w-full bg-blue-50 rounded-lg border border-blue-200 px-3 py-3 text-center tracking-widest font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1 font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu bảo mật"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1 font-medium">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={handleToggleConfirmPassword}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md mt-4"
            >
              Đăng ký
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login/username"
                className="text-blue-600 font-semibold hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </div>
      </div>

      <NotifyDialog onClose={hideNotify} {...notifyProps} />
      <FullScreenLoader show={isLoading} message="Đang xử lý..." />
    </div>
  );
}
