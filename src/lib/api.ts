import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { loadToken, saveToken, clearToken, clearSessionId, loadSessionId } from "./tokenStorage";
import { ApiUrls } from "@/type/apiUrls";
import { HttpCode } from "@/type/http-codes";
let accessToken: string | null = loadToken();

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// ================= Request Interceptor =================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = accessToken || loadToken();
    console.log("Request URL:", config.url);
    console.log("Token present:", !!token);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= Response Interceptor =================
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      err.response?.status === HttpCode.unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const session_id = loadSessionId();
        console.log("Refreshing with session_id:", session_id);
        if (!session_id) {
          throw new Error("No session id");
        }

        // Gọi refresh đúng backend
        const res = await api.post(
          ApiUrls.authen.refresh,
          { session_id }
        );

        const access_token:string = res.data?.data?.access_token;
        if (!access_token) {
          throw new Error("Invalid refresh response");
        }

        accessToken = access_token;
        saveToken(accessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);

      } catch (e) {
        // Refresh fail → clear toàn bộ auth state
        clearToken();
        clearSessionId();
        accessToken = null;

        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

// ================= Helpers =================
export const setAccessToken = (token: string): void => {
  accessToken = token;
  saveToken(token);
};

export const removeAccessToken = (): void => {
  accessToken = null;
  clearToken();
};

export default api;