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
  Settings,
} from "lucide-react";

import FeatureCard from "./components/feature-card";
import InfoCard from "./components/info-card";
import SettingDC from "./components/setting_db";
import { useDrowsy } from "@/hooks/useDrowsy";
import { useCamera } from "@/hooks/useCamera";
import CameraLive from "../components/CameraLive";

export default function DashboardPage() {
  const [sleepAlert, setSleepAlert] = useState(false);
  const [objectDetect, setObjectDetect] = useState(false);
  const [signDetect, setSignDetect] = useState(false);
  const [laneMonitor, setLaneMonitor] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [darkMode, setDarkMode] = useState(false);

  const [showLocation, setShowLocation] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showTime, setShowTime] = useState(true);

  const [openSetting, setOpenSetting] = useState(false);

  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState("Đang tải...");
  const [temperature, setTemperature] = useState("...");
  const [time, setTime] = useState("--:--:--");

  const frontRef = useRef<HTMLVideoElement>(null!);
  const { camReady: frontReady, camError: frontError, openCamera: openFront, stopCamera: stopFront } = useCamera(frontRef);
  const { result, busy } = useDrowsy({ videoRef: frontRef, enabled: sleepAlert, intervalMs: 1200 });

  // --- Dark mode toàn cục ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // --- Cập nhật thời gian ---
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // --- Lấy vị trí & thời tiết ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        try {
          const apiKey = "YOUR_API_KEY";
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`);
          const data = await res.json();
          setWeather(data.weather?.[0]?.description ?? "--");
          setTemperature(`${data.main?.temp ?? "--"}°C`);
        } catch {
          setWeather("Lỗi tải thời tiết");
          setTemperature("--");
        }
      }, () => setLocation("Không lấy được vị trí"));
    }
  }, []);

  const danger = !!result?.data?.is_drowsy;
  const statusText = sleepAlert ? (result ? `${result.message} (EAR: ${result?.data?.eye_aspect_ratio ?? "-"})` : "Đang bật...") : "Đang tắt";

  const handleCameraToggle = () => {
    setCameraOn((prev) => {
      const newState = !prev;
      if (newState) openFront("webcam");
      else {
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-1">
        {/* --- Cột trái: Chức năng --- */}
        <div className="flex-1 space-y-6 m-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Chức năng</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={Eye} title="Cảnh báo buồn ngủ" status={statusText} toggle={sleepAlert} onToggle={() => setSleepAlert(v => !v)} />
            <FeatureCard icon={AlertTriangle} title="Phát hiện vật cản" status={objectDetect ? "Đang bật" : "Đang tắt"} toggle={objectDetect} onToggle={() => setObjectDetect(v => !v)} />
            <FeatureCard icon={TrafficCone} title="Nhận diện biển báo" status={signDetect ? "Đang bật" : "Đang tắt"} toggle={signDetect} onToggle={() => setSignDetect(v => !v)} />
            <FeatureCard icon={Route} title="Giám sát làn đường" status={laneMonitor ? "Đang bật" : "Đang tắt"} toggle={laneMonitor} onToggle={() => setLaneMonitor(v => !v)} />
          </div>

          {/* Nút điều khiển camera & âm thanh */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mt-4">
            <button className="px-6 py-2 rounded-lg bg-slate-600 text-white font-semibold shadow hover:bg-slate-700 transition" onClick={handleCameraToggle}>
              {frontReady || signDetect ? "Tắt camera" : "Mở camera"}
            </button>
            <button className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition" onClick={() => setSoundEnabled(v => !v)}>
              {soundEnabled ? "Bật âm thanh" : "Tắt âm thanh"}
            </button>
          </div>

          {/* Camera */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className={`h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden dark:bg-gray-800 ${danger ? "border-red-500" : ""}`}>
              <div className="flex items-center justify-between text-blue-500 font-medium p-2 border-b">
                <div className="flex items-center gap-2"><Camera className="w-5 h-5" /><span>Camera trước</span></div>
                {result && <span className="text-xs text-gray-400">{result.data?.latency_ms}ms</span>}
              </div>
              <div className="flex-1 bg-black flex items-center justify-center relative">
                <video ref={frontRef} className="w-full h-full object-contain" muted autoPlay playsInline />
                {!frontReady && <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Nhấn “Mở camera” để bật webcam laptop</div>}
              </div>
            </div>

            <div className="h-[480px] flex flex-col rounded-xl shadow-md border overflow-hidden dark:bg-gray-800">
              <div className="flex items-center gap-2 text-blue-500 font-medium p-2 border-b z-10 relative">
                <Camera className="w-5 h-5" />
                <span>Camera sau</span>
              </div>
              <div className="flex-1 bg-black relative">
                <CameraLive enabled={signDetect} startCamera={cameraOn} soundEnabled={soundEnabled} className="w-full h-full object-contain" />
                {!signDetect && <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Nhấn “Mở camera” để bật iVCam</div>}
              </div>
            </div>
          </div>
        </div>

        {/* --- Cột phải: Thông tin --- */}
        <div className="w-64 space-y-4 m-6 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Thông tin</h2>
            <button onClick={() => setOpenSetting(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings size={22} className="transition-colors hover:text-white" />
            </button>
          </div>
          {showLocation && <InfoCard icon={MapPin} label="Vị trí" value={location} />}
          {showWeather && <InfoCard icon={Sun} label="Thời tiết" value={weather} />}
          {showTemp && <InfoCard icon={Thermometer} label="Nhiệt độ" value={temperature} />}
          {showTime && <InfoCard icon={Clock} label="Thời gian" value={time} />}
        </div>
      </div>

      <SettingDC
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        volume={volume}
        setVolume={setVolume}
        showLocation={showLocation}
        setShowLocation={setShowLocation}
        showWeather={showWeather}
        setShowWeather={setShowWeather}
        showTemp={showTemp}
        setShowTemp={setShowTemp}
        showTime={showTime}
        setShowTime={setShowTime}
      />
    </div>
  );
}
