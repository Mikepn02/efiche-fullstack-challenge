import { Body, Controller, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import type { Response, Request } from 'express';
import { CreateSessionDto } from './dto/create-session.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSessionAttendanceDto } from './dto/create-patient-session.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Post('program')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new program session' })
  @ApiResponse({ status: 201, description: 'Program session created successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createProgramSession(@Body() dto: CreateSessionDto, @Res() res: Response) {
    console.log(dto)
    const response = await this.sessionsService.createProgramSession(dto);
    return res.status(response.status).json(response);
  }

  @Post('program/bulk')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create multiple program sessions in bulk' })
  @ApiResponse({ status: 201, description: 'Program sessions created successfully' })
  @ApiResponse({ status: 400, description: 'No sessions provided' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createProgramSessionsBulk(@Body() dtos: CreateSessionDto[], @Res() res: Response) {
    const response = await this.sessionsService.createProgramSessionsBulk(dtos);
    return res.status(response.status).json(response);
  }

  @Get()
  async getAllProgramSessions(@Res() res: Response) {
    const response = await this.sessionsService.getAllProgramSessions();
    return res.status(response.status).json(response);
  }

  @Post('patient')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new patient session' })
  @ApiResponse({ status: 201, description: 'Patient session created successfully' })
  @ApiResponse({ status: 404, description: 'Patient or session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPatientSession(@Body() dto: CreateSessionAttendanceDto, @Req() req: Request, @Res() res: Response) {
    const userId = req.user.id
    const response = await this.sessionsService.recordAttendance(userId, dto);
    return res.status(response.status).json(response);
  }

  @Get('patient')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Create a new patient session' })
  @ApiResponse({ status: 200, description: 'Get All Patient Attendances' })
  @ApiResponse({ status: 404, description: 'Patient or session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAttendances(@Res() res: Response) {
    const response = await this.sessionsService.getAllSessionAttendance();
    return res.status(response.status).json(response);
  }

  @Get('program/:programId')
  @ApiOperation({ summary: 'Get all sessions for a specific program' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProgramSessions(@Param('programId') programId: string, @Res() res: Response) {
    const response = await this.sessionsService.getProgramSessions(programId);
    return res.status(response.status).json(response);
  }

  @Patch('cancel/:sessionId')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Cancel Patient Session' })
  @ApiResponse({ status: 200, description: 'Session cancelled successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async cancelSession(@Param('sessionId') sessionId: string, @Body() reason: string, @Res() res: Response) {
    const response = await this.sessionsService.cancelSession(sessionId, reason);
    return res.status(response.status).json(response);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get a specific session by ID' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSessionById(@Param('sessionId') sessionId: string, @Res() res: Response) {
    const response = await this.sessionsService.getSesssionById(sessionId);
    return res.status(response.status).json(response);
  }



  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all sessions attended by a specific patient' })
  @ApiResponse({ status: 200, description: 'Patient sessions retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPatientSessions(@Param('patientId') patientId: string, @Res() res: Response) {
    const response = await this.sessionsService.getPatientAttendedSessions(patientId);
    return res.status(response.status).json(response);
  }
}
