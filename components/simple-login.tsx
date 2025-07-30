"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Shield, GraduationCap, Mail, Lock, Eye, EyeOff, User, UserCheck, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { AuthModal } from "@/components/auth-modal"

export function SimpleLogin() {
  const [showPassword, setShowPassword] = useState({ admin: false, student: false })
  const [isLoading, setIsLoading] = useState({ admin: false, student: false })
  const [credentials, setCredentials] = useState({
    admin: { email: "", password: "" },
    student: { email: "", password: "" }
  })
  const [showSignup, setShowSignup] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (type: 'admin' | 'student') => {
    setIsLoading(prev => ({ ...prev, [type]: true }))

    try {
      const result = await signIn("credentials", {
        email: credentials[type].email,
        password: credentials[type].password,
        redirect: false,
      })

      if (result?.ok) {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${type}!`,
        })

        setTimeout(() => {
          router.push(type === 'admin' ? '/admin' : '/student')
        }, 1000)
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo credentials.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(prev => ({ ...prev, [type]: false }))
  }

  const handleInputChange = (type: 'admin' | 'student', field: 'email' | 'password', value: string) => {
    setCredentials(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }))
  }

  const useDemoCredentials = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setCredentials(prev => ({
        ...prev,
        admin: { email: "admin@pulse.com", password: "admin123" }
      }))
    } else {
      setCredentials(prev => ({
        ...prev,
        student: { email: "student@pulse.com", password: "student123" }
      }))
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 pulse-gradient rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold">PULSE Portal</h1>
          </div>
          <p className="text-xl text-muted-foreground">Choose your login type to continue</p>
        </motion.div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Login */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <UserCheck className="w-6 h-6" />
                  Admin Login
                </CardTitle>
                <CardDescription>Access the administrative dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@pulse.com"
                      className="pl-10"
                      value={credentials.admin.email}
                      onChange={(e) => handleInputChange('admin', 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type={showPassword.admin ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      value={credentials.admin.password}
                      onChange={(e) => handleInputChange('admin', 'password', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => ({ ...prev, admin: !prev.admin }))}
                    >
                      {showPassword.admin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Badge 
                    variant="secondary" 
                    className="w-full justify-center cursor-pointer hover:bg-secondary/80"
                    onClick={() => useDemoCredentials('admin')}
                  >
                    Demo: admin@pulse.com / admin123
                  </Badge>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => handleLogin('admin')}
                    disabled={isLoading.admin}
                  >
                    {isLoading.admin ? "Signing in..." : "Sign in as Admin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Login */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full border-2 hover:border-green-200 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <User className="w-6 h-6" />
                  Student Login
                </CardTitle>
                <CardDescription>Access your student dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="student@college.edu"
                      className="pl-10"
                      value={credentials.student.email}
                      onChange={(e) => handleInputChange('student', 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="student-password"
                      type={showPassword.student ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      value={credentials.student.password}
                      onChange={(e) => handleInputChange('student', 'password', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => ({ ...prev, student: !prev.student }))}
                    >
                      {showPassword.student ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Badge 
                    variant="secondary" 
                    className="w-full justify-center cursor-pointer hover:bg-secondary/80"
                    onClick={() => useDemoCredentials('student')}
                  >
                    Demo: student@pulse.com / student123
                  </Badge>

                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={() => handleLogin('student')}
                    disabled={isLoading.student}
                  >
                    {isLoading.student ? "Signing in..." : "Sign in as Student"}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowSignup(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Student Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            Having trouble? Click on demo credentials above to use test accounts.
          </p>
        </motion.div>
      </div>

      {/* Signup Modal */}
      <AuthModal 
        mode={showSignup ? "signup" : null} 
        onClose={() => setShowSignup(false)} 
      />
    </div>
  )
}