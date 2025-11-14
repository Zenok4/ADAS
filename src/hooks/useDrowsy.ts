import { CoreFunctionService } from "@/services/coreFunctionService";
import { useState, useEffect, useCallback } from "react";

type DrowsyResult = {
  code: number;
  data: {
    is_drowsy: boolean;
    message: string;
    eye_aspect_ratio: number;
    latency_ms: number;
    frame_count: number;
  };
  message: string;
  success: boolean;
};

type UseDrowsyOptions = {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
  intervalMs?: number;
};

export function useDrowsy({
  videoRef,
  enabled = false,
  intervalMs = 1000,
}: UseDrowsyOptions) {
  const [result, setResult] = useState<DrowsyResult | null>(null);
  const [busy, setBusy] = useState(false);

  const captureAndSend = useCallback(async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Lấy data URL base64 (JPEG)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8); 
    // dataUrl dạng: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."

    setBusy(true);
    try {
      const { data } = await CoreFunctionService.drowsy(dataUrl);
      setResult(data);
    } catch (err) {
      console.error("Lỗi gửi ảnh lên AI:", err);
    } finally {
      setBusy(false);
    }
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(captureAndSend, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs, captureAndSend]);

  return { result, busy };
}
