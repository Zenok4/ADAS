"use client";
import { useState, useEffect } from "react";
import {
  Eye,
  AlertTriangle,
  TrafficCone,
  Route,
  MapPin,
  Sun,
  Thermometer,
  Clock,
  Camera,
} from "lucide-react";

<<<<<<< HEAD
import FeatureCard from "./components/feature-card";
import InfoCard from "./components/info-card";
import {UserHeader} from "./components/user-header";
import { UserSidebar } from "./components/user-sidebar";
=======
import { useState } from "react";
>>>>>>> origin/huy

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle trạng thái bật/tắt của các tính năng
  const [sleepAlert, setSleepAlert] = useState(false);
  const [objectDetect, setObjectDetect] = useState(false);
  const [signDetect, setSignDetect] = useState(false);
  const [laneMonitor, setLaneMonitor] = useState(false);

  // State cho dữ liệu API
  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState("Đang tải...");
  const [temperature, setTemperature] = useState("...");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Lấy thời gian realtime
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lấy vị trí + thời tiết từ API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

          try {
            const apiKey = "YOUR_API_KEY"; // 👉 thay bằng key thật
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
            );
            const data = await res.json();
            setWeather(data.weather[0].description);
            setTemperature(`${data.main.temp}°C`);
          } catch (err) {
            console.error(err);
            setWeather("Lỗi tải thời tiết");
            setTemperature("--");
          }
        },
        () => {
          setLocation("Không lấy được vị trí");
        }
      );
    }
  }, []);

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <UserHeader />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <UserSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

        {/* Main Content */}
        <main
          className={`flex-1 p-6 flex gap-6 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* --- Cột trái: Chức năng --- */}
          <div className="flex-1 space-y-6">
            <h2 className="text-lg font-bold">Chức năng</h2>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={Eye}
                title="Cảnh báo buồn ngủ"
                status={sleepAlert ? "Đang bật" : "Đang tắt"}
                toggle={sleepAlert}
                onToggle={() => setSleepAlert((prev) => !prev)}
              />
              <FeatureCard
                icon={AlertTriangle}
                title="Phát hiện vật cản"
                status={objectDetect ? "Đang bật" : "Đang tắt"}
                toggle={objectDetect}
                onToggle={() => setObjectDetect((prev) => !prev)}
              />
              <FeatureCard
                icon={TrafficCone}
                title="Nhận diện biển báo"
                status={signDetect ? "Đang bật" : "Đang tắt"}
                toggle={signDetect}
                onToggle={() => setSignDetect((prev) => !prev)}
              />
              <FeatureCard
                icon={Route}
                title="Giám sát làn đường"
                status={laneMonitor ? "Đang bật" : "Đang tắt"}
                toggle={laneMonitor}
                onToggle={() => setLaneMonitor((prev) => !prev)}
              />
            </div>

            <div className="flex justify-center mt-2">
              <button className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition">
                Bắt đầu
              </button>
            </div>

            {/* Camera */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Camera trước */}
              <div className="h-60 flex flex-col rounded-xl shadow-md border overflow-hidden">
                <div className="flex items-center gap-2 text-blue-500 font-medium p-2 border-b">
                  <Camera className="w-5 h-5" />
                  <span>Camera trước</span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-sm">API Camera trước</span>
                </div>
              </div>

              {/* Camera sau */}
              <div className="h-60 flex flex-col rounded-xl shadow-md border overflow-hidden">
                <div className="flex items-center gap-2 text-blue-500 font-medium p-2 border-b">
                  <Camera className="w-5 h-5" />
                  <span>Camera sau</span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-sm">API Camera sau</span>
                </div>
              </div>
=======
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
>>>>>>> origin/huy
            </div>
          </div>

<<<<<<< HEAD
          {/* --- Cột phải: Thông tin từ API --- */}
          <div className="w-64 space-y-4">
            <h2 className="text-lg font-bold">Thông tin</h2>
            <InfoCard icon={MapPin} label="Vị trí" value={location} />
            <InfoCard icon={Sun} label="Thời tiết" value={weather} />
            <InfoCard icon={Thermometer} label="Nhiệt độ" value={temperature} />
            <InfoCard icon={Clock} label="Thời gian" value={time} />
          </div>
        </main>
      </div>
=======
      <footer className="py-6 text-center text-xs text-[#b0d8ff]">
        Prototype UI • © 2025
      </footer>
>>>>>>> origin/huy
    </div>
  );
}
