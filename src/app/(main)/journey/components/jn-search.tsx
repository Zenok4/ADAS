"use client";

import * as React from "react";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
// Giả định component JourneyCalendar của bạn đã có tính năng dropdown tháng/năm
import JourneyCalendar from "./jn-calendar"; 

// --- KHAI BÁO KIỂU DỮ LIỆU CHÍNH ---
interface TripSearchBarProps {
    // Trạng thái của ô tìm kiếm chung
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    
    // Trạng thái của Bộ lọc Nâng cao (đã áp dụng)
    filterCar: string;
    setFilterCar: (car: string) => void;
    calendarDateFilter: Date | undefined;
    setCalendarDateFilter: (date: Date | undefined) => void;
    // THÊM STATE LỌC ĐỊA ĐIỂM
    filterLocation: string;
    setFilterLocation: (location: string) => void;
}

// --- Hàm format ngày DD/MM/YYYY ---
const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return "";
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const yearStr = date.getFullYear();
    return `${dayStr}/${monthStr}/${yearStr}`;
};

// --- Calendar Popup ---
interface CalendarPopupProps {
    selectedDate: Date | undefined;
    onSelectDate: (d: Date | undefined) => void;
    onClose: () => void;
}

function CalendarPopup({ selectedDate, onSelectDate, onClose }: CalendarPopupProps) {
    const popupRef = React.useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={popupRef} className="absolute top-full mt-1 right-0 z-50"> 
            <JourneyCalendar
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                    onSelectDate(d);
                    if (d) onClose();
                }}
            />
        </div>
    );
}

// --- COMPONENT CHÍNH ---
export default function TripSearchBar({
    searchTerm,
    setSearchTerm,
    filterCar,
    setFilterCar,
    calendarDateFilter,
    setCalendarDateFilter,
    // LẤY STATE LỌC ĐỊA ĐIỂM TỪ PROPS
    filterLocation,
    setFilterLocation,
}: TripSearchBarProps) {
    const { useMemo, useState, useEffect } = React;

    // Trạng thái UI: Ẩn/Hiện form bộ lọc
    const [isFilterVisible, setIsFilterVisible] = useState(false); 
    // Trạng thái UI: Ẩn/Hiện Calendar Popup
    const [showCalendar, setShowCalendar] = useState(false); 

    // Trạng thái TẠM THỜI (dùng để nhập liệu trong form, chưa áp dụng)
    const [tempCar, setTempCar] = useState(filterCar);
    const [tempDate, setTempDate] = useState(calendarDateFilter);
    // STATE TẠM THỜI CHO LỌC ĐỊA ĐIỂM
    const [tempLocation, setTempLocation] = useState(filterLocation);
    
    // Đồng bộ trạng thái TẠM THỜI khi trạng thái ĐÃ ÁP DỤNG (props) thay đổi
    useEffect(() => {
        setTempCar(filterCar);
        setTempDate(calendarDateFilter);
        setTempLocation(filterLocation);
    }, [filterCar, calendarDateFilter, filterLocation]);

    // Trạng thái kiểm tra xem có bộ lọc nào đang được ÁP DỤNG không
    const isFilterActive = useMemo(() => {
        return !!filterCar || !!calendarDateFilter || !!filterLocation;
    }, [filterCar, calendarDateFilter, filterLocation]);

    // --- Xử lý Áp dụng Bộ lọc (GIỮ FORM MỞ) ---
    const handleApplyFilters = () => {
        // Áp dụng các giá trị tạm thời vào các state chính
        setFilterCar(tempCar);
        setCalendarDateFilter(tempDate);
        // ÁP DỤNG LỌC ĐỊA ĐIỂM
        setFilterLocation(tempLocation);
        
        // GIỮ FORM LỌC MỞ sau khi áp dụng
        // setIsFilterVisible(false); // Loại bỏ lệnh đóng form này
    };

    // --- Xử lý Đặt lại Bộ lọc (Reset 3 ô lọc và áp dụng rỗng) ---
    const handleResetFilters = () => {
        // Reset trạng thái TẠM THỜI về giá trị rỗng
        setTempCar("");
        setTempDate(undefined);
        setTempLocation(""); // RESET ĐỊA ĐIỂM TẠM THỜI

        // Reset trạng thái ĐÃ ÁP DỤNG về rỗng (để xóa lọc)
        setFilterCar("");
        setCalendarDateFilter(undefined);
        setFilterLocation(""); // RESET ĐỊA ĐIỂM ĐÃ ÁP DỤNG
    };

    // --- Xử lý Mở/Đóng Form Lọc ---
    const handleFilterToggle = () => {
        if (isFilterVisible) {
            // Nếu người dùng đóng form, hủy mọi thay đổi TẠM THỜI chưa áp dụng, 
            // đồng bộ về trạng thái ĐÃ ÁP DỤNG cuối cùng.
            setTempCar(filterCar);
            setTempDate(calendarDateFilter);
            setTempLocation(filterLocation);
        }
        setIsFilterVisible((prev) => !prev);
    };

    return (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            
            {/* Hàng 1: Thanh tìm kiếm chính và Nút Bộ lọc */}
            <div className="flex space-x-3 items-center">
                
                {/* 1. Input tìm kiếm (Luôn Full-width) */}
                <div className="relative flex-grow">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm chung (Địa điểm, Biển số xe, Tuyến đường...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400"
                    />
                </div>

                {/* 2. Nút mở/đóng bộ lọc */}
                <button
                    onClick={handleFilterToggle}
                    className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                        isFilterVisible || isFilterActive
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title={isFilterActive ? "Bộ lọc đang được áp dụng" : "Mở bộ lọc nâng cao"}
                >
                    <Filter className="w-4 h-4 mr-1.5" /> 
                    {isFilterVisible ? "Đóng lọc" : "Bộ lọc"}
                </button>
            </div>

            {/* Hàng 2: Form Bộ lọc Nâng cao (Hiện/Ẩn - Không ảnh hưởng đến Hàng 1) */}
            {isFilterVisible && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Bộ lọc nâng cao</h4>
                    {/* THAY ĐỔI LƯỚI SANG grid-cols-3 ĐỂ CHỨA THÊM TRƯỜNG LỌC ĐỊA ĐIỂM */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* 2.1 Lọc theo ngày (Sử dụng TempDate) */}
                        <div className="relative">
                            <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Ngày (DD/MM/YYYY)</label>
                            <input
                                type="text"
                                placeholder="Chọn ngày"
                                value={tempDate ? formatDateForDisplay(tempDate) : ""}
                                readOnly
                                onClick={() => setShowCalendar((prev) => !prev)}
                                className="w-full px-4 py-2 pr-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            />
                            
                            {/* Nút mở lịch */}
                            <button
                                onClick={() => setShowCalendar((prev) => !prev)}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 mt-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                                title="Chọn ngày"
                            >
                                <CalendarIcon className="w-5 h-5" />
                            </button>

                            {/* Nút xóa ngày */}
                            {tempDate && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTempDate(undefined);
                                    }}
                                    className="absolute right-7 top-1/2 transform -translate-y-1/2 mt-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                                    title="Xóa ngày"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Calendar Popup */}
                            {showCalendar && (
                                <CalendarPopup
                                    selectedDate={tempDate}
                                    onSelectDate={(d) => {
                                        setTempDate(d);
                                        setShowCalendar(false); 
                                    }}
                                    onClose={() => setShowCalendar(false)}
                                />
                            )}
                        </div>

                        {/* 2.2 Lọc theo biển số xe (Sử dụng TempCar) */}
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Biển số xe</label>
                            <input
                                type="text"
                                placeholder="VD: 51A-12345"
                                value={tempCar}
                                onChange={(e) => setTempCar(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        {/* 2.3 Lọc theo địa điểm (Sử dụng TempLocation) */}
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Địa điểm/Tuyến đường</label>
                            <input
                                type="text"
                                placeholder="VD: Đà Nẵng, Cao tốc"
                                value={tempLocation}
                                onChange={(e) => setTempLocation(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Nút thao tác */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            onClick={handleResetFilters} 
                            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Đặt lại
                        </button>
                        <button 
                            onClick={handleApplyFilters} 
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}