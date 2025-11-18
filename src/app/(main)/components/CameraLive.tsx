"use client";
import React, { useRef, useState, useEffect } from "react";
import { signService } from "@/services/signService";

interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
}

interface CameraLiveProps {
  className?: string;
  startCamera: boolean;
  enabled: boolean;
}

const getBoxColor = (className: string): string => {
  const name = className.toLowerCase();
  if (name.includes("phụ")) return "#a020f0";
  if (name.includes("nguy hiểm") || name.includes("cảnh báo")) return "#ff0000";
  if (name.includes("hiệu lệnh")) return "#007bff";
  if (name.includes("chỉ dẫn")) return "#00cc66";
  if (name.includes("cấm")) return "#ff8000";
  return "#ffff00";
};

export default function CameraLive({ className, startCamera, enabled }: CameraLiveProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const loadingRef = useRef(false);
  const animationRef = useRef<number>(0);
  const [detections, setDetections] = useState<Detection[]>([]);

  // 🔹 Khởi động camera
  useEffect(() => {
    if (!startCamera) return;

    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
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
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // 🔹 Capture frame base64
  const captureFrameBase64 = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  // 🔹 Gửi frame đến backend
  const sendFrameToAI = async () => {
    if (!enabled || !startCamera || loadingRef.current) return;
    loadingRef.current = true;

    const base64 = captureFrameBase64();
    if (!base64) {
      loadingRef.current = false;
      return;
    }

    const onlyBase64 = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    try {
      const res = await signService.predictSign(onlyBase64);
      setDetections(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi gửi frame:", err);
      setDetections([]);
    } finally {
      loadingRef.current = false;
    }
  };

  // 🔹 Animation loop
  const frameLoop = () => {
    sendFrameToAI();
    animationRef.current = requestAnimationFrame(frameLoop);
  };

  useEffect(() => {
    if (startCamera && enabled) {
      animationRef.current = requestAnimationFrame(frameLoop);
    } else {
      setDetections([]);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [startCamera, enabled]);

  // 🔹 Vẽ bounding boxes
  useEffect(() => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((det) => {
      if (!det.box || det.box.length !== 4) return;
      const [x1, y1, x2, y2] = det.box;
      const w = x2 - x1;
      const h = y2 - y1;
      const color = getBoxColor(det.class_name);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(x1, y1 - 25, w, 25);
      ctx.fillStyle = color;
      ctx.font = "16px Arial";
      ctx.fillText(
        `${det.class_name} (${(det.confidence * 100).toFixed(1)}%)`,
        x1 + 5,
        y1 - 5
      );
    });
  }, [detections]);

  return (
    <div className={`${className} relative overflow-hidden`}>
      {enabled && startCamera && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white p-2 rounded text-sm z-10">
          {detections.length > 0
            ? `Đã phát hiện ${detections.length} biển báo`
            : "Không phát hiện biển báo"}
        </div>
      )}

      {startCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
        
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
