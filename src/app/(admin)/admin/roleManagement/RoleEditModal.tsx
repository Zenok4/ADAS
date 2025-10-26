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
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RoleEditModalProps {
  open: boolean; // điều khiển modal hiển thị
  role?: {
    id?: number;
    name?: string;
    description?: string;
    status?: string;
    permissions?: { api: string; desc: string; enabled: boolean }[];
  } | null;
  onClose: () => void;
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
  role,
  onClose,
}: RoleEditModalProps) {
  const [permissions, setPermissions] = useState(defaultPermissions);

  useEffect(() => {
    setPermissions(role?.permissions ?? defaultPermissions);
  }, [role, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-3xl p-0 border-0 bg-transparent shadow-none"
        showCloseButton={false}
      >
        <Card className="w-full relative">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <CardHeader>
            <CardTitle>
              {role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
            </CardTitle>
            <p className="text-sm text-gray-500">
              Cấu hình quyền truy cập cho các API và tính năng
            </p>
          </CardHeader>

          <CardContent>
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên vai trò:
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Trạng thái:
                </label>
                <select
                  defaultValue={role?.status || "Kích hoạt"}
                  className="w-32 px-2 py-1 border rounded text-gray-700
                             transition-colors"
                >
                  <option
                    value="Kích hoạt"
                    className="hover:bg-[#006DF0] hover:text-white"
                  >
                    Kích hoạt
                  </option>
                  <option
                    value="Tạm ngưng"
                    className="hover:bg-[#006DF0] hover:text-white"
                  >
                    Tạm ngưng
                  </option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-semibold">
                    API
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold">
                    Mô tả
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold">
                    Trạng thái
                  </th>
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
