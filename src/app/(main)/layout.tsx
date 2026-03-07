"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserSidebar } from "./components/user-sidebar";
import { UserHeader } from "./components/user-header";
import { useSession } from "@/context/SessionContext";
import { useNotifyDialog } from "@/hooks/useNotifyDialog";
import NotifyDialog from "@/components/NotifyDialog";
import { NotifyType } from "@/type/notify";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const { user, loading } = useSession();

  const {
    handlePrimaryAction,
    hideNotify,
    message,
    open,
    primaryActionText,
    showNotify,
    title,
    type,
  } = useNotifyDialog();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      showNotify({
        title: "Chưa đăng nhập",
        message: "Vui lòng đăng nhập để truy cập hệ thống.",
        type: NotifyType.Warning,
        primaryActionText: "Đến trang đăng nhập",
        onPrimaryAction: () => router.push("/login"),
        onClose: () => router.push("/login"),
      });
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <UserHeader />

      {/* Fixed Sidebar */}
      <UserSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "transition-all duration-300 pt-16",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-4">{children}</div>
      </main>

      <NotifyDialog
        open={open}
        onClose={hideNotify}
        title={title}
        message={message}
        type={type}
        primaryActionText={primaryActionText}
        onPrimaryAction={handlePrimaryAction}
      />
    </div>
  );
};

export default MainLayout;
