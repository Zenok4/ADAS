"use client"

import type React from "react"
import { useState } from "react"
import { AdminHeader } from "./_components/admin-header"
import { AdminSidebar } from "./_components/admin-sidebar"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <AdminHeader />

      {/* Fixed Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content Area */}
      <main
        className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
