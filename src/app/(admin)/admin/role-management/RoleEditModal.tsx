"use client";
import { AuthService } from "@/services/authService";
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
import { NotifyType } from "@/type/notify";


  interface Permission{
    id: number;
    code: string;
    description: string;
    enabled: boolean;
  }
  interface Role{
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    permissions?: {id: number} [];
    
  }
  interface RoleEditModalProps {
    open: boolean; // điều khiển modal hiển thị
    role?: Role | null;
    onClose: () => void;
    existingRoles?: Role[];
    showNotify: (args : any) => void;
    currentUserLevel: number;
  }

  export default function RoleEditModal({
    open,
    role,
    onClose,
    existingRoles,
    showNotify,
    currentUserLevel,
  }: RoleEditModalProps) {
    const [allPermissions, setAllPermissions] = useState<Omit<Permission, 'enabled'>[]>([]);
    const [displayPermissions, setDisplayPermissions] = useState<Permission[]>([]);

  

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [level, setLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const allPermRes = await AuthService.listPermissions();
          const allPerms = allPermRes.data.permissions || [];
          let ownedIds = new Set<number>();
          

          if (role && role.id) {
            const roleDetailsRes = await AuthService.getRole(role.id, true);
            console.log(" Dữ liệu chi tiết vai trò:", roleDetailsRes.data);
            const detailedRole= roleDetailsRes.data.role;

            setName(detailedRole.name || "");
            setDescription(detailedRole.description || "");
            setIsActive(detailedRole.is_active !== undefined ? detailedRole.is_active : true);
            setLevel(detailedRole.level || 1);
            const ownedPerms = detailedRole.permissions || [];
            ownedIds = new Set(ownedPerms.map((p: any) => p.id));
          
          } else {
            setName("");
            setDescription("");
            setIsActive(true);
            setLevel(1);
          
          }

            const mergedPermissions = allPerms.map((perm: any) => ({
              ...perm,
              enabled: ownedIds.has(perm.id),
            }));


            setDisplayPermissions(mergedPermissions);
          
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu quyền:", error);
          showNotify({
            type: NotifyType.Error,
            title: "Lỗi",
            message: "Không tải được dữ liệu quyền!",
          });
        } finally {
          setIsLoading(false);
        }
      };
      if (open) {
        fetchData();
      }
    }, [role, open, showNotify]);

    console.log("Display role:", role);


    const handleSave = async () => {
      
        const trimmedName = name.trim();
        if (!trimmedName) {
          showNotify({
            type: NotifyType.Warning,
            title: "Cảnh báo",
            message: "Tên vai trò không được để trống!",
          });
          return;
        }
        if (!role?.id && existingRoles?.some(r => r.name === trimmedName)) {
          showNotify({
            type: NotifyType.Error,
            title: "Tên vai trò đã tồn tại",
            message: `Vai trò với tên "${trimmedName}" đã tồn tại. Vui lòng chọn tên khác.`,
          });
          return;
        }
        const selectedPermsissionsIds = displayPermissions
          .filter((perm) => perm.enabled)
          .map((perm) => perm.id);

        if(selectedPermsissionsIds.length === 0){
          showNotify({
            type: NotifyType.Warning,
            title: "Cảnh báo",
            message: "Vui lòng chọn ít nhất một quyền cho vai trò!",
          });
          return;
        }
        if (level >= currentUserLevel) {
          showNotify({
            type: NotifyType.Error,
            title: "Lỗi quyền hạn",
            message: `Bạn không thể tạo hoặc gán level (${level}) cao hơn hoặc bằng level của chính bạn (${currentUserLevel}).`,
        });
          return; // Dừng lại, không gọi API
        }
      try {
        const payload = { name: trimmedName, description, is_active: isActive, level: level, current_user_level: currentUserLevel };
        if (role?.id) {
          await AuthService.updateRole(role.id, payload);
          await AuthService.assignPermissionToRole(role.id, selectedPermsissionsIds);
          showNotify({
            type: NotifyType.Success,
            title: "Thành công",
            message: "Cập nhật vai trò thành công!",
          });
        }
        else {
          const response = await AuthService.createRole(payload);
          const newRoleId = response.data.role;
          if (newRoleId && newRoleId.id) {
            await AuthService.assignPermissionToRole(newRoleId.id, selectedPermsissionsIds);
          }
          showNotify({
            type: NotifyType.Success,
            title: "Thành công",
            message: "Thêm vai trò thành công!",
          });
        }


        onClose();
      } catch (error) {
        console.error("Lưu vai trò thất bại:", error);
        showNotify({
          type: NotifyType.Error,
          title: "Lỗi",
          message: "Lưu vai trò thất bại!",
        });
      }
    };
  

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
                  value ={name}
                  onChange={(e) => setName(e.target.value)}
                //  defaultValue={role?.name || ""}
                  className="w-40 px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                //  defaultValue={role?.description || ""}
                  className="w-60 px-2 py-1 border rounded"
                />
              </div>
              <div> 
                <label className="block text-sm font-medium mb-1">
                  Cấp độ:
                </label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2 py-1 border rounded"
                  min ="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trạng thái:
                </label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                //  defaultValue={role?.status || "Kích hoạt"}
                  className="w-32 px-2 py-1 border rounded text-gray-700
                             transition-colors"
                >
                  <option
                    value="true"
                    className="hover:bg-[#006DF0] hover:text-white"
                  >
                    Kích hoạt
                  </option>
                  <option
                    value="false"
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
                    Tên quyền
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
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : displayPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">
                      Không có quyền nào để hiển thị.
                    </td>
                  </tr>
                ) : (

                
                displayPermissions.map((perm, idx) => (
                  <tr key={perm.id} className="border-b">
                    <td className="px-4 py-2">{perm.code}</td>
                    <td className="px-4 py-2">{perm.description}</td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={perm.enabled}
                        onChange={() =>
                          setDisplayPermissions((prev) =>
                            prev.map((p, i) =>
                              i === idx ? { ...p, enabled: !p.enabled } : p
                            )
                          )
                        }
                        className="w-5 h-5 accent-[#006DF0]"
                      />
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={handleSave} className="bg-[#006DF0] hover:bg-[#0055b3] text-white">              
                Lưu
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
