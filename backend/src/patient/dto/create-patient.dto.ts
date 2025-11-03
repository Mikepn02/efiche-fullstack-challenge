
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Patient\'s first name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Patient\'s last name' })
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Patient\'s date of birth in ISO format' })
  dateOfBirth: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({ 
    enum: Gender, 
    description: 'Patient\'s gender',
    required: false 
  })
  gender?: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty({ 
    description: 'ID of the staff member assigned to the patient',
    required: false 
  })
  assignedToId?: string;
}