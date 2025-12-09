"use client";
import React, { useRef, useState, useEffect } from "react";
import { signService } from "@/services/signService";
import { laneService } from "@/services/laneService";

interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
}

interface CameraLiveProps {
  className?: string;
  startCamera: boolean;
  enableSign: boolean;
  enableLane: boolean;
}

//  Màu theo nhóm biển báo
const getBoxColor = (className: string): string => {
  const name = className.toLowerCase();
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
  enableLane 
}: CameraLiveProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const loadingRef = useRef(false);
  
  const [detections, setDetections] = useState<Detection[]>([]);
  //  Sửa: State này giờ sẽ chứa trực tiếp Mảng (Detection[]) thay vì Object
  const [laneData, setLaneData] = useState<Detection[]>([]); 

  // 🔹 Khởi động camera
  useEffect(() => {
    if (!startCamera) return;

    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) 
          videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(" Không thể truy cập camera:", err);
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

  // 🔹 Capture frame
  const captureFrameBase64 = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const MAX_WIDTH = 640;
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  // 🔹 Gửi frame đến AI
  const sendFrameToAI = async () => {
    if ((!enableSign && !enableLane) || !startCamera || loadingRef.current) return;
    loadingRef.current = true;
    const base64 = captureFrameBase64();
    if (!base64) {
      loadingRef.current = false;
      return;
    }
    const onlyBase64 = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    try {
      const signPromise = enableSign ? signService.predictSign(onlyBase64) : Promise.resolve(null);
      const lanePromise = enableLane ? laneService.predictLane(onlyBase64) : Promise.resolve(null);

      const [signRes, laneRes] = await Promise.all([signPromise, lanePromise]);

      // --- 1. Xử lý Biển báo ---
      if (enableSign && signRes) {
        const dets = signRes?.data?.data?.data && Array.isArray(signRes.data.data.data)
            ? signRes.data.data.data
            : [];
        setDetections(dets);
      } else {
        setDetections([]);
      }

      // --- 2. Xử lý Làn đường ---
      if (enableLane && laneRes) {
        // Log để kiểm tra cấu trúc nếu cần
        // console.log("Lane API Raw:", laneRes); 
        
        // Truy cập sâu vào: laneRes -> data -> data (Mảng)
        // Dựa trên JSON bạn gửi: { code: 200, data: { data: [...] } }
        const lanesArray = laneRes.data?.data;

        if (Array.isArray(lanesArray)) {
           setLaneData(lanesArray); // Lưu trực tiếp mảng
        } else {
           setLaneData([]);
        }
      } else {
        setLaneData([]);
      }

    } catch (err) {
      console.error(" Lỗi gửi frame AI:", err);
    } finally {
      loadingRef.current = false;
    }
  };

  // 🔹 Loop gọi API
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startCamera && (enableSign || enableLane)) {
      interval = setInterval(() => sendFrameToAI(), 500);
    } else {
      setDetections([]);
      setLaneData([]);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [startCamera, enableSign, enableLane]);

  // 🔹 Vẽ Overlay
  useEffect(() => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === VẼ LÀN ĐƯỜNG (LANE) ===
    // laneData bây giờ đã là Array, không cần check .data nữa
    if (enableLane && laneData.length > 0) {
      laneData.forEach((lane) => {
        if (!lane.box || lane.box.length !== 4) return;
        const [x1, y1, x2, y2] = lane.box;
        const w = x2 - x1;
        const h = y2 - y1;

        // Chọn màu khác biệt cho làn đường
        const isBroken = lane.class_name.includes("broken");
        ctx.strokeStyle = isBroken ? "#00FFFF" : "#00FF00"; // Đứt khúc: Cyan, Liền: Green
        ctx.lineWidth = 2;
        
        // Vẽ box
        ctx.strokeRect(x1, y1, w, h);

        // Vẽ tên làn đường
        ctx.fillStyle = isBroken ? "#00FFFF" : "#00FF00";
        ctx.font = "bold 12px Arial";
        ctx.fillText(lane.class_name, x1, y1 - 4);
      });
    }

    // === VẼ BIỂN BÁO (SIGN) ===
    if (enableSign && detections.length > 0) {
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
        ctx.fillText(`${det.class_name} (${(det.confidence * 100).toFixed(0)}%)`, x1 + 5, y1 - 5);
      });
    }
  }, [detections, laneData, enableSign, enableLane]);

  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Thông báo trạng thái */}
      {startCamera && (
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10 items-start pointer-events-none">
           {enableSign && detections.length > 0 && (
             <div className="bg-black/60 text-white p-1 px-2 rounded text-xs">
                 Biển báo: {detections.length}
             </div>
           )}
           {enableLane && laneData.length > 0 && (
             <div className="bg-blue-600/80 text-white p-1 px-2 rounded text-xs">
                 Làn: {laneData.length}
             </div>
           )}
        </div>
      )}

      {/* Video */}
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
          Nhấn “Mở camera” để bật iVCam
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