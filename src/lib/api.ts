import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { loadToken, saveToken, clearToken } from "./tokenStorage";
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

    if (err.response?.status === HttpCode.unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post<{ access_token: string }>(
          ApiUrls.authen.refresh,
          {},
          { withCredentials: true }
        );

        accessToken = res.data.access_token;
        saveToken(accessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (e) {
        clearToken();
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
}

export const removeAccessToken = (): void => {
  accessToken = null;
  clearToken();
}

export default api;
