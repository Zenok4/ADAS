import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
let memorySessionId: string | null = null;

// ================= Encrypt / Decrypt =================
export const encrypt = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decrypt = (cipher: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
};

// ================= LocalStorage Helpers =================
export const saveToken = (token: string): void => {
  const encrypted = encrypt(token);
  localStorage.setItem("access_token", encrypted);
  console.log("Token:", encrypted);
};

export const loadToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const encrypted = localStorage.getItem("access_token");
  if (!encrypted) return null;
  return decrypt(encrypted);
};

export const clearToken = (): void => {
  localStorage.removeItem("access_token");
};

// ================= SESSION ID =================
export const saveSessionId = (sessionId: string) => {
  memorySessionId = sessionId;

  // fallback khi reload (optional)
  sessionStorage.setItem("sid", encrypt(sessionId));
};

export const loadSessionId = (): string | null => {
  if (memorySessionId) return memorySessionId;

  const encrypted = sessionStorage.getItem("sid");
  if (!encrypted) return null;

  const decrypted = decrypt(encrypted);
  memorySessionId = decrypted;
  return decrypted;
};

export const clearSessionId = () => {
  memorySessionId = null;
  sessionStorage.removeItem("sid");
};