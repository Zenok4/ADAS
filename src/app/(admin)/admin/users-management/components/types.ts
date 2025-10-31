// src/app/(admin)/admin/users-management/components/types.ts
import { UserData, UserCreatePayload } from "@/services/type/user.type";

// Kiểu dữ liệu cho form "Add User"
export type NewUserForm = Omit<UserCreatePayload, "phone" | "password"> & {
  phone: string;
  password: string;
  is_active: boolean;
  selectedRoleId: number | null;
};

// Kiểu dữ liệu cho form "Edit User"
export interface EditingUserForm extends UserData {
  selectedRoleId: number | null;
}