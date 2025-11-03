
import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export enum ProgramStatus {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export class UpdateProgramDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsEnum(ProgramStatus)
    @IsNotEmpty()
    status: ProgramStatus;
}