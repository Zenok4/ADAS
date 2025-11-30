"use client";

import { Dispatch, SetStateAction } from "react";

interface SettingDCProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;

  soundEnabled: boolean;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;

  showLocation: boolean;
  setShowLocation: Dispatch<SetStateAction<boolean>>;
  showWeather: boolean;
  setShowWeather: Dispatch<SetStateAction<boolean>>;
  showTemp: boolean;
  setShowTemp: Dispatch<SetStateAction<boolean>>;
  showTime: boolean;
  setShowTime: Dispatch<SetStateAction<boolean>>;
}

const SettingDC = ({
  open,
  onClose,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  volume,
  setVolume,
  showLocation,
  setShowLocation,
  showWeather,
  setShowWeather,
  showTemp,
  setShowTemp,
  showTime,
  setShowTime,
}: SettingDCProps) => {
  if (!open) return null;

  const alwaysOn = ["Hiển thị Vị trí", "Hiển thị Thời tiết", "Hiển thị Nhiệt độ", "Hiển thị Thời gian"];

  const renderToggle = (label: string, value: boolean, setValue: Dispatch<SetStateAction<boolean>>) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-700 dark:text-gray-200">{label}</span>
      <label className="relative inline-block w-12 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => setValue(e.target.checked)}
          className="absolute opacity-0 w-0 h-0"
          disabled={alwaysOn.includes(label)}
        />
        <span
          className={`absolute inset-0 rounded-full transition-colors duration-200 ${
            value ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
              value ? "translate-x-6" : ""
            }`}
          />
        </span>
      </label>
    </div>
  );

  return (
    <div className="absolute top-16 right-0 w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-xl p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Cài đặt</h3>
        <button
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {renderToggle("Hiển thị Vị trí", showLocation, setShowLocation)}
      {renderToggle("Hiển thị Thời tiết", showWeather, setShowWeather)}
      {renderToggle("Hiển thị Nhiệt độ", showTemp, setShowTemp)}
      {renderToggle("Hiển thị Thời gian", showTime, setShowTime)}
      {renderToggle("Bật âm thanh", soundEnabled, setSoundEnabled)}
      {renderToggle("Màu tối", darkMode, setDarkMode)}

      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Âm lượng</label>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SettingDC;
