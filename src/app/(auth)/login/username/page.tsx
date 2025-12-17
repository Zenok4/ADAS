"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import FullScreenLoader from "@/helper/loader";
import { HttpCode } from "@/type/http-codes";
import Logo from "@/components/logo";

const LoginWithUserNamePage = () => {
  const { loginWithUsername } = useSession();
  const notifyDialog = useNotifyDialog();
  const router = useRouter();

  // === State ===
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // === Deconstruct dialog ====
  const {
    open,
    type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = notifyDialog;

  // === Handler: submit login form ===
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName) {
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

    try {
      setIsLoading(true);
      const res: any = await loginWithUsername(userName, password);

      if (res != null && res?.code === HttpCode.unauthorized) {
        await showNotify({
          message: "Tên đăng nhập hoặc mật khẩu không đúng.",
          type: NotifyType.Error,
          title: "Lỗi Đăng Nhập",
        });
        setIsLoading(false);
        return;
      }

      if (!res) throw new Error();

      router.push("/dashboard");
    } catch (err) {
      await showNotify({
        message: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
        type: NotifyType.Error,
        title: "Lỗi Đăng Nhập",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD] dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 dark:border-gray-200">
        <div className="flex flex-col md:flex-row">
          {/* Left */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#F6F9FD] dark:bg-slate-900 p-8">
            <div className="flex flex-col items-center">
              <Logo width={20} height={20} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                ADAS
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Hệ thống hỗ trợ lái xe tiên tiến
              </p>
            </div>
          </div>

          {/* Right (Form) */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                <strong>Đăng nhập</strong>
              </h3>

              {/* Username */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tên Đăng Nhập
                </label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600
                    bg-white dark:bg-slate-700
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400
                    px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600
                      bg-white dark:bg-slate-700
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-400
                      px-3 py-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  href="/ForgotPass"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Đăng nhập
              </Button>

              {/* Register */}
              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Đăng ký ngay
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

      <FullScreenLoader show={isLoading} message="Đang đăng nhập..." />
    </div>
  );
};

export default LoginWithUserNamePage;
