"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import  NotifyDialog  from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";

type RoleModalType = "edit" | "delete";

interface RoleEditModalProps {
  open: boolean;
  type: RoleModalType;
  role?: {
    id?: number;
    name?: string;
    description?: string;
    status?: string;
    permissions?: { api: string; desc: string; enabled: boolean }[];
  };
  onClose: () => void;
  onConfirm?: () => void;
}

const defaultPermissions = [
  { api: "/api/users", desc: "Quản lý người dùng", enabled: true },
  { api: "/api/dashboard", desc: "Xem tổng quan hệ thống", enabled: true },
  { api: "/api/alerts", desc: "Quản lý cảnh báo", enabled: false },
  { api: "/api/vehicles", desc: "Quản lý phương tiện", enabled: true },
  { api: "/api/settings", desc: "Cài đặt hệ thống", enabled: true },
];

export default function RoleEditModal({
  open,
  type,
  role,
  onClose,
  onConfirm,
}: RoleEditModalProps) {
  const [permissions, setPermissions] = useState(defaultPermissions);

  useEffect(() => {
    setPermissions(role?.permissions ?? defaultPermissions);
  }, [role, open]);

  //  xoá → dùng NotifyDialog luôn
  if (type === "delete") {
    return (
      <NotifyDialog
        open={open}
        type={NotifyType.Warning}
        title="Xác nhận xoá"
        message={`Bạn có chắc chắn muốn xoá vai trò "${role?.name}" không?`}
        onClose={onClose}
        primaryActionText="Xác nhận"
        onPrimaryAction={onConfirm}
      />
    );
  }


  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none" showCloseButton={false} >       
        {/* Giữ nguyên UI bên trong */}
        <Card className="w-full relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <CardHeader>
            <CardTitle>Danh sách quyền truy cập</CardTitle>
            <p className="text-sm text-gray-500">
              Cấu hình quyền truy cập cho các API và tính năng
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Tên vai trò:</label>
                <input
                  type="text"
                  defaultValue={role?.name || ""}
                  className="w-40 px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả:</label>
                <input
                  type="text"
                  defaultValue={role?.description || ""}
                  className="w-60 px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 ">Trạng thái:</label>
                <select
                  defaultValue={role?.status || "Kích hoạt"}
                  className="w-32 px-2 py-1 border rounded "
                >
                  <option value="Kích hoạt" >Kích hoạt</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">API</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Mô tả</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, idx) => (
                  <tr key={perm.api} className="border-b">
                    <td className="px-4 py-2">{perm.api}</td>
                    <td className="px-4 py-2">{perm.desc}</td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={perm.enabled}
                        onChange={() =>
                          setPermissions((prev) =>
                            prev.map((p, i) =>
                              i === idx ? { ...p, enabled: !p.enabled } : p
                            )
                          )
                        }
                        className="w-5 h-5 accent-[#006DF0]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button className="bg-[#006DF0] hover:bg-[#0055b3] text-white">
              Lưu
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
