import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Name of the medication' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Brief description of the medication' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
