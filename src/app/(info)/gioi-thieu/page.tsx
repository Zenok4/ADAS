"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GioiThieuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a2a43] text-[#eaf6fb] px-4">
      <div className="w-full max-w-xs bg-[#163a5f] border border-[#b0d8ff] rounded-2xl shadow-lg p-8">
        <h1 className="text-center text-3xl font-bold text-[#80d4ff] mb-4 tracking-wide">
          Giới thiệu ứng dụng ADAS
        </h1>
        <p className="mb-6 text-justify leading-relaxed text-base">
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
    </div>
  );
}