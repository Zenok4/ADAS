"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
  return (
    <div
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className={cn("flex h-full flex-col")}>
        {/* Toggle Button */}
        <div
          className={cn("flex p-2 justify-end", collapsed && "justify-center")}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 transition-all duration-200 hover:bg-[#006DF0] hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 cursor-pointer">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "flex w-full gap-3 h-10 justify-start hover:bg-blue-700 hover:text-white",
                  pathName === item.href && "bg-blue-600 text-white",
                )}
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      "truncate transition-[opacity,width,margin] duration-300",
                      collapsed
                        ? "opacity-0 w-0 ml-0"
                        : "opacity-100 w-auto ml-3"
                    )}
                  >
                    {item.title}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
