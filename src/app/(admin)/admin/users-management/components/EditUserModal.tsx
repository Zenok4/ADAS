// src/app/(admin)/admin/users-management/components/EditUserModal.tsx
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
import { EditingUserForm } from "./types";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingUser: EditingUserForm | null;
  setEditingUser: React.Dispatch<React.SetStateAction<EditingUserForm | null>>;
  availableRoles: RoleData[];
  onRoleChange: (roleId: number, checked: boolean) => void;
  onSaveUser: () => void;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  editingUser,
  setEditingUser,
  availableRoles,
  onRoleChange,
  onSaveUser,
}: EditUserModalProps) {
  if (!editingUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left Column - User Info and Status */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <Input
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, username: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <Input
                type="tel"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <Select
                value={editingUser.is_active ? "active" : "suspended"}
                onValueChange={(value: "active" | "suspended") =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, is_active: value === "active" } : null
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
              Vai trò (chỉ chọn 1)
            </label>
            <div className="space-y-3 p-3 border rounded-md bg-gray-50 h-fit">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${role.id}`}
                    checked={editingUser.selectedRoleId === role.id}
                    onCheckedChange={(checked: boolean) =>
                      onRoleChange(role.id, checked)
                    }
                  />
                  <label
                    htmlFor={`edit-${role.id}`}
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
            onClick={onSaveUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}