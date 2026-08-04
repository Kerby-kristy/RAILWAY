'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createSession, clearSession, hashPassword, verifyPassword } from '@/lib/auth';

export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const name = String(formData.get('name') || '').trim();
  const accountType = String(formData.get('accountType') || 'PERSON') as 'PERSON' | 'COMPANY';
  const companyName = String(formData.get('companyName') || '').trim();

  if (!email || !password || !name) {
    redirect('/register?error=' + encodeURIComponent('Merci de remplir tous les champs obligatoires.'));
  }
  if (password.length < 8) {
    redirect('/register?error=' + encodeURIComponent('Le mot de passe doit contenir au moins 8 caractères.'));
  }
  if (accountType === 'COMPANY' && !companyName) {
    redirect('/register?error=' + encodeURIComponent('Le nom de l\'entreprise est requis pour un compte entreprise.'));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect('/register?error=' + encodeURIComponent('Un compte existe déjà avec cet email.'));
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      accountType,
      companyName: accountType === 'COMPANY' ? companyName : null,
    },
  });

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'USER' | 'ADMIN',
    accountType: user.accountType as 'PERSON' | 'COMPANY',
  });

  redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/dashboard');

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('Merci de saisir votre email et votre mot de passe.'));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect('/login?error=' + encodeURIComponent('Email ou mot de passe incorrect.'));
  }

  await createSession({
    sub: user!.id,
    email: user!.email,
    name: user!.name,
    role: user!.role as 'USER' | 'ADMIN',
    accountType: user!.accountType as 'PERSON' | 'COMPANY',
  });

  redirect(next && next.startsWith('/') ? next : '/dashboard');
}

export async function logoutAction() {
  await clearSession();
  redirect('/');
}
