"use client";

import { useState, useEffect } from "react";
import { UserService, AuthorService } from "@/services/userService";
import {
  UserData,
  RoleData,
  UserCreatePayload,
} from "@/services/type/user.type";
import { NewUserForm, EditingUserForm } from "./types";
import { UserManagementHeader } from "./UserManagementHeader";
import { UserListTable } from "./UserListTable";
import { AddUserModal } from "./AddUserModal";
import { EditUserModal } from "./EditUserModal";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { PaginationComponent } from "./PaginationComponent";

// Import thêm cho UI Lọc
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PAGE_LIMIT = 10;
type FormErrors = { username: string; email: string; phone: string };
const initialErrors: FormErrors = { username: "", email: "", phone: "" };

// (Hàm getErrorNotify giữ nguyên - không thay đổi)
const getErrorNotify = (error: any, defaultMessage: string) => {
  const responseData = error.response?.data;
  let finalErrorMessage: string = defaultMessage;

  const setError = (msg: any): boolean => {
    if (msg && typeof msg === 'string') {
      finalErrorMessage = msg;
      return true;
    }
    return false;
  };

  if (setError(responseData?.message) || setError(responseData?.detail)) {
  }
  else if (responseData?.error && typeof responseData.error === 'object' && setError(responseData.error.message)) {
  }
  else if (setError(responseData?.error)) {
  }
  else if (responseData?.data && (setError(responseData.data.message) || setError(responseData.data.error) || setError(responseData.data.detail))) {
  }
  else if (responseData?.errors) {
    const errors = responseData.errors;
    if (typeof errors === 'string') {
      finalErrorMessage = errors;
    }
    else if (Array.isArray(errors) && errors.length > 0 && typeof errors[0] === 'string') {
      finalErrorMessage = errors.join(', ');
    }
    else if (typeof errors === 'object' && !Array.isArray(errors)) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && Array.isArray(errors[firstErrorKey]) && errors[firstErrorKey].length > 0) {
        finalErrorMessage = errors[firstErrorKey][0];
      }
    }
  }
  else if (typeof responseData === 'string') {
    finalErrorMessage = responseData;
  }

  let title = "Lỗi";
  let userFriendlyMessage = finalErrorMessage;
  
  const lowerMessage = finalErrorMessage.toLowerCase();

  if (lowerMessage.includes("duplicate entry") && lowerMessage.includes("key 'users.username'")) {
    title = "Lỗi: Tên đăng nhập đã tồn tại";
    userFriendlyMessage = "Tên đăng nhập này đã được sử dụng bởi một tài khoản khác. Vui lòng chọn tên khác.";
  } else if (lowerMessage.includes("duplicate entry") && lowerMessage.includes("key 'users.email'")) {
    title = "Lỗi: Email đã tồn tại";
    userFriendlyMessage = "Email này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng email khác.";
  } else if (lowerMessage.includes("duplicate entry") && lowerMessage.includes("key 'users.phone'")) {
    title = "Lỗi: Số điện thoại đã tồn tại";
    userFriendlyMessage = "Số điện thoại này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng số khác.";
  }
  else if (lowerMessage.includes("username already exists") || lowerMessage.includes("tên đăng nhập đã tồn tại")) {
    title = "Lỗi: Tên đăng nhập đã tồn tại";
    userFriendlyMessage = "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.";
  } else if (lowerMessage.includes("email already exists") || lowerMessage.includes("email đã tồn tại")) {
    title = "Lỗi: Email đã tồn tại";
    userFriendlyMessage = "Email này đã được sử dụng. Vui lòng sử dụng email khác.";
  } else if (lowerMessage.includes("phone already exists") || lowerMessage.includes("số điện thoại đã tồn tại")) {
    title = "Lỗi: Số điện thoại đã tồn tại";
    userFriendlyMessage = "Số điện thoại này đã được sử dụng. Vui lòng sử dụng số khác.";
  } 
  else if (lowerMessage.includes("already exists") || lowerMessage.includes("đã tồn tại") || lowerMessage.includes("unique constraint") || lowerMessage.includes("duplicate key") || lowerMessage.includes("duplicate entry")) {
    title = "Lỗi Trùng Lặp";
    userFriendlyMessage = "Một trường thông tin bạn nhập đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
  }

  return {
    type: NotifyType.Error,
    title: title,
    message: userFriendlyMessage,
  };
};


export function UserManagement() {
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

  const [userList, setUserList] = useState<UserData[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUserForm | null>(null);
  const [newUser, setNewUser] = useState<NewUserForm>({
    username: "",
    email: "",
    phone: "",
    password: "",
    is_active: true,
    selectedRoleIds: [],
  });

  // === THAY ĐỔI VỀ STATE PHÂN TRANG VÀ LỌC ===
  const [page, setPage] = useState(1); // Đổi tên từ currentPage
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all",
  });
  // State cho các trường input UI (trước khi bấm "Lọc")
  const [uiSearchTerm, setUiSearchTerm] = useState("");
  const [uiFilterStatus, setUiFilterStatus] = useState("all");
  const [uiFilterRole, setUiFilterRole] = useState("all");
  // =============================================

  const [addFormErrors, setAddFormErrors] = useState<FormErrors>(initialErrors);
  const [editFormErrors, setEditFormErrors] =
    useState<FormErrors>(initialErrors);

  // (Hàm Validators giữ nguyên - không thay đổi)
  const validateEmail = (email: string): string => {
    if (!email) return "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ.";
    return "";
  };
  const validatePhone = (phone: string): string => {
    if (!phone) return "Số điện thoại là bắt buộc.";
    if (!/^(0[3|5|7|8|9])(\d{8})$/.test(phone)) return "Số điện thoại không hợp lệ (phải 10 số, bắt đầu bằng 0).";
    return "";
  };
  const validateUsername = (username: string): string => {
    if (!username) return "Tên đăng nhập là bắt buộc.";
    if (username.length < 4) return "Tên đăng nhập phải có ít nhất 4 ký tự.";
    if (/\s/.test(username)) return "Tên đăng nhập không được chứa khoảng trắng.";
    return "";
  };
  const validators = { validateEmail, validatePhone, validateUsername };

  // (Hàm fetchRoles giữ nguyên - chỉ bỏ fetchUsers)
  const fetchRoles = async () => {
    try {
      const response = await AuthorService.getAllRoles();
      let roles: RoleData[] = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          roles = response.data.data;
        } else if (
          response.data.data &&
          Array.isArray(response.data.data.roles)
        ) {
          roles = response.data.data.roles;
        } else if (Array.isArray(response.data.roles)) {
          roles = response.data.roles;
        } else {
          console.error("Invalid roles response structure:", response.data);
        }
      } else {
        console.error("No data returned from getAllRoles");
      }
      setAvailableRoles(roles);
      const userRole = roles.find((r) => r.name.toLowerCase() === "user");
      setUserRoleId(userRole ? userRole.id : null);
      if (userRole) {
        setNewUser((prev) => ({ ...prev, selectedRoleIds: [userRole.id] }));
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải danh sách vai trò.",
      });
    }
  };

  // === CẬP NHẬT fetchUsers ĐỂ DÙNG STATE ===
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // GỌI VỚI 5 THAM SỐ
      const response = await UserService.getAllUsers(
        page, 
        PAGE_LIMIT,
        filters.search, 
        filters.status, 
        filters.role 
      );
      if (response.data && response.data.data && response.data.data.users) {
        setUserList(response.data.data.users);
        setTotalPages(Math.ceil(response.data.data.total / PAGE_LIMIT));
      } else {
        console.error(
          "Failed to fetch users: Invalid response structure",
          response.data
        );
        setUserList([]);
      }
    } catch (error) {
      console.error("Failed to fetch users (catch):", error);
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải danh sách người dùng.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // === CẬP NHẬT useEffect ===
  // Chỉ fetch roles 1 lần
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch users khi 'page' hoặc 'filters' thay đổi
  useEffect(() => {
    fetchUsers();
  }, [page, filters]);
  // ==========================

  // (handleOpenAddModal giữ nguyên)
  const handleOpenAddModal = () => {
    setNewUser({
      username: "",
      email: "",
      phone: "",
      password: "",
      is_active: true,
      selectedRoleIds: userRoleId ? [userRoleId] : [],
    });
    setAddFormErrors(initialErrors);
    setIsAddModalOpen(true);
  };

  // (handleNewUserRoleChange giữ nguyên)
  const handleNewUserRoleChange = (roleId: number, checked: boolean) => {
    if (roleId === userRoleId && !checked) {
      return;
    }
    setNewUser((prev) => {
      const newRoleIds = checked
        ? [...prev.selectedRoleIds, roleId]
        : prev.selectedRoleIds.filter((id) => id !== roleId);
      return { ...prev, selectedRoleIds: newRoleIds };
    });
  };

  // === CẬP NHẬT handleAddUser (gọi fetchUsers) ===
  const handleAddUser = async () => {
    const errors: FormErrors = {
      username: validateUsername(newUser.username),
      email: validateEmail(newUser.email),
      phone: validatePhone(newUser.phone),
    };
    if (Object.values(errors).some((e) => e)) {
      setAddFormErrors(errors);
      showNotify({
        type: NotifyType.Warning,
        title: "Thông tin không hợp lệ",
        message: "Vui lòng kiểm tra lại các trường báo lỗi.",
      });
      return;
    }
    setAddFormErrors(initialErrors);

    try {
      const payload: UserCreatePayload = {
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
      };
      const response = await UserService.createUser(payload);

      if (!response.data || !response.data.data) {
        console.error(
          "Create user failed: Invalid response structure",
          response.data
        );
        showNotify({
          type: NotifyType.Error,
          title: "Lỗi",
          message: "Tạo user thất bại, response lạ.",
        });
        return;
      }

      const createdUser = response.data.data;
      if (!newUser.is_active) {
        await UserService.toggleUserStatus(createdUser.id, {
          is_active: false,
        });
      }
      if (newUser.selectedRoleIds.length > 0) {
        await AuthorService.assignRolesToUser(createdUser.id, {
          role_ids: newUser.selectedRoleIds,
        });
      }

      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đã thêm người dùng mới.",
      });
      setIsAddModalOpen(false);
      
      // Tải lại trang hiện tại (hoặc trang 1 nếu muốn)
      // Nếu bộ lọc đang được áp dụng, người dùng mới có thể không xuất hiện
      // Tốt nhất là về trang 1 và xóa bộ lọc
      handleClearFilters(); // Về trang 1 và xóa bộ lọc
    } catch (error: any) {
      console.error("LỖI GỐC TỪ BACKEND:", error.response?.data);
      showNotify(getErrorNotify(error, "Tạo người dùng thất bại."));
    }
  };

  // (handleEditUser giữ nguyên)
  const handleEditUser = async (user: UserData) => {
    try {
      const response = await UserService.getUserDetail(user.id, true);
      if (!response.data || !response.data.data) {
        console.error(
          "Get user detail failed: Invalid response structure",
          response.data
        );
        showNotify({
          type: NotifyType.Error,
          title: "Lỗi",
          message: "Lấy chi tiết user thất bại.",
        });
        return;
      }
      const userData = response.data.data;
      setEditingUser({
        ...userData,
        selectedRoleIds: userData.roles?.map((role) => role.id) || [],
      });
      setEditFormErrors(initialErrors);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải chi tiết người dùng.",
      });
    }
  };
  
  // (handleEditRoleChange giữ nguyên)
  const handleEditRoleChange = (roleId: number, checked: boolean) => {
    if (roleId === userRoleId && !checked) {
      return;
    }
    if (!editingUser) return;
    setEditingUser((prev) => {
      if (!prev) return null;
      const newRoleIds = checked
        ? [...prev.selectedRoleIds, roleId]
        : prev.selectedRoleIds.filter((id) => id !== roleId);
      return { ...prev, selectedRoleIds: newRoleIds };
    });
  };

  // === CẬP NHẬT handleSaveUser (gọi fetchUsers) ===
  const handleSaveUser = async () => {
    if (!editingUser) return;
    const errors: FormErrors = {
      username: validateUsername(editingUser.username),
      email: validateEmail(editingUser.email),
      phone: validatePhone(editingUser.phone),
    };
    if (Object.values(errors).some((e) => e)) {
      setEditFormErrors(errors);
      showNotify({
        type: NotifyType.Warning,
        title: "Thông tin không hợp lệ",
        message: "Vui lòng kiểm tra lại các trường báo lỗi.",
      });
      return;
    }
    setEditFormErrors(initialErrors);

    try {
      await UserService.updateUser(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
        display_name: editingUser.display_name,
      });
      await UserService.toggleUserStatus(editingUser.id, {
        is_active: editingUser.is_active,
      });
      await AuthorService.assignRolesToUser(editingUser.id, {
        role_ids: editingUser.selectedRoleIds,
      });

      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đã cập nhật người dùng.",
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
      await fetchUsers(); // Tải lại dữ liệu trang hiện tại
    } catch (error: any) {
      console.error("LỖI GỐC TỪ BACKEND:", error.response?.data);
      showNotify(getErrorNotify(error, "Cập nhật thất bại."));
    }
  };

  // (handleDeleteUser giữ nguyên)
  const handleDeleteUser = (user: UserData) => {
    showNotify({
      type: NotifyType.Warning,
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc chắn muốn xóa người dùng "${user.username}" không? Hành động này không thể hoàn tác.`,
      primaryActionText: "Xóa",
      onPrimaryAction: () => confirmDeleteUser(user.id),
    });
  };

  // === CẬP NHẬT confirmDeleteUser (gọi fetchUsers/setPage) ===
  const confirmDeleteUser = async (userId: number | string) => {
    try {
      await UserService.deleteUser(userId);
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đã xóa người dùng.",
      });
      if (userList.length === 1 && page > 1) {
        setPage(page - 1); // Trở về trang trước
      } else {
        fetchUsers(); // Tải lại trang hiện tại
      }
    } catch (error: any) {
      console.error("LỖI GỐC TỪ BACKEND:", error.response?.data);
      showNotify(getErrorNotify(error, "Xóa người dùng thất bại."));
    }
  };

  // === THÊM HÀM HANDLER CHO BỘ LỌC ===
  const handleApplyFilters = () => {
    setPage(1); // Quay về trang 1
    setFilters({ // Áp dụng bộ lọc
      search: uiSearchTerm,
      status: uiFilterStatus,
      role: uiFilterRole,
    });
  };

  const handleClearFilters = () => {
    setPage(1); // Quay về trang 1
    // Xóa state UI
    setUiSearchTerm("");
    setUiFilterStatus("all");
    setUiFilterRole("all");
    // Xóa bộ lọc đã áp dụng
    setFilters({
      search: "",
      status: "all",
      role: "all",
    });
  };
  // ===================================

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <UserManagementHeader onOpenAddModal={handleOpenAddModal} />

      {/* =============== THÊM THANH LỌC =============== */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row flex-wrap gap-4">
          {/* Search Input */}
          <div className="flex-grow min-w-[200px]">
            <label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Tìm kiếm
            </label>
            <Input
              id="search"
              placeholder="Tìm theo tên, email, SĐT..."
              value={uiSearchTerm}
              onChange={(e) => setUiSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Trạng thái
            </label>
            <Select value={uiFilterStatus} onValueChange={setUiFilterStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="w-full md:w-48">
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Vai trò
            </label>
            <Select value={uiFilterRole} onValueChange={setUiFilterRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 self-end pt-5">
            <Button onClick={handleApplyFilters}>
              <Search className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Xóa
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* =================================================== */}

      <UserListTable
        userList={userList}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        currentPage={page} // Cập nhật prop
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)} // Cập nhật prop
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        availableRoles={availableRoles}
        onRoleChange={handleEditRoleChange}
        onSaveUser={handleSaveUser}
        userRoleId={userRoleId}
        errors={editFormErrors}
        setErrors={setEditFormErrors}
        validators={validators}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        availableRoles={availableRoles}
        onRoleChange={handleNewUserRoleChange}
        onAddUser={handleAddUser}
        userRoleId={userRoleId}
        errors={addFormErrors}
        setErrors={setAddFormErrors}
        validators={validators}
      />

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