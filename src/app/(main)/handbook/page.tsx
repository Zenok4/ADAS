"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface SidebarItem {
  title: string;
  onClick?: () => void;
  children?: SidebarItem[];
}

interface HandbookSidebarProps {
  onNavigate: (path: string) => void; // callback khi chọn mục
}

export default function HandbookSidebar({ onNavigate }: HandbookSidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", onClick: () => onNavigate("/dashboard") },
    {
      title: "Sổ tay",
      children: [
        { title: "Hướng dẫn sử dụng", onClick: () => onNavigate("/handbook/guide") },
        { title: "Chính sách & Quy định", onClick: () => onNavigate("/handbook/policy") },
        { title: "Giới thiệu ADAS", onClick: () => onNavigate("/handbook/introduce") },
      ],
    },
    { title: "Cài đặt", onClick: () => onNavigate("/settings") },
  ];

  return (
    <div className="w-64 h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
      <ul className="flex-1 overflow-y-auto p-4 space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-gray-200">{item.title}</span>
                  </div>
                  {openMenus[item.title] ? (
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                {openMenus[item.title] && (
                  <ul className="mt-1 ml-5 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <button
                          onClick={child.onClick}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors w-full text-left"
              >
                {item.title}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        ADAS Handbook
      </div>
    </div>
  );
}
