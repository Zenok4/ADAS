import { useState, useCallback } from "react";

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  const openCamera = useCallback(
    async (preferred: "ivcam" | "webcam" = "webcam") => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");

        if (videoDevices.length === 0)
          throw new Error("Không tìm thấy camera nào.");

        let selectedCam;

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
        setCamError("Không mở được camera: " + err.message);
        setCamReady(false);
      }
    },
    [videoRef]
  );

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    setCamReady(false);
  }, [videoRef]);

  return { camReady, camError, openCamera, stopCamera };
};
