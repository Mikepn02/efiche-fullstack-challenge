import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';

@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPatient(@Body() dto: CreatePatientDto, @Res() res: Response) {
    const response = await this.patientService.createPatient(dto);
    return res.status(response.status).json(response);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'Retrieved all patients successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllPatients(@Res() res: Response) {
    const response = await this.patientService.getAllPatients();
    return res.status(response.status).json(response);
  }

  @Get(':patientId')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPatientById(@Param('patientId') patientId: string, @Res() res: Response) {
    const response = await this.patientService.getPatientById(patientId);
    return res.status(response.status).json(response);
  }

  @Get('assigned-to/:assignedToId')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get patients assigned to a specific staff/user' })
  @ApiResponse({ status: 200, description: 'Retrieved patients successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPatientsAssignedTo(@Param('assignedToId') assignedToId: string, @Res() res: Response) {
    const response = await this.patientService.getPatientAssignedTo(assignedToId);
    return res.status(response.status).json(response);
  }
}
