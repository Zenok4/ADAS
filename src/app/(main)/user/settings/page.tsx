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

// Import các component layout chung
import { UserHeader } from "../../../(main)/components/user-header";
import { UserSidebar } from "../../../(main)/components/user-sidebar";

// Import các component mới của trang Settings
import { SettingsTab } from "./components/settings-tab";
import { GeneralSettings } from "./components/general-settings";
import { AlertSettings } from "./components/alert-settings";
import { DisplaySettings } from "./components/display-settings";

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chung"); // chung, canhbao, hienthi

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <UserHeader />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <UserSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* --- SỬA ĐỔI Ở ĐÂY --- */}
        {/* Thay thế 'p-6' bằng 'p-8 pt-20' giống như file profile/page.tsx 
          để nội dung không bị header che mất.
        */}
        <main
          className={`flex-1 p-8 pt-20 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* Header của Main content (Giờ sẽ hiển thị đúng) */}
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
                <Upload size={16} />
                <span>Xuất cài đặt</span>
              </button>
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
      </div>
    </div>
  );
}