// src/app/(admin)/admin/users-management/components/DeleteUserModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserData } from "@/services/type/user.type";

interface DeleteUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userToDelete: UserData | null;
  onConfirmDelete: () => void;
}

export function DeleteUserModal({
  isOpen,
  onOpenChange,
  userToDelete,
  onConfirmDelete,
}: DeleteUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        </DialogHeader>

        {userToDelete && (
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete.username}</strong> không?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất
                cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}