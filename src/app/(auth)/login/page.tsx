// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at center, #17406a 0%, #0a2a43 100%)",
        color: "#ffffff",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <div className="flex flex-col items-center mt-9">
        {/* Logo */}
        <img
          src="https://img.icons8.com/fluency/96/steering-wheel.png"
          alt="logo"
          className="w-24 h-24 mb-8"
        />

        {/* Tiêu đề */}
        <h1 className="text-xl font-medium mb-8">ĐĂNG NHẬP</h1>

        {/* Nút Google */}
        <Link href="/oauth/google">
          <button
            className="w-[90vw] max-w-xs flex items-center justify-center bg-white text-gray-900
                       rounded-lg shadow-md px-4 py-3 mb-4 transition-colors hover:bg-gray-100"
          >
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google Logo"
              className="w-6 h-6 mr-3"
            />
            Tài khoản Google
          </button>
        </Link>

        {/* Nút Số điện thoại */}
        <Link href="/phone">
          <button
            className="w-[90vw] max-w-xs flex items-center justify-center bg-white text-gray-900
                       rounded-lg shadow-md px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <img
              src="https://img.icons8.com/fluency/48/phone.png"
              alt="Phone Icon"
              className="w-6 h-6 mr-3"
            />
            Số điện thoại
          </button>
        </Link>
      </div>
    </div>
  );
}