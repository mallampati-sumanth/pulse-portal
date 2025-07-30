"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { CertificateTemplate } from './certificate-template'
import { useToast } from '@/hooks/use-toast'

interface CertificateDownloadProps {
  studentName: string
  eventTitle: string
  eventDate: string
  eventId: string
}

export function CertificateDownload({ 
  studentName, 
  eventTitle, 
  eventDate, 
  eventId 
}: CertificateDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    setIsGenerating(true)
    
    try {
      const certificateId = `PULSE-${eventId.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`
      const issuedDate = new Date().toISOString()

      // Create a temporary container for the certificate
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Popup blocked')
      }

      // Get the certificate HTML
      const certificateElement = certificateRef.current
      const certificateHTML = certificateElement.outerHTML

      // Create the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${studentName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
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
            ${certificateHTML}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Print Certificate
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                Close
              </button>
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Save certificate record
      await saveCertificateRecord({
        studentName,
        eventTitle,
        eventDate,
        eventId,
        certificateId,
        issuedDate
      })

      toast({
        title: "Certificate Ready!",
        description: `Certificate for ${eventTitle} is ready for download/print.`,
      })

    } catch (error) {
      console.error('Certificate generation failed:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveCertificateRecord = async (certificateData: any) => {
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificateData),
      })

      if (!response.ok) {
        console.warn('Failed to save certificate record')
      }
    } catch (error) {
      console.warn('Failed to save certificate record:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden certificate template */}
      <div className="absolute -left-[9999px] -top-[9999px]">
        <CertificateTemplate
          ref={certificateRef}
          studentName={studentName}
          eventTitle={eventTitle}
          eventDate={eventDate}
          certificateId={`PULSE-${eventId.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`}
          issuedDate={new Date().toISOString()}
        />
      </div>

      {/* Download button */}
      <Button
        onClick={downloadCertificate}
        disabled={isGenerating}
        className="w-full"
        variant="outline"
      >
        {isGenerating ? (
          <>
            <FileText className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </>
        )}
      </Button>
    </div>
  )
}
