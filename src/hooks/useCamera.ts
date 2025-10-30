import { useState, useCallback } from "react";

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCamReady(true);
      }
    } catch (err: any) {
      setCamError("Không mở được camera: " + err.message);
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    setCamReady(false);
  }, [videoRef]);

  return { camReady, camError, openCamera, stopCamera };
};
