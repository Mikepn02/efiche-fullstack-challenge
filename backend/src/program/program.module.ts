import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { ProgramStatusCron } from './program-status.cron';

@Module({
  controllers: [ProgramController],
  providers: [ProgramService,ProgramStatusCron]
})
export class ProgramModule {}
