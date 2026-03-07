"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Save, Bell, Monitor, Settings } from "lucide-react";

import { SettingsTab } from "./components/settings-tab";
import { GeneralSettings } from "./components/general-settings";
import { AlertSettings } from "./components/alert-settings";
import { DisplaySettings } from "./components/display-settings";

// Import Notify
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";

export interface AppSettings {
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

const DEFAULT_SETTINGS: AppSettings = {
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("chung"); // Mặc định vào tab Chung
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Hook thông báo
  const {
    open,
    type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = useNotifyDialog();

  // 1. Load Settings từ LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("adas_settings");
    if (saved) {
      try {
        setSettings((prev) => ({
          ...prev,
          ...JSON.parse(saved),
        }));
      } catch (e) {
        console.error("Lỗi đọc settings cũ", e);
      }
    }
  }, []);

  // Update State helper
  const updateAlert = (key: keyof AppSettings["alert"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      alert: { ...prev.alert, [key]: value },
    }));
  };

  const updateDisplay = (key: keyof AppSettings["display"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      display: { ...prev.display, [key]: value },
    }));
  };

  // 2. Hàm Lưu (Đã sửa lỗi hiển thị nút thừa)
  const handleSave = () => {
    localStorage.setItem("adas_settings", JSON.stringify(settings));
    window.dispatchEvent(new Event("adas_settings_updated"));

    // FIX: Không truyền primaryActionText để tránh hiện 2 nút "Đóng"
    // Chỉ hiện thông báo thành công, người dùng bấm X hoặc click ra ngoài để đóng
    showNotify({
      type: NotifyType.Success,
      title: "Thành công",
      message: "Cấu hình hệ thống đã được lưu và áp dụng.",
      // primaryActionText: "Đóng", // <-- Đã xóa dòng này để bỏ nút Xanh thừa
      // onPrimaryAction: hideNotify, // <-- Đã xóa
    });
  };

  const handleReset = () => {
    showNotify({
      type: NotifyType.Warning,
      title: "Khôi phục mặc định?",
      message: "Tất cả cài đặt (trừ giao diện) sẽ trở về trạng thái ban đầu.",
      primaryActionText: "Khôi phục",
      onPrimaryAction: () => {
        setSettings(DEFAULT_SETTINGS);
        hideNotify();
        // Thông báo lại sau khi reset xong
        setTimeout(() => {
          showNotify({
            type: NotifyType.Info,
            title: "Đã khôi phục",
            message: "Các cài đặt đã về mặc định.",
          });
        }, 300);
      },
    });
  };

  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Cài đặt
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý hệ thống ADAS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800 transition-all"
              title="Khôi phục mặc định"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <Save size={18} />
              <span>Lưu</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
          <SettingsTab
            icon={Settings}
            label="Chung"
            isActive={activeTab === "chung"}
            onClick={() => setActiveTab("chung")}
          />
          <SettingsTab
            icon={Bell}
            label="Cảnh báo"
            isActive={activeTab === "canhbao"}
            onClick={() => setActiveTab("canhbao")}
          />
          <SettingsTab
            icon={Monitor}
            label="Giao diện"
            isActive={activeTab === "hienthi"}
            onClick={() => setActiveTab("hienthi")}
          />
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300">
          {activeTab === "chung" && <GeneralSettings />}
          {activeTab === "canhbao" && (
            <AlertSettings values={settings.alert} onUpdate={updateAlert} />
          )}
          {activeTab === "hienthi" && (
            <DisplaySettings
              values={settings.display}
              onUpdate={updateDisplay}
            />
          )}
        </div>
      </div>

      {/* Notify Dialog Component */}
      <NotifyDialog
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
        onClose={hideNotify}
      />
    </main>
  );
}
