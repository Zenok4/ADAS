import { useState, useCallback } from "react";

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  const openCamera = useCallback(
    async (preferred: "ivcam" | "webcam" = "webcam") => {
      try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        let videoDevices = devices.filter((d) => d.kind === "videoinput");

        if (videoDevices.length === 0)
          throw new Error("Không tìm thấy camera nào.");

        // Ép trình duyệt hiển thị tên thiết bị (label) nếu đang bị ẩn
        if (videoDevices[0].label === "") {
          const tempStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          devices = await navigator.mediaDevices.enumerateDevices();
          videoDevices = devices.filter((d) => d.kind === "videoinput");
          tempStream.getTracks().forEach((track) => track.stop());
        }

        let selectedCam;
        if (preferred === "ivcam") {
          // Bắt buộc tìm iVCam cho bên phải
          selectedCam = videoDevices.find((d) =>
            d.label.toLowerCase().includes("ivcam"),
          );
          if (!selectedCam) {
            throw new Error(
              "Không tìm thấy iVCam! Hãy bật app iVCam trên máy tính.",
            );
          }
        } else {
          // Bắt buộc dùng Webcam mặc định cho bên trái (Loại trừ iVCam)
          selectedCam = videoDevices.find(
            (d) => !d.label.toLowerCase().includes("ivcam"),
          );
          if (!selectedCam) selectedCam = videoDevices[0];
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
        console.error(`Lỗi mở ${preferred}:`, err);
        setCamError(err.message || "Lỗi camera không xác định");
        setCamReady(false);
      }
    },
    [videoRef],
  );

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamReady(false);
    setCamError(null);
  }, [videoRef]);

  return { camReady, camError, openCamera, stopCamera };
};
