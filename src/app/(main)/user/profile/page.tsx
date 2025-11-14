"use client";

import { useState } from "react";
import {
  UserCircle2,
  CheckCircle,
  FileEdit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  RectangleHorizontal,
  ShieldCheck,
} from "lucide-react";

// Import Header và Sidebar (Giữ nguyên)
import { UserHeader } from "../../../(main)/components/user-header";
import { UserSidebar } from "../../../(main)/components/user-sidebar";

// Component con để hiển thị từng mục thông tin (Giữ nguyên)
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <Icon size={20} className="text-gray-400 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // --- SỬA 1: 'bg-gray-50' (NỀN XÁM) NẰM Ở DIV NGOÀI CÙNG ---
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header (Giữ nguyên) */}
      <UserHeader />

      {/* Sidebar + Content (Giữ nguyên) */}
      <div className="flex flex-1">
        <UserSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* Main Content: */}
        <main
          // --- SỬA 2: ĐÃ XÓA 'bg-gray-50' KHỎI THẺ MAIN ---
          className={`flex-1 p-6 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* ----- NỘI DUNG TRANG PROFILE ----- */}

          <h1 className="text-2xl font-bold text-gray-900">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-500 mb-6">Thông tin người dùng</p>

          {/* Card 1: Card Header (Nền trắng) */}
          <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="bg-gray-100 rounded-full p-4">
              <UserCircle2 size={48} className="text-gray-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold">Lê Văn A</h2>
              <p className="text-sm text-gray-500">Driver</p>
              <div className="flex justify-center md:justify-start gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Tên xe - Biển số
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Hệ thống hoạt động
                </span>
              </div>
              <div className="flex justify-center md:justify-start items-center text-green-600 font-medium mt-2">
                <CheckCircle size={16} className="mr-1" />
                <span>Điểm an toàn: 95/100</span>
              </div>
            </div>
            <button className="flex-shrink-0 ml-auto px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors">
              <FileEdit size={16} />
              <span>Chỉnh sửa</span>
            </button>
          </div>

          {/* Lưới chứa 2 card thông tin bên dưới */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
            
            {/* Card 2: Thông tin cá nhân (Nền trắng) */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>
              <InfoItem
                icon={Mail}
                label="Email"
                value="levana@gmail.com"
              />
              <InfoItem
                icon={Phone}
                label="Số điện thoại"
                value="+84 123 456 789"
              />
              <InfoItem
                icon={MapPin}
                label="Địa chỉ"
                value="Đà Nẵng, Việt Nam"
              />
              <InfoItem
                icon={Calendar}
                label="Ngày đăng ký"
                value="15 tháng 9, 2024"
              />
            </div>

            {/* Card 3: Thông tin xe & ADAS (Nền trắng) */}
<div className="bg-white rounded-xl shadow-md p-6 space-y-5">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Thông tin xe & ADAS
  </h3>

  <InfoItem
    icon={Car}
    label="Phương tiện"
    value="Honda City 2023"
  />

  <InfoItem
    icon={RectangleHorizontal}
    label="Biển số"
    value="43E1-11111"
  />

  <InfoItem
    icon={ShieldCheck}
    label="Phiên bản ADAS"
    value="ADAS v1.1.1"
  />

  <InfoItem
    icon={Calendar}
    label="Kích hoạt từ"
    value="15 tháng 9, 2024"
  />
</div>
            </div>
          </main>
        </div>
      </div>
    );
  }