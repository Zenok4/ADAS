"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
                    bg-[radial-gradient(circle_at_center,_#17406a,_#0a2a43)] px-4">
      <img
        src="https://img.icons8.com/fluency/96/steering-wheel.png"
        alt="logo"
        className="w-24 h-24 mb-8"
      />

      <h1 className="text-xl font-medium text-white mb-8">ĐĂNG NHẬP</h1>

      <Button
        variant="default"
        className="w-[90vw] max-w-xs mb-4 flex items-center justify-center px-4 py-3"
        onClick={() => router.push("/oauth/google")}
      >
        <img
          src="https://img.icons8.com/color/48/000000/google-logo.png"
          alt="Google"
          className="w-6 h-6 mr-3"
        />
        Tài khoản Google
      </Button>

      <Button
        variant="default"
        className="w-[90vw] max-w-xs flex items-center justify-center px-4 py-3"
        onClick={() => router.push("/login/phone")}
      >
        <img
          src="https://img.icons8.com/fluency/48/phone.png"
          alt="Phone"
          className="w-6 h-6 mr-3"
        />
        Số điện thoại
      </Button>
    </div>
  );
}