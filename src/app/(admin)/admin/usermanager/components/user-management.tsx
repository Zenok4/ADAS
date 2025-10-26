"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, UserPlus } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string[];
  status: "active" | "suspended";
  createdDate: string;
}

const users: User[] = [
  {
    id: "1",
    username: "Admin",
    email: "admin@gmail.com",
    role: ["Admin"],
    status: "active",
    createdDate: "2025-10-12",
  },
  {
    id: "2",
    username: "User1",
    email: "User1@gmail.com",
    role: ["User"],
    status: "active",
    createdDate: "2025-10-12",
  },
  {
    id: "3",
    username: "User2",
    email: "User2@gmail.com",
    role: ["User"],
    status: "suspended",
    createdDate: "2025-10-12",
  },
];

const availableRoles = ["Admin", "User", "Manager", "Editor", "Viewer"];

export function UserManagement() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(users);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "createdDate">>({
    username: "",
    email: "",
    role: [],
    status: "active",
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (!editingUser) return;

    setEditingUser((prev) => {
      if (!prev) return null;

      if (checked) {
        return { ...prev, role: [...prev.role, role] };
      } else {
        return { ...prev, role: prev.role.filter((r) => r !== role) };
      }
    });
  };

  const handleNewUserRoleChange = (role: string, checked: boolean) => {
    setNewUser((prev) => {
      if (checked) {
        return { ...prev, role: [...prev.role, role] };
      } else {
        return { ...prev, role: prev.role.filter((r) => r !== role) };
      }
    });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUserList((prev) =>
        prev.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setIsEditModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.role.length > 0) {
      const user: User = {
        ...newUser,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split("T")[0],
      };
      setUserList((prev) => [...prev, user]);
      setIsAddModalOpen(false);
      setNewUser({
        username: "",
        email: "",
        role: [],
        status: "active",
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUserList((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Quản lý tài khoản và quyền truy cập hệ thống
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* User List Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Danh sách người dùng
          </CardTitle>
          <p className="text-sm text-gray-600">
            Tất cả tài khoản trong hệ thống
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Tên đăng nhập
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Vai trò
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Ngày tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.role.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "destructive"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {user.status === "active" ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {user.createdDate}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Left Column - User Info and Status */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-600">
                    {editingUser.username}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-600">
                    {editingUser.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value: "active" | "suspended") =>
                      setEditingUser((prev) =>
                        prev ? { ...prev, status: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="suspended">Tạm khóa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column - Roles */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <div className="space-y-3 p-3 border rounded-md bg-gray-50 h-fit">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={editingUser.role.includes(role)}
                        onCheckedChange={(checked: boolean) =>
                          handleRoleChange(role, checked)
                        }
                      />
                      <label
                        htmlFor={role}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Left Column - User Info and Status */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <Input
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <Select
                  value={newUser.status}
                  onValueChange={(value: "active" | "suspended") =>
                    setNewUser((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Roles */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <div className="space-y-3 p-3 border rounded-md bg-gray-50 h-fit">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${role}`}
                      checked={newUser.role.includes(role)}
                      onCheckedChange={(checked: boolean) =>
                        handleNewUserRoleChange(role, checked)
                      }
                    />
                    <label
                      htmlFor={`new-${role}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                !newUser.username || !newUser.email || newUser.role.length === 0
              }
            >
              Thêm người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          </DialogHeader>

          {userToDelete && (
            <div className="py-4">
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <strong>{userToDelete.username}</strong> không?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác.
                  Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh
                  viễn.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
