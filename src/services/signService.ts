const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const signService = {
  predictSign: async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_URL}/sign/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend trả về ${response.status}: ${text}`);
    }

    return response.json();
  },
};
