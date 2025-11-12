"use client";
import { Camera } from "lucide-react";

type Props = {
  title?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  busy?: boolean;
  camReady?: boolean;
  error?: string | null;
  highlightDanger?: boolean;
  rightNote?: string;
  heightClass?: string;
};

export default function CameraPanel({
  title = "Camera",
  videoRef,
  busy,
  camReady,
  error,
  highlightDanger,
  rightNote,
  heightClass = "h-[640px]",
}: Props) {
  return (
    <div
      className={`flex flex-col rounded-xl border shadow-md overflow-hidden ${heightClass} ${
        highlightDanger ? "border-red-500" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between text-blue-500 font-medium p-2 border-b">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span>{title}</span>
        </div>
        {rightNote && (
          <span className="text-xs text-gray-400">{rightNote}</span>
        )}
      </div>
      <div className="flex-1 bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          muted
          playsInline
        />
        {!camReady && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Nhấn “Mở camera” để khởi động IVCam
          </div>
        )}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-red-400 text-xs p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
