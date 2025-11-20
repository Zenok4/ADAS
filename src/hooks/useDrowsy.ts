import { CoreFunctionService } from "@/services/coreFunctionService";
import { useState, useEffect, useCallback, useRef } from "react";

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
  soundEnabled = true,
}: UseDrowsyOptions) {
  const [result, setResult] = useState<DrowsyResult | null>(null);
  const [busy, setBusy] = useState(false);

  // 🔹 Quản lý giọng nói
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const lastSpoken = useRef<string | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceList(voices);

      if (!selectedVoice) {
        const viVoice = voices.find(v => v.lang.startsWith("vi"));
        setSelectedVoice(viVoice || voices[0] || null);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // 🔹 Hàm đọc âm thanh
  const speak = useCallback(
    (text: string) => {
      if (!soundEnabled || !window.speechSynthesis) return;

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "vi-VN";

      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1;

      console.log("Utterance created:", text); // ===================== Âm thanh cảnh báo =====================
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    },
    [soundEnabled, selectedVoice]
  );

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

      // 🔹 Nếu phát hiện buồn ngủ, đọc cảnh báo
      if (data.data.is_drowsy && lastSpoken.current !== data.data.message) {
        speak(data.data.message);
        lastSpoken.current = data.data.message;
      } else if (!data.data.is_drowsy) {
        lastSpoken.current = null; // reset khi tài xế bình thường
      }
    } catch (err) {
      console.error("Lỗi gửi ảnh lên AI:", err);
    } finally {
      setBusy(false);
    }
  }, [videoRef, speak]);

  // 🔹 Reset kết quả
  const resetDrowsy = useCallback(() => setResult(null), []);

  // 🔹 Force capture ngay lập tức
  const forceCapture = useCallback(() => captureAndSend(), [captureAndSend]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(captureAndSend, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs, captureAndSend]);

  return { result, busy, resetDrowsy, forceCapture, speak };
}
