-- AlterTable
ALTER TABLE "public"."SessionAttendance" ADD COLUMN     "attendanceMarkedById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."SessionAttendance" ADD CONSTRAINT "SessionAttendance_attendanceMarkedById_fkey" FOREIGN KEY ("attendanceMarkedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
