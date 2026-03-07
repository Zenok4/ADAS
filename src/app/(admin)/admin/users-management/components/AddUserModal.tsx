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

// ... (Giữ nguyên types)
type FormErrors = { username: string; email: string; phone: string };
type Validators = {
  validateUsername: (v: string) => string;
  validateEmail: (v: string) => string;
  validatePhone: (v: string) => string;
};

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newUser: NewUserForm;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserForm>>;
  availableRoles: RoleData[];
  onRoleChange: (id: number, c: boolean) => void;
  onAddUser: () => void;
  userRoleId: number | null;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  validators: Validators;
  currentUserLevel: number;
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
  currentUserLevel,
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
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Thêm người dùng mới
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            {/* Tên đăng nhập */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên đăng nhập *
              </label>
              <Input
                value={newUser.username}
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
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
              {errors.username && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Tên hiển thị */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên hiển thị
              </label>
              <Input
                value={newUser.display_name || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    display_name: e.target.value,
                  }))
                }
                placeholder="Tên hiển thị (Tùy chọn)"
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value,
                    validators.validateEmail
                  )
                }
                onBlur={(e) =>
                  handleBlur("email", e.target.value, validators.validateEmail)
                }
                placeholder="vidu@email.com"
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Số điện thoại *
              </label>
              <Input
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value,
                    validators.validatePhone
                  )
                }
                onBlur={(e) =>
                  handleBlur("phone", e.target.value, validators.validatePhone)
                }
                placeholder="10 chữ số"
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mật khẩu *
              </label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Nhập mật khẩu"
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
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
          </div>

          {/* Cột phải: Vai trò */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vai trò (chọn nhiều)
            </label>
            <div className="space-y-3 p-3 border rounded-md bg-white-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 h-fit max-h-[400px] overflow-y-auto">
              {availableRoles.map((role) => {
                const isRoleTooHigh = (role.level || 0) >= currentUserLevel;
                const isDefaultRole = role.id === userRoleId;
                const isDisabled = isDefaultRole || isRoleTooHigh;

                return (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-${role.id}`}
                      checked={newUser.selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked: boolean) =>
                        onRoleChange(role.id, checked)
                      }
                      disabled={isDisabled}
                      className="border-gray-400 dark:border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-500"
                    />
                    <label
                      htmlFor={`add-${role.id}`}
                      className={`text-sm font-medium leading-none ${
                        isDisabled
                          ? "text-gray-400 dark:text-slate-600 cursor-not-allowed"
                          : "text-gray-700 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      }`}
                    >
                      {role.name}{" "}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        (Lv.{role.level || 0})
                      </span>
                      {isDefaultRole && " (Mặc định)"}
                      {isRoleTooHigh && " (Không đủ quyền)"}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            Hủy
          </Button>
          <Button
            onClick={onAddUser}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
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
