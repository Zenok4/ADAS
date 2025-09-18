export const ErrorType = {
  IPForbidden: "IPForbidden",
  AccessForbidden: "AccessForbidden",
  NoPermission: "NoPermission",
  Generic: "Generic",
} as const;

export type ErrorTypeKey = keyof typeof ErrorType;
export type ErrorTypeValue = (typeof ErrorType)[ErrorTypeKey];

export const ErrorMessages = {
  [ErrorType.IPForbidden]: "Truy cập bị từ chối",
  [ErrorType.AccessForbidden]: "Không có quyền truy cập",
  [ErrorType.NoPermission]: "Thiếu quyền hạn",
  [ErrorType.Generic]: "Đã xảy ra lỗi",
};