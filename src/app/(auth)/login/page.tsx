"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // === State ===
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // === Handler: submit login form ===
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Gọi API login tại đây
    console.log({
      emailOrPhone,
      password,
      rememberMe,
    });

    // Giả sử đăng nhập thành công
    router.push("/dashboard");
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
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                <strong>Đăng nhập</strong>
              </h3>

              {/* Email / Phone */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email hoặc Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center text-sm text-gray-600">
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
                className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Đăng nhập
              </Button>

              {/* Register */}
              <p className="mt-4 text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-blue-500 font-medium hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
