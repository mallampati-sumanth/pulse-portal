"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Calendar, Plus, BarChart3, TrendingUp, Clock } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { EventManagement } from "@/components/event-management"
import { CertificateTemplates } from "@/components/certificate-templates"
import { UserManagement } from "@/components/user-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Certificates Issued",
      value: "856",
      change: "+23%",
      icon: Award,
      color: "text-green-500",
    },
    {
      title: "Active Events",
      value: "12",
      change: "+3",
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New certificate generated",
      user: "John Doe (ECE2024001)",
      event: "Web Development Workshop",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      action: "Event registration opened",
      user: "Admin",
      event: "AI/ML Symposium 2024",
      time: "1 hour ago",
      status: "active",
    },
    {
      id: 3,
      action: "Certificate template updated",
      user: "Admin",
      event: "Technical Quiz Competition",
      time: "3 hours ago",
      status: "completed",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-6 ml-64">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage events, certificates, and student activities</p>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-500">{stat.change}</span> from last month
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
                      <Plus className="h-6 w-6" />
                      <span>Create Event</span>
                    </Button>
                    <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
                      <Award className="h-6 w-6" />
                      <span>Generate Certificates</span>
                    </Button>
                    <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
                      <BarChart3 className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest actions and updates in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "completed" ? "bg-green-500" : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.user} • {activity.event}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {activity.time}
                        </div>
                        <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "events" && <EventManagement />}
          {activeTab === "certificates" && <CertificateTemplates />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
        </motion.div>
      </main>
    </div>
  )
}
