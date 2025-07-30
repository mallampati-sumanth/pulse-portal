"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calendar, Users, MapPin, Clock, Edit, Trash2, Eye, Download, Key, UserCheck, Award } from "lucide-react"
import useStore from "@/lib/store"

export function EventManagement() {
  const { events, createEvent, updateEvent, deleteEvent } = useStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [viewingRegistrations, setViewingRegistrations] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [generatingCertificates, setGeneratingCertificates] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    category: "",
  })

  const { toast } = useToast()

  // Load registrations when viewing registrations modal
  useEffect(() => {
    if (viewingRegistrations) {
      loadEventRegistrations()
    }
  }, [viewingRegistrations])

  const loadEventRegistrations = async () => {
    if (!viewingRegistrations) return
    
    setLoadingRegistrations(true)
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const allRegistrations = await response.json()
        // Filter registrations for the current event
        const eventRegistrations = allRegistrations.filter(
          (reg: any) => reg.eventid === viewingRegistrations.id
        )
        setRegistrations(eventRegistrations)
      } else {
        toast({
          title: "Error",
          description: "Failed to load registrations",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to load registrations:', error)
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive"
      })
    } finally {
      setLoadingRegistrations(false)
    }
  }

  // Generate certificate for a user
  const generateCertificate = (studentName: string, eventTitle: string, eventDate: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    // Certificate background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 600)
    
    // Border
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, 760, 560)
    
    // Header
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 48px serif'
    ctx.textAlign = 'center'
    ctx.fillText('CERTIFICATE', 400, 120)
    
    ctx.font = 'bold 24px serif'
    ctx.fillText('OF PARTICIPATION', 400, 160)
    
    // Main content
    ctx.fillStyle = '#374151'
    ctx.font = '20px serif'
    ctx.fillText('This is to certify that', 400, 220)
    
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 36px serif'
    ctx.fillText(studentName, 400, 280)
    
    // Underline
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, 290)
    ctx.lineTo(600, 290)
    ctx.stroke()
    
    ctx.fillStyle = '#374151'
    ctx.font = '20px serif'
    ctx.fillText('has successfully participated in', 400, 330)
    
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 28px serif'
    ctx.fillText(eventTitle, 400, 380)
    
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px serif'
    ctx.fillText(`held on ${new Date(eventDate).toLocaleDateString()}`, 400, 420)
    
    // Footer
    ctx.fillStyle = '#9ca3af'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Certificate ID: PULSE-${Date.now()}`, 50, 550)
    ctx.textAlign = 'right'
    ctx.fillText(`Issued: ${new Date().toLocaleDateString()}`, 750, 550)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('PULSE PORTAL', 400, 550)
    
    // Download
    const link = document.createElement('a')
    link.download = `${studentName.replace(/\s+/g, '_')}_${eventTitle.replace(/\s+/g, '_')}_Certificate.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  // Generate certificates for all registered users
  const handleGenerateCertificates = async (event: any) => {
    setGeneratingCertificates(event.id)
    
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const allRegistrations = await response.json()
        const eventRegistrations = allRegistrations.filter(
          (reg: any) => reg.eventid === event.id
        )
        
        if (eventRegistrations.length === 0) {
          toast({
            title: "No registrations",
            description: "No students are registered for this event",
            variant: "destructive"
          })
          return
        }
        
        // Generate certificate for each registered user
        eventRegistrations.forEach((registration: any, index: number) => {
          setTimeout(() => {
            if (registration.user?.name) {
              generateCertificate(
                registration.user.name,
                event.title,
                event.date
              )
            }
          }, index * 500) // Stagger downloads
        })
        
        toast({
          title: "Certificates Generated!",
          description: `Generated ${eventRegistrations.length} certificates for ${event.title}`,
        })
      }
    } catch (error) {
      console.error('Failed to generate certificates:', error)
      toast({
        title: "Error",
        description: "Failed to generate certificates",
        variant: "destructive"
      })
    } finally {
      setGeneratingCertificates(null)
    }
  }

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    createEvent(newEvent)
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: "",
      category: "",
    })
    setIsCreateModalOpen(false)

    toast({
      title: "Event created successfully!",
      description: `${newEvent.title} has been added to the events list.`,
    })
  }

  const handleUpdateEvent = () => {
    if (!editingEvent) return

    updateEvent(editingEvent.id, editingEvent)
    setEditingEvent(null)

    toast({
      title: "Event updated successfully!",
      description: `${editingEvent.title} has been updated.`,
    })
  }

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    deleteEvent(eventId)
    toast({
      title: "Event deleted",
      description: `${eventTitle} has been removed.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "workshop":
        return "bg-purple-100 text-purple-800"
      case "symposium":
        return "bg-blue-100 text-blue-800"
      case "competition":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Create and manage events</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="pulse-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="100"
                    value={newEvent.maxParticipants}
                    onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newEvent.category}
                    onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="symposium">Symposium</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full pulse-gradient text-white"
                onClick={handleCreateEvent}
                disabled={!newEvent.title || !newEvent.date || !newEvent.time}
              >
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                      <span className="text-sm text-muted-foreground capitalize">{event.status}</span>
                    </div>
                    <CardDescription>{event.description}</CardDescription>
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <code className="text-sm bg-muted px-2 py-1 rounded">{event.accessKey}</code>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewingRegistrations(event)}
                      title="View Registrations"
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateCertificates(event)}
                      disabled={generatingCertificates === event.id}
                      title="Generate Certificates"
                    >
                      {generatingCertificates === event.id ? (
                        <Award className="w-4 h-4 animate-spin" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingEvent(event)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 bg-transparent"
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="mt-4 flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    />
                  </div>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Event Modal */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <Button className="w-full pulse-gradient text-white" onClick={handleUpdateEvent}>
                Update Event
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Registrations Modal */}
      <Dialog open={!!viewingRegistrations} onOpenChange={() => setViewingRegistrations(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Registrations for {viewingRegistrations?.title}
            </DialogTitle>
          </DialogHeader>
          
          {loadingRegistrations ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading registrations...</div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registrations yet for this event.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Total registrations: {registrations.length}
              </div>
              
              <div className="space-y-3">
                {registrations.map((registration, index) => (
                  <div 
                    key={registration.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {registration.user?.name?.charAt(0) || registration.user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium">
                            {registration.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {registration.user?.email}
                          </div>
                          {registration.user?.rollnumber && (
                            <div className="text-xs text-muted-foreground">
                              Roll: {registration.user.rollnumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(registration.registeredat).toLocaleDateString()}
                      </div>
                      <Badge 
                        variant={registration.status === 'registered' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {registration.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Export functionality can be added here
                    toast({
                      title: "Export feature",
                      description: "Export functionality will be implemented soon",
                    })
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Registration List
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
