// src/app/(auth)/login/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Điều hướng tới endpoint OAuth Google
    router.push("/oauth/google");
  };
  const handlePhoneLogin = () => {
    // Điều hướng tới trang đăng nhập bằng số điện thoại
    router.push("/phone");
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at center, #17406a 0%, #0a2a43 100%)",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      {/* Logo */}
      <img
        src="https://img.icons8.com/fluency/96/steering-wheel.png"
        alt="logo"
        className="w-24 h-24 mb-8"
      />

      {/* Tiêu đề */}
      <h1 className="text-xl font-medium text-white mb-8">ĐĂNG NHẬP</h1>

      {/* Nút Google */}
      <Button
        variant="default"
        size="default"
        className="w-[90vw] max-w-xs flex items-center justify-center bg-white text-blue-500 mb-4"
        onClick={handleGoogleLogin}
      >
        <img
          src="https://img.icons8.com/color/48/000000/google-logo.png"
          alt="Google Logo"
          className="w-6 h-6 mr-3"
        />
        Tài khoản Google
      </Button>

      {/* Nút Số điện thoại */}
      <Button
        variant="default"
        size="default"
        className="w-[90vw] max-w-xs flex items-center justify-center bg-white text-blue-500"
        onClick={handlePhoneLogin}
      >
        <img
          src="https://img.icons8.com/fluency/48/phone.png"
          alt="Phone Icon"
          className="w-6 h-6 mr-3"
        />
        Số điện thoại
      </Button>
    </main>
  );
}