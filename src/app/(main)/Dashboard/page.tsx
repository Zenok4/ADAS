"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CamCard } from "./components/cam-comp";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const [drowsyCount, setDrowsyCount] = useState(0);
  const [signScanCount, setSignScanCount] = useState(0);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0a2a43] text-white">
      <div className="mx-auto max-w-sm py-6 space-y-4">
        <h1 className="text-center text-2xl font-bold">DASHBOARD</h1>

        <CamCard
          title="CAM 1"
          count={drowsyCount}
          color="#ff6b6b"
          description="Số lần cảnh báo ngủ gật"
          onReset={() => {}}
        />

        <CamCard
          title="CAM 2"
          count={signScanCount}
          color="#4ecdc4"
          description="Số lần quét biển báo giao thông"
          onReset={() => {}}
        />

        <Card className="bg-[#113a5c] border-[#80d4ff]">
          <CardContent className="p-4">
            <Button
              onClick={() => router.push("/menu")}
              variant={"main"}
              className="w-full flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Hệ thống
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
