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

// Component CameraLive
import CameraLive from "../components/CameraLive";

export default function DashboardPage() {
  // --- STATE CHỨC NĂNG ---
  const [sleepAlert, setSleepAlert] = useState(false);
  const [objectDetect, setObjectDetect] = useState(false);
  const [signDetect, setSignDetect] = useState(false);
  const [laneMonitor, setLaneMonitor] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  // --- STATE DỮ LIỆU ---
  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState("Đang tải...");
  const [temperature, setTemperature] = useState("...");
  const [time, setTime] = useState("--:--:--");

  // --- STATE CẤU HÌNH HIỂN THỊ (Mặc định hiện tất cả) ---
  const [displayConfig, setDisplayConfig] = useState({
    showLocation: true,
    showWeather: true,
    showTemperature: true,
    showTime: true,
  });

  // 🎥 Camera trước = webcam (Drowsiness)
  const frontRef = useRef<HTMLVideoElement>(null!);
  const {
    camReady: frontReady,
    camError: frontError,
    openCamera: openFront,
    stopCamera: stopFront,
  } = useCamera(frontRef);

  // AI buồn ngủ chạy trên camera trước
  const { result, busy } = useDrowsy({
    videoRef: frontRef,
    enabled: sleepAlert,
    intervalMs: 1200,
  });

  // =========================================================
  // 1. LOGIC ĐỌC CÀI ĐẶT TỪ LOCAL STORAGE
  // =========================================================
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("adas_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.display) {
            // Merge với mặc định để tránh lỗi nếu thiếu key
            setDisplayConfig((prev) => ({
              ...prev,
              ...parsed.display,
            }));
          }
        }
      } catch (e) {
        console.error("Lỗi đọc cấu hình hiển thị:", e);
      }
    };

    // Load ngay lần đầu
    loadSettings();

    // Lắng nghe sự kiện nếu settings thay đổi (từ trang Settings)
    window.addEventListener("adas_settings_updated", loadSettings);
    return () =>
      window.removeEventListener("adas_settings_updated", loadSettings);
  }, []);

  // =========================================================
  // 2. LOGIC CAMERA & AI (GIỮ NGUYÊN)
  // =========================================================

  // Tự động mở webcam khi bật Cảnh báo buồn ngủ
  useEffect(() => {
    if (sleepAlert && !frontReady) {
      openFront("webcam");
    }
  }, [sleepAlert, frontReady, openFront]);

  // Tự bật camera SAU khi bật nhận diện (Sign HOẶC Object)
  useEffect(() => {
    const needRearCam = signDetect || objectDetect;
    if (needRearCam && !cameraOn) {
      setCameraOn(true);
    } else if (!needRearCam && cameraOn && !sleepAlert && !laneMonitor) {
      setCameraOn(false);
    }
  }, [signDetect, objectDetect, sleepAlert, laneMonitor, cameraOn]);

  // Reset state khi tắt camera
  useEffect(() => {
    if (!cameraOn) {
      if (signDetect) setSignDetect(false);
      if (objectDetect) setObjectDetect(false);
    }
  }, [cameraOn]);

  // Đồng hồ realtime
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Lấy vị trí + thời tiết
  useEffect(() => {
    // Chỉ lấy dữ liệu nếu cấu hình cho phép hiển thị (tiết kiệm API)
    if (
      !displayConfig.showLocation &&
      !displayConfig.showWeather &&
      !displayConfig.showTemperature
    )
      return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

          if (displayConfig.showWeather || displayConfig.showTemperature) {
            try {
              const apiKey = "YOUR_API_KEY"; // Thay API Key của bạn
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
              );
              const data = await res.json();
              setWeather(data.weather?.[0]?.description ?? "--");
              setTemperature(`${data.main?.temp ?? "--"}°C`);
            } catch {
              setWeather("Lỗi tải");
              setTemperature("--");
            }
          }
        },
        () => setLocation("Không lấy được vị trí")
      );
    }
  }, [
    displayConfig.showLocation,
    displayConfig.showWeather,
    displayConfig.showTemperature,
  ]);

  // Xử lý hiển thị trạng thái Drowsy
  const danger = !!result?.data?.is_drowsy;
  const statusText = sleepAlert
    ? result
      ? `${result.message} (EAR: ${result?.data?.eye_aspect_ratio ?? "-"})`
      : "Đang bật..."
    : "Đang tắt";

  const badge = result
    ? result?.data?.is_drowsy
      ? { text: "Cảnh báo tài xế đang ngủ gật!", cls: "bg-red-600" }
      : { text: "Tài xế bình thường", cls: "bg-green-600" }
    : busy
    ? { text: "Đang xử lý...", cls: "bg-blue-600" }
    : null;

  const handleCameraToggle = async () => {
    setCameraOn((prev) => {
      const newState = !prev;
      if (newState) {
        openFront("webcam");
      } else {
        setSleepAlert(false);
        setSignDetect(false);
        setObjectDetect(false);
        setLaneMonitor(false);
        stopFront();
      }
      return newState;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {/* --- Cột trái: Chức năng --- */}
        <div className="flex-1 space-y-6 m-6">
          <h2 className="text-lg font-bold">Chức năng</h2>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={Eye}
              title="Cảnh báo buồn ngủ"
              status={statusText}
              toggle={sleepAlert}
              onToggle={() => setSleepAlert((v) => !v)}
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Phát hiện vật cản"
              status={objectDetect ? "Đang bật" : "Đang tắt"}
              toggle={objectDetect}
              onToggle={() => setObjectDetect((v) => !v)}
            />
            <FeatureCard
              icon={TrafficCone}
              title="Nhận diện biển báo"
              status={signDetect ? "Đang bật" : "Đang tắt"}
              toggle={signDetect}
              onToggle={() => setSignDetect((v) => !v)}
            />
            <FeatureCard
              icon={Route}
              title="Giám sát làn đường"
              status={laneMonitor ? "Đang bật" : "Đang tắt"}
              toggle={laneMonitor}
              onToggle={() => setLaneMonitor((v) => !v)}
            />
          </div>

          {/* Nút điều khiển */}
          <div className="flex gap-3 justify-center mt-4">
            <button
              className="px-6 py-2 rounded-lg bg-slate-600 text-white font-semibold shadow hover:bg-slate-700 transition"
              onClick={handleCameraToggle}
            >
              {frontReady || signDetect || objectDetect
                ? "Tắt camera"
                : "Mở camera"}
            </button>
          </div>

          {/* Grid Camera */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* 1. Camera trước */}
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
                    {result.data?.latency_ms}ms
                  </span>
                )}
              </div>

              <div className="flex-1 bg-black flex items-center justify-center relative">
                <video
                  ref={frontRef}
                  className="w-full h-full object-contain"
                  muted
                  autoPlay
                  playsInline
                />
                {!frontReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Nhấn “Mở camera” để bật webcam laptop
                    </span>
                  </div>
                )}
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
                      {typeof result.data?.eye_aspect_ratio === "number"
                        ? result.data?.eye_aspect_ratio.toFixed(2)
                        : "-"}
                    </div>
                  )}
                </div>
                {frontError && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-red-400 text-xs p-2">
                    {frontError}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Camera sau */}
            <div className="h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden relative">
              <div className="flex items-center gap-2 text-blue-500 font-medium p-2 border-b z-10 relative">
                <Camera className="w-5 h-5" />
                <span>Camera sau</span>
              </div>

              <div className="flex-1 bg-black relative">
                <CameraLive
                  enableSign={signDetect}
                  enableObject={objectDetect}
                  startCamera={cameraOn}
                  className="w-full h-full object-contain"
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Nhấn “Mở camera” để bật iVCam
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Cột phải: Thông tin (CẬP NHẬT THEO CẤU HÌNH) --- */}
        <div className="w-64 space-y-4 m-6 ml-0">
          <h2 className="text-lg font-bold">Thông tin</h2>

          {displayConfig.showLocation && (
            <InfoCard icon={MapPin} label="Vị trí" value={location} />
          )}

          {displayConfig.showWeather && (
            <InfoCard icon={Sun} label="Thời tiết" value={weather} />
          )}

          {displayConfig.showTemperature && (
            <InfoCard icon={Thermometer} label="Nhiệt độ" value={temperature} />
          )}

          {displayConfig.showTime && (
            <InfoCard icon={Clock} label="Thời gian" value={time} />
          )}

          {/* Nếu tắt hết thì hiển thị thông báo nhỏ để layout đỡ trống */}
          {!displayConfig.showLocation &&
            !displayConfig.showWeather &&
            !displayConfig.showTemperature &&
            !displayConfig.showTime && (
              <div className="text-sm text-gray-400 italic">
                Các widget đã được ẩn trong Cài đặt.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
