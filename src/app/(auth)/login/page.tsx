"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User } from "lucide-react"; // Đã xóa Moon, Sun
import Link from "next/link";
import NotifyDialog from "@/components/NotifyDialog";
import FullScreenLoader from "@/helper/loader";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import { NotifyType } from "@/type/notify";
import Logo from "@/components/logo";
import { useSession } from "@/context/SessionContext";

type LoginMethod = "username" | "email";

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

export default function LoginPage() {
  const router = useRouter();
  const { showNotify, hideNotify, ...notifyProps } = useNotifyDialog();

  // === State ===
  const [method, setMethod] = useState<LoginMethod>("username");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithUsername, loginWithEmail } = useSession();

  // === Sync Dark Mode (Tự động nhận diện, không nút bấm) ===
  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleChangeMethod = (m: LoginMethod) => {
    setMethod(m);
    setPassword(""); // Reset mật khẩu khi chuyển tab
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      await showNotify({
        type: NotifyType.Warning,
        title: "Thiếu thông tin",
        message: "Vui lòng nhập mật khẩu.",
      });
      return;
    }

    setIsLoading(true);
    try {
      let res;

      if (method === "username") {
        if (!username) throw "Vui lòng nhập tên đăng nhập";
        res = await loginWithUsername(username, password);
      } else {
        if (!email) throw "Vui lòng nhập email";
        // Chỉ gửi Email + Password
        res = await loginWithEmail(email, password);
      }

      if(!res) {
        await showNotify({
        type: NotifyType.Error,
        title: "Đăng nhập thất bại",
        message: "Sai tài khoản hoặc mật khẩu",
      });
        return;
      }

      await showNotify({
        type: NotifyType.Success,
        title: "Xin chào",
        message: "Đăng nhập thành công!",
      });

      router.push("/dashboard");
    } catch (e: any) {
      const msg = getErrorMessage(e, "Sai tài khoản hoặc mật khẩu");
      await showNotify({
        type: NotifyType.Error,
        title: "Đăng nhập thất bại",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD] dark:bg-slate-900 transition-colors duration-300 relative">

      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300">
        {/* Left Banner */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#F6F9FD] dark:bg-slate-900 p-8 border-r border-gray-100 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <Logo width={20} height={20} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              ADAS
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Chào mừng bạn quay trở lại
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Đăng nhập
          </h3>

          <div className="flex border-b border-gray-200 dark:border-slate-600 mb-6">
            <button
              type="button"
              onClick={() => handleChangeMethod("username")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                method === "username"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} /> Email
              </div>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* INPUT USERNAME */}
            {method === "username" && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Tên đăng nhập
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập username"
                />
              </div>
            )}

            {/* INPUT EMAIL */}
            {method === "email" && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            )}

            {/* INPUT PASSWORD */}
            <div className="relative">
              <div className="flex justify-between mb-1">
                <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Mật khẩu
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md mt-4"
            >
              Đăng nhập
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>

      <NotifyDialog onClose={hideNotify} {...notifyProps} />
      <FullScreenLoader show={isLoading} message="Đang đăng nhập..." />
    </div>
  );
}
