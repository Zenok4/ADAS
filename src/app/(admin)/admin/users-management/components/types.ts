import { UserData, UserCreatePayload } from "@/services/type/user.type";

export type NewUserForm = Omit<UserCreatePayload, "phone" | "password"> & {
  phone: string;
  password: string;
  is_active: boolean;
  selectedRoleIds: number[];
};

export interface EditingUserForm extends UserData {
  selectedRoleIds: number[];
}
