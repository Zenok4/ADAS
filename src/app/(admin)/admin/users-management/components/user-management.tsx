"use client";

import { useState, useEffect, useMemo } from "react";
import { UserService, AuthorService } from "@/services/userService";
import { useSession } from "@/context/SessionContext";
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
// Đã xóa import Moon, Sun từ lucide-react

const PAGE_LIMIT = 10;
type FormErrors = { username: string; email: string; phone: string };
const initialErrors: FormErrors = { username: "", email: "", phone: "" };

const getErrorNotify = (error: any, defaultMessage: string) => {
  const responseData = error.response?.data;
  let finalErrorMessage: string = defaultMessage;

  const setError = (msg: any): boolean => {
    if (msg && typeof msg === "string") {
      finalErrorMessage = msg;
      return true;
    }
    return false;
  };
  // Logic lấy lỗi chi tiết (giữ nguyên như cũ của bạn)
  if (setError(responseData?.message) || setError(responseData?.detail)) {
  } else if (
    responseData?.error &&
    typeof responseData.error === "object" &&
    setError(responseData.error.message)
  ) {
  } else if (setError(responseData?.error)) {
  } else if (
    responseData?.data &&
    (setError(responseData.data.message) ||
      setError(responseData.data.error) ||
      setError(responseData.data.detail))
  ) {
  } else if (responseData?.errors) {
    const errors = responseData.errors;
    if (typeof errors === "string") finalErrorMessage = errors;
    else if (
      Array.isArray(errors) &&
      errors.length > 0 &&
      typeof errors[0] === "string"
    )
      finalErrorMessage = errors.join(", ");
    else if (typeof errors === "object" && !Array.isArray(errors)) {
      const firstErrorKey = Object.keys(errors)[0];
      if (
        firstErrorKey &&
        Array.isArray(errors[firstErrorKey]) &&
        errors[firstErrorKey].length > 0
      )
        finalErrorMessage = errors[firstErrorKey][0];
    }
  } else if (typeof responseData === "string") finalErrorMessage = responseData;

  // Logic map lỗi sang tiếng Việt thân thiện (giữ nguyên)
  let title = "Lỗi";
  let userFriendlyMessage = finalErrorMessage;
  const lowerMessage = finalErrorMessage.toLowerCase();

  if (
    lowerMessage.includes("duplicate entry") &&
    lowerMessage.includes("key 'users.username'")
  ) {
    title = "Lỗi: Tên đăng nhập đã tồn tại";
    userFriendlyMessage =
      "Tên đăng nhập này đã được sử dụng bởi một tài khoản khác. Vui lòng chọn tên khác.";
  } else if (
    lowerMessage.includes("duplicate entry") &&
    lowerMessage.includes("key 'users.email'")
  ) {
    title = "Lỗi: Email đã tồn tại";
    userFriendlyMessage =
      "Email này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng email khác.";
  } else if (
    lowerMessage.includes("duplicate entry") &&
    lowerMessage.includes("key 'users.phone'")
  ) {
    title = "Lỗi: Số điện thoại đã tồn tại";
    userFriendlyMessage =
      "Số điện thoại này đã được sử dụng bởi một tài khoản khác. Vui lòng sử dụng số khác.";
  } else if (
    lowerMessage.includes("username already exists") ||
    lowerMessage.includes("tên đăng nhập đã tồn tại")
  ) {
    title = "Lỗi: Tên đăng nhập đã tồn tại";
    userFriendlyMessage =
      "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.";
  } else if (
    lowerMessage.includes("email already exists") ||
    lowerMessage.includes("email đã tồn tại")
  ) {
    title = "Lỗi: Email đã tồn tại";
    userFriendlyMessage =
      "Email này đã được sử dụng. Vui lòng sử dụng email khác.";
  } else if (
    lowerMessage.includes("phone already exists") ||
    lowerMessage.includes("số điện thoại đã tồn tại")
  ) {
    title = "Lỗi: Số điện thoại đã tồn tại";
    userFriendlyMessage =
      "Số điện thoại này đã được sử dụng. Vui lòng sử dụng số khác.";
  } else if (
    lowerMessage.includes("already exists") ||
    lowerMessage.includes("đã tồn tại") ||
    lowerMessage.includes("unique constraint") ||
    lowerMessage.includes("duplicate key") ||
    lowerMessage.includes("duplicate entry")
  ) {
    title = "Lỗi Trùng Lặp";
    userFriendlyMessage =
      "Một trường thông tin bạn nhập đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
  }

  return { type: NotifyType.Error, title: title, message: userFriendlyMessage };
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
  const { user } = useSession();

  // === DARK MODE SYNC (Chỉ đồng bộ, không có nút bấm) ===
  // Logic này đảm bảo trang UserManagement cũng nhận class "dark" nếu Settings đã set.
  // Tuy nhiên, nếu bạn dùng next-themes bọc toàn app thì đoạn này có thể không cần thiết,
  // nhưng để chắc chắn tôi vẫn giữ đoạn check localStorage/system.
  useEffect(() => {
    // Nếu bạn dùng next-themes ở Root Layout, dòng này là thừa.
    // Nếu không, dòng này giúp đồng bộ theme khi load trang này độc lập.
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  // =====================================================

  const [userList, setUserList] = useState<UserData[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoleId, setUserRoleId] = useState<number | null>(null);

  const currentUserLevel = useMemo(() => {
    const userRoles = (user as any)?.roles;
    if (!user || !userRoles || userRoles.length === 0) return 0;
    return Math.max(...userRoles.map((role: any) => role.level));
  }, [user]);

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all",
  });
  const [uiSearchTerm, setUiSearchTerm] = useState("");
  const [uiFilterStatus, setUiFilterStatus] = useState("all");
  const [uiFilterRole, setUiFilterRole] = useState("all");
  const [addFormErrors, setAddFormErrors] = useState<FormErrors>(initialErrors);
  const [editFormErrors, setEditFormErrors] =
    useState<FormErrors>(initialErrors);

  const validateEmail = (email: string) =>
    !email
      ? "Email là bắt buộc."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Email không hợp lệ."
      : "";
  const validatePhone = (phone: string) =>
    !phone
      ? "Số điện thoại là bắt buộc."
      : !/^(03|05|07|08|09)\d{7,8}$/.test(phone)
      ? "Số điện thoại không hợp lệ."
      : "";
  const validateUsername = (username: string) =>
    !username
      ? "Tên đăng nhập là bắt buộc."
      : username.length < 4
      ? "Tên đăng nhập phải có ít nhất 4 ký tự."
      : /\s/.test(username)
      ? "Tên đăng nhập không được chứa khoảng trắng."
      : "";
  const validators = { validateEmail, validatePhone, validateUsername };

  const fetchRoles = async () => {
    try {
      const response = await AuthorService.getAllRoles();
      let roles: RoleData[] = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) roles = response.data.data;
        else if (response.data.data && Array.isArray(response.data.data.roles))
          roles = response.data.data.roles;
        else if (Array.isArray(response.data.roles))
          roles = response.data.roles;
      }
      roles.sort((a, b) => (b.level || 0) - (a.level || 0));
      setAvailableRoles(roles);
      const userRole = roles.find((r) => r.name.toLowerCase() === "user");
      setUserRoleId(userRole ? userRole.id : null);
      if (userRole)
        setNewUser((prev) => ({ ...prev, selectedRoleIds: [userRole.id] }));
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải danh sách vai trò.",
      });
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
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
      } else setUserList([]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải danh sách người dùng.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

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

  const handleNewUserRoleChange = (roleId: number, checked: boolean) => {
    if (roleId === userRoleId && !checked) return;
    setNewUser((prev) => ({
      ...prev,
      selectedRoleIds: checked
        ? [...prev.selectedRoleIds, roleId]
        : prev.selectedRoleIds.filter((id) => id !== roleId),
    }));
  };

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
        showNotify({
          type: NotifyType.Error,
          title: "Lỗi",
          message: "Tạo user thất bại, response lạ.",
        });
        return;
      }
      const createdUser = response.data.data;
      if (!newUser.is_active)
        await UserService.toggleUserStatus(createdUser.id, {
          is_active: false,
        });
      if (newUser.selectedRoleIds.length > 0)
        await AuthorService.assignRolesToUser(createdUser.id, {
          role_ids: newUser.selectedRoleIds,
        });
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đã thêm người dùng mới.",
      });
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      showNotify(getErrorNotify(error, "Tạo người dùng thất bại."));
    }
  };

  const handleEditUser = async (user: UserData) => {
    const targetMaxLevel =
      user.roles?.reduce((max, r) => Math.max(max, r.level || 0), 0) || 0;
    if (targetMaxLevel >= currentUserLevel) {
      showNotify({
        type: NotifyType.Error,
        title: "Không đủ quyền",
        message: `Bạn không thể chỉnh sửa người dùng có cấp độ (${targetMaxLevel}) cao hơn hoặc bằng bạn (${currentUserLevel}).`,
      });
      return;
    }
    try {
      const response = await UserService.getUserDetail(user.id, true);
      if (!response.data || !response.data.data) {
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
        selectedRoleIds: userData.roles?.map((role: any) => role.id) || [],
      });
      setEditFormErrors(initialErrors);
      setIsEditModalOpen(true);
    } catch (error) {
      showNotify({
        type: NotifyType.Error,
        title: "Lỗi",
        message: "Không thể tải chi tiết người dùng.",
      });
    }
  };

  const handleEditRoleChange = (roleId: number, checked: boolean) => {
    if (roleId === userRoleId && !checked) return;
    if (!editingUser) return;
    setEditingUser((prev) =>
      prev
        ? {
            ...prev,
            selectedRoleIds: checked
              ? [...prev.selectedRoleIds, roleId]
              : prev.selectedRoleIds.filter((id) => id !== roleId),
          }
        : null
    );
  };

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
      await fetchUsers();
    } catch (error: any) {
      showNotify(getErrorNotify(error, "Cập nhật thất bại."));
    }
  };

  const handleDeleteUser = (user: UserData) => {
    const targetMaxLevel =
      user.roles?.reduce((max, r) => Math.max(max, r.level || 0), 0) || 0;
    if (targetMaxLevel >= currentUserLevel) {
      showNotify({
        type: NotifyType.Error,
        title: "Không đủ quyền",
        message: `Bạn không thể xóa người dùng có cấp độ (${targetMaxLevel}) cao hơn hoặc bằng bạn (${currentUserLevel}).`,
      });
      return;
    }
    showNotify({
      type: NotifyType.Warning,
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc chắn muốn xóa người dùng "${user.username}" không?`,
      primaryActionText: "Xóa",
      onPrimaryAction: () => confirmDeleteUser(user.id),
    });
  };

  const confirmDeleteUser = async (userId: number | string) => {
    try {
      await UserService.deleteUser(userId);
      showNotify({
        type: NotifyType.Success,
        title: "Thành công",
        message: "Đã xóa người dùng.",
      });
      if (userList.length === 1 && page > 1) setPage(page - 1);
      else fetchUsers();
    } catch (error: any) {
      showNotify(getErrorNotify(error, "Xóa người dùng thất bại."));
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilters({
      search: uiSearchTerm,
      status: uiFilterStatus,
      role: uiFilterRole,
    });
  };
  const handleClearFilters = () => {
    setPage(1);
    setUiSearchTerm("");
    setUiFilterStatus("all");
    setUiFilterRole("all");
    setFilters({ search: "", status: "all", role: "all" });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl transition-colors duration-300 relative">
      {/* NÚT DARK MODE ĐÃ BỊ XÓA Ở ĐÂY */}

      <UserManagementHeader onOpenAddModal={handleOpenAddModal} />

      <Card className="mb-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardContent className="p-4 flex flex-col md:flex-row flex-wrap gap-4">
          <div className="flex-grow min-w-[200px]">
            <label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >
              Tìm kiếm
            </label>
            <Input
              id="search"
              placeholder="Tìm theo tên, email, SĐT..."
              value={uiSearchTerm}
              onChange={(e) => setUiSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
            />
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >
              Trạng thái
            </label>
            <Select value={uiFilterStatus} onValueChange={setUiFilterStatus}>
              <SelectTrigger
                id="status"
                className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <SelectItem
                  value="all"
                  className="dark:text-gray-200 dark:focus:bg-slate-700"
                >
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem
                  value="active"
                  className="dark:text-gray-200 dark:focus:bg-slate-700"
                >
                  Hoạt động
                </SelectItem>
                <SelectItem
                  value="suspended"
                  className="dark:text-gray-200 dark:focus:bg-slate-700"
                >
                  Tạm khóa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >
              Vai trò
            </label>
            <Select value={uiFilterRole} onValueChange={setUiFilterRole}>
              <SelectTrigger
                id="role"
                className="w-full bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <SelectItem
                  value="all"
                  className="dark:text-gray-200 dark:focus:bg-slate-700"
                >
                  Tất cả vai trò
                </SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem
                    key={role.id}
                    value={String(role.id)}
                    className="dark:text-gray-200 dark:focus:bg-slate-700"
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 self-end pt-5">
            <Button
              onClick={handleApplyFilters}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
            >
              <Search className="h-4 w-4" />
              Lọc
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Xóa
            </Button>
          </div>
        </CardContent>
      </Card>

      <UserListTable
        userList={userList}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        currentUserLevel={currentUserLevel}
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
        currentUserLevel={currentUserLevel}
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
        currentUserLevel={currentUserLevel}
      />

      <NotifyDialog
        onClose={hideNotify}
        open={open}
        type={type}
        title={title}
        message={message}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
      />
    </div>
  );
}
