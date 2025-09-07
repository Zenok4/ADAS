"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PhoneLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "forgot">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    // TODO: gọi API login
    alert(`Đăng nhập: ${phone} / ${password}`);
  };

  const onForgot = (e: FormEvent) => {
    e.preventDefault();
    // TODO: gọi API quên mật khẩu
    alert(`Yêu cầu reset gửi tới: ${phone}`);
  };

  const inputCls =
    "w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg" +
    " placeholder-blue-200 text-white focus:outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a2a43] px-4">
      <div className="w-full max-w-md bg-[#113a5c] border border-[#80d4ff] 
                      rounded-xl shadow-lg p-6 space-y-6">
        {step === "login" ? (
          <>
            <h2 className="text-center text-2xl font-bold text-[#80d4ff]">
              ĐĂNG NHẬP
            </h2>
            <form onSubmit={onLogin} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-white">Số điện thoại</label>
                <input
                  type="tel"
                  className={inputCls}
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col relative">
                <label className="mb-1 text-sm text-white">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className={inputCls}
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? (
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
            <h2 className="text-center text-2xl font-bold text-[#80d4ff]">
              QUÊN MẬT KHẨU
            </h2>
            <form onSubmit={onForgot} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-white">Số điện thoại</label>
                <input
                  type="tel"
                  className={inputCls}
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
    </div>
  );
}