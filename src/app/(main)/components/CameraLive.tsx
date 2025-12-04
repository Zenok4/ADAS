"use client";
import React, { useRef, useState, useEffect } from "react";
// Import service
import { signService } from "@/services/signService";
import { objectService } from "@/services/ai/objectService";

interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
  type: "sign" | "object";
}

interface CameraLiveProps {
  className?: string;
  startCamera: boolean;
  enableSign: boolean;
  enableObject: boolean;
}

// Map tần suất ra mili-giây
const FREQUENCY_MAP = {
  high: 330, // ~3 req/s
  medium: 1000, // 1 req/s
  low: 2000, // 0.5 req/s
};

const getBoxColor = (className: string, type: "sign" | "object"): string => {
  if (type === "object") return "#ff0000";
  const name = (className || "").toLowerCase();
  if (name.includes("phụ")) return "#a020f0";
  if (name.includes("nguy hiểm") || name.includes("cảnh báo")) return "#ff0000";
  if (name.includes("hiệu lệnh")) return "#007bff";
  if (name.includes("chỉ dẫn")) return "#00cc66";
  if (name.includes("cấm")) return "#ff8000";
  return "#ffff00";
};

export default function CameraLive({
  className,
  startCamera,
  enableSign,
  enableObject,
}: CameraLiveProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const loadingRef = useRef(false);

  const [detections, setDetections] = useState<Detection[]>([]);

  // State lưu thời gian interval hiện tại
  const [intervalMs, setIntervalMs] = useState(1000);

  // 0. Đọc cấu hình từ LocalStorage khi component mount hoặc khi có sự kiện update
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("adas_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          const freq = parsed.alert?.frequency as keyof typeof FREQUENCY_MAP;
          if (freq && FREQUENCY_MAP[freq]) {
            setIntervalMs(FREQUENCY_MAP[freq]);
          }
        }
      } catch (e) {
        console.warn("Dùng cấu hình mặc định do lỗi đọc storage");
      }
    };

    loadSettings();

    // Lắng nghe sự kiện nếu settings thay đổi ở tab khác
    window.addEventListener("adas_settings_updated", loadSettings);
    return () =>
      window.removeEventListener("adas_settings_updated", loadSettings);
  }, []);

  // 1. Khởi động camera
  useEffect(() => {
    if (!startCamera) return;
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("❌ Không thể truy cập camera:", err);
      }
    };
    startCam();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [startCamera]);

  // 2. Hàm hỗ trợ lấy data
  const safeGetList = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  // 3. Gửi frame đến AI
  const processAI = async () => {
    if ((!enableSign && !enableObject) || !startCamera || loadingRef.current)
      return;

    loadingRef.current = true;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0) {
      loadingRef.current = false;
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      loadingRef.current = false;
      return;
    }

    // Resize ảnh nhỏ lại để gửi API nhanh hơn (nếu cần, ở đây giữ nguyên logic cũ)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas
      .toDataURL("image/jpeg", 0.5)
      .replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    try {
      const promises = [];

      if (enableSign) {
        promises.push(
          signService
            .predictSign(base64)
            .then((res) => {
              const list = safeGetList(res);
              return list
                .filter(
                  (item: any) =>
                    Array.isArray(item.box) && item.box.length === 4
                )
                .map((item: any) => ({ ...item, type: "sign" }));
            })
            .catch(() => [])
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (enableObject) {
        promises.push(
          objectService
            .predictObject(base64)
            .then((res) => {
              const list = safeGetList(res);
              return list
                .filter(
                  (item: any) =>
                    Array.isArray(item.box) && item.box.length === 4
                )
                .map((item: any) => ({ ...item, type: "object" }));
            })
            .catch(() => [])
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      const [signResults, objectResults] = await Promise.all(promises);
      setDetections([...signResults, ...objectResults]);
    } catch (err) {
      console.error("❌ Lỗi xử lý AI:", err);
    } finally {
      loadingRef.current = false;
    }
  };

  // 4. Loop - Sử dụng intervalMs động
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (startCamera && (enableSign || enableObject)) {
      // console.log("Starting AI Loop with interval:", intervalMs);
      interval = setInterval(() => processAI(), intervalMs);
    } else {
      setDetections([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startCamera, enableSign, enableObject, intervalMs]); // Re-run khi intervalMs đổi

  // 5. Vẽ boxes (Giữ nguyên logic cũ)
  useEffect(() => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detections.length === 0) return;

    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      const w = x2 - x1;
      const h = y2 - y1;
      const color = getBoxColor(det.class_name, det.type);

      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, w, h);

      ctx.fillStyle = color;
      const text = `${det.class_name} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = "bold 16px Arial";
      const textWidth = ctx.measureText(text).width;

      const labelY = y1 > 25 ? y1 - 25 : y1;
      ctx.fillRect(x1, labelY, textWidth + 10, 25);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, x1 + 5, labelY + 18);
    });
  }, [detections]);

  return (
    <div
      className={`${className} relative overflow-hidden bg-black rounded-lg`}
    >
      {startCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
          Nhấn “Mở camera” để bật Camera
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Hiển thị info debug nhỏ */}
      {(enableSign || enableObject) && startCamera && (
        <div className="absolute bottom-2 left-2 flex gap-2 z-20 pointer-events-none">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            Delay: {intervalMs}ms
          </div>
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            {detections.length > 0
              ? `Phát hiện: ${detections.length}`
              : "Đang quét..."}
          </div>
        </div>
      )}
    </div>
  );
}
