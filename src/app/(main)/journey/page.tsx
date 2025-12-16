"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Car,
  Clock,
  AlertTriangle,
} from "lucide-react";

import IconCard from "./components/jn-icon-card";
import TripListItem from "./components/jn-list-item";
import TripDetailsView from "./components/jn-details";
import TripSearchBar from "./components/jn-search"; 
import JNPagination from "./components/jn-pagination"; 

// --- CẤU HÌNH PHÂN TRANG ---
const ITEMS_PER_PAGE = 5; // Số lượng mục trên mỗi trang

// --- KHAI BÁO KIỂU DỮ LIỆU (Giữ nguyên) ---
interface TripDetail {
  type: string;
  count: number;
  color: string;
}

interface TripData {
  id: string;
  date: string; // YYYY-MM-DD
  car: string;
  route: string;
  duration: string;
  warnings: number;
  details: TripDetail[];
}

// --- MOCK DATA (Đã thêm mục để kiểm tra phân trang) ---
const mockTrips: TripData[] = [
  {
    id: "trip-001",
    date: "2025-12-01", 
    car: "Toyota Camry 51A-12345",
    route: "Đà Nẵng - Huế",
    duration: "2h 15m",
    warnings: 22,
    details: [
      { type: "Buồn ngủ", count: 2, color: "bg-red-500" },
      { type: "Vật cản", count: 5, color: "bg-orange-500" },
      { type: "Làn đường", count: 3, color: "bg-blue-500" },
      { type: "Biển báo", count: 12, color: "bg-green-500" },
    ],
  },
  {
    id: "trip-002",
    date: "2025-11-30",
    car: "Toyota Camry 51A-12345",
    route: "Huế - Quảng Trị",
    duration: "2h 30m",
    warnings: 12,
    details: [
      { type: "Vật cản", count: 3, color: "bg-orange-500" },
      { type: "Làn đường", count: 1, color: "bg-blue-500" },
      { type: "Biển báo", count: 8, color: "bg-green-500" },
    ],
  },
  {
    id: "trip-003",
    date: "2025-11-29",
    car: "Honda City 43A-67890",
    route: "Đà Nẵng - Quảng Ngãi",
    duration: "2h 45m",
    warnings: 31,
    details: [
      { type: "Buồn ngủ", count: 4, color: "bg-red-500" },
      { type: "Vật cản", count: 7, color: "bg-orange-500" },
      { type: "Làn đường", count: 5, color: "bg-blue-500" },
      { type: "Biển báo", count: 15, color: "bg-green-500" },
    ],
  },
  // Thêm mục để kích hoạt phân trang
  { id: "trip-004", date: "2025-11-28", car: "Kia Morning 43B-00001", route: "Hà Nội - Hải Phòng", duration: "1h 45m", warnings: 10, details: [] },
  { id: "trip-005", date: "2025-11-27", car: "Kia Morning 43B-00001", route: "Hải Phòng - Hà Nội", duration: "1h 40m", warnings: 5, details: [] },
  { id: "trip-006", date: "2025-11-26", car: "Toyota Vios 51C-99999", route: "HCM - Vũng Tàu", duration: "2h 05m", warnings: 18, details: [] },
  { id: "trip-007", date: "2025-11-25", car: "Toyota Vios 51C-99999", route: "Vũng Tàu - HCM", duration: "2h 10m", warnings: 15, details: [] },
];


// --- COMPONENT CHÍNH ---
export default function TripHistoryPage() {
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  
  // States Lọc (Giữ nguyên)
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarDateFilter, setCalendarDateFilter] = useState<Date | undefined>(undefined);
  const [filterCar, setFilterCar] = useState("");
  const [filterLocation, setFilterLocation] = useState(""); 
  
  // STATE MỚI: Quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // --- Logic Lọc (Đã sửa tên thành allFilteredTrips và thêm reset currentPage) ---
  const allFilteredTrips = useMemo(() => {
    const locationTerm = filterLocation.toLowerCase().trim();
    const carTerm = filterCar.toLowerCase().trim();
    const generalSearchTerm = searchTerm.toLowerCase().trim();

    const results = mockTrips.filter((trip) => {
      const matchesSearch =
        trip.route.toLowerCase().includes(generalSearchTerm) ||
        trip.car.toLowerCase().includes(generalSearchTerm);

      const matchesCar = carTerm === "" || trip.car.toLowerCase().includes(carTerm);
      const matchesLocation = locationTerm === "" || trip.route.toLowerCase().includes(locationTerm);

      const matchesDate = calendarDateFilter
        ? (() => {
            const dateString = trip.date.replace(' ', '-');
            const [y, m, d] = dateString.split("-");
            const tripDate = new Date(Number(y), Number(m) - 1, Number(d));
            return tripDate.toDateString() === calendarDateFilter.toDateString(); 
          })()
        : true; 

      return matchesSearch && matchesCar && matchesLocation && matchesDate;
    });
    
    // Quan trọng: Reset trang về 1 khi kết quả lọc thay đổi
    setCurrentPage(1); 
    return results;
  }, [searchTerm, filterCar, filterLocation, calendarDateFilter]); 

  // LOGIC MỚI: Cắt dữ liệu cho trang hiện tại
  const currentTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allFilteredTrips.slice(startIndex, endIndex);
  }, [allFilteredTrips, currentPage]);


  // 🛑 HÀM MỚI: Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(allFilteredTrips.length / ITEMS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // --- Các hàm và tổng hợp dữ liệu (Giữ nguyên) ---
  const totalWarnings = useMemo(() => mockTrips.reduce((sum, t) => sum + t.warnings, 0), []);
  const totalDuration = "11h 45m";
  const lastTrip = mockTrips[0] || { route: "N/A", car: "N/A" };
  const lastRoute = lastTrip.route;
  const lastCar = lastTrip.car.split(' ')[0]; 

  const handleTripClick = (trip: TripData) => setSelectedTrip(trip);
  const handleBackToList = () => setSelectedTrip(null);

  if (selectedTrip) {
    return <TripDetailsView trip={selectedTrip} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-2">Lịch sử hành trình</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Xem lại các chuyến đi và cảnh báo an toàn
      </p>

      {/* --- Tổng quan --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <IconCard
          icon={MapPin}
          title="Hành trình gần nhất"
          value={lastRoute}
          bgColor="bg-blue-100 dark:bg-blue-900/50"
          iconColor="text-blue-500"
        />
        <IconCard
          icon={Car}
          title="Tên xe"
          value={lastCar}
          bgColor="bg-green-100 dark:bg-green-900/50"
          iconColor="text-green-500"
        />
        <IconCard
          icon={Clock}
          title="Tổng thời gian"
          value={totalDuration}
          bgColor="bg-purple-100 dark:bg-purple-900/50"
          iconColor="text-purple-500"
        />
        <IconCard
          icon={AlertTriangle}
          title="Tổng cảnh báo"
          value={totalWarnings.toString()}
          bgColor="bg-red-100 dark:bg-red-900/50"
          iconColor="text-red-500"
        />
      </div>

      {/* --- Thanh tìm kiếm & bộ lọc --- */}
      <TripSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCar={filterCar}
        setFilterCar={setFilterCar}
        calendarDateFilter={calendarDateFilter}
        setCalendarDateFilter={setCalendarDateFilter}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
      />

      {/* --- Danh sách hành trình --- */}
      <h2 className="text-xl font-bold mb-4">
        Danh sách hành trình ({allFilteredTrips.length})
      </h2>

      <div className="space-y-4">
        {/* SỬ DỤNG currentTrips THAY VÌ filteredTrips */}
        {currentTrips.length > 0 ? ( 
          currentTrips.map((trip) => (
            <TripListItem key={trip.id} trip={trip} onClick={() => handleTripClick(trip)} />
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 p-4 border rounded-lg bg-white dark:bg-gray-800">
            Không có hành trình nào phù hợp với điều kiện tìm kiếm/lọc.
          </div>
        )}
      </div>

      {/* COMPONENT PHÂN TRANG MỚI */}
      <JNPagination 
        totalItems={allFilteredTrips.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}