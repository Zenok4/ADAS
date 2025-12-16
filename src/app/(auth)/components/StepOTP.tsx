"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type StepOtpProps = {
  emailOrPhone: string;
  onResend: () => Promise<void>;
  onSubmit: (otp: string) => void;
};

export default function StepOtp({
  emailOrPhone,
  onResend,
  onSubmit,
}: StepOtpProps) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startCooldown = () => {
    setCooldown(60);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  };

  useEffect(() => {
    startCooldown();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    await onResend();
    setIsResending(false);
    startCooldown();
  };

  const handleSubmit = () => {
    if (!otp || otp.length < 6) return;
    onSubmit(otp);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Mã OTP gửi tới <strong>{emailOrPhone}</strong>
        </label>
        <input
          type="text"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-[0.5em] text-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className={`text-sm ${
              cooldown > 0 ? "text-gray-400" : "text-blue-600 hover:underline"
            }`}
          >
            {isResending
              ? "Đang gửi..."
              : cooldown > 0
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi lại mã"}
          </button>
        </div>
      </div>
      <Button
        type="button"
        disabled={otp.length < 6}
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        onClick={handleSubmit}
      >
        Xác thực OTP
      </Button>
    </div>
  );
}
