"use client";

import { useEffect, useState } from "react";
import { useAdasSettings } from "@/hooks/useAdasSettings";

export function useLocationWeather() {
  const { settings } = useAdasSettings();

  // Kiểm tra xem có cần chạy GPS không
  // Chỉ chạy nếu ít nhất 1 trong 2 tính năng cần GPS đang bật
  const needGPS = settings.display.showLocation || settings.display.showWeather;

  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState("Đang tải...");
  const [temperature, setTemperature] = useState("...");
  const [time, setTime] = useState("--:--:--");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // =====================
  //  ⏰ Đồng hồ realtime
  // =====================
  useEffect(() => {
    // Cập nhật ngay lập tức
    setTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =====================
  //  📍 Lấy vị trí + thời tiết (WeatherAPI)
  // =====================
  useEffect(() => {
    // Nếu cài đặt tắt cả Vị trí và Thời tiết -> Không làm gì cả (Tiết kiệm pin)
    if (!needGPS) {
      setLocation("Đã tắt GPS");
      setWeather("--");
      setTemperature("--");
      return;
    }

    if (!navigator.geolocation) {
      setLocation("Thiết bị không hỗ trợ GPS");
      return;
    }

    const geoSuccess = async (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setLatitude(lat);
      setLongitude(lon);

      try {
        // 1. Lấy địa chỉ nếu settings cho phép
        if (settings.display.showLocation) {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const geoData = await geoRes.json();
          const road = geoData.address?.road ?? "";
          const city =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.village ||
            "Không rõ";
          setLocation(`${road}, ${city}`);
        }

        // 2. Lấy thời tiết nếu settings cho phép
        if (settings.display.showWeather || settings.display.showTemperature) {
          const wRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
          );
          const wData = await wRes.json();

          setTemperature(`${wData.current_weather?.temperature ?? "--"}°C`);

          // Mã thời tiết -> Tiếng Việt
          const code = wData.current_weather?.weathercode;
          const weatherMap: Record<number, string> = {
            0: "Trời quang",
            1: "Hơi mây",
            2: "Nhiều mây",
            3: "U ám",
            45: "Sương mù",
            48: "Sương mù đóng băng",
            51: "Mưa phùn nhẹ",
            53: "Mưa phùn",
            55: "Mưa phùn dày",
            61: "Mưa nhẹ",
            63: "Mưa vừa",
            65: "Mưa to",
            71: "Tuyết nhẹ",
            73: "Tuyết vừa",
            75: "Tuyết dày",
            80: "Mưa rào nhẹ",
            81: "Mưa rào vừa",
            82: "Mưa rào lớn",
            95: "Dông",
            96: "Dông có mưa đá nhẹ",
            99: "Dông có mưa đá mạnh",
          };
          setWeather(weatherMap[code] ?? "Có mây");
        }
      } catch (err) {
        console.error(err);
        if (settings.display.showWeather) setWeather("Lỗi mạng");
      }
    };

    const geoError = () => {
      setLocation("Không lấy được vị trí");
    };

    const watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 10000,
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [
    needGPS,
    settings.display.showLocation,
    settings.display.showWeather,
    settings.display.showTemperature,
  ]);

  return { location, weather, temperature, time, latitude, longitude };
}
