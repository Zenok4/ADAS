import { useState, useEffect, useCallback, useRef } from "react";

export const useAudioAlert = (soundEnabled: boolean = true) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Lưu lịch sử câu đọc (chống spam)
  const lastSpeakRef = useRef<{ text: string; time: number }>({
    text: "",
    time: 0,
  });

  // Load voice (ưu tiên tiếng Việt, nếu không có thì để null để fallback)
  useEffect(() => {
    const loadVoice = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(
        (v) => v.lang === "vi-VN" || v.lang.startsWith("vi")
      );
      if (viVoice) setVoice(viVoice);
    };

    loadVoice();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
  }, []);

  const speak = useCallback(
    (text: string, isUrgent: boolean = false) => {
      console.log("Yêu cầu đọc:", text, "Khẩn cấp:", isUrgent);
      if (!text || !soundEnabled) return;
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const synth = window.speechSynthesis;

      const now = Date.now();
      const isSameText = text === lastSpeakRef.current.text;
      const timeDiff = now - lastSpeakRef.current.time;

      // Chống spam (1.5s khẩn cấp, 3s thường)
      const spamThreshold = isUrgent ? 1500 : 3000;
      if (isSameText && timeDiff < spamThreshold) return;

      // Ưu tiên khẩn cấp → chỉ cancel nếu đang đọc
      if (isUrgent && synth.speaking) {
        synth.cancel();
      }

      // Tin thường không được cắt ngang tin "cảnh báo"
      if (
        !isUrgent &&
        synth.speaking &&
        lastSpeakRef.current.text.includes("Cảnh báo")
      ) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Nếu có giọng Việt thì dùng
      if (voice) utterance.voice = voice;

      // Nếu không có voice → Chrome fallback sang voice mặc định (OK)
      utterance.lang = "vi-VN";
      utterance.rate = 1;

      synth.speak(utterance);

      lastSpeakRef.current = { text, time: now };
    },
    [soundEnabled, voice]
  );

  return {
    alertDrowsiness: (msg: string) => speak(msg, true),
    announceTrafficSign: (msg: string) => speak(msg, false),
    warnLaneDeparture: (msg: string) => speak(msg, false),
    warnObstacle: (msg: string) => speak(msg, false),

    stopAudio: () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
  };
};
