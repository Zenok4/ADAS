"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type StepOtpProps = {
  emailOrPhone: string;
  onResend?: () => Promise<void> | void; // optional
  onSuccess: () => void;
};

export default function StepOtp({ emailOrPhone, onResend, onSuccess }: StepOtpProps) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startCooldown = () => {
    setCooldown(60);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleResend = async () => {
    if (cooldown > 0) return;
    // gọi handler từ parent nếu có, hoặc fallback (console)
    if (onResend) {
      await onResend();
    } else {
      console.log("onResend not provided — implement resend logic here");
    }
    startCooldown();
  };

  const handleVerify = () => {
    if (!otp) {
      // bạn có thể báo lỗi ở parent bằng callback nếu muốn
      return;
    }
    // TODO: verify OTP via API -> onSuccess() when OK
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Mã OTP</label>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between items-center mt-2 text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`${
              cooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"
            }`}
          >
            {cooldown > 0 ? `Gửi lại OTP (${cooldown}s)` : "Gửi lại OTP"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-gray-500 hover:underline"
          >
            Chưa nhận được OTP?
          </button>
        </div>
      </div>

      <Button
        type="button"
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        onClick={handleVerify}
      >
        Xác thực OTP
      </Button>
    </div>
  );
}
