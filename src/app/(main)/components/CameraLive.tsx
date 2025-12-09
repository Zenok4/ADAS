"use client";
import React, { useState, useEffect, useRef } from "react";
import { signService } from "@/services/signService";
import { laneService } from "@/services/laneService";
import { useCamera } from "@/hooks/useCamera";
import { useAudioAlert } from "@/hooks/useAudioAlert";

// Import các hàm helper vừa tạo
import { 
  drawLanes, 
  drawSigns, 
  captureVideoFrame, 
  Detection 
} from "@/lib/drawUtils";

interface CameraLiveProps {
  className?: string;
  startCamera: boolean;
  enableSign: boolean;
  enableLane: boolean;
  soundEnabled: boolean;
}

export default function CameraLive({
  className,
  startCamera,
  enableSign,
  enableLane,
  soundEnabled, 
}: CameraLiveProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  
  const { openCamera, stopCamera } = useCamera(videoRef as React.RefObject<HTMLVideoElement>);
  const { alertDrowsiness: playAlert } = useAudioAlert(soundEnabled);

  const [detections, setDetections] = useState<Detection[]>([]);
  const [laneData, setLaneData] = useState<Detection[]>([]);
  const loadingRef = useRef(false);

  // 1. Quản lý Camera
  useEffect(() => {
    if (startCamera) {
      openCamera("ivcam"); // Hoặc "environment"
    } else {
      stopCamera();
      setDetections([]);
      setLaneData([]);
    }
    return () => stopCamera();
  }, [startCamera, openCamera, stopCamera]);

  // 2. Hàm gửi frame lên AI
  const sendFrameToAI = async () => {
    if ((!enableSign && !enableLane) || !startCamera || loadingRef.current) return;
    if (!videoRef.current || !canvasRef.current) return;

    // --- Sử dụng helper captureVideoFrame ---
    const base64 = captureVideoFrame(videoRef.current, canvasRef.current);
    if (!base64) return;

    loadingRef.current = true;
    const onlyBase64 = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    try {
      const [signRes, laneRes] = await Promise.all([
        enableSign ? signService.predictSign(onlyBase64) : Promise.resolve(null),
        enableLane ? laneService.predictLane(onlyBase64) : Promise.resolve(null),
      ]);

      // Xử lý Biển báo
      if (enableSign && signRes?.data?.data?.data && Array.isArray(signRes.data.data.data)) {
        const dets = signRes.data.data.data;
        setDetections(dets);
        
          if (dets.length > 0) {
            // 1. Tìm biển báo nguy hiểm hoặc cấm trước (Ưu tiên cao nhất)
            const urgentSign = dets.find((d: any) => 
                d.class_name.toLowerCase().includes("cam") || 
                d.class_name.toLowerCase().includes("nguy hiem") ||
                d.class_name.toLowerCase().includes("dung")
            );

            // 2. Quyết định đọc cái gì
            if (urgentSign) {
              // Nếu có biển nguy hiểm -> Đọc ngay lập tức (cắt ngang các tin khác)
              console.log("Ưu tiên đọc:", urgentSign.class_name);
              playAlert(`Cảnh báo: ${urgentSign.class_name}`); 
            } else {
              // Nếu không có biển nguy hiểm -> Đọc biển có độ tin cậy cao nhất
              // Nhưng chỉ đọc nếu chưa có gì đang đọc (để tránh spam tin rác)
              const bestSign = dets.reduce((prev: any, current: any) => 
                (prev.confidence > current.confidence) ? prev : current
              );
              
              if (bestSign) {
                 // Gửi tin thường (không có chữ "Cảnh báo" để useAudioAlert xử lý là tin thường)
                 playAlert(bestSign.class_name); 
              }
            }
          }
      } else {
        setDetections([]);
      }

      // Xử lý Làn đường
      if (enableLane && laneRes?.data?.data && Array.isArray(laneRes.data.data)) {
         setLaneData(laneRes.data.data);
      } else {
         setLaneData([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
    }
  };

  // 3. Loop gọi API
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startCamera && (enableSign || enableLane)) {
      interval = setInterval(sendFrameToAI, 500);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [startCamera, enableSign, enableLane]);

  // 4. Vẽ Overlay (Clean hơn rất nhiều)
  useEffect(() => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Đồng bộ kích thước canvas vẽ với video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }
    
    // Xóa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Gọi helper vẽ ---
    if (enableLane) {
      drawLanes(ctx, laneData);
    }

    if (enableSign) {
      drawSigns(ctx, detections);
    }
  }, [detections, laneData, enableSign, enableLane]);

  return (
    <div className={`${className} relative overflow-hidden bg-black rounded-lg`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      {startCamera && enableSign && detections.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-yellow-500/90 text-black font-bold p-1 px-2 rounded text-xs animate-pulse">
            {detections.length} Biển báo
          </div>
      )}
    </div>
  );
}