"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Car,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Flag,
  EyeOff,
  CornerUpRight,
  AlertOctagon,
} from "lucide-react"; // Import thêm các icon cụ thể
import IconCard from "./jn-icon-card";
import Badge from "./jn-badge";

// --- INTERFACES ---

interface TripDetail {
  type: string;
  count: number;
  color: string;
}

interface BackendEvent {
  id: number;
  detect_type: "sign" | "drowsiness" | "object" | "lane";
  time: string;
  avg_confidence: number | null;
  payload: any;
}

interface UIEvent {
  id: number;
  time: string;
  type: string;
  description: string;
  color: string;
  dotColor: string;
}

interface TripDetailsViewProps {
  trip: {
    date: string;
    route: string;
    car: string;
    duration: string;
    warnings: number;
    details: TripDetail[];
    rawEvents?: BackendEvent[];
  };
  onBack: () => void;
}

// --- CẤU HÌNH MAPPING MÀU SẮC ---

const tailwindColorMap: { [key: string]: string } = {
  "bg-green-500": "#10b981",
  "bg-orange-500": "#f97316",
  "bg-red-500": "#ef4444",
  "bg-blue-500": "#3b82f6",
  "bg-gray-500": "#6b7280",
};

const EVENT_CONFIG: Record<string, { label: string; color: string }> = {
  drowsiness: { label: "Buồn ngủ", color: "bg-orange-500" },
  lane: { label: "Làn đường", color: "bg-blue-500" },
  object: { label: "Vật cản", color: "bg-red-500" },
  sign: { label: "Biển báo", color: "bg-green-500" },
  default: { label: "Khác", color: "bg-gray-500" },
};

// --- HÀM TẠO MÔ TẢ (GIỮ NGUYÊN TÊN CLASS GỐC) ---
const generateDescription = (type: string, payload: any): string => {
  if (!payload) return "No details available";

  const dataList = payload.data || [];

  switch (type) {
    case "object":
      if (dataList.length > 0) {
        // Lấy tên class gốc (car, person, truck...)
        const item = dataList[0];
        const rawName = item.class_name || item.label || item.class || "object";
        return `Phát hiện vật cản: ${rawName}`;
      }
      return "Phát hiện vật cản";

    case "sign":
      if (dataList.length > 0) {
        // Gom nhóm các label gốc (speed_limit_60, stop...)
        const signNames = dataList
          .map((item: any) => {
            return item.class_name || item.label || item.class;
          })
          .join(", ");
        return `Nhận diện được biển báo: ${signNames}`;
      }
      return "Nhận diện biển báo";

    case "drowsiness":
      if (payload.is_drowsy) {
        // Nếu có status cụ thể (ví dụ: eyes_closed) thì hiển thị, không thì để text mặc định
        return payload.status
          ? `Cảnh báo: ${payload.status}`
          : "Phát hiện dấu hiệu buồn ngủ";
      }
      return "Cảnh báo mất tập trung";

    case "lane":
      if (dataList.length > 0) {
        const item = dataList[0];
        // Lấy hướng gốc (left, right...)
        const direction = item.direction || item.class_name || "lane_departure";
        return `Nhận diện được làn đường : ${direction}`;
      }
      return "Nhận diện làn đường";

    default:
      return "Phát hiện sự kiện bất thường";
  }
};

// --- HÀM LẤY ICON THEO LOẠI (Dùng Lucide) ---
const getEventIcon = (type: string) => {
  switch (type) {
    case "Biển báo":
      return Flag; // Hoặc AlertOctagon
    case "Buồn ngủ":
      return EyeOff;
    case "Vật cản":
      return AlertTriangle;
    case "Làn đường":
      return CornerUpRight;
    default:
      return AlertTriangle;
  }
};

const TripDetailsView: React.FC<TripDetailsViewProps> = ({ trip, onBack }) => {
  const [selectedStatType, setSelectedStatType] = useState<string | null>(null);

  // 1. CHUYỂN ĐỔI DỮ LIỆU
  const realEvents = useMemo<UIEvent[]>(() => {
    if (!trip.rawEvents || trip.rawEvents.length === 0) return [];

    return trip.rawEvents.map((e) => {
      const config = EVENT_CONFIG[e.detect_type] || EVENT_CONFIG.default;

      const dateObj = new Date(e.time);
      const timeStr = dateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Gọi hàm generateDescription mới (không dịch)
      const description = generateDescription(e.detect_type, e.payload);

      return {
        id: e.id,
        time: timeStr,
        type: config.label,
        description: description,
        color: config.color,
        dotColor: config.color.replace("bg-", "border-"),
      };
    });
  }, [trip.rawEvents]);

  // 2. LỌC
  const filteredEvents = useMemo(() => {
    if (!selectedStatType) return [];
    return realEvents.filter((e) => e.type === selectedStatType);
  }, [selectedStatType, realEvents]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Chi tiết hành trình
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {trip.date} - {trip.route}
        </p>
      </div>

      {/* Cards Tổng Quan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <IconCard
          icon={MapPin}
          title="Lộ trình"
          value={trip.route}
          bgColor="bg-blue-100 dark:bg-blue-900/50"
          iconColor="text-blue-500"
        />
        <IconCard
          icon={Car}
          title="Phương tiện"
          value={trip.car}
          bgColor="bg-green-100 dark:bg-green-900/50"
          iconColor="text-green-500"
        />
        <IconCard
          icon={Clock}
          title="Thời gian"
          value={trip.duration}
          bgColor="bg-purple-100 dark:bg-purple-900/50"
          iconColor="text-purple-500"
        />
        <IconCard
          icon={AlertTriangle}
          title="Tổng cảnh báo"
          value={trip.warnings.toString()}
          bgColor="bg-red-100 dark:bg-red-900/50"
          iconColor="text-red-500"
        />
      </div>

      <h3 className="text-lg font-bold mb-3">
        Lịch sử nhận diện ({trip.warnings})
      </h3>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {trip.details.length > 0 ? (
          trip.details.map((stat) => {
            const hexColor = tailwindColorMap[stat.color] || "#333";
            const isSelected = stat.type === selectedStatType;
            return (
              <button
                key={stat.type}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm transition-all border 
                                ${
                                  isSelected
                                    ? `text-white ${stat.color} border-transparent`
                                    : `text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50`
                                }`}
                style={isSelected ? { backgroundColor: hexColor } : {}}
                onClick={() =>
                  setSelectedStatType(isSelected ? null : stat.type)
                }
              >
                {stat.type}: {stat.count}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">Không có cảnh báo nào.</p>
        )}
      </div>

      {/* --- LIST SỰ KIỆN --- */}
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3.5 pl-6 space-y-6 pb-4">
        {(!selectedStatType ? realEvents : filteredEvents).map((event) => {
          // Lấy icon tương ứng từ Lucide
          const EventIcon = getEventIcon(event.type);

          return (
            <div key={event.id} className="relative">
              {/* Dot Indicator */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 ${event.dotColor.replace(
                  "border-",
                  "bg-"
                )}`}
                style={{ backgroundColor: tailwindColorMap[event.color] }}
              ></div>

              {/* Event Card */}
              <div
                className={`p-4 rounded-lg border shadow-sm transition
                  ${
                    event.type === "Biển báo"
                      ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                      : ""
                  }
                  ${
                    event.type === "Buồn ngủ"
                      ? "bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800"
                      : ""
                  }
                  ${
                    event.type === "Vật cản"
                      ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                      : ""
                  }
                  ${
                    event.type === "Làn đường"
                      ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800"
                      : ""
                  }
                  ${event.type === "Khác" ? "bg-gray-50 border-gray-200" : ""}
                  `}
              >
                {/* Header: Icon - Type - Time */}
                <div className="flex items-center gap-2 mb-1">
                  {/* Render Lucide Icon */}
                  <EventIcon
                    className={`w-5 h-5 
                      ${event.type === "Biển báo" ? "text-green-600" : ""}
                      ${event.type === "Buồn ngủ" ? "text-orange-600" : ""}
                      ${event.type === "Vật cản" ? "text-red-600" : ""}
                      ${event.type === "Làn đường" ? "text-blue-600" : ""}
                    `}
                  />

                  <span
                    className={`font-bold text-sm uppercase
                      ${
                        event.type === "Biển báo"
                          ? "text-green-700 dark:text-green-400"
                          : ""
                      }
                      ${
                        event.type === "Buồn ngủ"
                          ? "text-orange-700 dark:text-orange-400"
                          : ""
                      }
                      ${
                        event.type === "Vật cản"
                          ? "text-red-700 dark:text-red-400"
                          : ""
                      }
                      ${
                        event.type === "Làn đường"
                          ? "text-blue-700 dark:text-blue-400"
                          : ""
                      }
                      `}
                  >
                    {event.type}
                  </span>

                  <span className="text-gray-400 text-xs font-medium ml-auto">
                    {event.time}
                  </span>
                </div>

                {/* Body: Description */}
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pl-0 md:pl-7">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}

        {selectedStatType && filteredEvents.length === 0 && (
          <p className="text-gray-500 italic pl-2">
            Không tìm thấy sự kiện nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default TripDetailsView;
