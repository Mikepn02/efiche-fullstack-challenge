import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProgramStatusCron {
  private readonly logger = new Logger(ProgramStatusCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateProgramStatuses() {
    const now = new Date();
    this.logger.log('Checking and updating program statuses...');

  
    await this.prisma.program.updateMany({
      where: {
        endDate: { lt: now },
        status: { not: 'COMPLETED' },
      },
      data: { status: 'COMPLETED' },
    });

    // Mark ACTIVE
    await this.prisma.program.updateMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: { not: 'ONGOING' },
      },
      data: { status: 'ONGOING' },
    });

    await this.prisma.program.updateMany({
      where: {
        startDate: { gt: now },
        status: { not: 'UPCOMING' },
      },
      data: { status: 'UPCOMING' },
    });

    this.logger.log('Program statuses updated.');
  }
}
