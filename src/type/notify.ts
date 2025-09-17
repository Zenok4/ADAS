// src/type/notify.ts
export const NotifyType = {
  Success: "Success",
  Info: "Info",
  Warning: "Warning",
  Error: "Error", // vẫn dùng khi cần
} as const;

export type NotifyTypeKey = keyof typeof NotifyType;
export type NotifyTypeValue = typeof NotifyType[NotifyTypeKey];

export const NotifyDefaultTitle: Record<NotifyTypeValue, string> = {
  [NotifyType.Success]: "Thành công",
  [NotifyType.Info]: "Thông tin",
  [NotifyType.Warning]: "Cảnh báo",
  [NotifyType.Error]: "Lỗi",
};