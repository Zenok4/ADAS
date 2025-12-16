"use client";

import { useTheme } from "next-themes";
import { SettingsToggleItem, SettingsSelectItem } from "./settings-item";
import { AppSettings } from "../page";

// Component Section: Style nhỏ gọn, hỗ trợ Dark Mode
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

interface DisplaySettingsProps {
  values: AppSettings["display"];
  onUpdate: (key: keyof AppSettings["display"], value: any) => void;
}

export const DisplaySettings = ({ values, onUpdate }: DisplaySettingsProps) => {
  // Hook xử lý theme tự động của Shadcn/Next-themes
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <Section title="Giao diện chung">
        <SettingsSelectItem
          title="Chủ đề (Theme)"
          description="Chọn giao diện hiển thị"
          // Liên kết trực tiếp với hook useTheme
          value={theme || "system"}
          onChange={(val: string) => setTheme(val)}
          options={[
            { value: "system", label: "Tự động (Theo máy)" },
            { value: "light", label: "Sáng (Light)" },
            { value: "dark", label: "Tối (Dark)" },
          ]}
        />
        <SettingsToggleItem
          title="Lớp phủ AI (Overlay)"
          description="Vẽ khung nhận diện lên màn hình Camera"
          toggled={values.showOverlay}
          onToggle={(val: boolean) => onUpdate("showOverlay", val)}
        />
      </Section>

      <Section title="Widget Dashboard">
        <SettingsToggleItem
          title="Thời gian"
          description="Hiển thị đồng hồ số"
          toggled={values.showTime}
          onToggle={(val: boolean) => onUpdate("showTime", val)}
        />
        <SettingsToggleItem
          title="Thời tiết"
          description="Hiển thị widget thời tiết"
          toggled={values.showWeather}
          onToggle={(val: boolean) => onUpdate("showWeather", val)}
        />
        <SettingsToggleItem
          title="Vị trí GPS"
          description="Hiển thị tên đường/quận huyện"
          toggled={values.showLocation}
          onToggle={(val: boolean) => onUpdate("showLocation", val)}
        />
        <SettingsToggleItem
          title="Nhiệt độ"
          description="Hiển thị nhiệt độ ngoài trời"
          toggled={values.showTemperature}
          onToggle={(val: boolean) => onUpdate("showTemperature", val)}
        />
      </Section>
    </div>
  );
};