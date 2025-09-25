import { ErrorType, ErrorTypeValue } from "@/type/error";
import { useCallback, useRef, useState } from "react";

type ErrorState = {
  open: boolean;
  type: ErrorTypeValue;
  message: string;
  details?: string; // optional detail text
};

export function useErrorDialog() {
  const [state, setState] = useState<ErrorState>({
    open: false,
    type: ErrorType.Generic,
    message: "",
    details: "", // optional detail text
  });

  // Giữ resolver của Promise để resolve khi đóng dialog
  const resolverRef = useRef<(() => void) | null>(null);

  /**
   * Mở dialog và trả về Promise; Promise sẽ resolve khi dialog được đóng (hideError).
   */
  const showError = useCallback((type: ErrorTypeValue, message: string, details?: string) => {
    // Nếu đang có dialog mở, resolve promise cũ trước để tránh treo
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }

    setState({ open: true, type, message, details });

    return new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  /** Đóng dialog và resolve Promise đang chờ (nếu có) */
  const hideError = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
  }, []);

  return {
    // state để truyền vào ErrorDialog component bên ngoài
    open: state.open,
    type: state.type,
    message: state.message,
    details: state.details, // optional detail text

    // Bật tắt dialog
    showError, // (type, message) => Promise<void>
    hideError, // () => void
  };
}