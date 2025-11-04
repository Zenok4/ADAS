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

import FeatureCard from "./components/feature-card";
import InfoCard from "./components/info-card";
import { useSession } from "@/context/SessionContext";
import { loadToken } from "@/lib/tokenStorage";

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

  const token = loadToken();

  console.log({token});

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
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Sidebar + Content */}
      <div className="flex flex-1">

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
