"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loadToken, clearToken, saveToken } from "@/lib/tokenStorage";
import { AuthService } from "@/services/authService";

type User = {
  id: number;
  username: string;
  email: string;
  // thêm các field khác nếu cần
};

type ReponseData<T> = {
  data: T[];
  message: string;
  code: number;
};

type SessionContextType = {
  user: User | null;
  loading: boolean;
  loginWithUsername: (username: string, password: string) => Promise<ReponseData<any> | boolean>;
  loginWithEmail: (username: string, password: string, otp_code?: string) => Promise<ReponseData<any> | boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Khi app load, thử lấy /auth/me nếu có token
  useEffect(() => {
    const token = loadToken();
    if (!token) {
      setLoading(false);
      return;
    }

    AuthService.me(token)
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // ================== Hàm login ==================
  const loginWithUsername = async (username: string, password: string) => {
    try {
      const res = await AuthService.loginWithUsername(username, password);
      console.log("res", res);
      const { access_token, user } = res.data.data;

      console.log("user", user);

      saveToken(access_token);
      setUser(user);
      return true;
    } catch {
      return false;
    }
  };

  
  const loginWithEmail = async (username: string, password: string, otp_code?: string) => {
    try {
      const res = await AuthService.loginWithEmail(username, password, otp_code);
      const { access_token, user } = res.data;

      saveToken(access_token);
      setUser(user);
      return true;
    } catch {
      return false;
    }
  };

  // ================== Hàm logout ==================
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // ignore lỗi
    }
    clearToken();
    setUser(null);
  };

  // ================== Refresh session ==================
  const refreshSession = async () => {
    try {
      const token = loadToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await AuthService.me(token);
      setUser(res.data);
    } catch {
      clearToken();
      setUser(null);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, loginWithUsername, loginWithEmail, logout, refreshSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
};
