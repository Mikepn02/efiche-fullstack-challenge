import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { AssignMedicationDto } from './dto/assign-medication.dto';
import { CollectMedicationDto } from './dto/collect-medication.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import { CreateMedicationDto } from './dto/create-medication.dto';

@ApiTags('Medications')
@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) { }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new medication' })
  @ApiResponse({ status: 201, description: 'Medication created successfully' })
  @ApiResponse({ status: 409, description: 'Medication already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createMedication(
    @Body() dto: CreateMedicationDto,
    @Res() res: Response,
  ) {
    const response = await this.medicationService.createMedication(dto);
    return res.status(response.status).json(response);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create multiple medications at once' })
  @ApiResponse({ status: 201, description: 'Medications created successfully' })
  async createManyMedications(@Body() dtos: CreateMedicationDto[], @Res() res: Response) {
    const response = await this.medicationService.createManyMedications(dtos);
    return res.status(response.status).json(response);
  }


  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get all medications' })
  @ApiResponse({ status: 200, description: 'Medications retrieved successfully' })
  async getAllMedications(@Res() res: Response) {
    const response = await this.medicationService.getAllMedications();
    return res.status(response.status).json(response);
  }

  @Post('patient/prescribe')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Prescribe a medication to a patient' })
  @ApiResponse({ status: 201, description: 'Medication prescribed successfully' })
  @ApiResponse({ status: 404, description: 'Patient or medication not found' })
  @ApiResponse({ status: 409, description: 'Medication already prescribed to this patient' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async prescribePatient(
    @Body() dto: AssignMedicationDto,
    @Res() res: Response,
  ) {
    const response = await this.medicationService.prescribePatient(dto);
    return res.status(response.status).json(response);
  }

  @Get('prescriptions')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Retrieve all prescriptions' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listAllPrescriptions(@Res() res: Response) {
    const response = await this.medicationService.listAllPrescriptions();
    return res.status(response.status).json(response);
  }


  @Post('patient/dispense')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Record medication dispensing to a patient' })
  @ApiResponse({ status: 201, description: 'Dispense record created successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 409, description: 'Medication already dispensed for this period' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async recordDispensing(
    @Body() dto: CollectMedicationDto,
    @Res() res: Response,
  ) {
    const response = await this.medicationService.recordDispensing(dto);
    return res.status(response.status).json(response);
  }

  @Get('dispense/history')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Retrieve medication dispensing history' })
  @ApiResponse({ status: 200, description: 'Dispense history retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listDispensingHistory(@Res() res: Response) {
    const response = await this.medicationService.listDispingHistory();
    return res.status(response.status).json(response);
  }
}
