"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Save, RotateCw } from "lucide-react";
import AlertsSettings from "./alerts/page";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-3 px-2 font-medium border-b-2 transition-colors ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Chung
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`py-3 px-2 font-medium border-b-2 transition-colors ${
              activeTab === "alerts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Cảnh báo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Hồ sơ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Lê Văn A</h3>
                      <p className="text-sm text-gray-600">Tài xế</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => router.push("/settings/personal_info")}
                    >
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">levan.a@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Số điện thoại</label>
                      <p className="font-medium">+84 912 345 678</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trạng thái hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Kết nối</span>
                    <span className="font-medium text-green-600">Hoạt động</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Camera</span>
                    <span className="font-medium text-green-600">Sẵn sàng</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">GPS</span>
                    <span className="font-medium text-green-600">Đã khóa</span>
                  </div>
                  <hr className="my-3" />
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        
        {activeTab === "alerts" && (
          <div>
            <AlertsSettings />
          </div>
        )}
      </div>
    </div>
  );
}
