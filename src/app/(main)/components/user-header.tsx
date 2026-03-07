"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, User as UserIcon, LogOut } from "lucide-react";
import Logo from "@/components/logo";
import { useSession } from "@/context/SessionContext";

export const UserHeader = () => {
  const router = useRouter();
  const { user, logout } = useSession();

  const handleLogout = async () => {
    if (logout) {
      await logout();
      router.push("/login");
    }
  };

  // Lấy 2 chữ cái đầu của tên để hiển thị nếu không có ảnh
  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "US";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-6 cursor-pointer">
      {/* Logo + Title */}
      <div
        className="flex items-center gap-2 text-[#004572] dark:text-white transition-colors duration-200"
        onClick={() => router.push("/dashboard")}
      >
        <Logo />
        <div>
          <p className="text-xl font-bold uppercase">ADAS Dashboard</p>
          <p className="text-xs">Hệ thống hỗ trợ lái xe nâng cao</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          className="flex gap-2 items-center
                    hover:bg-[#004572]/10 dark:hover:bg-white/10
                    hover:text-[#004572] dark:hover:text-white
                    transition-colors duration-200"
        >
          <Bell className="h-4 w-4 text-[#004572] dark:text-white transition-colors duration-200" />
          <p className="text-sm text-[#004572] dark:text-white transition-colors duration-200">
            Thông báo
          </p>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {/* Nếu user có avatar url thì thêm vào src, hiện tại để trống */}
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username || "Người dùng"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "Chưa cập nhật email"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Link đến Profile */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/user/profile")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
            </DropdownMenuItem>

            {/* Link đến Settings */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/user/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt hệ thống</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Link Đăng xuất */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
