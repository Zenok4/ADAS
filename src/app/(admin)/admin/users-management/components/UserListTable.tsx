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
  currentUserLevel: number; // Level người dùng hiện tại
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
                <tr className="border-b border-gray-200 bg-gray-50/50">
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
                  userList.map((user) => {
                    // 1. SẮP XẾP ROLE: Level cao nhất lên trước
                    const sortedRoles = user.roles
                      ? [...user.roles].sort((a: any, b: any) => (b.level || 0) - (a.level || 0))
                      : [];
                    
                    // 2. CHECK QUYỀN: Level cao nhất của user này
                    const targetHighestLevel = sortedRoles.length > 0 ? sortedRoles[0].level || 0 : 0;
                    // User hiện tại phải có level cao hơn hẳn target (hoặc bằng nếu admin cao nhất)
                    // Logic ở đây: Không được xóa/sửa người có level >= mình
                    const isActionDisabled = targetHighestLevel >= currentUserLevel;

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        
                        {/* Hiển thị Role đã sắp xếp */}
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
                                      // Highlight role cao nhất
                                      className={`text-xs ${
                                          (role.level || 0) === targetHighestLevel 
                                          ? "bg-blue-100 text-blue-800 border-blue-200" 
                                          : "bg-gray-100 text-gray-700"
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
                                        className="text-xs cursor-pointer"
                                      >
                                        +{sortedRoles.length - MAX_ROLES_DISPLAYED}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="flex flex-col gap-1 p-1">
                                        {sortedRoles.map((role) => (
                                          <span key={role.id} className="text-xs">
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
                                className="text-xs text-gray-500"
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
                                ? "bg-green-100 text-green-800 hover:bg-green-200 shadow-none"
                                : "bg-red-100 text-red-800 hover:bg-red-200 shadow-none"
                            }
                          >
                            {user.is_active ? "Hoạt động" : "Tạm khóa"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {new Date(user.created_at).toLocaleDateString("vi-VN")}
                        </td>

                        {/* Cột thao tác: Disable nếu không đủ quyền */}
                        <td className="py-4 px-4">
                          {isActionDisabled ? (
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <div className="flex items-center gap-2 opacity-40 cursor-not-allowed">
                                    <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0">
                                        <ShieldAlert className="h-4 w-4 text-gray-500" />
                                    </Button>
                                 </div>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p className="max-w-xs text-center">
                                   Bạn không có quyền tác động lên tài khoản có cấp độ cao hơn hoặc bằng bạn.
                                 </p>
                               </TooltipContent>
                             </Tooltip>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => onEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
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