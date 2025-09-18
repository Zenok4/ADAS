import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

type RoleModalType = "edit" | "delete";

interface RoleEditModalProps {
  open: boolean;
  type: RoleModalType;
  role?: {
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
  if (!open) return null;

  // Quản lý trạng thái quyền hạn bằng state
  const [permissions, setPermissions] = useState(defaultPermissions);

  // Nếu có role truyền vào thì cập nhật lại permissions
  useEffect(() => {
    setPermissions(role?.permissions ?? defaultPermissions);
  }, [role, open]);

  if (type === "delete") {
    // Giao diện xác nhận xóa
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <Card className="w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={32} />
              <CardTitle className="text-lg">Cảnh báo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 mb-4">
              <span className="font-semibold">Cảnh báo:</span> Hành động này có thể ảnh hưởng đến dữ liệu của bạn. Bạn có chắc chắn muốn tiếp tục?
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="destructive" onClick={onConfirm} className="bg-orange-400 hover:bg-orange-500 text-white">
              Xác nhận
            </Button>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Giao diện chỉnh sửa vai trò & quyền truy cập
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl relative">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò:</label>
              <input
                type="text"
                defaultValue={role?.name || ""}
                className="w-40 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả:</label>
              <input
                type="text"
                defaultValue={role?.description || ""}
                className="w-60 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
              <select
                defaultValue={role?.status || "Kích hoạt"}
                className="w-32 px-2 py-1 border rounded"
              >
                <option value="Kích hoạt">Kích hoạt</option>
                <option value="Tạm ngưng">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <div>
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
                        onChange={() => {
                          setPermissions(prev =>
                            prev.map((p, i) =>
                              i === idx ? { ...p, enabled: !p.enabled } : p
                            )
                          );
                        }}
                        className="w-5 h-5 accent-[#006DF0]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="main" className="bg-[#006DF0] hover:bg-[#0055b3] text-white">
            Lưu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}