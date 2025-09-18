"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ emailOrPhone, username, password, confirm });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FD]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#F6F9FD] p-8">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <img
                  src="https://img.icons8.com/fluency/96/steering-wheel.png"
                  alt="logo"
                  className="w-20 h-20"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">ADAS</h2>
              <p className="text-sm text-gray-600 mt-1">
                Hệ thống hỗ trợ lái xe tiên tiến
              </p>
            </div>
          </div>

          {/* Right side (Form) */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
            <div className="w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  <strong>Đăng ký</strong>
                </h3>

                {/* Email */}
                <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Email hoặc Số điện thoại
                </label>
                <div className="relative">
                    {/*<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />*/}
                    <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>
                </div>

                {/* Username */}
                <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Tên đăng nhập
                </label>
                <div className="relative">
                    {/*<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />*/}
                    <input
                    type="text"
                    placeholder="Nhập tên đăng nhập của bạn"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                </div>

                {/* Password */}
                <div>
                <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                </div>

                {/* Confirm Password */}
                {/* Confirm password */}
                <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Nhập lại mật khẩu
                </label>
                <div className="relative">
                    <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  <Link href="/login/web" className="text-blue-500 font-medium hover:underline">
                    Đăng nhập ngay
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
