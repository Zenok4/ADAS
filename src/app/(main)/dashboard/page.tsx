"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  Volume2,
  VolumeX,
} from "lucide-react";

import FeatureCard from "./components/feature-card";
import InfoCard from "./components/info-card";
import CameraLive from "../components/CameraLive";

// Hooks
import { useDrowsy } from "@/hooks/useDrowsy";
import { useCamera } from "@/hooks/useCamera";
import { useLocationWeather } from "@/hooks/useLocationWeather";

export default function DashboardPage() {
  // 1. Quản lý State
  const [features, setFeatures] = useState({
    sleepAlert: false,
    objectDetect: false,
    signDetect: false,
    laneMonitor: false,
  });

  const [rearCameraOn, setRearCameraOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const { location, weather, temperature, time } = useLocationWeather();

  // 2. Setup Refs & Hooks
  const frontRef = useRef<HTMLVideoElement>(null);

  // Hook Camera Trước
  const {
    camReady: frontReady,
    camError: frontError,
    openCamera: openFront,
    stopCamera: stopFront,
  } = useCamera(frontRef as React.RefObject<HTMLVideoElement>);

  // Hook AI Buồn ngủ
  const { result: drowsyResult, busy: drowsyBusy } = useDrowsy({
    videoRef: frontRef as React.RefObject<HTMLVideoElement>,
    enabled: features.sleepAlert,
    intervalMs: 1200,
    soundEnabled: isSoundOn,
  });

  // 3. Logic Tự động bật Camera khi chọn tính năng
  useEffect(() => {
    if (features.sleepAlert && !frontReady) {
      openFront("webcam" as any);
    }
  }, [features.sleepAlert, frontReady, openFront]);

  useEffect(() => {
    if (
      (features.signDetect || features.laneMonitor || features.objectDetect) &&
      !rearCameraOn
    ) {
      setRearCameraOn(true);
    }
  }, [
    features.signDetect,
    features.laneMonitor,
    features.objectDetect,
    rearCameraOn,
  ]);

  // 4. Handlers
  const toggleFeature = useCallback((key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // --- SỬA LOGIC: MỞ/TẮT ĐỒNG THỜI CẢ 2 CAMERA ---
  const handleMainButton = () => {
    const isAnyOn = frontReady || rearCameraOn;

    if (isAnyOn) {
      // TẮT HẾT
      stopFront();
      setRearCameraOn(false);

      // Reset các tính năng về tắt
      setFeatures({
        sleepAlert: false,
        objectDetect: false,
        signDetect: false,
        laneMonitor: false,
      });
    } else {
      // BẬT CẢ HAI
      openFront("webcam" as any); // Bật cam trước
      setRearCameraOn(true); // Bật cam sau
    }
  };
  // ------------------------------------------------

  const drowsyDanger = !!drowsyResult?.data?.is_drowsy;
  const drowsyBadge = drowsyResult
    ? drowsyResult.data.is_drowsy
      ? { text: "CẢNH BÁO: TÀI XẾ NGỦ GẬT!", cls: "bg-red-600 animate-pulse" }
      : { text: "Tài xế tỉnh táo", cls: "bg-green-600" }
    : drowsyBusy
    ? { text: "Đang xử lý...", cls: "bg-blue-600" }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* --- CỘT TRÁI --- */}
        <div className="flex-1 space-y-6 m-4 lg:m-6">
          <h2 className="text-lg font-bold text-gray-800">
            Bảng điều khiển ADAS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={Eye}
              title="Cảnh báo buồn ngủ"
              status={features.sleepAlert ? "Đang giám sát" : "Đang tắt"}
              toggle={features.sleepAlert}
              onToggle={() => toggleFeature("sleepAlert")}
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Phát hiện vật cản"
              status={features.objectDetect ? "Đang bật" : "Đang tắt"}
              toggle={features.objectDetect}
              onToggle={() => toggleFeature("objectDetect")}
            />
            <FeatureCard
              icon={TrafficCone}
              title="Nhận diện biển báo"
              status={features.signDetect ? "Đang bật" : "Đang tắt"}
              toggle={features.signDetect}
              onToggle={() => toggleFeature("signDetect")}
            />
            <FeatureCard
              icon={Route}
              title="Giám sát làn đường"
              status={features.laneMonitor ? "Đang bật" : "Đang tắt"}
              toggle={features.laneMonitor}
              onToggle={() => toggleFeature("laneMonitor")}
            />
          </div>

          {/* Cụm nút điều khiển */}
          <div className="flex justify-center items-center gap-3 mt-6">
            {/* Nút Master Camera */}
            <button
              className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 text-white ${
                frontReady || rearCameraOn
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-700 hover:bg-slate-800"
              }`}
              onClick={handleMainButton}
            >
              <Camera className="w-5 h-5" />
              {frontReady || rearCameraOn ? "Tắt camera" : "Mở camera"}
            </button>

            {/* Nút Âm thanh (Giữ nguyên UI cũ) */}
            <button
              className={`p-3 rounded-lg border shadow-sm transition-all flex items-center justify-center ${
                isSoundOn
                  ? "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                  : "bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300"
              }`}
              onClick={() => setIsSoundOn(!isSoundOn)}
              title={
                isSoundOn ? "Tắt âm thanh cảnh báo" : "Bật âm thanh cảnh báo"
              }
            >
              {isSoundOn ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Camera Trước */}
            <div
              className={`h-[360px] md:h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden bg-white ${
                drowsyDanger ? "border-red-500 ring-2 ring-red-500" : ""
              }`}
            >
              <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Eye className="w-5 h-5" />
                  <span>Camera tài xế</span>
                </div>
                {drowsyResult && (
                  <span className="text-xs text-gray-500">
                    {drowsyResult.data?.latency_ms}ms
                  </span>
                )}
              </div>

              <div className="flex-1 bg-black flex items-center justify-center relative">
                <video
                  ref={frontRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  muted
                  autoPlay
                  playsInline
                />

                <div className="absolute top-3 right-3">
                  {drowsyBadge && (
                    <div
                      className={`text-xs text-white px-3 py-1.5 rounded-full shadow font-medium ${drowsyBadge.cls}`}
                    >
                      {drowsyBadge.text}
                    </div>
                  )}
                </div>

                {!frontReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-sm">Nhấn "Mở camera" để bắt đầu</span>
                  </div>
                )}
                {frontError && (
                  <div className="absolute bottom-0 w-full bg-red-600 text-white text-xs p-1 text-center">
                    {frontError}
                  </div>
                )}
              </div>
            </div>

            {/* Camera Sau */}
            <div className="h-[360px] md:h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden bg-white">
              <div className="flex items-center gap-2 text-blue-700 font-semibold p-3 border-b bg-gray-50">
                <Route className="w-5 h-5" />
                <span>Camera hành trình</span>
              </div>

              <div className="flex-1 bg-black relative">
                {/* --- SỬA ĐOẠN NÀY --- */}
                <CameraLive
                  startCamera={rearCameraOn}
                  enableSign={features.signDetect}
                  enableLane={features.laneMonitor}
                  enableObject={features.objectDetect} // <--- Thêm dòng này
                  soundEnabled={isSoundOn}
                  className="w-full h-full"
                />
                {/* --------------------- */}

                {!rearCameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100/10">
                    <span className="text-sm">Camera chưa bật</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI --- */}
        <div className="w-full lg:w-72 bg-white border-l p-6 space-y-4">
          <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">
            Thông tin hành trình
          </h3>
          <InfoCard icon={MapPin} label="Vị trí" value={location} />
          <InfoCard icon={Sun} label="Thời tiết" value={weather} />
          <InfoCard icon={Thermometer} label="Nhiệt độ" value={temperature} />
          <InfoCard icon={Clock} label="Thời gian" value={time} />
        </div>
      </div>
    </div>
  );
}
