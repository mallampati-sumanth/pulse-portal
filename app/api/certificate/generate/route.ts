import { NextRequest, NextResponse } from 'next/server';

// A simple, fast SVG certificate generator
function generateCertificateSVG(studentName: string, eventName: string, eventDate: string, certificateId: string) {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif; background-color: #f0f4f8;">
      <rect width="100%" height="100%" fill="#f0f4f8"/>
      <rect x="10" y="10" width="780" height="580" fill="white" stroke="#003366" stroke-width="4"/>
      
      <g style="text-anchor: middle;">
        <text x="400" y="100" font-size="48" font-weight="bold" fill="#003366">
          Certificate of Participation
        </text>
        
        <text x="400" y="180" font-size="20" fill="#333">
          This is to certify that
        </text>
        
        <text x="400" y="250" font-size="36" font-weight="bold" fill="#0055a4">
          ${studentName}
        </text>
        
        <text x="400" y="320" font-size="20" fill="#333">
          has successfully participated in the event
        </text>
        
        <text x="400" y="380" font-size="28" font-weight="bold" fill="#0055a4">
          ${eventName}
        </text>
        
        <text x="400" y="430" font-size="18" fill="#333">
          on ${formattedDate}
        </text>
        
        <text x="400" y="520" font-size="16" font-weight="bold" fill="#003366">
          PULSE Portal
        </text>
        
        <text x="400" y="550" font-size="12" fill="#777">
          Certificate ID: ${certificateId}
        </text>
      </g>
    </svg>
  `;
  return svg;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentName = searchParams.get('studentName') || 'Sample Student';
  const eventName = searchParams.get('eventName') || 'Sample Event';
  const eventDate = searchParams.get('eventDate') || new Date().toISOString();
  const certificateId = searchParams.get('certificateId') || 'SAMPLE-ID';

  const svgImage = generateCertificateSVG(studentName, eventName, eventDate, certificateId);

  return new NextResponse(svgImage, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}
