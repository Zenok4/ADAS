// src/app/(admin)/admin/users-management/components/user-management.tsx
// (ĐÃ REFACTOR - Gọn gàng hơn)
"use client";

import { useState, useEffect } from "react";

// Imports các service và type
import { UserService, AuthorService } from "@/services/userService";
import {
  UserData,
  RoleData,
  UserCreatePayload,
} from "@/services/type/user.type";

// Imports các type form từ file mới
import { NewUserForm, EditingUserForm } from "./types";

// Imports các component con mới
import { UserManagementHeader } from "./UserManagementHeader";
import { UserListTable } from "./UserListTable";
import { AddUserModal } from "./AddUserModal";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserModal } from "./DeleteUserModal";

// (Giả sử bạn có component toast để thông báo)
// import { useToast } from "@/components/ui/use-toast";

export function UserManagement() {
  // const { toast } = useToast();

  // == State Quản lý Danh sách và Roles ==
  const [userList, setUserList] = useState<UserData[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // == State Quản lý Modals ==
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // == State Quản lý Dữ liệu Form ==
  const [editingUser, setEditingUser] = useState<EditingUserForm | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const [newUser, setNewUser] = useState<NewUserForm>({
    username: "",
    email: "",
    phone: "",
    password: "",
    is_active: true,
    selectedRoleId: null,
  });

  // == Hàm Fetch Dữ liệu (Giữ nguyên) ==

  const fetchRoles = async () => {
    try {
      const response = await AuthorService.getAllRoles();
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          setAvailableRoles(response.data.data);
        } else if (
          response.data.data &&
          Array.isArray(response.data.data.roles)
        ) {
          setAvailableRoles(response.data.data.roles);
        } else if (Array.isArray(response.data.roles)) {
          setAvailableRoles(response.data.roles);
        } else {
          console.error("Invalid roles response structure:", response.data);
          setAvailableRoles([]);
        }
      } else {
        console.error("No data returned from getAllRoles");
        setAvailableRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setAvailableRoles([]);
      // toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải danh sách vai trò." });
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.getAllUsers(1, 100);
      if (response.data && response.data.data && response.data.data.users) {
        setUserList(response.data.data.users);
      } else {
        console.error(
          "Failed to fetch users: Invalid response structure",
          response.data
        );
        setUserList([]);
      }
    } catch (error) {
      console.error("Failed to fetch users (catch):", error);
      setUserList([]);
      // toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải danh sách người dùng." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // == Hàm Xử lý Modal "Add User" (Giữ nguyên) ==

  const handleOpenAddModal = () => {
    setNewUser({
      username: "",
      email: "",
      phone: "",
      password: "",
      is_active: true,
      selectedRoleId: null,
    });
    setIsAddModalOpen(true);
  };

  const handleNewUserRoleChange = (roleId: number, checked: boolean) => {
    setNewUser((prev) => {
      if (checked) {
        return { ...prev, selectedRoleId: roleId };
      } else {
        return prev.selectedRoleId === roleId
          ? { ...prev, selectedRoleId: null }
          : prev;
      }
    });
  };

  const handleAddUser = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.phone ||
      !newUser.password
    ) {
      // toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin bắt buộc." });
      console.error("Missing required fields");
      return;
    }
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
        // toast({ variant: "destructive", title: "Lỗi", description: "Tạo user thất bại, response lạ." });
        return;
      }
      const createdUser = response.data.data;
      if (!newUser.is_active) {
        await UserService.toggleUserStatus(createdUser.id, {
          is_active: false,
        });
      }
      if (newUser.selectedRoleId !== null) {
        await AuthorService.assignRolesToUser(createdUser.id, {
          role_ids: [newUser.selectedRoleId],
        });
      }
      // toast({ title: "Thành công", description: "Đã thêm người dùng mới." });
      setIsAddModalOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      // toast({ variant: "destructive", title: "Lỗi", description: "Tên đăng nhập hoặc email đã tồn tại." });
    }
  };

  // == Hàm Xử lý Modal "Edit User" (Giữ nguyên) ==
  const handleEditUser = async (user: UserData) => {
    try {
      const response = await UserService.getUserDetail(user.id, true);
      if (!response.data || !response.data.data) {
        console.error(
          "Get user detail failed: Invalid response structure",
          response.data
        );
        // toast({ variant: "destructive", title: "Lỗi", description: "Lấy chi tiết user thất bại." });
        return;
      }
      const userData = response.data.data;
      setEditingUser({
        ...userData,
        selectedRoleId: userData.roles?.[0]?.id || null,
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải chi tiết người dùng." });
    }
  };

  const handleEditRoleChange = (roleId: number, checked: boolean) => {
    if (!editingUser) return;
    setEditingUser((prev) => {
      if (!prev) return null;
      if (checked) {
        return { ...prev, selectedRoleId: roleId };
      } else {
        return prev.selectedRoleId === roleId
          ? { ...prev, selectedRoleId: null }
          : prev;
      }
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
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
      if (editingUser.selectedRoleId !== null) {
        await AuthorService.assignRolesToUser(editingUser.id, {
          role_ids: [editingUser.selectedRoleId],
        });
      } else {
        // (Nếu cần clear role)
        // await AuthorService.assignRolesToUser(editingUser.id, { role_ids: [] });
      }
      // toast({ title: "Thành công", description: "Đã cập nhật người dùng." });
      setIsEditModalOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      // toast({ variant: "destructive", title: "Lỗi", description: "Cập nhật thất bại." });
    }
  };

  // == Hàm Xử lý Modal "Delete User" (Giữ nguyên) ==
  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await UserService.deleteUser(userToDelete.id);
        // toast({ title: "Thành công", description: `Đã xóa người dùng ${userToDelete.username}.` });
        setUserList((prev) =>
          prev.filter((user) => user.id !== userToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Failed to delete user:", error);
        // toast({ variant: "destructive", title: "Lỗi", description: "Xóa người dùng thất bại." });
      }
    }
  };

  // == Render JSX (ĐÃ REFACTOR) ==

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 1. Header Section */}
      <UserManagementHeader onOpenAddModal={handleOpenAddModal} />

      {/* 2. User List Card */}
      <UserListTable
        userList={userList}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* 3. Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        availableRoles={availableRoles}
        onRoleChange={handleEditRoleChange}
        onSaveUser={handleSaveUser}
      />

      {/* 4. Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        availableRoles={availableRoles}
        onRoleChange={handleNewUserRoleChange}
        onAddUser={handleAddUser}
      />

      {/* 5. Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        userToDelete={userToDelete}
        onConfirmDelete={confirmDeleteUser}
      />
    </div>
  );
}