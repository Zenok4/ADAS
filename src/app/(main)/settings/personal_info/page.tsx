"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar, Car, Shield, CheckCircle, Edit, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function PersonalInfoPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  // State thông tin người dùng
  const [email, setEmail] = useState("levan.a@example.com");
  const [phone, setPhone] = useState("+84 912 345 678");
  const [address, setAddress] = useState("123 Nguyễn Huệ, Quận 1, TP. HCM");
  const [vehicle, setVehicle] = useState("Toyota Camry 2023");
  const [adasVersion, setAdasVersion] = useState("v2.4.1");

  const handleSaveSettings = () => {
    // Đây là nơi lưu dữ liệu, hiện demo bằng alert
    alert("Thông tin đã được lưu!");
    setIsEditing(false);
    setSaveConfirmOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" onClick={() => router.back()} className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>LV</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Lê Văn A</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Đáng tin cậy</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">95</div>
                <div className="text-sm text-gray-600">Điểm an toàn/100</div>
                {!isEditing && (
                  <Button size="sm" variant="outline" className="mt-2 gap-2" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                    Sửa
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{email}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{phone}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{address}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-600">Ngày đăng ký</p>
                <p className="font-medium">15/06/2023</p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle & ADAS Info */}
          <Card>
            <CardHeader>
              <CardTitle>Xe và ADAS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{vehicle}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={adasVersion}
                    onChange={(e) => setAdasVersion(e.target.value)}
                    className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{adasVersion}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-medium text-green-600">Hoạt động bình thường</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Lần cập nhật cuối</p>
                  <p className="font-medium">10/01/2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button onClick={() => setSaveConfirmOpen(true)}>
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Xác nhận */}
      <Dialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Bạn đã chắc chắn thay đổi cài đặt mới. Bạn có chắc muốn tiếp tục?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveConfirmOpen(false)}>Đóng</Button>
            <Button className="bg-orange-500 text-white" onClick={handleSaveSettings}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
