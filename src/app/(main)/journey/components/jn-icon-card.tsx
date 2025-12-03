import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- ĐỊNH NGHĨA GIAO DIỆN TRỰC TIẾP TRONG COMPONENT ---
interface IconCardProps {
    icon: LucideIcon;
    title: string;
    value: string;
    // Màu nền cho vòng tròn icon (ví dụ: bg-blue-100 dark:bg-blue-900/50)
    bgColor?: string; 
    // Màu cho icon (ví dụ: text-blue-500)
    iconColor?: string; 
}

const IconCard: React.FC<IconCardProps> = ({
    icon: Icon,
    title,
    value,
    // Đặt mặc định là màu nền trắng/xám cho thẻ ngoài cùng
    bgColor = "bg-white dark:bg-gray-800", 
    iconColor = "text-gray-500",
}) => {
    
    return (
        // Thẻ ngoài cùng: Đặt màu nền là trắng/xám (giống như ảnh mẫu)
        <div
            className={`p-4 rounded-xl shadow-md flex items-center space-x-4 transition-all duration-300 bg-white dark:bg-gray-800`}
        >
            {/* Vòng tròn icon: Sử dụng bgColor/iconColor đã truyền vào */}
            <div 
                className={`p-3 rounded-full ${iconColor} ${bgColor}`}
            >
                <Icon className="w-6 h-6" />
            </div>
            
            {/* Nội dung */}
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default IconCard;