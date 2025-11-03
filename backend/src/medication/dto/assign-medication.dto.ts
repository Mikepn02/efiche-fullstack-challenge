import { IsString, IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { MedicationFrequency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AssignMedicationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  medicationId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dosage: string;

  @IsEnum(MedicationFrequency)
  @ApiProperty()
  frequency: MedicationFrequency;
}
