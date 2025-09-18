"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type StepNewPasswordProps = {
  onSuccess: () => void;
};

export default function StepNewPassword({ onSuccess }: StepNewPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = () => {
    if (!password || password !== confirm) return;
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        type="button"
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        onClick={handleSubmit}
      >
        Đổi mật khẩu
      </Button>
    </div>
  );
}
