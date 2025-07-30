"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Calendar, Award, Trophy, Edit, Save, Camera, Star, Target, BookOpen, MapPin, Clock } from "lucide-react"
import { useSession } from "next-auth/react"

export function StudentProfile() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchProfileData()
      fetchRegistrations()
    }
  }, [session])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations/user')
      if (response.ok) {
        const events = await response.json()
        setRegistrations(events || [])
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profile updated!",
          description: "Your profile information has been saved successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  const achievements = [
    {
      title: "Top Performer",
      description: "Ranked in top 20 students",
      icon: Trophy,
      color: "text-yellow-500",
      earned: true,
    },
    {
      title: "Certificate Collector",
      description: "Earned 5+ certificates",
      icon: Award,
      color: "text-green-500",
      earned: true,
    },
    {
      title: "Active Participant",
      description: "Attended 8+ events",
      icon: Target,
      color: "text-blue-500",
      earned: true,
    },
    {
      title: "Knowledge Seeker",
      description: "Completed 3+ workshops",
      icon: BookOpen,
      color: "text-purple-500",
      earned: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Student Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and track your progress</p>
        </div>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "pulse-gradient text-white" : ""}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profileData.name} />
                <AvatarFallback className="text-2xl">
                  {profileData.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                  variant="outline"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-2xl font-bold">{profileData.name}</h3>
                <Badge className="pulse-gradient text-white">
                  <Trophy className="w-3 h-3 mr-1" />
                  Rank #{profileData.rank}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{profileData.rollNumber}</p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{profileData.certificatesEarned} Certificates</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{profileData.eventsAttended} Events</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{profileData.totalPoints} Points</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev: any) => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 rounded border bg-muted/20">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <div className="flex items-center space-x-2 p-2 rounded border bg-muted/20">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>{profileData.rollNumber}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev: any) => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 rounded border bg-muted/20">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev: any) => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 rounded border bg-muted/20">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData((prev: any) => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            ) : (
              <div className="p-2 rounded border bg-muted/20">
                <span>{profileData.bio}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Your technical skills and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  {skill}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm" className="h-6 bg-transparent">
                  + Add Skill
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Areas you're passionate about</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                  {interest}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm" className="h-6 bg-transparent">
                  + Add Interest
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your accomplishments and milestones</CardDescription>
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
                    <achievement.icon className={`w-5 h-5 ${achievement.earned ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? "text-green-600" : "text-gray-500"}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && <Badge className="bg-green-100 text-green-800">Earned</Badge>}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
