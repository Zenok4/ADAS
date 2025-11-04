import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

export const AuthService = {
  loginWithUsername: (username: string, password: string) =>
    api.post(ApiUrls.authen.loginUsername, { username, password }),

  loginWithEmail: (email: string, password: string, otp_code?: string) =>
    api.post(ApiUrls.authen.loginEmail, { email, password, otp_code }),

  logout: () => api.post(ApiUrls.authen.logout),

  me: (access_token: string) =>
    api.get(ApiUrls.authen.me, {
      headers: { Authorization: `Bearer ${access_token}` },
  }),


  refresh: () => api.post<{ access_token: string }>(ApiUrls.authen.refresh, {}),

  permission: () => api.get(ApiUrls.author.myPermissions),

  registerWithUsername: (username: string, password: string) =>
    api.post(ApiUrls.authen.registerWithUsername, { username, password }),

  registerWithEmail: (email: string, password: string) =>
    api.post(ApiUrls.authen.registerWithEmail, { email, password }),

  registerWithPhone: (phone: string, password: string) =>
    api.post(ApiUrls.authen.registerWithPhone, { phone, password }),
};
