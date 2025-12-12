import { CoreFunctionService } from "@/services/coreFunctionService";
import { useState, useEffect, useCallback } from "react";
import { useAudioAlert } from "./useAudioAlert";

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
  soundEnabled?: boolean; // 🔊 bật/tắt cảnh báo âm thanh
};

export function useDrowsy({
  videoRef,
  enabled = false,
  intervalMs = 1000,
}: UseDrowsyOptions) {
  const [result, setResult] = useState<DrowsyResult | null>(null);
  const [busy, setBusy] = useState(false);

  const { alertDrowsiness } = useAudioAlert(true); // true = bật âm thanh

  // 🔹 Hàm chụp ảnh và gửi lên server
  const captureAndSend = useCallback(async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    setBusy(true);
    try {
      const { data } = await CoreFunctionService.drowsy(dataUrl);
      setResult(data);
      if (data?.data?.is_drowsy) {
        alertDrowsiness(`Cảnh báo buồn ngủ!`);
      }
    } catch (err) {
      console.error("Lỗi gửi ảnh lên AI:", err);
    } finally {
      setBusy(false);
    }
  }, [videoRef]);

  // 🔹 Reset kết quả
  const resetDrowsy = useCallback(() => setResult(null), []);

  // 🔹 Force capture ngay lập tức
  const forceCapture = useCallback(() => captureAndSend(), [captureAndSend]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(captureAndSend, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs, captureAndSend]);

  return { result, busy, resetDrowsy, forceCapture };
}
