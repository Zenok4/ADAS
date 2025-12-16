"use client";

import { ChevronRight } from "lucide-react";

interface Alert {
  id: string;
  type: "Buồn ngủ" | "Lân đường" | "Vật cản" | "Biến báo";
  vehicleId: string;
  time: string;
}

export default function RecentWarnings() {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "Buồn ngủ",
      vehicleId: "Xe VN-001",
      time: "10:30",
    },
    {
      id: "2",
      type: "Lân đường",
      vehicleId: "Xe VN-001",
      time: "10:30",
    },
    {
      id: "3",
      type: "Vật cản",
      vehicleId: "Xe VN-001",
      time: "10:29",
    },
    {
      id: "4",
      type: "Biến báo",
      vehicleId: "Xe VN-001",
      time: "10:27",
    },
  ];

  const getAlertColor = (type: string) => {
    return "bg-yellow-300";
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Cảnh báo gần đây
        </h1>
        <p className="text-slate-600">
          Danh sách các cảnh báo mới nhất từ hệ thống
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
          >
            {/* Left Section - Type Badge */}
            <div className="flex items-center gap-4 flex-1">
              <span
                className={`${getAlertColor(
                  alert.type
                )} text-slate-700 font-semibold px-3 py-2 rounded whitespace-nowrap w-28 text-center h-10 flex items-center justify-center`}
              >
                {alert.type}
              </span>

              {/* Vehicle ID */}
              <span className="text-slate-700 font-medium">
                {alert.vehicleId}
              </span>
            </div>

            {/* Right Section - Time and Link */}
            <div className="flex items-center gap-6">
              <span className="text-slate-600 font-medium whitespace-nowrap">
                {alert.time}
              </span>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Xem chi tiết
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
