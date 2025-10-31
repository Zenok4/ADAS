// src/app/(admin)/admin/users-management/components/AddUserModal.tsx
"use client";

import { Button } from "@/components/ui/button";
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
import { RoleData } from "@/services/type/user.type";
import { NewUserForm } from "./types";

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newUser: NewUserForm;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserForm>>;
  availableRoles: RoleData[];
  onRoleChange: (roleId: number, checked: boolean) => void;
  onAddUser: () => void;
}

export function AddUserModal({
  isOpen,
  onOpenChange,
  newUser,
  setNewUser,
  availableRoles,
  onRoleChange,
  onAddUser,
}: AddUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Cột 1: Thông tin User */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên đăng nhập *
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
                Email *
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
                Số điện thoại *
              </label>
              <Input
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu *
              </label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <Select
                value={newUser.is_active ? "active" : "suspended"}
                onValueChange={(value: "active" | "suspended") =>
                  setNewUser((prev) => ({
                    ...prev,
                    is_active: value === "active",
                  }))
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

          {/* Cột 2: Vai trò */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vai trò (chỉ chọn 1)
            </label>
            <div className="space-y-3 p-3 border rounded-md bg-gray-50 h-fit">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`add-${role.id}`}
                    checked={newUser.selectedRoleId === role.id}
                    onCheckedChange={(checked: boolean) =>
                      onRoleChange(role.id, checked)
                    }
                  />
                  <label
                    htmlFor={`add-${role.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {role.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={onAddUser}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={
              !newUser.username ||
              !newUser.email ||
              !newUser.phone ||
              !newUser.password
            }
          >
            Thêm người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}