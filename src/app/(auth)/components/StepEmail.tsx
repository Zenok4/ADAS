"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type StepEmailProps = {
  onSuccess: (value: string) => void;
};

export default function StepEmail({ onSuccess }: StepEmailProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value) return;
    onSuccess(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Email hoặc Số điện thoại
        </label>
        <input
          type="text"
          placeholder="Nhập email hoặc số điện thoại"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        type="button"
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        onClick={handleSubmit}
      >
        Gửi mã OTP
      </Button>
    </div>
  );
}
