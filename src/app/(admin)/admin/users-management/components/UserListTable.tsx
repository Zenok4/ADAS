"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { UserData } from "@/services/type/user.type";
import { UserListSkeleton } from "./UserListSkeleton";
import { PaginationComponent } from "./PaginationComponent";
// Thêm import cho Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserListTableProps {
  userList: UserData[];
  isLoading: boolean;
  onEditUser: (user: UserData) => void;
  onDeleteUser: (user: UserData) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserListTable({
  userList,
  isLoading,
  onEditUser,
  onDeleteUser,
  currentPage,
  totalPages,
  onPageChange,
}: UserListTableProps) {
  const MAX_ROLES_DISPLAYED = 2; // Giới hạn số role hiển thị

  return (
    // Bọc toàn bộ Card trong TooltipProvider
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Danh sách người dùng
          </CardTitle>
          <p className="text-sm text-gray-600">
            Tất cả tài khoản trong hệ thống
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Tên đăng nhập
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Vai trò
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Ngày tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <UserListSkeleton rows={10} />
                ) : userList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có người dùng nào.
                    </td>
                  </tr>
                ) : (
                  userList.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      
                      {/* =============== CẬP NHẬT Ô VAI TRÒ =============== */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            <>
                              {user.roles
                                .slice(0, MAX_ROLES_DISPLAYED)
                                .map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {role.name}
                                  </Badge>
                                ))}
                              {user.roles.length > MAX_ROLES_DISPLAYED && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="text-xs cursor-pointer"
                                    >
                                      +{user.roles.length - MAX_ROLES_DISPLAYED}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="flex flex-col gap-1 p-1">
                                      {user.roles.map((role) => (
                                        <span key={role.id} className="text-xs">
                                          {role.name}
                                        </span>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-500"
                            >
                              User
                            </Badge>
                          )}
                        </div>
                      </td>
                      {/* =================================================== */}

                      <td className="py-4 px-4">
                        <Badge
                          variant={user.is_active ? "default" : "destructive"}
                          className={
                            user.is_active
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {user.is_active ? "Hoạt động" : "Tạm khóa"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => onEditUser(user)}
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() => onDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}