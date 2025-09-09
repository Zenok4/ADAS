"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CamCard } from "./components/cam-comp";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  // State cho từng module
  const [modules, setModules] = useState({
    BUONNGU: false,
    BIENBAO: false,
    VATCAN: false,
    LANDUONG: false,
  });

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0a2a43] text-white relative">
      {/* Thanh tiêu đề */}
      <header className="sticky top-0 z-10 border-b border-[#80d4ff]/30 bg-[#0a2a43]/90 backdrop-blur">
        <div className="mx-auto max-w-md sm:max-w-4xl px-3 sm:px-4 h-12 flex items-center justify-between">
          {/* Logo + tiêu đề */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-[#113a5c] border border-[#80d4ff] flex items-center justify-center text-xs font-bold text-[#80d4ff]">

            </div>
            <span className="text-base sm:text-lg font-semibold text-white">
              Dashboard
            </span>
          </div>

          {/* Nút icon 4 chấm */}
          <button className="rounded-lg border border-[#80d4ff] bg-[#113a5c] p-1 shadow-md hover:scale-105 transition">
            <div className="grid grid-cols-2 gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[#80d4ff]"
                />
              ))}
            </div>
          </button>
        </div>
      </header>


      {/* Cột trung tâm */}
      <main className="mx-auto w-full max-w-md px-2 py-3 space-y-4 sm:px-4 sm:py-6">
        {/* Khối Module */}
        <section className="rounded-2xl border-2 border-[#80d4ff] bg-[#113a5c] p-3 sm:p-4">
          <h2 className="text-center text-xl sm:text-2xl font-extrabold text-[#80d4ff]">
            Chức năng
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(modules).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-[#80d4ff]/60 bg-[#113a5c] p-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-medium">
                    {key === "BUONNGU"
                      ? "Buồn ngủ"
                      : key === "BIENBAO"
                        ? "Biển báo"
                        : key === "VATCAN"
                          ? "Cảnh báo vật cản"
                          : "Làn đường"}
                  </h3>
                  <button
                    onClick={() => toggleModule(key as keyof typeof modules)}
                    className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold"
                    style={{
                      background: value ? "#0c527c" : "#0E6193",
                      color: "#fff",
                    }}
                  >
                    {value ? "Tắt" : "Bật"}
                  </button>
                </div>
                <div className="mt-2 text-xs sm:text-sm flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${value ? "bg-green-500" : "bg-slate-400"
                      }`}
                  />
                  <span
                    className={value ? "text-green-400" : "text-[#b0d8ff]"}
                  >
                    {value ? "Đang chạy" : "Chờ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nút bắt đầu */}
        <div className="flex justify-center">
          <button className="w-full sm:w-auto rounded-xl px-6 py-3 text-lg font-semibold bg-[#0E6193] text-white">
            Bắt đầu
          </button>
        </div>

        {/* Camera */}
        {/* Camera */}
        <section className="rounded-2xl border-2 border-[#80d4ff] bg-[#113a5c] p-3 sm:p-4">
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* CAM 1 */}
            <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d3a5a] overflow-hidden">
              <div className="text-center font-medium text-[#80d4ff] text-sm sm:text-base py-1 border-b border-[#80d4ff]/40">
                CAM 1
              </div>
              <div className="relative w-full h-52 sm:h-60 bg-black/30"></div>
            </div>
            {/* CAM 2 */}
            <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d3a5a] overflow-hidden">
              <div className="text-center font-medium text-[#80d4ff] text-sm sm:text-base py-1 border-b border-[#80d4ff]/40">
                CAM 2
              </div>
              <div className="relative w-full h-52 sm:h-60 bg-black/30"></div>
            </div>
          </div>
        </section>


      </main>


      <footer className="py-6 text-center text-xs text-[#b0d8ff]">

      </footer>
    </div>
  );
}
