

// 1. Định nghĩa Role data
export interface RoleData {
  id: number;
  name: string;
  description?: string;
  level?: number; 
}

// 2. Định nghĩa User data
export interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles?: RoleData[];
}

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

export interface UserResponse {
  data: UserData;
  success: boolean;
  message: string;
  code: number;
}

export interface RolesResponse {
  data: {
    roles: RoleData[];
  };
  success: boolean;
  message: string;
  code: number;
}

// 6. Payload cho API /users/create
export interface UserCreatePayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  display_name?: string; 
}


export interface UserToggleStatusPayload {
  is_active: boolean;
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  phone?: string;
  display_name?: string;
}