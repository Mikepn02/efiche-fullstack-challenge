import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
  } else {
    // Hash the password
    const hashedPassword = await hash(adminPassword, 10);

 
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log(`Admin user created successfully:`, {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  }

  // Seed programs
  const now = new Date();
  const allPrograms = [
    {
      name: 'Mental Health Support Program',
      description: 'Comprehensive mental health support program focusing on anxiety, depression, and stress management. Includes group therapy sessions and one-on-one consultations.',
      startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 4, 30),
      status: 'ONGOING' as const,
    },
    {
      name: 'Substance Abuse Recovery Program',
      description: 'Structured recovery program for individuals dealing with substance abuse. Features weekly group sessions, individual counseling, and medication management.',
      startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() - 1, 30),
      status: 'COMPLETED' as const,
    },
    {
      name: 'Trauma Healing Workshop',
      description: 'Specialized workshop designed to help individuals process and heal from traumatic experiences. Includes evidence-based therapies and peer support.',
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 3, 30),
      status: 'ONGOING' as const,
    },
    {
      name: 'Family Therapy Program',
      description: 'Program focused on improving family dynamics and communication. Suitable for families dealing with mental health challenges or relationship issues.',
      startDate: new Date(now.getFullYear() - 1, now.getMonth(), 1),
      endDate: new Date(now.getFullYear() - 1, now.getMonth() + 5, 30),
      status: 'ARCHIVED' as const,
    },
    {
      name: 'Youth Mental Wellness Initiative',
      description: 'Targeted program for adolescents and young adults (ages 13-25) addressing common mental health concerns. Includes peer support groups and educational sessions.',
      startDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      endDate: new Date(now.getFullYear(), now.getMonth() + 5, 15),
      status: 'ONGOING' as const,
    },
    {
      name: 'Crisis Intervention Program',
      description: 'Immediate support program for individuals experiencing mental health crises. Provides 24/7 access to counseling and emergency intervention services.',
      startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 3, 30),
      status: 'ONGOING' as const,
    },
    {
      name: 'Cognitive Behavioral Therapy Group',
      description: 'Evidence-based CBT program for managing anxiety and depression. Includes structured sessions focusing on thought patterns and behavioral changes.',
      startDate: new Date(now.getFullYear() - 1, now.getMonth() + 2, 1),
      endDate: new Date(now.getFullYear() - 1, now.getMonth() + 7, 30),
      status: 'ARCHIVED' as const,
    },
    {
      name: 'Mindfulness and Meditation Program',
      description: 'Wellness program teaching mindfulness techniques, meditation practices, and stress reduction strategies. Suitable for all experience levels.',
      startDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 5, 30),
      status: 'ONGOING' as const,
    },
    {
      name: 'Post-Traumatic Stress Recovery Program',
      description: 'Specialized program for individuals dealing with PTSD. Includes trauma-informed care, EMDR therapy, and gradual exposure techniques.',
      startDate: new Date(now.getFullYear(), now.getMonth() - 4, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 2, 28),
      status: 'ONGOING' as const,
    },
    {
      name: 'Community Mental Health Outreach',
      description: 'Community-focused program providing mental health education and support to underserved populations. Includes workshops, screenings, and resource connections.',
      startDate: new Date(now.getFullYear() - 1, now.getMonth() - 3, 1),
      endDate: new Date(now.getFullYear() - 1, now.getMonth() + 3, 30),
      status: 'COMPLETED' as const,
    },
  ];

  // Get existing program names
  const existingPrograms = await prisma.program.findMany({
    select: { name: true },
  });
  const existingNames = new Set(existingPrograms.map(p => p.name));

  // Filter out programs that already exist
  const programsToCreate = allPrograms.filter(
    program => !existingNames.has(program.name)
  );

  if (programsToCreate.length === 0) {
    console.log(`All programs already exist. Skipping program seed.`);
  } else {
    const createdPrograms = await prisma.program.createMany({
      data: programsToCreate,
    });

    console.log(`Successfully created ${createdPrograms.count} new programs.`);
    console.log(`Total programs in database: ${existingPrograms.length + createdPrograms.count}`);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

