"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loadToken, clearToken, saveToken, loadSessionId, saveSessionId, clearSessionId } from "@/lib/tokenStorage";
import { AuthService } from "@/services/authService";

type User = {
  id: string;
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
  loginWithUsername: (
    username: string,
    password: string
  ) => Promise<ReponseData<any> | boolean>;
  loginWithEmail: (
    username: string,
    password: string,
    otp_code?: string
  ) => Promise<ReponseData<any> | boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
      .then((res) => {
        // === SỬA TẠI ĐÂY ===
        // API /me trả về { message: "...", data: { user object } }
        setUser(res.data.data);
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // ================== Hàm login ==================
  const loginWithUsername = async (username: string, password: string) => {
    try {
      const res = await AuthService.loginWithUsername(username, password);
      console.log("res", res);
      // Hàm này có vẻ đúng vì bạn lấy user từ res.data.data.user
      const { access_token, session_id, user } = res.data.data;

      console.log("user", user);

      saveToken(access_token);
      saveSessionId(session_id);
      setUser(user);
      return true;
    } catch {
      return false;
    }
  };

  const loginWithEmail = async (
    username: string,
    password: string,
    otp_code?: string
  ) => {
    try {
      const res = await AuthService.loginWithEmail(
        username,
        password,
        otp_code
      );
      // Cần đảm bảo cấu trúc response này là đúng
      const { access_token, user, session_id } = res.data; 

      saveToken(access_token);
      saveSessionId(session_id);
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
    clearSessionId();
    setUser(null);
  };

  // ================== Refresh session ==================
  const refreshSession = async () => {
    setLoading(true);
    try {
      const session_id = loadSessionId();
      if (!session_id) throw new Error("No session");

      const res = await AuthService.refresh(session_id);

      const { access_token } = res.data.data;
      saveToken(access_token);

      // Sau khi có access_token mới → gọi /me
      const me = await AuthService.me(access_token);
      setUser(me.data.data);

    } catch {
      clearToken();
      clearSessionId();
      setUser(null);
    }
    setLoading(false);
  };


  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        loginWithUsername,
        loginWithEmail,
        logout,
        refreshSession,
      }}
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
