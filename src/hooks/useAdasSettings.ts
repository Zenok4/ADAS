"use client";

import { useState, useEffect } from "react";

export interface AdasSettings {
  alert: {
    volume: number;
    frequency: "high" | "medium" | "low";
  };
  display: {
    theme: string;
    showWeather: boolean;
    showTime: boolean;
    showLocation: boolean;
    showTemperature: boolean;
    showOverlay: boolean;
  };
}

const DEFAULT_SETTINGS: AdasSettings = {
  alert: { volume: 80, frequency: "medium" },
  display: {
    theme: "system",
    showWeather: true,
    showTime: true,
    showLocation: true,
    showTemperature: true,
    showOverlay: true,
  },
};

export const useAdasSettings = () => {
  const [settings, setSettings] = useState<AdasSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem("adas_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          // Merge sâu để đảm bảo không lỗi nếu thiếu key con
          alert: { ...prev.alert, ...(parsed.alert || {}) },
          display: { ...prev.display, ...(parsed.display || {}) },
        }));
      }
    } catch (e) {
      console.warn("Không đọc được cấu hình ADAS, dùng mặc định.");
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    // 1. Load ngay khi mount
    loadSettings();

    // 2. Lắng nghe sự kiện custom từ trang Settings
    window.addEventListener("adas_settings_updated", loadSettings);

    // 3. Lắng nghe sự kiện storage (nếu mở nhiều tab)
    window.addEventListener("storage", loadSettings);

    return () => {
      window.removeEventListener("adas_settings_updated", loadSettings);
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  return { settings, isLoaded };
};
