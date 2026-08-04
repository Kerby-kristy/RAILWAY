'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { QUESTIONNAIRE_ITEMS, computeScore, type QuestionnaireAnswerValue } from '@/lib/questionnaire';

export async function createApplicationAction(formData: FormData) {
  const session = await requireUser();

  const type = String(formData.get('type') || session.accountType) as 'PERSON' | 'COMPANY';
  const applicantName = String(formData.get('applicantName') || session.name).trim();
  const organizationName = String(formData.get('organizationName') || '').trim();
  const scopeDescription = String(formData.get('scopeDescription') || '').trim();

  if (!applicantName || !scopeDescription) {
    redirect('/dashboard/applications/new?error=' + encodeURIComponent('Merci de compléter les champs obligatoires.'));
  }
  if (type === 'COMPANY' && !organizationName) {
    redirect('/dashboard/applications/new?error=' + encodeURIComponent('Le nom de l\'organisation est requis.'));
  }

  const answers: Record<string, QuestionnaireAnswerValue> = {};
  for (const item of QUESTIONNAIRE_ITEMS) {
    const value = formData.get(`answers[${item.id}]`);
    if (typeof value === 'string' && value) {
      answers[item.id] = value as QuestionnaireAnswerValue;
    }
  }
  if (Object.keys(answers).length !== QUESTIONNAIRE_ITEMS.length) {
    redirect('/dashboard/applications/new?error=' + encodeURIComponent('Merci de répondre à toutes les questions de l\'auto-évaluation.'));
  }

  const documentFiles = formData.getAll('documents').filter((f): f is File => f instanceof File && f.size > 0);
  const documents = documentFiles.map((f) => ({ name: f.name, size: f.size }));

  const { score } = computeScore(answers);

  const application = await prisma.application.create({
    data: {
      userId: session.sub,
      type,
      applicantName,
      organizationName: type === 'COMPANY' ? organizationName : null,
      scopeDescription,
      answers: JSON.stringify(answers),
      documents: JSON.stringify(documents),
      status: 'SUBMITTED',
      submittedAt: new Date(),
      score,
    },
  });

  redirect(`/dashboard/applications/${application.id}?submitted=1`);
}
