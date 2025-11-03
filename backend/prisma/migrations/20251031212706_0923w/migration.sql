/*
  Warnings:

  - You are about to drop the column `enrolledAt` on the `PatientSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PatientSession" DROP COLUMN "enrolledAt",
ADD COLUMN     "attendedAt" TIMESTAMP(3);
