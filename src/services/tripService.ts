// src/services/tripService.ts
import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

// Gọi API lấy danh sách chuyến đi
export const fetchTrips = async (
  userId: number,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params: any = { user_id: userId };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get(ApiUrls.trip.list, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return null;
  }
};

// Gọi API lấy thông tin tổng hợp (Summary)
export const fetchTripSummary = async (userId: number) => {
  try {
    const response = await api.get(ApiUrls.trip.summary, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
};
