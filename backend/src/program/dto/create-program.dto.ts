
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { IsAfter, IsNotPastDate } from 'src/decorators/date.decorator';

export enum ProgramStatus {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export class CreateProgramDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @ApiProperty()
    @IsNotPastDate({ message: 'Start date cannot be in the past' })
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @ApiProperty()
    @IsAfter('startDate', { message: 'End date must be after start date' })
    @IsNotEmpty()
    endDate: string;

    @IsEnum(ProgramStatus)
    @IsNotEmpty()
    @ApiProperty()
    status: ProgramStatus;
}