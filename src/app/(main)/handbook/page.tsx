"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface SidebarItem {
  title: string;
  href?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Sổ tay",
    children: [
      { title: "Hướng dẫn sử dụng", href: "/handbook/guide" },
      { title: "Chính sách & Quy định", href: "/handbook/policy" },
      { title: "Giới thiệu ADAS", href: "/handbook/introduce" },
    ],
  },
  {
    title: "Cài đặt",
    href: "/settings",
  },
];

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-64 bg-white border-r h-screen p-4 overflow-y-auto">
      <ul className="space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {openMenus[item.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {openMenus[item.title] && (
                  <ul className="mt-1 ml-5 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <Link
                          href={child.href!}
                          className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href!}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
