"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Award, Calendar, Download, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalyticsDashboard() {
  const analyticsData = [
    {
      title: "Event Participation",
      value: "85%",
      change: "+12%",
      description: "Average participation rate across all events",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Certificate Generation",
      value: "1,247",
      change: "+23%",
      description: "Total certificates generated this month",
      icon: Award,
      color: "text-green-500",
    },
    {
      title: "User Engagement",
      value: "92%",
      change: "+8%",
      description: "Active users in the last 30 days",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Event Success Rate",
      value: "96%",
      change: "+4%",
      description: "Events completed successfully",
      icon: Calendar,
      color: "text-orange-500",
    },
  ]

  const recentMetrics = [
    {
      metric: "Page Views",
      value: "12,847",
      period: "Last 7 days",
      trend: "up",
    },
    {
      metric: "New Registrations",
      value: "156",
      period: "This week",
      trend: "up",
    },
    {
      metric: "Certificate Downloads",
      value: "892",
      period: "Last 30 days",
      trend: "up",
    },
    {
      metric: "Event Completions",
      value: "234",
      period: "This month",
      trend: "up",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track performance and user engagement</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="pulse-gradient text-white">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="text-green-500">{metric.change}</span> from last period
                </p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Participation Trends</CardTitle>
            <CardDescription>Monthly participation rates over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Generation</CardTitle>
            <CardDescription>Weekly certificate generation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Metrics</CardTitle>
          <CardDescription>Key performance indicators from recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{metric.metric}</h4>
                  <Badge variant="outline" className="text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {metric.period}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Overall system performance and user satisfaction metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
              <div>
                <h4 className="font-medium text-green-800">System Uptime</h4>
                <p className="text-sm text-green-600">99.9% availability this month</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div>
                <h4 className="font-medium text-blue-800">User Satisfaction</h4>
                <p className="text-sm text-blue-600">4.8/5 average rating from feedback</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">High</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div>
                <h4 className="font-medium text-purple-800">Response Time</h4>
                <p className="text-sm text-purple-600">Average 1.2s page load time</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
