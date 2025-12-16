"use client";

import { useEffect, useState } from "react";

export function useLocationWeather() {
  const [location, setLocation] = useState("Đang lấy vị trí...");
  const [weather, setWeather] = useState("Đang tải...");
  const [temperature, setTemperature] = useState("...");
  const [time, setTime] = useState("--:--:--");

  // =====================
  //  ⏰ Đồng hồ realtime
  // =====================
  useEffect(() => {
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
    if (!navigator.geolocation) {
      setLocation("Thiết bị không hỗ trợ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // --------- Lấy địa chỉ (Nominatim) ---------
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

          // --------- Lấy thời tiết (Open-Meteo FREE, không cần API key) ---------
          const wRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
          );

          const wData = await wRes.json();

          setTemperature(`${wData.current_weather?.temperature ?? "--"}°C`);

          // Mã thời tiết → mô tả tiếng Việt
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

          setWeather(weatherMap[code] ?? "Không rõ");
        } catch (err) {
          console.error(err);
          setWeather("Lỗi lấy thời tiết");
          setTemperature("--");
        }
      },

      () => setLocation("Không lấy được vị trí")
    );
  }, []);

  return { location, weather, temperature, time };
}
