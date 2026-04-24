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
  /* ================= CONFIG ================= */
  const FREQUENCY_MAP = {
    high: 330,
    medium: 1000,
    low: 2000,
  };

  /* ================= REFS ================= */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const loadingSign = useRef(false);
  const loadingLane = useRef(false);
  const loadingObject = useRef(false);

  /* ================= HOOKS ================= */
  const { openCamera, stopCamera, camError } = useCamera(
    videoRef as React.RefObject<HTMLVideoElement>,
  );
  const {
    alertDrowsiness: playAlert,
    warnObstacle,
    announceTrafficSign,
  } = useAudioAlert(soundEnabled);

  /* ================= STATE ================= */
  const [detections, setDetections] = useState<Detection[]>([]);
  const [laneData, setLaneData] = useState<Detection[]>([]);
  const [objectData, setObjectData] = useState<Detection[]>([]);
  const [intervalMs, setIntervalMs] = useState(1000);

  /* ================= LOAD SETTINGS ================= */
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
      } catch {
        console.warn("Không đọc được settings, dùng mặc định");
      }
    };

    loadSettings();
    window.addEventListener("adas_settings_updated", loadSettings);
    return () =>
      window.removeEventListener("adas_settings_updated", loadSettings);
  }, []);

  /* ================= CAMERA CONTROL ================= */
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

  /* ================= AI PIPELINE ================= */
  const sendFrameToAI = () => {
    if (!startCamera) return;
    if (!enableSign && !enableLane && !enableObject) return;
    if (!videoRef.current || !canvasRef.current) return;

    const base64 = captureVideoFrame(videoRef.current, canvasRef.current);
    if (!base64) return;

    const onlyBase64 = base64.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      "",
    );

    /* ---------- SIGN ---------- */
    if (enableSign && !loadingSign.current) {
      loadingSign.current = true;
      CoreFunctionService.sign(onlyBase64, userId || "", latitude, longitude)
        .then((res) => {
          // 1. HÀM QUÉT TỰ ĐỘNG BẤT CHẤP TÊN BIẾN
          const extractArray = (obj: any): any[] => {
            if (!obj) return [];
            if (Array.isArray(obj)) return obj; // Nếu bản thân nó là mảng -> Lụm
            if (typeof obj === "object") {
              // Tìm ở tầng hiện tại xem có key nào là mảng không
              for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key]; // Lụm ngay
              }
              // Nếu không có, đào sâu xuống các tầng dưới
              for (const key in obj) {
                const found = extractArray(obj[key]);
                if (found.length > 0) return found;
              }
            }
            return [];
          };

          // Chạy hàm quét
          const rawSigns = extractArray(res?.data);
          console.log("👉 MẢNG BIỂN BÁO TÌM ĐƯỢC:", rawSigns);

          // 2. CHUẨN HÓA DỮ LIỆU
          const formattedSigns = rawSigns.map((s: any) => ({
            ...s,
            class_name: s.class_name || s.label || s.name || "Biển báo",
            box: s.bbox || s.box || s.bounding_box || s.coordinates,
            confidence:
              s.confidence !== undefined
                ? s.confidence
                : s.score !== undefined
                  ? s.score
                  : 1,
          }));

          // 3. LỌC TỌA ĐỘ HỢP LỆ VÀ HIỂN THỊ
          const signsOnly = formattedSigns.filter(
            (item) => Array.isArray(item.box) && item.box.length === 4,
          );

          setDetections(signsOnly);

          // 4. PHÁT ÂM THANH
          if (signsOnly.length > 0) {
            const best = signsOnly.reduce((a: any, b: any) =>
              (a.confidence || 0) > (b.confidence || 0) ? a : b,
            );
            announceTrafficSign(best.class_name);
          }
        })
        .catch(console.error)
        .finally(() => {
          loadingSign.current = false;
        });
    }

    /* ---------- LANE ---------- */
    if (enableLane && !loadingLane.current) {
      loadingLane.current = true;
      CoreFunctionService.predictLane(
        onlyBase64,
        userId || "",
        latitude,
        longitude,
      )
        .then((res) => {
          // Khám phá các tầng JSON
          const d = res?.data?.data || res?.data || {};

          // QUÉT MẠNH: Thêm trường 'detections' theo đúng cấu trúc JSON mới của Backend
          const rawLanes = Array.isArray(d.detections)
            ? d.detections // Trúng phóc cấu trúc mới
            : Array.isArray(d.data)
              ? d.data
              : Array.isArray(d.lanes)
                ? d.lanes
                : Array.isArray(d)
                  ? d
                  : [];

          // Chuẩn hóa tên và tọa độ
          const formattedLanes = rawLanes.map((l: any) => ({
            ...l,
            class_name: l.class_name || l.label || l.name || "Làn đường",
            box: l.box || l.bbox || l.bounding_box || l.coordinates,
            confidence:
              l.confidence !== undefined
                ? l.confidence
                : l.score !== undefined
                  ? l.score
                  : 1,
          }));

          // Lọc kết quả hợp lệ
          const validLanes = formattedLanes.filter(
            (item) => Array.isArray(item.box) && item.box.length === 4,
          );

          setLaneData(validLanes);
        })
        .catch(console.error)
        .finally(() => {
          loadingLane.current = false;
        });
    }

    /* ---------- OBJECT ---------- */
    if (enableObject && !loadingObject.current) {
      loadingObject.current = true;
      CoreFunctionService.object(onlyBase64, userId || "", latitude, longitude)
        .then((res) => {
          const rawObjs = res?.data?.data?.data?.objects || [];

          // MAP QUAN TRỌNG: Đổi label -> class_name và bbox -> box
          const formattedObjs = rawObjs.map((o: any) => ({
            ...o,
            class_name: o.label,
            box: o.bbox,
          }));

          setObjectData(formattedObjs);

          const danger = formattedObjs.find((o: any) => o.confidence > 0.4);
          if (danger) warnObstacle(`Chú ý, có ${danger.class_name}`);
        })
        .catch(console.error)
        .finally(() => {
          loadingObject.current = false;
        });
    }
  };

  /* ================= LOOP ================= */
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (startCamera && (enableSign || enableLane || enableObject)) {
      timer = setInterval(sendFrameToAI, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startCamera, enableSign, enableLane, enableObject, intervalMs]);

  /* ================= CANVAS SIZE ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      if (overlayRef.current) {
        overlayRef.current.width = video.videoWidth;
        overlayRef.current.height = video.videoHeight;
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  /* ================= DRAW ================= */
  useEffect(() => {
    const canvas = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (enableLane) drawLanes(ctx, laneData);
    if (enableObject) drawObjects(ctx, objectData);
    if (enableSign) drawSigns(ctx, detections);
  }, [detections, laneData, objectData, enableSign, enableLane, enableObject]);

  /* ================= UI ================= */
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
      <canvas ref={canvasRef} className="hidden" />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {camError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <span className="text-red-500 font-bold p-4 text-center">
            {camError}
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none">
        {startCamera && enableSign && detections.length > 0 && (
          <div className="bg-yellow-500/90 text-black font-bold p-1 px-2 rounded text-xs">
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
