"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Key, Award, Download, Eye, CheckCircle, Sparkles } from "lucide-react"
import useStore from "@/lib/store"

export function CertificateGenerator() {
  const { events, certificates, currentUser, generateCertificate, downloadCertificate } = useStore()
  const [accessKey, setAccessKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validatedEvent, setValidatedEvent] = useState<any>(null)
  const [certificateData, setCertificateData] = useState({
    studentName: currentUser?.name || "",
    rollNumber: currentUser?.rollNumber || "",
    eventName: "",
    issueDate: new Date().toISOString().split("T")[0],
  })

  const { toast } = useToast()

  const userCertificates = certificates.filter((cert) => cert.studentId === currentUser?.id)

  const handleKeyValidation = async () => {
    setIsValidating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const event = events.find((e) => e.accessKey === accessKey)

    if (event) {
      setValidatedEvent(event)
      setCertificateData((prev) => ({
        ...prev,
        eventName: event.title,
      }))

      toast({
        title: "Access key validated!",
        description: `You can now generate certificate for ${event.title}`,
      })
    } else {
      toast({
        title: "Invalid access key",
        description: "Please check your key and try again.",
        variant: "destructive",
      })
      setValidatedEvent(null)
    }

    setIsValidating(false)
  }

  const handleGenerateCertificate = async () => {
    if (!validatedEvent || !currentUser) return

    const certificate = await generateCertificate(accessKey, {
      ...certificateData,
      studentId: currentUser.id,
    })

    if (certificate) {
      toast({
        title: "Certificate generated!",
        description: "Your certificate is ready for download.",
      })

      // Reset form
      setAccessKey("")
      setValidatedEvent(null)
      setCertificateData({
        studentName: currentUser.name,
        rollNumber: currentUser.rollNumber || "",
        eventName: "",
        issueDate: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleDownloadCertificate = (certificateId: string) => {
    downloadCertificate(certificateId)
    toast({
      title: "Certificate downloaded!",
      description: "Certificate has been marked as downloaded.",
    })
  }

  const demoKeys = events.map((event) => ({
    key: event.accessKey,
    event: event.title,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Certificate Generator</h2>
        <p className="text-muted-foreground">Enter your event access key to generate your certificate</p>
      </div>

      {/* Demo Keys */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            Available Access Keys
          </CardTitle>
          <CardDescription>Use these keys to generate certificates for completed events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {demoKeys.map((demo, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border">
                <div>
                  <code className="font-mono text-sm font-medium">{demo.key}</code>
                  <p className="text-sm text-muted-foreground">{demo.event}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setAccessKey(demo.key)}>
                  Use Key
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Key Input */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Access Key</CardTitle>
          <CardDescription>Provide the unique key given by event organizers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-key">Event Access Key</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="access-key"
                  placeholder="Enter your access key"
                  className="pl-10"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                />
              </div>
              <Button
                onClick={handleKeyValidation}
                disabled={!accessKey || isValidating}
                className="pulse-gradient text-white"
              >
                {isValidating ? "Validating..." : "Validate"}
              </Button>
            </div>
          </div>

          {validatedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-green-50 border border-green-200"
            >
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-medium text-green-800">Event Validated</h4>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  <strong>Event:</strong> {validatedEvent.title}
                </p>
                <p>
                  <strong>Category:</strong> {validatedEvent.category}
                </p>
                <p>
                  <strong>Date:</strong> {validatedEvent.date}
                </p>
                <p>
                  <strong>Description:</strong> {validatedEvent.description}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Form */}
      {validatedEvent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>Review and confirm your certificate information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input
                    id="student-name"
                    value={certificateData.studentName}
                    onChange={(e) =>
                      setCertificateData((prev) => ({
                        ...prev,
                        studentName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roll-number">Roll Number</Label>
                  <Input
                    id="roll-number"
                    value={certificateData.rollNumber}
                    onChange={(e) =>
                      setCertificateData((prev) => ({
                        ...prev,
                        rollNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" value={certificateData.eventName} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={certificateData.issueDate}
                  onChange={(e) =>
                    setCertificateData((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  className="flex-1 pulse-gradient text-white"
                  onClick={handleGenerateCertificate}
                  disabled={!certificateData.studentName || !certificateData.rollNumber}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* My Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>Previously generated certificates</CardDescription>
        </CardHeader>
        <CardContent>
          {userCertificates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No certificates generated yet.</p>
              <p className="text-sm">Use an access key above to generate your first certificate!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userCertificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 pulse-gradient rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{cert.eventName}</h4>
                      <p className="text-sm text-muted-foreground">Generated on {cert.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={cert.status === "downloaded" ? "default" : "outline"}>{cert.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadCertificate(cert.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
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
