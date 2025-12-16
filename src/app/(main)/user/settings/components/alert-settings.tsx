"use client";
import { SettingsSelectItem, SettingsSliderItem } from "./settings-item";
import { AppSettings } from "../page";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 last:border-b-0 dark:border-slate-800">
    <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

export const AlertSettings = ({
  values,
  onUpdate,
}: {
  values: AppSettings["alert"];
  onUpdate: (key: keyof AppSettings["alert"], value: any) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <Section title="Hiệu năng AI">
        <SettingsSelectItem
          title="Tần suất xử lý (FPS)"
          description="Tốc độ gửi ảnh lên server. Cao hơn sẽ mượt hơn."
          value={values.frequency}
          onChange={(val: any) => onUpdate("frequency", val)}
          options={[
            { value: "high", label: "Cao (Tối đa)" },
            { value: "medium", label: "Trung bình (Khuyên dùng)" },
            { value: "low", label: "Thấp (Tiết kiệm Pin)" },
          ]}
        />
      </Section>
      <Section title="Âm thanh hệ thống">
        <SettingsSliderItem
          title="Âm lượng cảnh báo"
          description="Độ lớn âm thanh loa khi phát hiện vật cản"
          min={0}
          max={100}
          step={10}
          value={values.volume}
          onChange={(val: any) => onUpdate("volume", val)}
        />
      </Section>
    </div>
  );
};