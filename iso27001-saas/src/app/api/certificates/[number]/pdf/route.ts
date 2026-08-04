import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildCertificatePdf } from '@/lib/pdf';

export async function GET(request: NextRequest, { params }: { params: { number: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: params.number },
    include: { application: true },
  });

  if (!certificate) {
    return NextResponse.json({ error: 'Certificat introuvable' }, { status: 404 });
  }

  const verifyUrl = new URL(`/verify/${certificate.certificateNumber}`, request.url).toString();

  const pdfBuffer = await buildCertificatePdf({
    certificateNumber: certificate.certificateNumber,
    holderName: certificate.holderName,
    organizationName: certificate.application.organizationName,
    type: certificate.type,
    scopeDescription: certificate.application.scopeDescription,
    issueDate: certificate.issueDate,
    expiryDate: certificate.expiryDate,
    verifyUrl,
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${certificate.certificateNumber}.pdf"`,
    },
  });
}
