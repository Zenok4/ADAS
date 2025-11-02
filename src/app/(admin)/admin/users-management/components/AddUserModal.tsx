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

type FormErrors = { username: string; email: string; phone: string };
type Validators = {
  validateUsername: (value: string) => string;
  validateEmail: (value: string) => string;
  validatePhone: (value: string) => string;
};

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newUser: NewUserForm;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserForm>>;
  availableRoles: RoleData[];
  onRoleChange: (roleId: number, checked: boolean) => void;
  onAddUser: () => void;
  userRoleId: number | null;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  validators: Validators;
}

export function AddUserModal({
  isOpen,
  onOpenChange,
  newUser,
  setNewUser,
  availableRoles,
  onRoleChange,
  onAddUser,
  userRoleId,
  errors,
  setErrors,
  validators,
}: AddUserModalProps) {
  const handleChange = (
    field: keyof NewUserForm,
    value: string,
    validator: (val: string) => string
  ) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };

  const handleBlur = (
    field: keyof NewUserForm,
    value: string,
    validator: (val: string) => string
  ) => {
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên đăng nhập *
              </label>
              <Input
                value={newUser.username}
                onChange={(e) =>
                  handleChange("username", e.target.value, validators.validateUsername)
                }
                onBlur={(e) =>
                  handleBlur("username", e.target.value, validators.validateUsername)
                }
                placeholder="Ít nhất 4 ký tự"
              />
              {errors.username && (
                <p className="text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                type="email"
                value={newUser.email}
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số điện thoại *
              </label>
              <Input
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value, validators.validatePhone)
                }
                onBlur={(e) =>
                  handleBlur("phone", e.target.value, validators.validatePhone)
                }
                placeholder="10 chữ số, ví dụ: 0912345678"
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vai trò (chọn nhiều)
            </label>
            <div className="space-y-3 p-3 border rounded-md bg-white-50 h-fit">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`add-${role.id}`}
                    checked={newUser.selectedRoleIds.includes(role.id)}
                    onCheckedChange={(checked: boolean) =>
                      onRoleChange(role.id, checked)
                    }
                    disabled={role.id === userRoleId}
                  />
                  <label
                    htmlFor={`add-${role.id}`}
                    className={`text-sm font-medium leading-none ${
                      role.id === userRoleId
                        ? "text-gray-500 cursor-not-allowed"
                        : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    }`}
                  >
                    {role.name}
                    {role.id === userRoleId && " (Mặc định)"}
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