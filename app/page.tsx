"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Calendar, Shield, Zap, Trophy, ArrowRight, Star, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {

  const features = [
    {
      icon: Award,
      title: "Instant Certificates",
      description: "Generate professional certificates with QR verification in seconds",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based authentication with encrypted data protection",
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Complete event lifecycle management with analytics",
    },
    {
      icon: Users,
      title: "Student Portal",
      description: "Personalized dashboard for students to track achievements",
    },
  ]

  const stats = [
    { number: "500+", label: "Certificates Generated" },
    { number: "50+", label: "Events Hosted" },
    { number: "1000+", label: "Active Students" },
    { number: "99.9%", label: "Uptime" },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 pulse-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PULSE Portal</span>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="ghost" asChild className="hover:bg-primary/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="pulse-gradient text-white hover:opacity-90">
              <Link href="/login">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 pulse-gradient text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Event Portal
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              PULSE Portal
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The most advanced student event management system. Generate certificates, manage events, and track
              achievements with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="pulse-gradient text-white hover:opacity-90 animate-pulse-glow"
                asChild
              >
                <Link href="/login">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose PULSE?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology and designed for the future of student engagement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 pulse-gradient rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-4xl mx-auto pulse-gradient p-1">
              <div className="bg-background rounded-lg p-12">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
                <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Events?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of students already using PULSE Portal to manage their academic achievements and event
                  participation.
                </p>
                <Button
                  size="lg"
                  className="pulse-gradient text-white hover:opacity-90"
                  asChild
                >
                  <Link href="/login">
                    Get Started Today
                    <Star className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 pulse-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PULSE Portal</span>
          </div>
          <p className="text-muted-foreground mb-4">Built by the ECE Department Student Body</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 PULSE Portal</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
