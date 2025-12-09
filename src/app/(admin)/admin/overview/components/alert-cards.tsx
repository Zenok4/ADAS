"use client";

import { Eye, AlertCircle, EyeOff, Zap } from "lucide-react";

interface AlertCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  percentage: number;
  statusText: string;
  count: string;
  statusColor: string;
}

export default function AlertCards() {
  const alertCards: AlertCard[] = [
    {
      id: "1",
      title: "Cảnh báo buồn ngủ",
      description: "Theo dõi tình trạng tỉnh táo của xe",
      icon: <Eye className="w-6 h-6 text-slate-600" />,
      percentage: 90,
      statusText: "Hoạt động",
      count: "234 xe đang theo dõi",
      statusColor: "text-green-600",
    },
    {
      id: "2",
      title: "Phát hiện cảnh báo",
      description: "Nhận diện và cảnh báo biến giao thông",
      icon: <AlertCircle className="w-6 h-6 text-slate-600" />,
      percentage: 90,
      statusText: "Hoạt động",
      count: "1,246 biến báo đã phát hiện",
      statusColor: "text-green-600",
    },
    {
      id: "3",
      title: "Cảnh báo lân đường",
      description: "Cảnh báo khi xe chệch làn đường",
      icon: <EyeOff className="w-6 h-6 text-slate-600" />,
      percentage: 90,
      statusText: "Hoạt động",
      count: "45 cảnh báo hôm nay",
      statusColor: "text-green-600",
    },
    {
      id: "4",
      title: "Cảnh báo vật cản",
      description: "Phát hiện và cảnh báo vật cản phía trước",
      icon: <Zap className="w-6 h-6 text-slate-600" />,
      percentage: 90,
      statusText: "Hoạt động",
      count: "92 cảnh báo hôm nay",
      statusColor: "text-green-600",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                {card.icon}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Độ chính xác
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {card.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${card.percentage}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${card.statusColor}`}>
                {card.statusText}
              </span>
              <span className="text-sm text-slate-600">{card.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
