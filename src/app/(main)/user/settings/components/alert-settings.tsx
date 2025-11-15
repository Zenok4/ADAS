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

export const AlertSettings = () => {
  // State ví dụ
  const [volume, setVolume] = useState(80);
  const [alertSound, setAlertSound] = useState("default");
  const [sleepDetect, setSleepDetect] = useState(true);
  const [sleepSensitivity, setSleepSensitivity] = useState("medium");
  const [collisionWarning, setCollisionWarning] = useState(true);
  const [collisionDistance, setCollisionDistance] = useState("medium");
  const [laneWarning, setLaneWarning] = useState(true);
  const [signWarning, setSignWarning] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(5);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Section title="Âm thanh chung">
        <SettingsSliderItem
          title="Âm lượng cảnh báo"
          description="Điều chỉnh âm lượng chung của hệ thống"
          min={0}
          max={100}
          step={5}
          value={volume}
          onChange={setVolume}
        />
        <SettingsSelectItem
          title="Kiểu chuông"
          description="Chọn âm thanh cảnh báo"
          value={alertSound}
          onChange={setAlertSound}
          options={[
            { value: "default", label: "Mặc định" },
            { value: "voice", label: "Giọng nói" },
            { value: "beep", label: "Tiếng Beep" },
          ]}
        />
      </Section>

      <Section title="Cảnh báo buồn ngủ">
        <SettingsToggleItem
          title="Phát hiện buồn ngủ"
          description="Bật/Tắt cảnh báo khi tài xế có dấu hiệu mệt mỏi"
          toggled={sleepDetect}
          onToggle={setSleepDetect}
        />
        <SettingsSelectItem
          title="Độ nhạy"
          description="Độ nhạy của hệ thống phát hiện"
          value={sleepSensitivity}
          onChange={setSleepSensitivity}
          options={[
            { value: "low", label: "Thấp" },
            { value: "medium", label: "Trung bình" },
            { value: "high", label: "Cao" },
          ]}
        />
      </Section>

      <Section title="Cảnh báo va chạm">
        <SettingsToggleItem
          title="Phát hiện vật cản"
          description="Bật/Tắt cảnh báo va chạm phía trước"
          toggled={collisionWarning}
          onToggle={setCollisionWarning}
        />
        <SettingsSelectItem
          title="Khoảng cách cảnh báo"
          description="Cảnh báo khi vật cản ở khoảng cách"
          value={collisionDistance}
          onChange={setCollisionDistance}
          options={[
            { value: "near", label: "Gần" },
            { value: "medium", label: "Trung bình" },
            { value: "far", label: "Xa" },
          ]}
        />
      </Section>

      <Section title="Giám sát làn đường">
        <SettingsToggleItem
          title="Cảnh báo lệch làn"
          description="Bật/Tắt cảnh báo khi xe rời khỏi làn đường"
          toggled={laneWarning}
          onToggle={setLaneWarning}
        />
      </Section>

      <Section title="Nhận diện biển báo">
        <SettingsToggleItem
          title="Cảnh báo vượt tốc độ"
          description="Cảnh báo khi tốc độ xe vượt quá biển báo"
          toggled={signWarning}
          onToggle={setSignWarning}
        />
        <SettingsSelectItem
          title="Mức vượt cho phép"
          description="Cảnh báo khi vượt quá tốc độ"
          value={String(speedLimit)}
          onChange={(val) => setSpeedLimit(Number(val))}
          options={[
            { value: "0", label: "0 km/h" },
            { value: "5", label: "+5 km/h" },
            { value: "10", label: "+10 km/h" },
          ]}
        />
      </Section>
    </div>
  );
};