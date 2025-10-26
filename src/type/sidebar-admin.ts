import { Home, KeyRound, Settings, Users } from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Quản lý người dùng",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Phân quyền",
    icon: KeyRound,
    href: "/admin/roleManagement",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];
