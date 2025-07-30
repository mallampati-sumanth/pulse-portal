"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, Users, CheckCircle, Plus } from "lucide-react"
import useStore from "@/lib/store"
import { useSession } from "next-auth/react"

export function EventCalendar() {
  const { events, currentUser, registerForEvent } = useStore()
  const { toast } = useToast()
  const { data: session } = useSession()

  // Track registered events
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])
  const [isRegistering, setIsRegistering] = useState<string | null>(null)

  // Load user's registered events on component mount
  useEffect(() => {
    if (session?.user) {
      loadUserRegistrations()
    }
  }, [session])

  const loadUserRegistrations = async () => {
    try {
      const response = await fetch('/api/event-registration')
      if (response.ok) {
        const registrations = await response.json()
        const eventIds = registrations.map((reg: any) => reg.eventid)
        setRegisteredEvents(eventIds)
      }
    } catch (error) {
      console.error('Failed to load registrations:', error)
    }
  }

  const handleRegisterForEvent = async (eventId: string, eventTitle: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive"
      })
      return
    }

    if (isRegistering) return

    setIsRegistering(eventId)

    try {
      const response = await fetch('/api/event-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update local state
        setRegisteredEvents((prev) => [...prev, eventId])
        
        // Update store (for UI consistency)
        if (currentUser) {
          registerForEvent(eventId, currentUser.id)
        }

        toast({
          title: "Registration successful!",
          description: `You have been registered for ${eventTitle}`,
        })
      } else {
        toast({
          title: "Registration failed",
          description: data.error || "Failed to register for event",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRegistering(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "workshop":
        return "bg-purple-100 text-purple-800"
      case "competition":
        return "bg-orange-100 text-orange-800"
      case "bootcamp":
        return "bg-green-100 text-green-800"
      case "symposium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const upcomingEvents = events.filter((event) => event.status === "upcoming")
  const completedEvents = events.filter((event) => event.status === "completed")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Calendar</h2>
        <p className="text-muted-foreground">Discover and register for upcoming events</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Available for registration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredEvents.length}</div>
            <p className="text-xs text-muted-foreground">You're registered for</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events you can get certificates for</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you can register for</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events at the moment.</p>
              <p className="text-sm">Check back later for new events!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                        {registeredEvents.includes(event.id) && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Registered
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.participants}/{event.maxParticipants} participants
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((event.participants / event.maxParticipants) * 100)}% full
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {registeredEvents.includes(event.id) ? (
                        <Button variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registered
                        </Button>
                      ) : (
                        <Button
                          className="pulse-gradient text-white"
                          onClick={() => handleRegisterForEvent(event.id, event.title)}
                          disabled={event.participants >= event.maxParticipants || isRegistering === event.id}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {isRegistering === event.id 
                            ? "Registering..." 
                            : event.participants >= event.maxParticipants 
                            ? "Full" 
                            : "Register Now"}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Events */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Events</CardTitle>
          <CardDescription>Events you can generate certificates for</CardDescription>
        </CardHeader>
        <CardContent>
          {completedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No completed events yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Access Key: <code className="bg-muted px-1 rounded">{event.accessKey}</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    <Button variant="outline" size="sm">
                      Generate Certificate
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
