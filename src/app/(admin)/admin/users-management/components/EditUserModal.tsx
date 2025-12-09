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

type FormErrors = { username: string; email: string; phone: string };
type Validators = {
  validateUsername: (value: string) => string;
  validateEmail: (value: string) => string;
  validatePhone: (value: string) => string;
};

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingUser: EditingUserForm | null;
  setEditingUser: React.Dispatch<React.SetStateAction<EditingUserForm | null>>;
  availableRoles: RoleData[];
  onRoleChange: (roleId: number, checked: boolean) => void;
  onSaveUser: () => void;
  userRoleId: number | null;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  validators: Validators;
  currentUserLevel: number; // Thêm prop này
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  editingUser,
  setEditingUser,
  availableRoles,
  onRoleChange,
  onSaveUser,
  userRoleId,
  errors,
  setErrors,
  validators,
  currentUserLevel,
}: EditUserModalProps) {
  if (!editingUser) return null;

  const handleChange = (
    field: keyof EditingUserForm,
    value: string,
    validator: (val: string) => string
  ) => {
    setEditingUser((prev) => (prev ? { ...prev, [field]: value } : null));
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };

  const handleBlur = (
    field: keyof EditingUserForm,
    value: string,
    validator: (val: string) => string
  ) => {
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        {/* =============== LEFT COLUMN =============== */}
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            {/* Tên đăng nhập */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <Input
                value={editingUser.username}
                onChange={(e) =>
                  handleChange(
                    "username",
                    e.target.value,
                    validators.validateUsername
                  )
                }
                onBlur={(e) =>
                  handleBlur(
                    "username",
                    e.target.value,
                    validators.validateUsername
                  )
                }
                placeholder="Ít nhất 4 ký tự"
              />
              {errors.username && (
                <p className="text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Tên hiển thị */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên hiển thị
              </label>
              <Input
                value={editingUser.display_name || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, display_name: e.target.value } : null
                  )
                }
                placeholder="Tên hiển thị"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  handleChange("email", e.target.value, validators.validateEmail)
                }
                onBlur={(e) =>
                  handleBlur("email", e.target.value, validators.validateEmail)
                }
                placeholder="vidu@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <Input
                type="tel"
                value={editingUser.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value, validators.validatePhone)
                }
                onBlur={(e) =>
                  handleBlur("phone", e.target.value, validators.validatePhone)
                }
                placeholder="10 chữ số"
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Trạng thái */}
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

          {/* =============== RIGHT COLUMN: ROLES =============== */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vai trò (chọn nhiều)
            </label>
            <div className="space-y-3 p-3 border rounded-md bg-white-50 h-fit max-h-[400px] overflow-y-auto">
              {availableRoles.map((role) => {
                // User không được tick vào các role cấp cao hơn mình
                const isRoleTooHigh = (role.level || 0) >= currentUserLevel;
                const isDefaultRole = role.id === userRoleId;
                
                // Disabled nếu là role mặc định HOẶC role quá cao
                const isDisabled = isDefaultRole || isRoleTooHigh;

                return (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${role.id}`}
                      checked={editingUser.selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked: boolean) =>
                        onRoleChange(role.id, checked)
                      }
                      disabled={isDisabled}
                    />
                    <label
                      htmlFor={`edit-${role.id}`}
                      className={`text-sm font-medium leading-none ${
                        isDisabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      }`}
                    >
                      {role.name} <span className="text-xs text-gray-400">(Lv.{role.level || 0})</span>
                      {isDefaultRole && " (Mặc định)"}
                      {isRoleTooHigh && " (Không đủ quyền)"}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =============== FOOTER =============== */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSaveUser} className="bg-blue-600 hover:bg-blue-700">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}