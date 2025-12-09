"use client";

import { useState } from "react";
import {
  Upload,
  RefreshCw,
  Save,
  Bell,
  Monitor,
  Settings,
} from "lucide-react";

import { SettingsTab } from "./components/settings-tab";
import { GeneralSettings } from "./components/general-settings";
import { AlertSettings } from "./components/alert-settings";
import { DisplaySettings } from "./components/display-settings";

export default function SettingsPage() {

  const [activeTab, setActiveTab] = useState("chung");

  return (

    <main className="p-6">
      {/* Header của Main content */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-500">
            Cấu hình và tùy chỉnh hệ thống ADAS
          </p>
        </div>
        <div className="flex items-center gap-2">
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium bg-white border shadow-sm hover:bg-gray-50">
            <RefreshCw size={16} />
            <span>Khôi phục mặc định</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-blue-500 shadow-sm hover:bg-blue-600">
            <Save size={16} />
            <span>Lưu cài đặt</span>
          </button>
        </div>
      </div>

      {/* Thanh Tab điều hướng */}
      <div className="border-b border-gray-200 flex">
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
          label="Hiển thị"
          isActive={activeTab === "hienthi"}
          onClick={() => setActiveTab("hienthi")}
        />
      </div>

      {/* Vùng nội dung của Tab (căn giữa) */}
      <div className="mt-6 max-w-4xl mx-auto">
        {activeTab === "chung" && <GeneralSettings />}
        {activeTab === "canhbao" && <AlertSettings />}
        {activeTab === "hienthi" && <DisplaySettings />}
      </div>
    </main>
  );
}