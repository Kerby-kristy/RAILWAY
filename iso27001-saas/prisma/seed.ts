import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin1234!', 10);
  const demoPassword = await bcrypt.hash('Demo1234!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@iso27001-cert.test' },
    update: {},
    create: {
      email: 'admin@iso27001-cert.test',
      passwordHash: adminPassword,
      name: 'Auditeur Admin',
      accountType: 'PERSON',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@iso27001-cert.test' },
    update: {},
    create: {
      email: 'demo@iso27001-cert.test',
      passwordHash: demoPassword,
      name: 'Jean Demo',
      accountType: 'COMPANY',
      companyName: 'Demo SARL',
      role: 'USER',
    },
  });

  console.log('Seed terminé.');
  console.log('Admin  -> admin@iso27001-cert.test / Admin1234!');
  console.log('Client -> demo@iso27001-cert.test / Demo1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
