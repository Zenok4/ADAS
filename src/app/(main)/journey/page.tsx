"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Car, Clock, AlertTriangle } from "lucide-react";

// Import các component con
import IconCard from "./components/jn-icon-card";
import TripListItem from "./components/jn-list-item";
import TripDetailsView from "./components/jn-details";
import TripSearchBar from "./components/jn-search";
import JNPagination from "./components/jn-pagination";

// Import service gọi API (đã tạo ở bước trước)
import { fetchTrips, fetchTripSummary } from "@/services/tripService";
import { useSession } from "@/context/SessionContext";

// --- INTERFACES ---
interface TripDetail {
  type: string;
  count: number;
  color: string;
}

interface TripData {
  id: string;
  date: string;
  car: string;
  route: string;
  duration: string;
  warnings: number;
  details: TripDetail[];
  rawEvents?: any[]; // Dữ liệu sự kiện gốc để truyền vào trang chi tiết
}

// Mapping màu sắc cảnh báo
const ALERT_MAPPING: Record<string, { label: string; color: string }> = {
  drowsiness: { label: "Buồn ngủ", color: "bg-red-500" },
  lane: { label: "Làn đường", color: "bg-blue-500" },
  object: { label: "Vật cản", color: "bg-orange-500" },
  sign: { label: "Biển báo", color: "bg-green-500" },
};

// --- HÀM HELPER: CHUYỂN TOẠ ĐỘ -> TÊN THÀNH PHỐ (Reverse Geocoding) ---
const getCityName = async (lat: number, lng: number) => {
  try {
    // Sử dụng API miễn phí của OpenStreetMap (Nominatim)
    // zoom=10: Lấy mức độ Thành phố/Quận
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "Accept-Language": "vi-VN", // Yêu cầu trả về tiếng Việt
      },
    });

    if (!response.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    const data = await response.json();

    if (data && data.address) {
      // Ưu tiên lấy theo thứ tự: Thành phố -> Thị xã -> Tỉnh
      const city =
        data.address.city || data.address.town || data.address.state || "";
      const country = data.address.country || "";

      if (city && country) return `${city}, ${country}`;
      return city || data.display_name.split(",")[0]; // Fallback lấy tên ngắn gọn nhất
    }

    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Lỗi lấy tên địa điểm:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // Fallback về toạ độ nếu lỗi mạng
  }
};

export default function TripHistoryPage() {
  // --- STATE DỮ LIỆU ---
  const [trips, setTrips] = useState<TripData[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [currentAddress, setCurrentAddress] = useState("Đang cập nhật..."); // State lưu địa chỉ text
  const [loading, setLoading] = useState(true);

  // --- STATE UI & FILTER ---
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarDateFilter, setCalendarDateFilter] = useState<
    Date | undefined
  >(undefined);
  const [filterCar, setFilterCar] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useSession();

  useEffect(() => {
    if (user) {
      return;
    }
  }, [user]);

  // --- CẤU HÌNH ---
  const ITEMS_PER_PAGE = 5;
  const USER_ID = user?.id;

  // --- 1. GỌI API KHI TRANG LOAD ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Gọi song song API danh sách và API tổng hợp
        const [tripsRes, summaryRes] = await Promise.all([
          fetchTrips(USER_ID),
          fetchTripSummary(USER_ID),
        ]);

        // Xử lý danh sách chuyến đi
        if (tripsRes && tripsRes.code === 200) {
          const mappedTrips = tripsRes?.data?.map((item: any, index: number) =>
            mapBackendDataToFrontend(item, index)
          );
          setTrips(mappedTrips);
        }

        // Xử lý thông tin tổng hợp (Summary)
        if (summaryRes && summaryRes.code === 200) {
          setSummaryData(summaryRes.data);

          // -> LOGIC QUAN TRỌNG: LẤY ĐỊA CHỈ TỪ TOẠ ĐỘ <-
          if (summaryRes.data.latest_location) {
            const { latitude, longitude } = summaryRes.data.latest_location;
            // Nếu có toạ độ hợp lệ (khác 0 hoặc null)
            if (latitude && longitude) {
              const addressName = await getCityName(latitude, longitude);
              setCurrentAddress(addressName);
            } else {
              setCurrentAddress("Chưa có dữ liệu vị trí");
            }
          }
        }
      } catch (error) {
        console.error("Lỗi tải trang:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- 2. HÀM MAPPING DỮ LIỆU (Backend Python -> Frontend React) ---
  const mapBackendDataToFrontend = (
    backendItem: any,
    index: number
  ): TripData => {
    // Tính toán giờ phút
    const hours = Math.floor(backendItem.duration_minutes / 60);
    const minutes = backendItem.duration_minutes % 60;
    const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Map Alerts
    const details: TripDetail[] = [];
    if (backendItem.alerts) {
      Object.entries(backendItem.alerts).forEach(([key, count]) => {
        if (key !== "total" && (count as number) > 0) {
          const mapping = ALERT_MAPPING[key] || {
            label: key,
            color: "bg-gray-500",
          };
          details.push({
            type: mapping.label,
            count: count as number,
            color: mapping.color,
          });
        }
      });
    }

    const carNameFull = backendItem.car
      ? `${backendItem.car.name} ${backendItem.car.plate}`
      : "Xe không xác định";

    return {
      id: `trip-${index}`,
      date: backendItem.date,
      car: carNameFull,
      route: "Đà Nẵng - Quảng Nam", // Backend hiện chưa trả về route text, tạm hardcode hoặc để placeholder
      duration: durationStr,
      warnings: backendItem.alerts?.total || 0,
      details: details,
      rawEvents: backendItem.events, // Lưu raw events cho trang chi tiết
    };
  };

  // --- 3. LOGIC LỌC (CLIENT-SIDE) ---
  const allFilteredTrips = useMemo(() => {
    const locationTerm = filterLocation.toLowerCase().trim();
    const carTerm = filterCar.toLowerCase().trim();
    const generalSearchTerm = searchTerm.toLowerCase().trim();

    const results = trips?.filter((trip) => {
      const matchesSearch =
        trip.route.toLowerCase().includes(generalSearchTerm) ||
        trip.car.toLowerCase().includes(generalSearchTerm);

      const matchesCar =
        carTerm === "" || trip.car.toLowerCase().includes(carTerm);
      const matchesLocation =
        locationTerm === "" || trip.route.toLowerCase().includes(locationTerm);

      const matchesDate = calendarDateFilter
        ? (() => {
            const dateString = trip.date.replace(" ", "-");
            const [y, m, d] = dateString.split("-");
            const tripDate = new Date(trip.date);
            // So sánh ngày/tháng/năm
            return (
              tripDate.getDate() === calendarDateFilter.getDate() &&
              tripDate.getMonth() === calendarDateFilter.getMonth() &&
              tripDate.getFullYear() === calendarDateFilter.getFullYear()
            );
          })()
        : true;

      return matchesSearch && matchesCar && matchesLocation && matchesDate;
    });

    // Reset về trang 1 khi bộ lọc thay đổi
    if (currentPage !== 1) setCurrentPage(1);

    return results;
  }, [searchTerm, filterCar, filterLocation, calendarDateFilter, trips]);

  // --- 4. LOGIC PHÂN TRANG ---
  const currentTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allFilteredTrips?.slice(startIndex, endIndex);
  }, [allFilteredTrips, currentPage]);

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(allFilteredTrips?.length / ITEMS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- 5. ĐIỀU HƯỚNG ---
  const handleTripClick = (trip: TripData) => setSelectedTrip(trip);
  const handleBackToList = () => setSelectedTrip(null);

  // Nếu đang chọn xem chi tiết -> Render trang chi tiết
  if (selectedTrip) {
    return <TripDetailsView trip={selectedTrip} onBack={handleBackToList} />;
  }

  // --- 6. RENDER GIAO DIỆN CHÍNH ---
  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-2">Lịch sử hành trình</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Xem lại các chuyến đi và cảnh báo an toàn
      </p>

      {/* --- PHẦN TỔNG QUAN (SUMMARY) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <IconCard
          icon={MapPin}
          title="Vị trí gần nhất"
          value={currentAddress} // <- ĐÃ THAY ĐỔI: Hiển thị tên địa điểm thay vì toạ độ
          bgColor="bg-blue-100 dark:bg-blue-900/50"
          iconColor="text-blue-500"
        />
        <IconCard
          icon={Car}
          title="Tên xe"
          value={summaryData?.car_name || "N/A"}
          bgColor="bg-green-100 dark:bg-green-900/50"
          iconColor="text-green-500"
        />
        <IconCard
          icon={Clock}
          title="Tổng thời gian"
          value={
            summaryData
              ? `${Math.floor(
                  summaryData.total_time_seconds / 3600
                )}h ${Math.floor(
                  (summaryData.total_time_seconds % 3600) / 60
                )}m`
              : "0h 0m"
          }
          bgColor="bg-purple-100 dark:bg-purple-900/50"
          iconColor="text-purple-500"
        />
        <IconCard
          icon={AlertTriangle}
          title="Tổng cảnh báo"
          value={summaryData?.total_alerts?.toString() || "0"}
          bgColor="bg-red-100 dark:bg-red-900/50"
          iconColor="text-red-500"
        />
      </div>

      {/* --- THANH TÌM KIẾM --- */}
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

      {/* --- DANH SÁCH HÀNH TRÌNH --- */}
      <h2 className="text-xl font-bold mb-4">
        Danh sách hành trình ({allFilteredTrips?.length})
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTrips?.length > 0 ? (
            currentTrips?.map((trip) => (
              <TripListItem
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              Không có hành trình nào phù hợp với điều kiện tìm kiếm.
            </div>
          )}
        </div>
      )}

      {/* --- PHÂN TRANG --- */}
      {!loading && allFilteredTrips?.length > 0 && (
        <JNPagination
          totalItems={allFilteredTrips?.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
