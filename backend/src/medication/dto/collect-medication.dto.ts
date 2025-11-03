import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CollectMedicationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  assignmentId: string;
}
