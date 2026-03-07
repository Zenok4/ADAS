"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ShieldAlert } from "lucide-react";
import { UserData } from "@/services/type/user.type";
import { UserListSkeleton } from "./UserListSkeleton";
import { PaginationComponent } from "./PaginationComponent";
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
  currentUserLevel: number;
}

export function UserListTable({
  userList,
  isLoading,
  onEditUser,
  onDeleteUser,
  currentPage,
  totalPages,
  onPageChange,
  currentUserLevel,
}: UserListTableProps) {
  const MAX_ROLES_DISPLAYED = 2;

  return (
    <TooltipProvider>
      <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách người dùng
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tất cả tài khoản trong hệ thống
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Tên đăng nhập
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Vai trò
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Ngày tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <UserListSkeleton rows={10} />
                ) : userList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      Không có người dùng nào.
                    </td>
                  </tr>
                ) : (
                  userList.map((user) => {
                    const sortedRoles = user.roles
                      ? [...user.roles].sort(
                          (a: any, b: any) => (b.level || 0) - (a.level || 0)
                        )
                      : [];
                    const targetHighestLevel =
                      sortedRoles.length > 0 ? sortedRoles[0].level || 0 : 0;
                    const isActionDisabled =
                      targetHighestLevel >= currentUserLevel;

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
                          {user.username}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1">
                            {sortedRoles.length > 0 ? (
                              <>
                                {sortedRoles
                                  .slice(0, MAX_ROLES_DISPLAYED)
                                  .map((role) => (
                                    <Badge
                                      key={role.id}
                                      variant="secondary"
                                      className={`text-xs ${
                                        (role.level || 0) === targetHighestLevel
                                          ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                                          : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                                      }`}
                                    >
                                      {role.name}
                                    </Badge>
                                  ))}
                                {sortedRoles.length > MAX_ROLES_DISPLAYED && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className="text-xs cursor-pointer dark:text-gray-300 dark:border-slate-600"
                                      >
                                        +
                                        {sortedRoles.length -
                                          MAX_ROLES_DISPLAYED}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100">
                                      <div className="flex flex-col gap-1 p-1">
                                        {sortedRoles.map((role) => (
                                          <span
                                            key={role.id}
                                            className="text-xs"
                                          >
                                            {role.name} (Lv.{role.level || 0})
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
                                className="text-xs text-gray-500 dark:text-gray-400"
                              >
                                User
                              </Badge>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant={user.is_active ? "default" : "destructive"}
                            className={
                              user.is_active
                                ? "bg-green-100 text-green-800 hover:bg-green-200 shadow-none dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                                : "bg-red-100 text-red-800 hover:bg-red-200 shadow-none dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                            }
                          >
                            {user.is_active ? "Hoạt động" : "Tạm khóa"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300 text-sm">
                          {new Date(user.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {isActionDisabled ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 opacity-40 cursor-not-allowed">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                    className="h-8 w-8 p-0"
                                  >
                                    <ShieldAlert className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700">
                                <p className="max-w-xs text-center">
                                  Bạn không có quyền tác động lên tài khoản có
                                  cấp độ cao hơn hoặc bằng bạn.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:text-gray-300 dark:hover:text-blue-400"
                                onClick={() => onEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:text-gray-300 dark:hover:text-red-400"
                                onClick={() => onDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
