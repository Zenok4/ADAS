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

type SessionContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
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

    AuthService.me()
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // ================== Hàm login ==================
  const login = async (username: string, password: string) => {
    try {
      const res = await AuthService.loginWithUsername(username, password);
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
      const res = await AuthService.me();
      setUser(res.data);
    } catch {
      clearToken();
      setUser(null);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, login, logout, refreshSession }}
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
