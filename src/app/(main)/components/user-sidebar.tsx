"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { sidebarItems } from "@/type/sidebar-user";

interface UserSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const UserSidebar = ({
  className,
  collapsed = false,
  onToggle,
}: UserSidebarProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle Button */}
        <div className={cn("flex p-2 justify-end", collapsed && "justify-center")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 transition-all duration-200 hover:bg-[#006DF0] hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 cursor-pointer">
            {sidebarItems.map((item) => {
              const isParentActive = item.children?.some((ch) => ch.href === pathName);

              return (
                <div key={item.title}>
                  {/* Parent Item */}
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 h-10 px-2 hover:bg-blue-700 hover:text-white",
                      (pathName === item.href || isParentActive || expanded === item.title) &&
                        "bg-blue-600 text-white"
                    )}
                    onClick={() => {
                      if (item.children) {
                        // Toggle submenu
                        setExpanded((prev) => (prev === item.title ? null : item.title));
                      } else {
                        router.push(item.href);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className={cn("truncate ml-3 transition-all")}>{item.title}</span>}
                    </div>

                    {!collapsed && item.children && (
                      <div className="flex items-center">
                        {expanded === item.title || isParentActive ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Button>

                  {/* Submenu */}
                  {!collapsed && item.children && (expanded === item.title || isParentActive) && (
                    <div className="ml-8 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <button
                          key={child.href}
                          onClick={() => router.push(child.href)}
                          className={cn(
                            "flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md",
                            pathName === child.href
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-gray-800 hover:bg-blue-100"
                          )}
                        >
                          <div className="h-6 w-6 flex items-center justify-center text-gray-700">
                            <child.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">{child.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
