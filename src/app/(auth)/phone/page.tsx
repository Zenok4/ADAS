// src/app/(auth)/phone/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation";

export default function PhoneLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login"|"forgot">("login");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đăng nhập: ${phone} / ${password}`);
    // TODO: gọi API login…
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Yêu cầu reset gửi tới: ${phone}`);
    // TODO: xử lý quên mật khẩu…
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0a2a43", color: "#fff", fontFamily: "Roboto,Arial,sans-serif" }}
    >
      <div
        className="w-full max-w-md p-6 rounded-xl space-y-6"
        style={{ backgroundColor: "#113a5c", border: "1px solid #80d4ff" }}
      >
        {step === "login" ? (
          <>
            <h2 className="text-center text-2xl font-bold" style={{ color: "#80d4ff" }}>
              ĐĂNG NHẬP
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg placeholder:text-blue-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="mb-1 text-sm">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg placeholder:text-blue-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-200" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-200 hover:underline"
                  onClick={() => setStep("forgot")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button type="submit" variant="main" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl font-bold" style={{ color: "#80d4ff" }}>
              QUÊN MẬT KHẨU
            </h2>
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg placeholder:text-blue-200 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="main" className="w-full">
                Gửi yêu cầu
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-200 hover:underline"
                  onClick={() => setStep("login")}
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}