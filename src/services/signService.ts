const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const signService = {
  predictSign: async (imageBase64: string) => {
    const response = await fetch(`${API_URL}/sign/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_base64: imageBase64 }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend trả về ${response.status}: ${text}`);
    }

    return response.json();
  },
};
