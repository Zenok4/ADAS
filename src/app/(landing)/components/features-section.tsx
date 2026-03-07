"use client";

import { Eye, AlertTriangle, Bell, Send } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Cảnh báo buồn ngủ",
    description: "Phát hiện mệt mỏi và cảnh báo ngay lập tức",
  },
  {
    icon: AlertTriangle,
    title: "Phát hiện vật cản",
    description: "Cảnh báo về chướng ngại vật phía trước",
  },
  {
    icon: Bell,
    title: "Nhận điều biến báo",
    description: "Đọc và cảnh báo biển giao thông",
  },
  {
    icon: Send,
    title: "Giám sát lái đường",
    description: "Cảnh báo lệch làn đường thông minh",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* THAY ĐỔI Ở ĐÂY:
         - Bỏ "max-w-6xl"
         - Thêm "w-full" hoặc "max-w-screen-2xl" để rộng hơn
         - Giữ "mx-auto" để căn giữa nếu màn hình quá lớn
      */}
      <div className="w-full max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          4 Chức năng bảo vệ chính
        </h2>

        {/* Grid này sẽ tự động giãn ra theo chiều rộng mới */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            // ... (giữ nguyên phần code bên trong)
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                {/* ... nội dung card giữ nguyên */}
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
