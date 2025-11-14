"use client";

import { useState } from "react";
import {
  SettingsToggleItem,
  SettingsSelectItem,
  SettingsSliderItem,
} from "./settings-item";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <h3 className="p-6 pb-0 text-lg font-semibold text-gray-900">{title}</h3>
    {children}
  </div>
);

export const DisplaySettings = () => {
  // State ví dụ
  const [theme, setTheme] = useState("auto");
  const [brightness, setBrightness] = useState(90);
  const [defaultCam, setDefaultCam] = useState("front");
  const [showOverlay, setShowOverlay] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showTime, setShowTime] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Section title="Giao diện">
        <SettingsSelectItem
          title="Chủ đề (Theme)"
          description="Chọn giao diện sáng, tối hoặc tự động"
          value={theme}
          onChange={setTheme}
          options={[
            { value: "light", label: "Sáng" },
            { value: "dark", label: "Tối" },
            { value: "auto", label: "Tự động (Ngày/Đêm)" },
          ]}
        />
        <SettingsSliderItem
          title="Độ sáng màn hình"
          description="Điều chỉnh độ sáng thủ công"
          min={10}
          max={100}
          step={5}
          value={brightness}
          onChange={setBrightness}
        />
      </Section>

      <Section title="Hiển thị Camera">
        <SettingsSelectItem
          title="Camera mặc định"
          description="Camera hiển thị khi khởi động"
          value={defaultCam}
          onChange={setDefaultCam}
          options={[
            { value: "front", label: "Camera trước" },
            { value: "rear", label: "Camera sau" },
            { value: "off", label: "Không hiển thị" },
          ]}
        />
        <SettingsToggleItem
          title="Hiển thị lớp phủ (Overlay)"
          description="Hiện vạch kẻ, hộp nhận diện trên camera"
          toggled={showOverlay}
          onToggle={setShowOverlay}
        />
      </Section>

      <Section title="Thông tin trên Dashboard">
        <SettingsToggleItem
          title="Hiển thị Thời tiết"
          description="Bật/Tắt widget thời tiết"
          toggled={showWeather}
          onToggle={setShowWeather}
        />
        <SettingsToggleItem
          title="Hiển thị Đồng hồ"
          description="Bật/Tắt widget đồng hồ"
          toggled={showTime}
          onToggle={setShowTime}
        />
      </Section>
    </div>
  );
};