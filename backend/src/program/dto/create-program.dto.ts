
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

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
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @ApiProperty()
    @IsNotEmpty()
    endDate: string;

    @IsEnum(ProgramStatus)
    @IsNotEmpty()
    @ApiProperty()
    status: ProgramStatus;
}