import React, { useState } from 'react';
import { MapPin, Clock, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';
import Badge from './jn-badge';

interface TripDetail {
    type: string;
    count: number;
    color: string;
}

interface TripData {
    // Để khớp với giao diện, format chuỗi date phải là "YYYY-MM-DD" (ví dụ: "2025-12-01")
    date: string; 
    car: string; // VD: "Toyota Camry 51A-12345"
    route: string; // VD: "Đà Nẵng - Huế"
    duration: string; // VD: "2h 15m"
    warnings: number;
    details: TripDetail[];
}

interface TripListItemProps {
    trip: TripData;
    onClick: () => void;
}

const TripListItem: React.FC<TripListItemProps> = ({ trip, onClick }) => {

    const WarningIcon = AlertTriangle;
    const warningColor = trip.warnings > 20 ? "text-red-500 dark:text-red-400" : "text-orange-500 dark:text-orange-400";

    // --- PHẦN SỬA ĐỔI QUAN TRỌNG: Tách Năm, Tháng, Ngày từ chuỗi "YYYY-MM-DD" ---
    // Giả định chuỗi date có định dạng "YYYY-MM-DD" hoặc "YYYY/MM/DD"
    const [year, month, day] = trip.date.split(/[-\/]/); 

    const handleItemClick = () => {
        onClick();
    }

    // Phân tách Tên xe và Biển số xe để hiển thị sạch hơn
    const carParts = trip.car.split(' ');
    const carName = carParts.slice(0, carParts.length - 1).join(' ');
    const licensePlate = carParts[carParts.length - 1];

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={handleItemClick} // <-- Điều hướng khi click
        >
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
                {/* Cột trái: Ngày, Xe, Tuyến, Thời gian */}
                <div className="flex items-center space-x-6 w-full sm:w-auto mb-2 sm:mb-0">
                    
                    {/* Đảm bảo w-auto để không làm hỏng căn chỉnh */}
                    <div className="text-center flex-shrink-0"> 
                        {/* Ngày (01) */}
                        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                            {day} {month} 
                        </p>
                        {/* Năm (2025) */}
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                            {year} 
                        </p>
                    </div>
                    
                    {/* Thông tin chuyến đi */}
                    <div className="flex flex-col space-y-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{carName} ({licensePlate})</p>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{trip.route}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
                            <span>{trip.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Cảnh báo và Icon mở rộng */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                    {/* Cảnh báo và Badges */}
                    <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center text-sm font-semibold">
                            <WarningIcon className={`w-4 h-4 mr-1 ${warningColor}`} />
                            <span className={warningColor}>{trip.warnings} cảnh báo</span>
                        </div>

                        <div className="flex flex-wrap justify-end gap-1">
                            {/* Hiển thị chi tiết cảnh báo dưới dạng Badge */}
                            {trip.details.map((detail, dIndex) => (
                                <Badge key={dIndex} text={`${detail.type}: ${detail.count}`} color={detail.color} />
                            ))}
                        </div>
                    </div>
                    
                    {/* Icon mũi tên (luôn là ChevronRight) */}
                    <div className="pl-2">
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TripListItem;