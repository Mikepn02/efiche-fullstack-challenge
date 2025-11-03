import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum SessionStatus {
    ATTENDED = 'ATTENDED',
    MISSED = 'MISSED',
    CANCELED = 'CANCELED',
}

export class CreateSessionAttendanceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    sessionId: string;

   

    @IsEnum(SessionStatus)
    @IsNotEmpty()
    @ApiProperty({ enum: SessionStatus })
    status: SessionStatus;
}