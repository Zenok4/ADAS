// src/app/(info)/gioi-thieu/page.tsx
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Giới thiệu ứng dụng ADAS",
};

export default function Page() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0a2a43", color: "#eaf6fb" }}
    >
      <div
        className="w-full max-w-xs mx-auto rounded-2xl shadow-lg"
        style={{
          backgroundColor: "#163a5f",
          border: "1px solid #b0d8ff",
          padding: "32px 24px 24px",
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-4"
          style={{ color: "#80d4ff", fontSize: "2rem", letterSpacing: "1px" }}
        >
          Giới thiệu ứng dụng ADAS
        </h1>

        <p
          className="mb-7 text-justify leading-relaxed"
          style={{ fontSize: "1.08rem", lineHeight: 1.7 }}
        >
          Ứng dụng ADAS hỗ trợ tài xế lái xe an toàn với các tính năng cảnh báo
          giao thông thông minh, nhận diện biển báo, cảnh báo buồn ngủ và nhiều
          tiện ích khác.
        </p>

        <Link href="/login">
          <button
            className="w-full rounded-md font-medium transition-transform duration-200"
            style={{
              backgroundColor: "#005c99",
              color: "#ffffff",
              padding: "12px 0",
            }}
          >
            Đăng nhập & sử dụng ngay
          </button>
        </Link>
      </div>
    </main>
  );
}