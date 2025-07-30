"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "student"
  rollNumber?: string
  joinDate: string
  certificatesEarned: number
  eventsAttended: number
  totalPoints: number
  rank: number
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: "active" | "upcoming" | "completed"
  participants: number
  maxParticipants: number
  category: string
  accessKey: string
  createdBy: string
}

interface Certificate {
  id: string
  studentId: string
  eventId: string
  studentName: string
  rollNumber: string
  eventName: string
  issueDate: string
  downloadUrl: string
  status: "generated" | "downloaded"
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  usage: number
  lastModified: string
  status: "active" | "inactive"
}

interface AppState {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean

  // Data
  users: User[]
  events: Event[]
  certificates: Certificate[]
  templates: Template[]

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User>) => Promise<boolean>
  logout: () => void

  // Event actions
  createEvent: (eventData: Partial<Event>) => void
  updateEvent: (id: string, eventData: Partial<Event>) => void
  deleteEvent: (id: string) => void
  registerForEvent: (eventId: string, userId: string) => void

  // Certificate actions
  generateCertificate: (accessKey: string, studentData: any) => Promise<Certificate | null>
  downloadCertificate: (certificateId: string) => void

  // Template actions
  createTemplate: (templateData: Partial<Template>) => void
  updateTemplate: (id: string, templateData: Partial<Template>) => void
  deleteTemplate: (id: string) => void

  // User actions
  updateUser: (id: string, userData: Partial<User>) => void
  deleteUser: (id: string) => void
}

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,

      // Sample data
      users: [
        {
          id: "1",
          name: "Admin User",
          email: "admin@pulse.com",
          role: "admin",
          joinDate: "2024-01-01",
          certificatesEarned: 0,
          eventsAttended: 0,
          totalPoints: 0,
          rank: 1,
        },
        {
          id: "2",
          name: "John Doe",
          email: "john.doe@college.edu",
          role: "student",
          rollNumber: "ECE2024001",
          joinDate: "2024-01-15",
          certificatesEarned: 5,
          eventsAttended: 8,
          totalPoints: 450,
          rank: 12,
        },
        {
          id: "3",
          name: "Jane Smith",
          email: "jane.smith@college.edu",
          role: "student",
          rollNumber: "ECE2024002",
          joinDate: "2024-01-16",
          certificatesEarned: 3,
          eventsAttended: 6,
          totalPoints: 320,
          rank: 18,
        },
      ],

      events: [
        {
          id: "1",
          title: "Web Development Workshop",
          description: "Learn modern web development with React and Next.js",
          date: "2024-02-15",
          time: "10:00 AM",
          location: "Computer Lab 1",
          status: "active",
          participants: 45,
          maxParticipants: 50,
          category: "workshop",
          accessKey: "PULSE2024WEB",
          createdBy: "1",
        },
        {
          id: "2",
          title: "AI/ML Symposium 2024",
          description: "Annual symposium on Artificial Intelligence and Machine Learning",
          date: "2024-02-20",
          time: "9:00 AM",
          location: "Main Auditorium",
          status: "upcoming",
          participants: 120,
          maxParticipants: 200,
          category: "symposium",
          accessKey: "PULSE2024AI",
          createdBy: "1",
        },
        {
          id: "3",
          title: "Technical Quiz Competition",
          description: "Test your technical knowledge across various domains",
          date: "2024-01-30",
          time: "2:00 PM",
          location: "Seminar Hall",
          status: "completed",
          participants: 80,
          maxParticipants: 100,
          category: "competition",
          accessKey: "PULSE2024QUIZ",
          createdBy: "1",
        },
      ],

      certificates: [
        {
          id: "1",
          studentId: "2",
          eventId: "3",
          studentName: "John Doe",
          rollNumber: "ECE2024001",
          eventName: "Technical Quiz Competition",
          issueDate: "2024-01-30",
          downloadUrl: "#",
          status: "downloaded",
        },
      ],

      templates: [
        {
          id: "1",
          name: "Workshop Certificate",
          description: "Standard template for workshop completion certificates",
          category: "workshop",
          usage: 156,
          lastModified: "2024-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Competition Winner",
          description: "Template for competition winners and participants",
          category: "competition",
          usage: 89,
          lastModified: "2024-01-10",
          status: "active",
        },
      ],

      // Auth actions
      login: async (email: string, password: string) => {
        const { users } = get()

        // Demo login logic
        if (email === "admin@pulse.com" && password === "admin123") {
          const user = users.find((u) => u.email === email)
          if (user) {
            set({ currentUser: user, isAuthenticated: true })
            return true
          }
        }

        if (email === "student@pulse.com" && password === "student123") {
          const user = users.find((u) => u.id === "2")
          if (user) {
            set({ currentUser: user, isAuthenticated: true })
            return true
          }
        }

        return false
      },

      signup: async (userData: Partial<User>) => {
        const { users } = get()
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || "",
          email: userData.email || "",
          role: "student",
          rollNumber: userData.rollNumber,
          joinDate: new Date().toISOString().split("T")[0],
          certificatesEarned: 0,
          eventsAttended: 0,
          totalPoints: 0,
          rank: users.length + 1,
        }

        set({
          users: [...users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        })
        return true
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false })
      },

      // Event actions
      createEvent: (eventData: Partial<Event>) => {
        const { events, currentUser } = get()
        const newEvent: Event = {
          id: Date.now().toString(),
          title: eventData.title || "",
          description: eventData.description || "",
          date: eventData.date || "",
          time: eventData.time || "",
          location: eventData.location || "",
          status: "upcoming",
          participants: 0,
          maxParticipants: Number(eventData.maxParticipants) || 100,
          category: eventData.category || "",
          accessKey: `PULSE${Date.now()}`,
          createdBy: currentUser?.id || "",
        }

        set({ events: [...events, newEvent] })
      },

      updateEvent: (id: string, eventData: Partial<Event>) => {
        const { events } = get()
        set({
          events: events.map((event) => (event.id === id ? { ...event, ...eventData } : event)),
        })
      },

      deleteEvent: (id: string) => {
        const { events } = get()
        set({ events: events.filter((event) => event.id !== id) })
      },

      registerForEvent: (eventId: string, userId: string) => {
        const { events, users } = get()

        set({
          events: events.map((event) =>
            event.id === eventId ? { ...event, participants: event.participants + 1 } : event,
          ),
          users: users.map((user) =>
            user.id === userId
              ? { ...user, eventsAttended: user.eventsAttended + 1, totalPoints: user.totalPoints + 50 }
              : user,
          ),
        })
      },

      // Certificate actions
      generateCertificate: async (accessKey: string, studentData: any) => {
        const { events, certificates, users } = get()

        const event = events.find((e) => e.accessKey === accessKey)
        if (!event) return null

        const newCertificate: Certificate = {
          id: Date.now().toString(),
          studentId: studentData.studentId || "2",
          eventId: event.id,
          studentName: studentData.studentName,
          rollNumber: studentData.rollNumber,
          eventName: event.title,
          issueDate: studentData.issueDate,
          downloadUrl: `#certificate-${Date.now()}`,
          status: "generated",
        }

        set({
          certificates: [...certificates, newCertificate],
          users: users.map((user) =>
            user.id === newCertificate.studentId
              ? { ...user, certificatesEarned: user.certificatesEarned + 1, totalPoints: user.totalPoints + 100 }
              : user,
          ),
        })

        return newCertificate
      },

      downloadCertificate: (certificateId: string) => {
        const { certificates } = get()
        set({
          certificates: certificates.map((cert) =>
            cert.id === certificateId ? { ...cert, status: "downloaded" as const } : cert,
          ),
        })
      },

      // Template actions
      createTemplate: (templateData: Partial<Template>) => {
        const { templates } = get()
        const newTemplate: Template = {
          id: Date.now().toString(),
          name: templateData.name || "",
          description: templateData.description || "",
          category: templateData.category || "",
          usage: 0,
          lastModified: new Date().toISOString().split("T")[0],
          status: "active",
        }

        set({ templates: [...templates, newTemplate] })
      },

      updateTemplate: (id: string, templateData: Partial<Template>) => {
        const { templates } = get()
        set({
          templates: templates.map((template) =>
            template.id === id
              ? { ...template, ...templateData, lastModified: new Date().toISOString().split("T")[0] }
              : template,
          ),
        })
      },

      deleteTemplate: (id: string) => {
        const { templates } = get()
        set({ templates: templates.filter((template) => template.id !== id) })
      },

      // User actions
      updateUser: (id: string, userData: Partial<User>) => {
        const { users } = get()
        set({
          users: users.map((user) => (user.id === id ? { ...user, ...userData } : user)),
        })
      },

      deleteUser: (id: string) => {
        const { users } = get()
        set({ users: users.filter((user) => user.id !== id) })
      },
    }),
    {
      name: "pulse-portal-storage",
    },
  ),
)

export default useStore
