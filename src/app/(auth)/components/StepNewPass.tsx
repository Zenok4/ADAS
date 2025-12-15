"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type StepNewPasswordProps = {
  isLoading: boolean;
  onSuccess: (password: string) => void;
};

export default function StepNewPassword({
  isLoading,
  onSuccess,
}: StepNewPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    if (!password || password !== confirm) return;
    onSuccess(password);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="relative">
        <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <label className="block text-sm text-gray-600 mb-1">
          Xác nhận mật khẩu
        </label>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-9 text-gray-400"
        >
          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <Button
        type="button"
        disabled={isLoading || !password || password !== confirm}
        className="w-full py-5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        onClick={handleSubmit}
      >
        {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
      </Button>
    </div>
  );
}
