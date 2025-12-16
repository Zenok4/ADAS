const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const objectService = {
  predictObject: async (imageBase64: string) => {
    try {
      const response = await fetch(`${API_URL}/object/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      // Giả sử backend trả về cấu trúc chuẩn { data: { data: [...] } } hoặc { data: [...] }
      // Bạn điều chỉnh return tùy theo response thực tế của flask
      return result.data;
    } catch (error) {
      console.error("Lỗi kết nối tới Object Service:", error);
      return [];
    }
  },
};
