"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, Calendar, Award, Users, BarChart3, Settings, LogOut, Zap, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()

  // Get user data from session or fallback to demo data
  const userData = session?.user || {
    name: "Admin User",
    role: "admin"
  }

  // Generate initials for avatar
  const initials = userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU'

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      badge: "12",
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: Award,
      badge: null,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      badge: "1.2k",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <motion.div
      className="fixed left-0 top-0 h-full w-64 bg-card border-r p-6 z-40"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 pulse-gradient rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">PULSE Portal</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="mb-8 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{userData.name}</h3>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === item.id ? "pulse-gradient text-white" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </motion.div>
  )
}
