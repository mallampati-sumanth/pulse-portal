"use client"

import React from 'react'

interface CertificateTemplateProps {
  studentName: string
  eventTitle: string
  eventDate: string
  certificateId: string
  issuedDate: string
}

export const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ studentName, eventTitle, eventDate, certificateId, issuedDate }, ref) => {
    return (
      <div 
        ref={ref}
        className="w-[800px] h-[600px] bg-white relative overflow-hidden print:shadow-none"
        style={{ 
          fontFamily: 'serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '12px solid #2d3748'
        }}
      >
        {/* Inner white background */}
        <div className="absolute inset-4 bg-white border-4 border-gray-300">
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-blue-600"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-blue-600"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-blue-600"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-blue-600"></div>

          {/* Header */}
          <div className="text-center pt-8 pb-4">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">⚡</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-blue-800 mb-2 tracking-wider">CERTIFICATE</h1>
            <div className="w-32 h-1 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-lg text-blue-600 font-semibold tracking-widest">OF ACHIEVEMENT</p>
          </div>

          {/* Main Content */}
          <div className="px-12 text-center">
            <p className="text-base text-gray-600 mb-4 italic">This is to certify that</p>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 inline-block px-8">
                {studentName}
              </h2>
            </div>
            
            <p className="text-base text-gray-600 mb-3">has successfully completed</p>
            
            <h3 className="text-xl font-semibold text-blue-700 mb-4 px-4">
              {eventTitle}
            </h3>
            
            <p className="text-sm text-gray-500 mb-6">
              Conducted on {new Date(eventDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            {/* Achievement badge */}
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-full p-3">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-12 pb-6">
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="w-24 h-0.5 bg-gray-400 mb-1"></div>
                <p className="text-xs text-gray-500">Coordinator</p>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-400 space-y-1">
                  <p className="font-mono">ID: {certificateId}</p>
                  <p>Issued: {new Date(issuedDate).toLocaleDateString()}</p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-lg">⚡</span>
                    <span className="font-bold text-blue-700">PULSE PORTAL</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-0.5 bg-gray-400 mb-1"></div>
                <p className="text-xs text-gray-500">Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CertificateTemplate.displayName = "CertificateTemplate"
