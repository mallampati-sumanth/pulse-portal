"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, GraduationCap, Shield, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"

interface AuthModalProps {
  mode: "login" | "signup" | null
  onClose: () => void
}

export function AuthModal({ mode, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(mode || "login")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true)

    try {
      if (type === "login") {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          toast({
            title: "Login successful!",
            description: "Redirecting to your dashboard...",
          })

          setTimeout(() => {
            router.push("/student") // Will be redirected based on role
            onClose()
          }, 1000)
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Try demo credentials.",
            variant: "destructive",
          })
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        console.log('Starting user registration...')

        // Register new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            rollNumber: formData.rollNumber,
            password: formData.password,
          }),
        })

        const responseData = await response.json()
        console.log('Registration response:', response.status, responseData)

        if (response.ok) {
          toast({
            title: "Account created successfully!",
            description: "Welcome to PULSE Portal!",
          })

          // Auto-login after successful registration
          console.log('Auto-logging in after registration...')
          const loginResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          if (loginResult?.ok) {
            setTimeout(() => {
              router.push("/student")
              onClose()
            }, 1000)
          } else {
            console.log('Auto-login failed, but account was created')
            toast({
              title: "Account created!",
              description: "Please log in with your new credentials.",
            })
            setActiveTab("login")
          }
        } else {
          console.error('Registration failed:', response.status, responseData)
          toast({
            title: "Registration failed",
            description: responseData.error || "Something went wrong.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={mode !== null} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                  <TabsTrigger value="login" onClick={() => setActiveTab("login")}>Login</TabsTrigger>
                  <TabsTrigger value="signup" onClick={() => setActiveTab("signup")}>Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="p-6 pt-4">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 pulse-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Welcome Back</CardTitle>
                      <CardDescription>Sign in to access your PULSE dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@college.edu"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Badge variant="secondary" className="w-full justify-center">
                          Admin: admin@pulse.com / admin123
                        </Badge>
                        <Badge variant="secondary" className="w-full justify-center">
                          Student: student@pulse.com / student123
                        </Badge>
                      </div>

                      <Button
                        className="w-full pulse-gradient text-white hover:opacity-90"
                        onClick={() => handleSubmit("login")}
                        disabled={isLoading || !formData.email || !formData.password}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signup" className="p-6 pt-4">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 pulse-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Join PULSE</CardTitle>
                      <CardDescription>Create your account to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="John Doe"
                              className="pl-10"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rollNumber">Roll Number</Label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="rollNumber"
                              placeholder="ECE2024001"
                              className="pl-10"
                              value={formData.rollNumber}
                              onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your.email@college.edu"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full pulse-gradient text-white hover:opacity-90"
                        onClick={() => handleSubmit("signup")}
                        disabled={isLoading || !formData.name || !formData.email || !formData.password}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
