"use client";

import { useState } from "react";

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
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          {/* Logo + tiêu đề */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[#113a5c] border border-[#80d4ff] flex items-center justify-center text-xs font-bold text-[#80d4ff]">
              L
            </div>
            <span className="text-lg font-semibold text-white">Dashboard</span>
          </div>

          {/* Nút icon 4 chấm */}
          <button className="rounded-lg border border-[#80d4ff] bg-[#113a5c] p-1.5 shadow-md hover:scale-105 transition">
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
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Khối Module */}
        <section className="rounded-2xl border-2 border-[#80d4ff] bg-[#113a5c] p-4">
          <h2 className="text-center text-2xl font-extrabold text-[#80d4ff]">
            Chức năng
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(modules).map(([key, value]) => (
              <div
                key={key}
                className="module-card rounded-2xl border border-[#80d4ff]/60 bg-[#113a5c] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
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
                    className="rounded-xl px-3 py-1.5 text-sm"
                    style={{
                      background: value ? "#0c527c" : "#0E6193",
                      color: "#fff",
                    }}
                  >
                    {value ? "Tắt" : "Bật"}
                  </button>
                </div>
                <div className="mt-3 text-sm flex items-center gap-2">
                  <span
                    className={`dot h-2 w-2 rounded-full ${
                      value ? "bg-green-500" : "bg-slate-400"
                    }`}
                  ></span>
                  <span
                    className={`status ${
                      value ? "text-green-400" : "text-[#b0d8ff]"
                    }`}
                  >
                    {value ? "Đang chạy" : "Chờ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nút bắt đầu ở giữa */}
        <div className="flex justify-center">
          <button
            className="rounded-xl px-6 py-2 text-base font-semibold"
            style={{ background: "#0E6193", color: "#fff" }}
          >
            Bắt đầu
          </button>
        </div>

        {/* Khối Camera gộp chia 2 cột */}
        <section className="rounded-2xl border-2 border-[#80d4ff] bg-[#113a5c] p-4 relative">
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CAM 1 */}
            <div className="rounded-2xl border border-[#80d4ff]/60 bg-[#113a5c] p-3">
              <h4 className="text-center font-medium mb-2 text-[#80d4ff]">
                CAM 1
              </h4>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#80d4ff]/30 bg-black/30"></div>
            </div>
            {/* CAM 2 */}
            <div className="rounded-2xl border border-[#80d4ff]/60 bg-[#113a5c] p-3">
              <h4 className="text-center font-medium mb-2 text-[#80d4ff]">
                CAM 2
              </h4>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#80d4ff]/30 bg-black/30"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-[#b0d8ff]">
        Prototype UI • © 2025
      </footer>
    </div>
  );
}
