// src/app/(admin)/admin/users-management/components/UserManagementHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserManagementHeaderProps {
  onOpenAddModal: () => void;
}

export function UserManagementHeader({
  onOpenAddModal,
}: UserManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-gray-600">
          Quản lý tài khoản và quyền truy cập hệ thống
        </p>
      </div>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={onOpenAddModal}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Thêm người dùng
      </Button>
    </div>
  );
}