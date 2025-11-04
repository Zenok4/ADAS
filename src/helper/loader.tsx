"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type LoaderSize = "sm" | "md" | "lg";
type LoaderColor = "white" | "blue" | "gray" | "red" | "green" | "yellow";

type FullScreenLoaderProps = {
  show: boolean;
  message?: string;
  transparentBackground?: boolean;
  zIndex?: number;
  size?: LoaderSize;
  color?: LoaderColor;
};

export default function FullScreenLoader({
  show,
  message,
  transparentBackground = false,
  zIndex = 50,
  size = "md",
  color = "white",
}: FullScreenLoaderProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [show]);

  if (!show) return null;

  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorMap: Record<LoaderColor, string> = {
    white: "bg-white",
    blue: "bg-blue-500",
    gray: "bg-gray-300",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
  };

  const overlay = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
        transparentBackground ? "bg-transparent" : "bg-black/60 backdrop-blur-sm"
      }`}
      style={{ zIndex }}
    >
      <div className="max-w-full w-full flex flex-col items-center gap-6">
        {/* Custom 3-dot loader with fade and scale animation */}
        <style>{`
          @keyframes dotPulseScale {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.4); }
            60% { opacity: 0.6; transform: scale(1.2); }
          }
        `}</style>

        <div className="flex items-center justify-center space-x-3">
          <span className={`${sizeMap[size]} rounded-full ${colorMap[color]} animate-[dotPulseScale_1s_ease-in-out_infinite] [animation-delay:-0.3s]`}></span>
          <span className={`${sizeMap[size]} rounded-full ${colorMap[color]} animate-[dotPulseScale_1s_ease-in-out_infinite] [animation-delay:-0.15s]`}></span>
          <span className={`${sizeMap[size]} rounded-full ${colorMap[color]} animate-[dotPulseScale_1s_ease-in-out_infinite]`}></span>
        </div>

        {message && (
          <div className="text-center text-sm sm:text-base text-white/95 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(overlay, document.body);
}