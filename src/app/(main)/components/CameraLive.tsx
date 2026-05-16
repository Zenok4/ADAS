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
  const FREQUENCY_MAP = { high: 330, medium: 1000, low: 2000 };

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
  const { warnObstacle, announceTrafficSign } = useAudioAlert(soundEnabled);

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
          if (freq && FREQUENCY_MAP[freq]) setIntervalMs(FREQUENCY_MAP[freq]);
        }
      } catch {
        console.warn("Không đọc được settings");
      }
    };
    loadSettings();
    window.addEventListener("adas_settings_updated", loadSettings);
    return () =>
      window.removeEventListener("adas_settings_updated", loadSettings);
  }, []);

  /* ================= CAMERA CONTROL ================= */
  useEffect(() => {
    if (startCamera) openCamera("ivcam");
    else {
      stopCamera();
      setDetections([]);
      setLaneData([]);
      setObjectData([]);
    }
    return () => stopCamera();
  }, [startCamera, openCamera, stopCamera]);

  /* ================= AI PIPELINE ================= */
  const sendFrameToAI = () => {
    if (!startCamera || !videoRef.current || !canvasRef.current) return;
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
          const d = res?.data?.data?.data || res?.data?.data || res?.data || {};
          const rawSigns = Array.isArray(d.detections)
            ? d.detections
            : Array.isArray(d.signs)
              ? d.signs
              : Array.isArray(d.objects)
                ? d.objects
                : Array.isArray(d.data)
                  ? d.data
                  : [];

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

          const signsOnly = formattedSigns.filter(
            (item) => Array.isArray(item.box) && item.box.length === 4,
          );
          setDetections(signsOnly);
          if (signsOnly.length > 0)
            announceTrafficSign(signsOnly[0].class_name);
        })
        .finally(() => (loadingSign.current = false));
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
          const d = res?.data?.data?.data || res?.data?.data || res?.data || {};
          const rawLanes = Array.isArray(d.detections)
            ? d.detections
            : Array.isArray(d.lanes)
              ? d.lanes
              : Array.isArray(d.data)
                ? d.data
                : Array.isArray(d.objects)
                  ? d.objects
                  : [];

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

          const validLanes = formattedLanes.filter(
            (item) => Array.isArray(item.box) && item.box.length === 4,
          );
          setLaneData(validLanes);
        })
        .finally(() => (loadingLane.current = false));
    }

    /* ---------- OBJECT ---------- */
    if (enableObject && !loadingObject.current) {
      loadingObject.current = true;
      CoreFunctionService.object(onlyBase64, userId || "", latitude, longitude)
        .then((res) => {
          const d = res?.data?.data?.data || res?.data?.data || res?.data || {};
          const rawObjs = Array.isArray(d.objects)
            ? d.objects
            : Array.isArray(d.detections)
              ? d.detections
              : Array.isArray(d.data)
                ? d.data
                : [];

          const formattedObjs = rawObjs.map((o: any) => ({
            ...o,
            class_name: o.class_name || o.label || o.name || "Vật cản",
            box: o.bbox || o.box || o.bounding_box || o.coordinates,
            confidence:
              o.confidence !== undefined
                ? o.confidence
                : o.score !== undefined
                  ? o.score
                  : 1,

            // DỮ LIỆU TỐC ĐỘ / KHOẢNG CÁCH / VA CHẠM THỰC TẾ TỪ BACKEND
            distance: o.distance,
            speed: o.speed,
            warning_level: o.warning_level,
            warning_message: o.warning_message,
          }));

          const validObjs = formattedObjs.filter(
            (item) => Array.isArray(item.box) && item.box.length === 4,
          );
          setObjectData(validObjs);

          // Lọc ra các cảnh báo nguy hiểm mức High để phát âm thanh
          const highDanger = validObjs.find(
            (o) => o.warning_level && o.warning_level.toLowerCase() === "high",
          );
          if (highDanger) {
            warnObstacle(
              `Nguy hiểm, coi chừng va chạm ${highDanger.class_name}`,
            );
          }
        })
        .finally(() => (loadingObject.current = false));
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

  /* ================= TRÍCH XUẤT STATE CẢNH BÁO ================= */
  // CHỈ lấy đối tượng có warning_level là "high"
  const dangerObj = objectData.find(
    (o) => o.warning_level && o.warning_level.toLowerCase() === "high",
  );

  const isDanger = !!dangerObj;
  const warningLevel = dangerObj?.warning_level?.toLowerCase();
  const warningMsg =
    dangerObj?.warning_message || "CHÚ Ý: CÓ VẬT CẢN PHÍA TRƯỚC!";

  /* ================= UI ĐỒNG BỘ VỚI CHỨC NĂNG CẢNH BÁO BUỒN NGỦ ================= */
  return (
    <div
      className={`${className} relative overflow-hidden bg-black rounded-lg transition-all duration-300 ${
        warningLevel === "high" ? "ring-4 ring-red-600" : ""
      }`}
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

      {/* BẢNG CẢNH BÁO TEXT GỌN GÀNG Ở TRUNG TÂM PHÍA TRÊN */}
      {isDanger && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none w-max">
          <div className="font-black px-6 py-2 rounded-md shadow-lg text-white bg-red-600">
            {warningMsg}
          </div>
        </div>
      )}

      {camError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <span className="text-red-500 font-bold p-4 text-center">
            {camError}
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex flex-col gap-1 pointer-events-none z-20">
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
