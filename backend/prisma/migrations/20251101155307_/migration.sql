/*
  Warnings:

  - You are about to drop the column `dateCollected` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the `PatientSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PatientSession" DROP CONSTRAINT "PatientSession_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientSession" DROP CONSTRAINT "PatientSession_sessionId_fkey";

-- AlterTable
ALTER TABLE "public"."Prescription" DROP COLUMN "dateCollected";

-- DropTable
DROP TABLE "public"."PatientSession";

-- CreateTable
CREATE TABLE "public"."SessionAttendance" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "attendedAt" TIMESTAMP(3),
    "status" "public"."SessionStatus" NOT NULL,
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DispenseRecord" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DispenseRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SessionAttendance" ADD CONSTRAINT "SessionAttendance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionAttendance" ADD CONSTRAINT "SessionAttendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ProgramSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DispenseRecord" ADD CONSTRAINT "DispenseRecord_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DispenseRecord" ADD CONSTRAINT "DispenseRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
