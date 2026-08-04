'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { generateCertificateNumber, computeExpiryDate } from '@/lib/certificate';

export async function decideApplicationAction(formData: FormData) {
  await requireAdmin();

  const applicationId = String(formData.get('applicationId') || '');
  const decision = String(formData.get('decision') || '');
  const comment = String(formData.get('comment') || '').trim();

  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) {
    redirect('/admin?error=' + encodeURIComponent('Dossier introuvable.'));
  }
  if (application!.status === 'APPROVED' || application!.status === 'REJECTED') {
    redirect(`/admin/applications/${applicationId}?error=` + encodeURIComponent('Ce dossier a déjà été traité.'));
  }

  if (decision === 'APPROVE') {
    const issueDate = new Date();
    const expiryDate = computeExpiryDate(issueDate);

    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          reviewComment: comment || null,
          reviewedAt: issueDate,
        },
      }),
      prisma.certificate.create({
        data: {
          applicationId,
          certificateNumber: generateCertificateNumber(application!.type),
          holderName: application!.applicantName,
          type: application!.type,
          issueDate,
          expiryDate,
        },
      }),
    ]);
  } else if (decision === 'REJECT') {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        reviewComment: comment || null,
        reviewedAt: new Date(),
      },
    });
  } else {
    redirect(`/admin/applications/${applicationId}?error=` + encodeURIComponent('Décision invalide.'));
  }

  redirect(`/admin/applications/${applicationId}?decided=1`);
}

export async function markUnderReviewAction(formData: FormData) {
  await requireAdmin();
  const applicationId = String(formData.get('applicationId') || '');
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'UNDER_REVIEW' },
  });
  redirect(`/admin/applications/${applicationId}`);
}

export async function revokeCertificateAction(formData: FormData) {
  await requireAdmin();
  const certificateId = String(formData.get('certificateId') || '');
  const reason = String(formData.get('reason') || '').trim();

  await prisma.certificate.update({
    where: { id: certificateId },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
      revokedReason: reason || 'Non spécifiée',
    },
  });

  redirect('/admin/certificates?revoked=1');
}
