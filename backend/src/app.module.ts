import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ProgramModule } from './program/program.module';
import { PatientModule } from './patient/patient.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { SessionsModule } from './sessions/sessions.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MedicationModule } from './medication/medication.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, UserModule, PrismaModule, ProgramModule, PatientModule, SessionsModule, EnrollmentsModule, MedicationModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
