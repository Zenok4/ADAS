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
import { Bell, Settings, User, LogOut } from "lucide-react";
import Logo from "@/components/logo";

export const AdminHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-[#004572]">
        <Logo />
        <div>
          <p className="text-xl font-bold uppercase">Admin Dashboard</p>
          <p className="text-xs">Hệ thống hỗ trợ lái xe nâng cao</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" className="flex gap-2 items-center hover:bg-[#004572]/10 hover:text-[#004572]">
          <Bell className="h-4 w-4"></Bell>
          <p className="text-sm">Thông báo</p>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
