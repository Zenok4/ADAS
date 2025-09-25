"use client";

import { useState } from "react";
import { Eye, ShieldCheck, Navigation, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [alerts] = useState([
    { type: "Buồn ngủ", vehicle: "Xe VN-001", time: "10:30" },
    { type: "Làn đường", vehicle: "Xe VN-001", time: "10:30" },
    { type: "Vật cản", vehicle: "Xe VN-001", time: "10:29" },
    { type: "Biển báo", vehicle: "Xe VN-001", time: "10:27" },
  ]);

  return (
    <div className="min-h-screen bg-[#f8fbff] p-8">
      {/* Tổng quan hệ thống */}
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Tổng số xe đang hoạt động" value="1,247" icon="🚗" />
        <Card title="Cảnh báo trong 24h" value="89" icon="⚠️" />
        <Card title="Độ chính xác hệ thống" value="98.5%" icon="📈" />
        <Card title="Thời gian hoạt động" value="98%" icon="⏱️" />
      </div>

      {/* Các Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Cảnh báo buồn ngủ"
          description="Theo dõi tình trạng tỉnh táo của xe"
          accuracy="90%"
          status="234 xe đang theo dõi"
          icon={<Eye className="w-5 h-5" />}
        />
        <StatCard
          title="Phát hiện cảnh báo"
          description="Nhận diện và cảnh báo biển giao thông"
          accuracy="90%"
          status="1,246 biển báo đã phát hiện"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          title="Cảnh báo làn đường"
          description="Cảnh báo khi xe chệch làn đường"
          accuracy="90%"
          status="45 cảnh báo hôm nay"
          icon={<Navigation className="w-5 h-5" />}
        />
        <StatCard
          title="Cảnh báo vật cản"
          description="Phát hiện và cảnh báo vật cản phía trước"
          accuracy="90%"
          status="92 cảnh báo hôm nay"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Cảnh báo gần đây */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cảnh báo gần đây</h2>
        <p className="text-sm text-gray-600 mb-4">
          Danh sách các cảnh báo mới nhất từ hệ thống
        </p>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 px-4 py-3"
            >
              {/* Grid: Badge | Xe | Time | Button */}
              <div className="grid items-center gap-4 [grid-template-columns:140px_1fr_64px_120px]">
                {/* Badge */}
                <span className="inline-flex justify-center px-3 py-1 rounded-md bg-yellow-100 text-gray-800 text-sm font-semibold">
                  {alert.type}
                </span>

                {/* Xe */}
                <span className="text-sm">{alert.vehicle}</span>

                {/* Time */}
                <span className="text-sm text-gray-600 text-right">
                  {alert.time}
                </span>

                {/* Button */}
                <button className="px-3 py-1 rounded-md bg-gray-100 text-blue-600 text-sm font-medium hover:underline">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Component nhỏ: Card cho phần tổng quan */
function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <span>{icon}</span> {title}
      </p>
      <p className="text-2xl font-bold mt-2 text-[#1677FF]">{value}</p>
    </div>
  );
}

/* Component StatCard */
function StatCard({
  title,
  description,
  accuracy, // ví dụ: "90%"
  status,
  icon,
}: {
  title: string;
  description: string;
  accuracy: string;
  status: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col">
      {/* Tiêu đề + icon */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-800">{icon}</span>
        <p className="font-medium text-gray-800">{title}</p>
      </div>

      <p className="text-sm text-gray-600 mb-2">{description}</p>

      {/* Độ chính xác (label trái, % phải) */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Độ chính xác</span>
        <span className="font-semibold text-gray-800">{accuracy}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mt-1 mb-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: accuracy }} // lấy đúng % từ prop
        />
      </div>

      {/* Hoạt động (trái) + status (phải) cùng hàng */}
      <div className="flex items-center justify-between">
        <p className="text-blue-600 text-sm font-medium">Hoạt động</p>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
}
