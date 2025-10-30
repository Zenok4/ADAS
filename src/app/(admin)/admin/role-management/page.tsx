"use client";


import { useEffect, useState } from "react";
import { AuthService } from "@/services/authService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import RoleEditModal from "./RoleEditModal";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";



export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<any>(undefined);
  const [modalType, setModalType] = useState<"edit" | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  useEffect(() => { 
    loadRoles();
  }, []);
  const loadRoles = async () => {
    try {
      const res = await AuthService.listRoles();
      setRoles(res.data.roles );
    } catch (error) {
      console.error("Lỗi tải danh sách vai trò:", error);
    }
  };
  
  // NotifyDialog để xác nhận xóa
  const {
    open,
    type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = useNotifyDialog();

  const handleEdit = (role: any) => {
    setSelectedRole(role);
    setModalType("edit");
  };
// truyền id vao role: any
  const handleDelete = (role: any) => {
    showNotify({
      type: NotifyType.Warning,
      title: "Xác nhận xoá",
      message: `Bạn có chắc chắn muốn xoá vai trò "${role.name}" không?`,
      primaryActionText: "Xoá",
      onPrimaryAction:async () => {
        //Logic xoá vai trò ở đây
        try{
          await AuthService.deleteRole(role.id);
          await loadRoles();
        }catch(error){
          console.error("Lỗi xoá vai trò:", error);
        }
      },
    });

  };

  const handleAdd = () => {
    setSelectedRole(null); // null = thêm mới
    setModalType("edit");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
            <p className="text-gray-600">
              Quản lý vai trò và quyền hạn của vai trò
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#006DF0] hover:bg-[#0055b3] text-white"
          >
            <Plus size={20} />
            Thêm vai trò
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách vai trò</CardTitle>
            <p className="text-sm text-gray-500">
              Tất cả vai trò trong hệ thống
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            role.status === "Kích hoạt"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {role.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {role.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {role.createdDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(role)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(role)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal edit/add role */}
      <RoleEditModal
        open={modalType === "edit"}
        role={selectedRole}
        onClose={() => {
          setSelectedRole(undefined);
          setModalType(null);
          loadRoles();
        }}
      />

      {/* NotifyDialog confirm delete */}
      <NotifyDialog
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
        onClose={hideNotify}
      />
    </div>
  );
}
