"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type StepEmailProps = {
  isLoading: boolean;
  onSuccess: (value: string) => void;
};

export default function StepEmail({ isLoading, onSuccess }: StepEmailProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSuccess(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      <div>
        <label className="block text-sm text-gray-600 mb-1 font-medium">
          Email hoặc Số điện thoại
        </label>
        <input
          type="text"
          placeholder="Nhập email hoặc số điện thoại"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 transition-all"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !value}
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
      >
        {isLoading ? "Đang gửi..." : "Tiếp tục"}
      </Button>
    </form>
  );
}
