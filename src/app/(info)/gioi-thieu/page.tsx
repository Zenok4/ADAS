// src/app/(info)/gioi-thieu/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GioiThieuPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 bg-[#0a2a43] text-[#eaf6fb]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
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
          className="text-center font-bold mb-4 text-[#80d4ff]"
          style={{ fontSize: "2rem", letterSpacing: "1px" }}
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

        <Button
          variant="main"
          className="w-full py-3"
          onClick={() => router.push("/login")}
        >
          Đăng nhập & sử dụng ngay
        </Button>
      </div>
    </main>
  );
}