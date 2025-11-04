"use client";


import { use, useEffect, useState } from "react";
import { AuthService } from "@/services/authService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import RoleEditModal from "./RoleEditModal";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { ListRolesParams } from "@/services/authService";



export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<any>(undefined);
  const [modalType, setModalType] = useState<"edit" | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [pagination , setPagination] = useState({
    page : 1,
    limit: 10,
    total: 0,
  })
  const [filters, setFilters] = useState({
    name: "",
    description: "",
    is_active: null as boolean | null,
  })
  const [nameInput, setNameInput] = useState("");
  useEffect(() => { 
    loadRoles();
  }, [pagination.page,filters]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(f => ({ ...f, name: nameInput }));
      setPagination(prev => ({
        ...prev,
        page: 1,  
      }));
    }, 500); // Chờ 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(handler);
  }, [nameInput]);
  const loadRoles = async () => {
    try {
      const params: ListRolesParams = {
        page: pagination.page,
        limit: pagination.limit,
        list_permissions: true,

        ... (filters.name && { name: filters.name } ),
        ... (filters.description && { description: filters.description } ),
        ... (filters.is_active !== null && { is_active: filters.is_active } ),
      };
      const res = await AuthService.ListRoles(params);
      console.log("API response (pagination):", res.data);
      setRoles(res.data.data.roles || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.data.total || 0,
      }));
      // const res = await AuthService.listRoles(true);
      // console.log("API response:", res.data);
      // setRoles(res.data.roles || []);
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

          showNotify({
            type: NotifyType.Success,
            title: "Xoá thành công",
            message: `Vai trò "${role.name}" đã được xoá thành công.`,
            primaryActionText: "Xác nhận",
          });
        }catch(error){
          console.error("Lỗi xoá vai trò:", error);
          showNotify({
            type: NotifyType.Error,
            title: "Lỗi xoá vai trò", 
            message: `Đã có lỗi xảy ra khi xoá vai trò "${role.name}". Vui lòng thử lại.`,
            primaryActionText: "Xác nhận",
          });
        }
      },
    });

  };

  const handleAdd = () => {
    setSelectedRole(null); // null = thêm mới
    setModalType("edit");
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleFilterSubmit = () => {
    setFilters(f => ({ ...f, name: nameInput }));

    setPagination(prev => ({
      ...prev,
      page: 1, // Reset về trang đầu khi áp dụng bộ lọc mới
    }));
    //loadRoles();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ===  TIÊU ĐỀ VÀ NÚT === */}
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
        

        {/* === THÊM KHUNG FILTER (GỢI Ý) === */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <input
              type="text"
              placeholder="Tên vai trò..."
              className="w-full px-3 py-2 border rounded"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <select
              className="w-full px-3 py-2  border rounded text-gray-700 transition-colors"
              value={filters.is_active === null ? "" : String(filters.is_active)}
              onChange={(e) => 
                setFilters(f => ({ 
                  ...f, 
                  is_active: e.target.value === "" ? null : e.target.value === "true" 
                }))
              }
            >
              <option value="" className="hover:bg-[#006DF0] hover:text-white">Tất cả trạng thái</option>
              <option value="true" className="hover:bg-[#006DF0] hover:text-white">Kích hoạt</option>
              <option value="false" className="hover:bg-[#006DF0] hover:text-white">Tạm ngưng</option>
            </select>
            <Button 
              onClick={handleFilterSubmit}
              className="bg-[#006DF0] hover:bg-[#0055b3] text-white"
            >
              Tìm kiếm
            </Button>
          </CardContent>
        </Card>
        {/* === KẾT THÚC KHUNG FILTER === */}


        <Card>
          <CardHeader>
            <CardTitle>Danh sách vai trò</CardTitle>
            <p className="text-sm text-gray-500">
              {/* Hiển thị tổng số */}
              Tìm thấy tổng cộng {pagination.total} vai trò.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              
              <table className="w-full">
                {/* ... (thead) ... */}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tên vai trò
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mô tả
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày tạo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      {/* === BẮT ĐẦU NỘI DUNG THÊM VÀO === */}
                      {/* Thay thế comment cũ bằng nội dung cột thật */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            role.is_active 
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {role.is_active ? "Kích hoạt" : "Tạm ngưng"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-1">
                          {role.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Format lại ngày tháng cho dễ đọc */}
                        {new Date(role.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrawhitespace-nowrap text-sm font-medium">
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
            
            {/* === THÊM PHÂN TRANG === */}
            <div className="p-4 border-t">

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Trang {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="bg-[#006DF0] hover:bg-[#0055b3] text-white disabled:opacity-60"
                  >
                    Trang trước
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    className="bg-[#006DF0] hover:bg-[#0055b3] text-white disabled:opacity-60"
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            </div>
            {/* === KẾT THÚC PHÂN TRANG === */}

          </CardContent>
        </Card>
      </div>

      {/* Modal edit/add role */}
      <RoleEditModal
        open={modalType === "edit"}
        role={selectedRole}
        existingRoles={roles}
        showNotify={showNotify}
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
