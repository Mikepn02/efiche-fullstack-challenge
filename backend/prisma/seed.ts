import { PrismaClient, Role, Gender, ProgramStatus, SessionType, SessionFrequency, SessionStatus, MedicationFrequency } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data in dependency order (children first)
  await prisma.dispenseRecord.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.sessionAttendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.programSession.deleteMany();
  await prisma.program.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users (staff/admin for relations)
  const staff = await prisma.user.create({
    data: {
      name: 'Staff Member',
      email: 'staff@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuv', // dummy hash
      role: Role.STAFF,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Member',
      email: 'admin@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuv',
      role: Role.ADMIN,
    },
  });

  // Seed Patients
  const [patientAlice, patientBob, patientCara] = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: 'Alice',
        lastName: 'Anderson',
        dateOfBirth: new Date('1990-01-15'),
        gender: Gender.FEMALE,
        assignedToId: staff.id,
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Bob',
        lastName: 'Brown',
        dateOfBirth: new Date('1985-06-30'),
        gender: Gender.MALE,
        assignedToId: staff.id,
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Cara',
        lastName: 'Clark',
        dateOfBirth: new Date('2001-11-22'),
        gender: Gender.FEMALE,
        assignedToId: admin.id,
      },
    }),
  ]);

  // Seed Programs
  const programDiabetes = await prisma.program.create({
    data: {
      name: 'Diabetes Care Program',
      description: 'Comprehensive diabetes management and education.',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      status: ProgramStatus.ONGOING,
    },
  });

  const programWellness = await prisma.program.create({
    data: {
      name: 'General Wellness Program',
      description: 'Lifestyle, nutrition, and exercise coaching.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-09-30'),
      status: ProgramStatus.ONGOING,
    },
  });

  // Seed Program Sessions
  const [sessionD1, sessionD2, sessionW1] = await Promise.all([
    prisma.programSession.create({
      data: {
        programId: programDiabetes.id,
        title: 'Intro to Diabetes',
        description: 'Overview and goals.',
        date: new Date('2025-01-05T10:00:00Z'),
        frequency: SessionFrequency.ONCE,
        sessionType: SessionType.GROUP,
      },
    }),
    prisma.programSession.create({
      data: {
        programId: programDiabetes.id,
        title: 'Nutrition for Diabetes',
        description: 'Diet and carb counting.',
        date: new Date('2025-02-05T10:00:00Z'),
        frequency: SessionFrequency.MONTHLY,
        sessionType: SessionType.CONSULTATION,
      },
    }),
    prisma.programSession.create({
      data: {
        programId: programWellness.id,
        title: 'Wellness Kickoff',
        description: 'Baseline assessment and plan.',
        date: new Date('2025-03-03T14:00:00Z'),
        frequency: SessionFrequency.ONCE,
        sessionType: SessionType.ONE_ON_ONE,
      },
    }),
  ]);

  // Enrollments
  const [enrollAliceDiabetes, enrollBobDiabetes, enrollCaraWellness] = await Promise.all([
    prisma.enrollment.create({
      data: {
        patientId: patientAlice.id,
        programId: programDiabetes.id,
        enrolledById: staff.id,
      },
    }),
    prisma.enrollment.create({
      data: {
        patientId: patientBob.id,
        programId: programDiabetes.id,
        enrolledById: admin.id,
      },
    }),
    prisma.enrollment.create({
      data: {
        patientId: patientCara.id,
        programId: programWellness.id,
        enrolledById: staff.id,
      },
    }),
  ]);

  // Session Attendance
  await Promise.all([
    prisma.sessionAttendance.create({
      data: {
        patientId: patientAlice.id,
        sessionId: sessionD1.id,
        attendedAt: new Date('2025-01-05T10:05:00Z'),
        status: SessionStatus.ATTENDED,
        attendanceMarkedById: staff.id,
      },
    }),
    prisma.sessionAttendance.create({
      data: {
        patientId: patientBob.id,
        sessionId: sessionD1.id,
        status: SessionStatus.MISSED,
        attendanceMarkedById: admin.id,
      },
    }),
    prisma.sessionAttendance.create({
      data: {
        patientId: patientAlice.id,
        sessionId: sessionD2.id,
        status: SessionStatus.CANCELED,
        cancelReason: 'Patient unwell',
        attendanceMarkedById: staff.id,
      },
    }),
    prisma.sessionAttendance.create({
      data: {
        patientId: patientCara.id,
        sessionId: sessionW1.id,
        attendedAt: new Date('2025-03-03T14:10:00Z'),
        status: SessionStatus.ATTENDED,
        attendanceMarkedById: staff.id,
      },
    }),
  ]);

  // Medications
  const [metformin, insulin, vitaminD] = await Promise.all([
    prisma.medication.create({
      data: { name: 'Metformin', description: 'Oral antihyperglycemic agent' },
    }),
    prisma.medication.create({
      data: { name: 'Insulin Glargine', description: 'Long-acting insulin' },
    }),
    prisma.medication.create({
      data: { name: 'Vitamin D3', description: 'Supplement' },
    }),
  ]);

  // Prescriptions
  const [rxAliceMet, rxBobInsulin, rxCaraVitD] = await Promise.all([
    prisma.prescription.create({
      data: {
        medicationId: metformin.id,
        patientId: patientAlice.id,
        dosage: '500 mg',
        frequency: MedicationFrequency.DAILY,
      },
    }),
    prisma.prescription.create({
      data: {
        medicationId: insulin.id,
        patientId: patientBob.id,
        dosage: '10 units',
        frequency: MedicationFrequency.DAILY,
      },
    }),
    prisma.prescription.create({
      data: {
        medicationId: vitaminD.id,
        patientId: patientCara.id,
        dosage: '1000 IU',
        frequency: MedicationFrequency.WEEKLY,
      },
    }),
  ]);

  // Dispense Records
  await Promise.all([
    prisma.dispenseRecord.create({
      data: {
        assignmentId: rxAliceMet.id,
        patientId: patientAlice.id,
        collectedAt: new Date('2025-01-06T09:00:00Z'),
      },
    }),
    prisma.dispenseRecord.create({
      data: {
        assignmentId: rxBobInsulin.id,
        patientId: patientBob.id,
        collectedAt: new Date('2025-02-06T09:30:00Z'),
      },
    }),
    prisma.dispenseRecord.create({
      data: {
        assignmentId: rxCaraVitD.id,
        patientId: patientCara.id,
        collectedAt: new Date('2025-03-04T11:15:00Z'),
      },
    }),
  ]);

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


