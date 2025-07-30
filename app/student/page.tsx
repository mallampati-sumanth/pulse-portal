"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Award, Calendar, Download, Trophy, Clock, CheckCircle, Star, Target } from "lucide-react"
import { StudentSidebar } from "@/components/student-sidebar"
import { CertificateGenerator } from "@/components/certificate-generator"
import { EventCalendar } from "@/components/event-calendar"
import { StudentProfile } from "@/components/student-profile"
import { CertificateDownload } from "@/components/certificate-download"
import { useSession } from "next-auth/react"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { toast } = useToast()
  const { data: session } = useSession()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Load user registrations
  useEffect(() => {
    if (session?.user) {
      loadRegistrations()
    }
  }, [session])

  const loadRegistrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/registrations/user')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      }
    } catch (error) {
      console.error('Failed to load registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateStudentCertificate = (eventTitle: string, eventDate: string) => {
    // Use session data for student name
    const studentName = session?.user?.name || "Student"
    
    // Generate a unique event ID for the certificate
    const eventId = `event-${eventTitle.replace(/\s+/g, '-').toLowerCase()}`
    
    // Create certificate template and open in new window for printing
    const certificateWindow = window.open('', '_blank')
    if (!certificateWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to download certificates",
        variant: "destructive"
      })
      return
    }

    const certificateId = `PULSE-${eventId.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`
    
    certificateWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: serif; 
              margin: 0; 
              padding: 20px;
              background: white;
            }
          </style>
        </head>
        <body>
          <div style="width: 800px; height: 600px; margin: 0 auto; background: white; border: 8px solid #1e40af; position: relative;">
            
            <!-- Header -->
            <div style="text-align: center; padding-top: 60px;">
              <h1 style="font-size: 48px; font-weight: bold; color: #1e40af; margin-bottom: 10px;">CERTIFICATE</h1>
              <p style="font-size: 24px; color: #1e40af; font-weight: 600;">OF PARTICIPATION</p>
            </div>

            <!-- Main Content -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 18px; color: #6b7280; margin-bottom: 20px;">This is to certify that</p>
              
              <h2 style="font-size: 36px; font-weight: bold; color: #374151; border-bottom: 3px solid #1e40af; padding-bottom: 10px; display: inline-block; margin: 0 40px;">
                ${studentName}
              </h2>
              
              <p style="font-size: 18px; color: #6b7280; margin: 30px 0 20px 0;">has successfully participated in</p>
              
              <h3 style="font-size: 28px; font-weight: 600; color: #1e40af; margin-bottom: 20px;">
                ${eventTitle}
              </h3>
              
              <p style="font-size: 16px; color: #6b7280; margin-bottom: 40px;">
                Conducted on ${new Date(eventDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <!-- Footer -->
            <div style="position: absolute; bottom: 40px; left: 60px; right: 60px;">
              <div style="display: flex; justify-content: space-between; align-items: end;">
                <div style="text-align: center;">
                  <div style="width: 120px; height: 2px; background: #9ca3af; margin-bottom: 5px;"></div>
                  <p style="font-size: 14px; color: #6b7280;">Coordinator</p>
                </div>
                
                <div style="text-align: center;">
                  <p style="font-size: 12px; color: #9ca3af; font-family: monospace;">ID: ${certificateId}</p>
                  <p style="font-size: 12px; color: #9ca3af;">Issued: ${new Date().toLocaleDateString()}</p>
                  <p style="font-size: 16px; font-weight: bold; color: #1e40af; margin-top: 5px;">PULSE PORTAL</p>
                </div>
                
                <div style="text-align: center;">
                  <div style="width: 120px; height: 2px; background: #9ca3af; margin-bottom: 5px;"></div>
                  <p style="font-size: 14px; color: #6b7280;">Director</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 15px; font-size: 16px;">
              Print Certificate
            </button>
            <button onclick="window.close()" style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
              Close Window
            </button>
          </div>
        </body>
      </html>
    `)

    certificateWindow.document.close()

    toast({
      title: "Certificate Generated!",
      description: `Certificate for ${eventTitle} is ready for download/print.`,
    })
  }

  const studentData = {
    name: "John Doe",
    rollNumber: "ECE2024001",
    email: "john.doe@college.edu",
    joinDate: "2024-01-15",
    certificatesEarned: 5,
    eventsAttended: 8,
    totalPoints: 450,
    rank: 12,
  }

  const recentCertificates = [
    {
      id: 1,
      title: "Web Development Workshop",
      issueDate: "2024-01-20",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "AI/ML Fundamentals",
      issueDate: "2024-01-18",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Technical Quiz Winner",
      issueDate: "2024-01-15",
      status: "completed",
      downloadUrl: "#",
    },
  ]

  const achievements = [
    {
      title: "Early Bird",
      description: "Registered for 5+ events",
      icon: Clock,
      earned: true,
    },
    {
      title: "Certificate Collector",
      description: "Earned 5+ certificates",
      icon: Award,
      earned: true,
    },
    {
      title: "Top Performer",
      description: "Ranked in top 20",
      icon: Trophy,
      earned: true,
    },
    {
      title: "Event Master",
      description: "Attended 10+ events",
      icon: Target,
      earned: false,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-6 ml-64">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {studentData.name}!</h1>
            <p className="text-muted-foreground">Track your progress and manage your certificates</p>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Student Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.certificatesEarned}</div>
                    <p className="text-xs text-muted-foreground">+2 this month</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.eventsAttended}</div>
                    <p className="text-xs text-muted-foreground">+3 this month</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Star className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentData.totalPoints}</div>
                    <p className="text-xs text-muted-foreground">+50 this week</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rank</CardTitle>
                    <Trophy className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">#{studentData.rank}</div>
                    <p className="text-xs text-muted-foreground">+3 positions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Certificates</CardTitle>
                  <CardDescription>Your latest earned certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCertificates.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 pulse-gradient rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{cert.title}</h4>
                            <p className="text-sm text-muted-foreground">Issued on {cert.issueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {cert.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateStudentCertificate(
                              cert.title,
                              cert.issueDate,
                              session?.user?.name || 'Student'
                            )}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Event Registrations</CardTitle>
                  <CardDescription>Events you have registered for</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-muted-foreground">Loading registrations...</div>
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No event registrations yet.</p>
                      <p className="text-sm">Register for events to see them here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registrations.slice(0, 5).map((registration, index) => (
                        <motion.div
                          key={registration.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{registration.event?.title || 'Event Title'}</h4>
                              <p className="text-sm text-muted-foreground">
                                {registration.event?.date} at {registration.event?.time} • {registration.event?.location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Registered: {new Date(registration.registeredat).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {registration.status}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateStudentCertificate(
                                registration.event?.title || 'Event',
                                registration.event?.date || new Date().toISOString(),
                                session?.user?.name || 'Student'
                              )}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Certificate
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                      
                      {registrations.length > 5 && (
                        <div className="text-center pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab("events")}
                          >
                            View All Events ({registrations.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your progress and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          achievement.earned ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              achievement.earned ? "pulse-gradient" : "bg-gray-200"
                            }`}
                          >
                            <achievement.icon
                              className={`w-5 h-5 ${achievement.earned ? "text-white" : "text-gray-500"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>
                              {achievement.title}
                            </h4>
                            <p className={`text-sm ${achievement.earned ? "text-green-600" : "text-gray-500"}`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "certificates" && <CertificateGenerator />}
          {activeTab === "events" && <EventCalendar />}
          {activeTab === "profile" && <StudentProfile />}
        </motion.div>
      </main>
    </div>
  )
}
