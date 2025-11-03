import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { IsNotPastDate } from 'src/decorators/date.decorator';

export enum SessionType {
    ONE_ON_ONE = 'ONE_ON_ONE',
    GROUP = 'GROUP',
    CONSULTATION = 'CONSULTATION',
}

export enum SessionFrequency {
    ONCE = 'ONCE',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export class CreateSessionDto {
    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    programId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ enum: SessionFrequency, required: false, default: SessionFrequency.ONCE })
    @IsEnum(SessionFrequency)
    @IsOptional()
    frequency?: SessionFrequency = SessionFrequency.ONCE;

    @ApiProperty({ enum: SessionType })
    @IsEnum(SessionType)
    @IsNotEmpty()
    sessionType: SessionType;
}