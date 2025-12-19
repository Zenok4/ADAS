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
  const { openCamera, stopCamera } = useCamera(videoRef as React.RefObject<HTMLVideoElement>);
  const { alertDrowsiness: playAlert, warnObstacle } =
    useAudioAlert(soundEnabled);

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
      ""
    );

    /* ---------- SIGN ---------- */
    if (enableSign && !loadingSign.current) {
      loadingSign.current = true;
      CoreFunctionService.sign(
        onlyBase64,
        userId || "",
        latitude,
        longitude
      )
        .then((res) => {
          const dets = res?.data?.data?.data?.data;
          if (Array.isArray(dets)) {
            setDetections(dets);
            if (dets.length > 0) {
              const best = dets.reduce((a: any, b: any) =>
                a.confidence > b.confidence ? a : b
              );
              playAlert(best.class_name);
            }
          } else setDetections([]);
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
        longitude
      )
        .then((res) => {
          if (Array.isArray(res?.data)) setLaneData(res.data);
          else setLaneData([]);
        })
        .catch(console.error)
        .finally(() => {
          loadingLane.current = false;
        });
    }

    /* ---------- OBJECT ---------- */
    if (enableObject && !loadingObject.current) {
      loadingObject.current = true;
      CoreFunctionService.object(
        onlyBase64,
        userId || "",
        latitude,
        longitude
      )
        .then((res) => {
          let objs: any[] = [];

          if (
            res?.data?.data?.data?.data?.data &&
            Array.isArray(res.data.data.data.data.data)
          ) {
            objs = res.data.data.data.data.data;
          } else if (
            res?.data?.data?.data?.data &&
            Array.isArray(res.data.data.data.data)
          ) {
            objs = res.data.data.data.data;
          } else if (
            res?.data?.data?.data &&
            Array.isArray(res.data.data.data)
          ) {
            objs = res.data.data.data;
          }

          setObjectData(objs);

          const danger = objs.find((o) => o.confidence > 0.4);
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
    const canvas = overlayRef.current;
    if (!video || !canvas) return;

    const onLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
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
  }, [
    detections,
    laneData,
    objectData,
    enableSign,
    enableLane,
    enableObject,
  ]);

  /* ================= UI ================= */
  return (
    <div className={`${className} relative overflow-hidden bg-black rounded-lg`}>
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
