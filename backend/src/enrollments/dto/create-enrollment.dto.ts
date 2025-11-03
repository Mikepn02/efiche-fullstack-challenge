import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the patient to be enrolled' })
  patientId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the program to enroll in' })
  programId: string;

}
