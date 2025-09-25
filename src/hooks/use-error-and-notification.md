- Dưới đây là 1 file mẫu sử dụng useNotifyDialog và useErrorDialog
- Trong trường hợp chỉ dùng 1 cái thay vì cả 2 dialog thì có thể gọi như sau:
 
```typescript
    const errorDialog = useErrorDialog(
        open: open,
        type: type,
        title,
        message,
        primaryActionText,
        showNotify,
        hideNotify,
        handlePrimaryAction,
    )
```
##### File mẫu
```typescript
"use client";

import { useHotKey } from "@/hook/use-hot-key";
import { useErrorDialog } from "@/hook/useErrorDialog";
import ErrorDialog from "@/components/ErrorDialog";
import { ErrorMessages, ErrorType } from "@/type/error";
import { shortcut } from "@/type/hot_key";
import { useState } from "react";
import { useNotifyDialog } from "@/hook/useNotifyDialog";
import { NotifyType } from "@/type/notify";
import NotifyDialog from "@/components/NotifyDialog";

export default function ShortcutExampleHook() {
  const [count, setCount] = useState(0);

  // Sử dụng hook useErrorDialog để quản lý dialog lỗi
  // Trả về các state và method để hiển thị dialog lỗi
  const errorDialog = useErrorDialog();
  const notifyDialog = useNotifyDialog();

  // tái cấu trúc các biến từ errorDialog và notifyDialog để tránh xung đột việc lặp tên tham số
  const {
    open: errorOpen,
    type: errorType,
    message: errorMessage,
    details,
    showError,
    hideError,
  } = errorDialog;

  const {
    open: open,
    type: type,
    title,
    message,
    primaryActionText,
    showNotify,
    hideNotify,
    handlePrimaryAction,
  } = notifyDialog;

  const increment = () => setCount((prev) => prev + 1);

  // Ví dụ method xử lý lỗi
  const handleError = async () => {
    // Ví dụ sử dụng showError để hiển thị lỗi
    // Truyền vào type, message và details vào showError(message, type,details?)
    // await showError(ErrorType.AccessForbidden, ErrorMessages[ErrorType.AccessForbidden], "Chi tiết lỗi: Bạn không có quyền truy cập vào tài nguyên này.");

    // Ví dụ sử dụng showNotify để hiển thị thông báo
    await showNotify({ type: NotifyType.Warning, message: "Đây là thông báo kiểu Info." });

    // Ví dụ sử dụng showNotify với các tùy chọn khác
    // Truyền vào type, message, title, primaryActionText và onPrimaryAction
    await showNotify({
      type: NotifyType.Success,
      title: "Xác nhận",
      message: "Bạn có chắc muốn thực hiện hành động này?",
      primaryActionText: "Xác nhận",
      onPrimaryAction: () => {
        // hành động chính (ví dụ gọi API)
        console.log({count});
      },
    });

    // Tăng count sau khi dialog được đóng
    increment();
  };

  // Ví dụ thiết lập phím tắt, ví dụ Cmd+K (Mac) hoặc Ctrl+K (Windows)
  const hot_key = shortcut.testing;
  useHotKey({ key: hot_key.key, ctr: hot_key.ctr, callback: handleError });

  return (
    <div className="p-6">
      <h1>Shortcut Example with Hook</h1>
      <p>Press Cmd+K (Mac) hoặc Ctrl+K (Windows) → count: {count}</p>

      {/* Hiển thị Dialog lỗi */}
      <ErrorDialog
        open={errorDialog.open}
        type={errorDialog.type}
        message={errorDialog.message}
        onClose={errorDialog.hideError}
        detail={errorDialog.details}
      />

      <NotifyDialog
        open={notifyDialog.open}
        type={notifyDialog.type}
        title={notifyDialog.title}
        message={notifyDialog.message}

        // primary action và onPrimaryAction là tùy chọn
        primaryActionText={notifyDialog.primaryActionText}
        onPrimaryAction={notifyDialog.handlePrimaryAction}

        onClose={notifyDialog.hideNotify}
      />
    </div>
  );
}
```