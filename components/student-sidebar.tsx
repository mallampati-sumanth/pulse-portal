"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Award, Calendar, User, Settings, LogOut, Zap, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

interface StudentSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function StudentSidebar({ activeTab, onTabChange }: StudentSidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()

  // Get user data from session or fallback to demo data
  const userData = session?.user || {
    name: "Demo Student",
    rollnumber: "ST001",
    rank: 1,
    certificatesearned: 0,
    eventsattended: 0
  }

  // Generate initials for avatar
  const initials = userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DS'

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: Award,
      badge: userData.certificatesearned?.toString() || "0",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      badge: userData.eventsattended?.toString() || "0",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
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
          <p className="text-xs text-muted-foreground">Student Panel</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="mb-8 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Student" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-sm">{userData.name}</h3>
            <p className="text-xs text-muted-foreground">{userData.rollnumber || 'No Roll Number'}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            #{userData.rank || 1}
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
