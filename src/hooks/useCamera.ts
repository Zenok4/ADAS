import { useState, useCallback } from "react";

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  // 🔹 Mở camera
  const openCamera = useCallback(
    async (preferred: "ivcam" | "webcam" = "webcam") => {
      try {
        // Lấy danh sách thiết bị
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");

        if (videoDevices.length === 0)
          throw new Error("Không tìm thấy camera nào.");

        let selectedCam;

        // Chọn camera theo preference
        if (preferred === "ivcam") {
          selectedCam =
            videoDevices.find((d) =>
              d.label.toLowerCase().includes("ivcam")
            ) || videoDevices[0];
        } else {
          selectedCam =
            videoDevices.find(
              (d) =>
                d.label.toLowerCase().includes("integrated") ||
                d.label.toLowerCase().includes("webcam") ||
                d.label.toLowerCase().includes("user facing")
            ) ||
            videoDevices.find((d) => !d.label.toLowerCase().includes("ivcam")) ||
            videoDevices[0];
        }

        // Lấy stream video
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCam.deviceId } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setCamReady(true);
          setCamError(null);
        }
      } catch (err: any) {
        console.error("Camera error:", err);
        setCamError("Không mở được camera: " + (err.message || err));
        setCamReady(false);
      }
    },
    [videoRef]
  );

  // 🔹 Dừng camera
  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamReady(false);
  }, [videoRef]);

  return { camReady, camError, openCamera, stopCamera };
};
