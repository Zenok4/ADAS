import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

export const AuthService = {
  loginWithUsername: (username: string, password: string) =>
    api.post(ApiUrls.authen.loginUsername, { username, password }),

  loginWithEmail: (email: string, password: string, otp_code?: string) =>
    api.post(ApiUrls.authen.loginEmail, { email, password, otp_code }),

  logout: () => api.post(ApiUrls.authen.logout),

  me: () => api.get(ApiUrls.authen.me),

  refresh: () => api.post<{ access_token: string }>(ApiUrls.authen.refresh, {}),

  permission: () => api.get(ApiUrls.author.myPermissions),
};
