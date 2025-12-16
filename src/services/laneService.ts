import api from "@/lib/api";
import { ApiUrls } from "../type/apiUrls";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const laneService = {
  predictLane: async (imageBase64: string) => {
    try {
    // Gọi đến Backend (Port 5000)
    const response = await api.post(ApiUrls.core_functions.lane, { image_base64: imageBase64 });

    return response.data;
    }catch (error) {
        console.error(`Backend Lane Error:`, error);
        return {data : {data: []}};
    }
  }
};