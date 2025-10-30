"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserSidebar } from "./components/user-sidebar"
import { UserHeader } from "./components/header"

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <UserHeader />

      {/* Fixed Sidebar */}
      <UserSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content Area */}
      <main
        className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}

export default MainLayout
