"use client";

import { useState, useMemo } from "react";
import { X, MapPin, Car, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import IconCard from "./jn-icon-card"; 
import Badge from "./jn-badge"; 

interface TripDetail {
    type: string;
    count: number;
    color: string;
}

// Bảng ánh xạ màu Tailwind
const tailwindColorMap: { [key: string]: string } = {
    'bg-green-500': '#10b981', 
    'bg-orange-500': '#f97316', 
    'bg-red-500': '#ef4444', 
    'bg-blue-500': '#3b82f6',
};

interface Event {
    id: number;
    time: string;
    type: 'Biển báo' | 'Buồn ngủ' | 'Vật cản' | 'Làn đường';
    description: string;
    color: 'bg-green-500' | 'bg-orange-500' | 'bg-red-500' | 'bg-blue-500';
    dotColor: string; 
}

// --- MOCK DATA EVENT (ĐÃ ĐIỀU CHỈNH MÀU SẮC ĐỂ KHỚP VỚI page.tsx) ---
const mockEvents: Event[] = [
    // Biển báo: bg-green-500 
    { id: 1, time: "08:15:23", type: "Biển báo", description: "Nhận diện biển báo giới hạn tốc độ 60km/h", color: "bg-green-500", dotColor: "border-green-500" },
    
    // Buồn ngủ: bg-red-500 
    { id: 2, time: "08:22:45", type: "Buồn ngủ", description: "Phát hiện dấu hiệu buồn ngủ - mắt nhắm lâu", color: "bg-red-500", dotColor: "border-red-500" },
    
    // Vật cản: bg-orange-500 
    { id: 3, time: "08:35:10", type: "Vật cản", description: "Phát hiện xe phía trước đang phanh gấp", color: "bg-orange-500", dotColor: "border-orange-500" },
    
    // Làn đường: bg-blue-500 
    { id: 4, time: "08:41:33", type: "Làn đường", description: "Cảnh báo xe đang lệch làn đường bên phải", color: "bg-blue-500", dotColor: "border-blue-500" },
    
    // Tiếp tục cập nhật các mục còn lại theo quy tắc mới:
    { id: 5, time: "08:55:20", type: "Biển báo", description: "Nhận diện biển báo cấm vượt", color: "bg-green-500", dotColor: "border-green-500" },
    { id: 6, time: "09:28:55", type: "Làn đường", description: "Cảnh báo xe đang lệch làn đường bên trái", color: "bg-blue-500", dotColor: "border-blue-500" },
    { id: 7, time: "09:50:20", type: "Biển báo", description: "Nhận diện biển báo giao nhau với đường sắt", color: "bg-green-500", dotColor: "border-green-500" },
    
    // Vật cản: bg-orange-500
    { id: 8, time: "09:51:40", type: "Vật cản", description: "Phát hiện người đi bộ băng qua đường", color: "bg-orange-500", dotColor: "border-orange-500" },
    
    // Buồn ngủ: bg-red-500
    { id: 9, time: "10:05:15", type: "Buồn ngủ", description: "Phát hiện ngáp nhiều lần liên tiếp", color: "bg-red-500", dotColor: "border-red-500" },
    
    { id: 10, time: "10:09:48", type: "Biển báo", description: "Nhận diện biển báo giới hạn tốc độ 80km/h", color: "bg-green-500", dotColor: "border-green-500" },
    
    // Vật cản: bg-orange-500
    { id: 11, time: "10:17:07", type: "Vật cản", description: "Phát hiện xe máy cắt ngang", color: "bg-orange-500", dotColor: "border-orange-500" },
    
    { id: 12, time: "10:35:45", type: "Biển báo", description: "Nhận diện biển báo đường nguy hiểm", color: "bg-green-500", dotColor: "border-green-500" },
];

interface TripDetailsViewProps {
    trip: {
        date: string;
        route: string;
        car: string;
        duration: string;
        warnings: number;
        details: TripDetail[];
    };
    onBack: () => void; 
}

const TripDetailsView: React.FC<TripDetailsViewProps> = ({ trip, onBack }) => {
    
    const [selectedStatType, setSelectedStatType] = useState<string | null>(null); 

    // Lọc sự kiện dựa trên loại cảnh báo được chọn
    const filteredEvents = useMemo(() => {
        if (!selectedStatType) return []; 
        return mockEvents.filter(e => e.type === selectedStatType);
    }, [selectedStatType]);
    
    // Lấy màu Tailwind của loại cảnh báo đang được chọn
    const currentStatColorClass = trip.details.find(stat => stat.type === selectedStatType)?.color || 'text-gray-800 dark:text-gray-100';

    return (
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            
            {/* Header và Nút Quay lại */}
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

            {/* Thẻ Tổng quan chi tiết */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <IconCard icon={MapPin} title="Lộ trình" value={trip.route} bgColor="bg-blue-100 dark:bg-blue-900/50" iconColor="text-blue-500" />
                <IconCard icon={Car} title="Phương tiện" value={trip.car} bgColor="bg-green-100 dark:bg-green-900/50" iconColor="text-green-500" />
                <IconCard icon={Clock} title="Thời gian" value={trip.duration} bgColor="bg-purple-100 dark:bg-purple-900/50" iconColor="text-purple-500" />
                <IconCard icon={AlertTriangle} title="Tổng cảnh báo" value={trip.warnings.toString()} bgColor="bg-red-100 dark:bg-red-900/50" iconColor="text-red-500" />
            </div>
            
            {/* Tiêu đề Thống kê cảnh báo */}
            <h3 className="text-lg font-bold mb-3">Thống kê cảnh báo</h3>

            {/* Các nút thống kê cảnh báo (Button thay đổi trạng thái lọc) */}
            <div className="flex flex-wrap gap-2 mb-8">
                {trip.details.map((stat) => {
                    const hexColor = tailwindColorMap[stat.color] || '#333';
                    const isSelected = stat.type === selectedStatType;
                    return (
                        <button
                            key={stat.type}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-full shadow-md transition-all border 
                                ${isSelected 
                                    ? `text-white ${stat.color} border-transparent`
                                    : `text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600`
                                }`}
                            style={isSelected ? { backgroundColor: hexColor } : {}}
                            // Logic: Click lần 1 chọn, Click lần 2 bỏ chọn (quay về Timeline tổng)
                            onClick={() => setSelectedStatType(isSelected ? null : stat.type)} 
                        >
                            {stat.type}: {stat.count}
                        </button>
                    );
                })}
            </div>

            {/* --- PHẦN LỊCH SỬ CẢNH BÁO ĐÃ LỌC (Hiển thị khi selectedStatType KHÁC null) --- */}
            {selectedStatType && (
                <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    {/* Tiêu đề Lịch sử cảnh báo đã lọc */}
                    <h4 className={`text-base font-semibold mb-3 ${currentStatColorClass.replace('bg-', 'text-')}`}>
                        Lịch sử cảnh báo {selectedStatType}
                    </h4>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div 
                                    className={`w-2 h-2 rounded-full inline-block mr-2 align-middle`} 
                                    style={{ backgroundColor: tailwindColorMap[event.color] }}
                                ></div>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.time}</span>
                                <p className="text-sm dark:text-gray-200 mt-1 pl-4">
                                    {event.description}
                                </p>
                            </div>
                        ))}
                        {filteredEvents.length === 0 && (
                            <p className="text-center text-gray-500 text-sm py-4">Không có cảnh báo nào thuộc loại này.</p>
                        )}
                    </div>
                </div>
            )}
            
            {/* --- PHẦN LỊCH SỬ TẤT CẢ SỰ KIỆN (CHỈ HIỂN THỊ KHI selectedStatType LÀ null) --- */}
            {!selectedStatType && (
                <>
                    <h2 className="text-xl font-bold mb-4 mt-8">
                        Lịch sử sự kiện (Tất cả: {mockEvents.length})
                    </h2>

                    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-4 space-y-4">
                        {mockEvents.map((event) => (
                            <div key={event.id} className="relative">
                                {/* Dot (Chấm trên Timeline) */}
                                {/* CHÚ Ý: event.dotColor đã được sửa trong mockEvents, nên nó đã đúng */}
                                <div className={`absolute -left-5 top-0.5 w-4 h-4 rounded-full border-4 ${event.dotColor} bg-white dark:bg-gray-900 ring-2 ring-gray-200 dark:ring-gray-700`}></div>
                                
                                {/* Event Card */}
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{event.time}</span>
                                        <Badge text={event.type} color={event.color} />
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TripDetailsView;