import api from "@/lib/api";
import { ApiUrls } from "../type/apiUrls";

export const objectService = {
  predictObject: async (imageBase64: string) => {
    try {
      const response = await api.post(ApiUrls.core_functions.object, {
        image_base64: imageBase64,
      });
      // Trả về data từ axios (đã được backend format chuẩn ở bước trên)
      return response.data;
    } catch (error) {
      console.error("Backend Object Error:", error);
      return { data: { data: [] } }; // Fallback an toàn
    }
  },
};