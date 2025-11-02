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
    href: "/admin/users-management",
  },
  {
    title: "Phân quyền",
    icon: KeyRound,
    href: "/admin/role-management",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];
