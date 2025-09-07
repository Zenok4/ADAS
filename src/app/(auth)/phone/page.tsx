// src/app/(auth)/phone/page.tsx
"use client";

import { useState } from "react";

export default function PhoneLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API login
    alert(`Đăng nhập: ${phone} / ${password}`);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0a2a43" }}
    >
      <div
        className="w-full max-w-md p-6 rounded-xl"
        style={{
          backgroundColor: "#113a5c",
          border: "1px solid #80d4ff",
        }}
      >
        {/* Tiêu đề */}
        <h2 className="text-center text-2xl font-bold mb-6" style={{ color: "#80d4ff" }}>
          ĐĂNG NHẬP
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Số điện thoại */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-white">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg text-white placeholder:text-blue-200 focus:outline-none"
            />
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-sm text-white">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-[#80d4ff] rounded-lg text-white placeholder:text-blue-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 
                             5 2.239 5 5-2.239 5-5 5z" />
                    <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7.633 0-11-7-11-7a18.45 18.45 0 012.33-3.94M1 1l22 22" />
                    <path d="M9.88 9.88a3 3 0 104.24 4.24" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Quên mật khẩu */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-200 hover:underline"
              onClick={() => alert("Chuyển sang form Quên mật khẩu")}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white"
            style={{ backgroundColor: "#0369a1" }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </main>
  );
}