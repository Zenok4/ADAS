// services/type/user.type.ts

// 1. Định nghĩa Role data (từ role.py)
export interface RoleData {
  id: number;
  name: string;
  description?: string;
}

// 2. Định nghĩa User data (từ user.py)
export interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  display_name: string;
  is_active: boolean;
  created_at: string; // (isoformat)
  updated_at: string; // (isoformat)
  roles?: RoleData[]; // (nếu include_roles=true)
}

// 3. Kiểu dữ liệu trả về của API /users/list (từ usermanage_endpoints.py)
export interface PaginatedUsersResponse {
  data: {
    users: UserData[];
    page: number;
    limit: number;
    total: number;
  };
  success: boolean;
  message: string;
  code: number;
}

// 4. Kiểu dữ liệu trả về chung cho một user (từ response_success)
export interface UserResponse {
  data: UserData;
  success: boolean;
  message: string;
  code: number;
}

// 5. Kiểu dữ liệu trả về danh sách roles (từ response_success)
export interface RolesResponse {
  data: {
    roles: RoleData[];
  };
  success: boolean;
  message: string;
  code: number;
}

// 6. Payload cho API /users/create (từ usermanage_endpoints.py)
export interface UserCreatePayload {
  username: string;
  email: string;
  phone: string;
  password: string;
}

// 7. Payload cho API /users/status/<id> (từ usermanage_endpoints.py)
export interface UserToggleStatusPayload {
  is_active: boolean;
}

// 8. Payload cho API /author/users/<id>/roles/assign (từ author_enpoints.py)
export interface AssignRolesPayload {
  role_ids: number[];
}

// 9. Payload cho API /users/update/<id>
export interface UserUpdatePayload {
  username?: string;
  email?: string;
  phone?: string;
  display_name?: string;
}