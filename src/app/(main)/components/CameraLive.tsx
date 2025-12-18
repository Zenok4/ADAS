"use client";
import React, { useState, useEffect, useRef } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useAudioAlert } from "@/hooks/useAudioAlert";

import {
  drawLanes,
  drawSigns,
  drawObjects,
  captureVideoFrame,
  Detection,
} from "@/lib/drawUtils";
import { CoreFunctionService } from "@/services/coreFunctionService";

interface CameraLiveProps {
  className?: string;
  startCamera: boolean;
  enableSign: boolean;
  enableLane: boolean;
  enableObject: boolean;
  soundEnabled: boolean;
  userId?: string;
  latitude?: number;
  longitude?: number;
}

export default function CameraLive({
  className,
  startCamera,
  enableSign,
  enableLane,
  enableObject,
  soundEnabled,
  userId,
  latitude,
  longitude,
}: CameraLiveProps) {
  const FREQUENCY_MAP = {
    high: 330, // ~3 req/s
    medium: 1000, // 1 req/s
    low: 2000, // 0.5 req/s
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const { openCamera, stopCamera } = useCamera(
    videoRef as React.RefObject<HTMLVideoElement>
  );
  const { alertDrowsiness: playAlert, warnObstacle } =
    useAudioAlert(soundEnabled);

  const [detections, setDetections] = useState<Detection[]>([]);
  const [laneData, setLaneData] = useState<Detection[]>([]);
  const [objectData, setObjectData] = useState<Detection[]>([]); // State mới

  const loadingRef = useRef(false);

  // State lưu thời gian interval hiện tại
  const [intervalMs, setIntervalMs] = useState(500);

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
    if (startCamera) {
      openCamera("ivcam");
    } else {
      stopCamera();
      setDetections([]);
      setLaneData([]);
      setObjectData([]);
    }
    return () => stopCamera();
  }, [startCamera, openCamera, stopCamera]);

  const sendFrameToAI = async () => {
    if (
      (!enableSign && !enableLane && !enableObject) ||
      !startCamera ||
      loadingRef.current
    )
      return;
    if (!videoRef.current || !canvasRef.current) return;

    const base64 = captureVideoFrame(videoRef.current, canvasRef.current);
    if (!base64) return;

    loadingRef.current = true;
    const onlyBase64 = base64.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );

    try {
      const [signRes, laneRes, objectRes] = await Promise.all([
        enableSign
          ? CoreFunctionService.sign(
              onlyBase64,
              userId || "",
              latitude,
              longitude
            )
          : Promise.resolve(null),
        enableLane
          ? CoreFunctionService.predictLane(
              onlyBase64,
              userId || "",
              latitude,
              longitude
            )
          : Promise.resolve(null),
        enableObject
          ? CoreFunctionService.object(
              onlyBase64,
              userId || "",
              latitude,
              longitude
            )
          : Promise.resolve(null),
      ]);

      console.log("Kết quả Biển báo:", signRes);

      // 1. Biển báo
      if (
        enableSign &&
        signRes?.data?.data?.data?.data &&
        Array.isArray(signRes.data.data.data?.data)
      ) {
        const dets = signRes.data.data.data?.data;
        setDetections(dets);
        if (dets.length > 0) {
          const urgentSign = dets.find(
            (d: any) =>
              d.class_name.toLowerCase().includes("cam") ||
              d.class_name.toLowerCase().includes("nguy hiem") ||
              d.class_name.toLowerCase().includes("dung")
          );
          if (urgentSign) {
            playAlert(`Cảnh báo: ${urgentSign.class_name}`);
          } else {
            const bestSign = dets.reduce((prev: any, current: any) =>
              prev.confidence > current.confidence ? prev : current
            );
            if (bestSign) playAlert(bestSign.class_name);
          }
        }
      } else {
        setDetections([]);
      }

      // 2. Làn đường
      if (enableLane && laneRes?.data && Array.isArray(laneRes.data)) {
        setLaneData(laneRes.data);
      } else {
        setLaneData([]);
      }

      // 3. Xử lý Vật cản (FIXED: Xử lý JSON 3 lớp)
      if (enableObject && objectRes) {
        // --- LOGIC TỰ TÌM MẢNG DỮ LIỆU (Safe Unwrap) ---
        let objs: any[] = [];

        // Kiểm tra trường hợp 3 lớp (Trường hợp hiện tại của bạn)
        if (
          objectRes.data?.data?.data?.data?.data &&
          Array.isArray(objectRes.data.data.data.data.data)
        ) {
          objs = objectRes.data.data.data.data.data;
        }
        // Kiểm tra trường hợp 2 lớp (Nếu backend sửa lại gọn hơn)
        else if (
          objectRes.data?.data?.data?.data &&
          Array.isArray(objectRes.data.data.data.data)
        ) {
          objs = objectRes.data.data.data.data;
        }
        // Kiểm tra trường hợp 1 lớp (Nếu gọn nhất)
        else if (
          objectRes.data.data.data &&
          Array.isArray(objectRes.data.data.data)
        ) {
          objs = objectRes.data.data.data;
        }

        console.log("Số lượng vật thể tìm thấy:", objs.length); // Debug xem có bao nhiêu xe

        if (objs.length > 0) {
          setObjectData(objs);

          // Logic cảnh báo
          const dangerObj = objs.find(
            (o: any) => o.confidence > 0.4 // JSON của bạn là 0.73, nên 0.4 chắc chắn bắt được
          );

          if (dangerObj) {
            const nameMap: Record<string, string> = {
              person: "Người đi bộ",
              car: "Ô tô",
              truck: "Xe tải",
            };
            const vnName =
              nameMap[dangerObj.class_name] || dangerObj.class_name;

            // Log ra console để chắc chắn logic chạy
            console.log(`>>> PHÁT HIỆN: ${vnName} (${dangerObj.confidence})`);

            warnObstacle(`Chú ý, có ${vnName}`);
          }
        } else {
          setObjectData([]);
        }
      } else {
        setObjectData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startCamera && (enableSign || enableLane || enableObject)) {
      interval = setInterval(sendFrameToAI, intervalMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startCamera, enableSign, enableLane, enableObject]);

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

    if (enableLane) drawLanes(ctx, laneData);
    if (enableObject) drawObjects(ctx, objectData); // Vẽ Object
    if (enableSign) drawSigns(ctx, detections);
  }, [detections, laneData, objectData, enableSign, enableLane, enableObject, intervalMs]);

  return (
    <div
      className={`${className} relative overflow-hidden bg-black rounded-lg`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none">
        {startCamera && enableSign && detections.length > 0 && (
          <div className="bg-yellow-500/90 text-black font-bold p-1 px-2 rounded text-xs animate-pulse">
            {detections.length} Biển báo
          </div>
        )}
        {startCamera && enableObject && objectData.length > 0 && (
          <div className="bg-blue-600/90 text-white font-bold p-1 px-2 rounded text-xs">
            {objectData.length} Vật cản
          </div>
        )}
      </div>
    </div>
  );
}
