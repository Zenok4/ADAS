import { Home, Settings, Waypoints } from "lucide-react";
import { BookOpen, Info, FileText, NotebookPen } from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Hành trình",
    icon: Waypoints,
    href: "/journey",
  },
  {
    title: "Sổ tay",
    href: "#",
    icon: BookOpen,
    children: [
      {
        title: "Giới thiệu",
        href: "/handbook/introduce",
        icon: Info,
      },
      {
        title: "Hướng dẫn",
        href: "/handbook/guide",
        icon: NotebookPen,
      },
      {
        title: "Chính sách & Quy định",
        href: "/handbook/policy",
        icon: FileText,
      },
    ],
  },
  
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/settings",
  },
];
