"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/services/authService";
import NotifyDialog from "@/components/NotifyDialog";
import FullScreenLoader from "@/helper/loader";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import { NotifyType } from "@/type/notify";

export default function RegisterPage() {
  const router = useRouter();
  const notifyDialog = useNotifyDialog();

  // === State ===
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // === Deconstruct dialog ====
  const {
    open: open,
    type: type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = notifyDialog;

  // === Handler: toggle visibility ===
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // === Handler: submit form ===
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      await showNotify({
        message: "Vui lòng nhập tên đăng nhập.",
        type: NotifyType.Warning,
        title: "Thiếu trường cần thiết",
      });
      return;
    }

    if (!password) {
      await showNotify({
        message: "Vui lòng nhập mật khẩu.",
        type: NotifyType.Warning,
        title: "Thiếu trường cần thiết",
      });
      return;
    }

    if (password !== confirmPassword) {
      await showNotify({
        message: "Mật khẩu xác nhận không khớp.",
        type: NotifyType.Warning,
        title: "Lỗi xác nhận mật khẩu",
      });
      return;
    }

    setIsLoading(true);

    const res = await AuthService.registerWithUsername(username, password);

    if(res != null && res?.data.success === false){
      setIsLoading(false);
      await showNotify({
        message: "Đăng ký không thành công. Hãy thử lại sau.",
        type: NotifyType.Error,
        title: "Lỗi Đăng Ký",
      });
      return;
    }

    await showNotify({
      message: "Đăng ký thành công!",
      type: NotifyType.Success,
      title: "Thành Công",
      primaryActionText: "Đăng nhập ngay!",
      onPrimaryAction: () => {
        router.push("/login/username");
      },
    });

    setIsLoading(false);

    // Giả sử đăng ký thành công
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left */}
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

          {/* Right (Form) */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
            <form onSubmit={handleRegister} className="w-full space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                <strong>Đăng ký</strong>
              </h3>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Submit */}
              <Button
                type="submit"
                className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Đăng ký
              </Button>

              {/* Back to login */}
              <p className="mt-4 text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login/username"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <NotifyDialog
        open={open}
        onClose={hideNotify}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
      />

      <FullScreenLoader show={isLoading} message="Đang đăng ký..." />
    </div>
  );
}
