"use client";
import { useState, useEffect, useRef } from "react";
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

import FeatureCard from "./components/feature-card";
import InfoCard from "./components/info-card";

// Hooks AI + Camera
import { useDrowsy } from "@/hooks/useDrowsy";
import { useCamera } from "@/hooks/useCamera";

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

  // 🎥 Setup camera & AI buồn ngủ
  const videoRef = useRef<HTMLVideoElement>(null!);
  const { camReady, camError, openCamera, stopCamera } = useCamera(videoRef);
  const { result, busy } = useDrowsy({
    videoRef,
    enabled: sleepAlert,
    intervalMs: 1200,
  });

  // Đồng hồ realtime
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

  //  Trạng thái AI
  const danger = !!result?.data?.is_drowsy;
  const statusText = sleepAlert
    ? result
      ? `${result.message} (EAR: ${result?.data?.eye_aspect_ratio ?? "-"})`
      : "Đang bật..."
    : "Đang tắt";

  //  Huy hiệu hiển thị trên video
  const badge = result
    ? result?.data.is_drowsy
      ? { text: "Cảnh báo tài xế đang ngủ gật!", cls: "bg-red-600" }
      : { text: "Tài xế bình thường", cls: "bg-green-600" }
    : busy
    ? { text: "Đang xử lý...", cls: "bg-blue-600" }
    : null;

  // Nút control
  const handleToggleSleep = () => setSleepAlert((prev) => !prev);
  const handleCameraToggle = () => (camReady ? stopCamera() : openCamera());

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
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
                status={statusText}
                toggle={sleepAlert}
                onToggle={handleToggleSleep}
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

            {/* Nút điều khiển */}
            <div className="flex gap-3 justify-center mt-4">
              <button
                className={`px-6 py-2 rounded-lg font-semibold text-white shadow transition ${
                  sleepAlert
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={handleToggleSleep}
              >
                {sleepAlert ? "Dừng cảnh báo" : "Bắt đầu cảnh báo"}
              </button>

              <button
                className="px-6 py-2 rounded-lg bg-slate-600 text-white font-semibold shadow hover:bg-slate-700 transition"
                onClick={handleCameraToggle}
              >
                {camReady ? "Tắt camera" : "Mở camera"}
              </button>
            </div>

            {/* Camera */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Camera trước */}
              <div
                className={`h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden ${
                  danger ? "border-red-500" : ""
                }`}
              >
                <div className="flex items-center justify-between text-blue-500 font-medium p-2 border-b">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    <span>Camera trước</span>
                  </div>
                  {result && (
                    <span className="text-xs text-gray-400">
                      {result.data.latency_ms}ms
                    </span>
                  )}
                </div>

                <div className="flex-1 bg-black flex items-center justify-center relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    muted
                    autoPlay
                    playsInline
                  />

                  {!camReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        Nhấn “Mở camera” để khởi động IVCam
                      </span>
                    </div>
                  )}

                  {/*  Huy hiệu cảnh báo / xử lý */}
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                    {badge && (
                      <div
                        className={`text-xs text-white px-2 py-1 rounded shadow ${badge.cls}`}
                      >
                        {badge.text}
                      </div>
                    )}

                    {result && (
                      <div className="text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded">
                        EAR:{" "}
                        {typeof result.data.eye_aspect_ratio === "number"
                          ? result.data.eye_aspect_ratio.toFixed(2)
                          : "-"}
                        {typeof result.data.latency_ms === "number"
                          ? ` • ${result.data.latency_ms}ms`
                          : ""}
                      </div>
                    )}
                  </div>

                  {camError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-red-400 text-xs p-2">
                      {camError}
                    </div>
                  )}
                </div>
              </div>

              {/* Camera sau (placeholder) */}
              <div className="h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden">
                <div className="flex items-center gap-2 text-blue-500 font-medium p-2 border-b">
                  <Camera className="w-5 h-5" />
                  <span>Camera sau</span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-sm">API Camera sau</span>
                </div>
              </div>
            </div>
          </div>

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
    </div>
  );
}
