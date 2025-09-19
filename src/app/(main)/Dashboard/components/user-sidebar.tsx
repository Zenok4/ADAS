"use client";

import { Home, Car, Map, Camera, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export const UserSidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const [active, setActive] = useState("dashboard");

  const menus = [
    { key: "dashboard", label: "Trang chủ", icon: Home, href: "/user/dashboard" },
    { key: "drive", label: "Hành trình", icon: Car, href: "/user/drive" },
    { key: "map", label: "Bản đồ", icon: Map, href: "/user/map" },
    { key: "camera", label: "Camera", icon: Camera, href: "/user/camera" },
    { key: "settings", label: "Cài đặt", icon: Settings, href: "/user/settings" },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40
      ${collapsed ? "w-16" : "w-64"}`}
    >
      <nav className="flex flex-col h-full">
        {/* Menu items */}
        <ul className="flex-1 py-4 space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <li key={menu.key}>
                <Link
                  href={menu.href}
                  onClick={() => setActive(menu.key)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                  ${
                    active === menu.key
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span>{menu.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center h-12 border-t hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </nav>
    </aside>
  );
};
