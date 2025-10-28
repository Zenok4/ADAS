import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY || "";

// ================= Encrypt / Decrypt =================
export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decryptToken = (cipher: string): string | null => {
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
  const encrypted = encryptToken(token);
  localStorage.setItem("access_token", encrypted);
};

export const loadToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const encrypted = localStorage.getItem("access_token");
  if (!encrypted) return null;
  return decryptToken(encrypted);
};

export const clearToken = (): void => {
  localStorage.removeItem("access_token");
};
