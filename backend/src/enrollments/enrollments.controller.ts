import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Enroll a patient in a program' })
  @ApiResponse({ status: 201, description: 'Patient enrolled successfully' })
  @ApiResponse({ status: 404, description: 'Patient or program not found' })
  @ApiResponse({ status: 409, description: 'Patient is already enrolled in this program' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async enrollPatient(@Body() dto: CreateEnrollmentDto, @Req() req: Request, @Res() res: Response) {
    const userId = req.user.id
    const response = await this.enrollmentsService.enrollPatient(userId,dto);
    return res.status(response.status).json(response);
  }

   @Get()
  @ApiOperation({ summary: 'Get all enrolled patients in a program' })
  @ApiResponse({ status: 200, description: 'Retrieved enrolled patients successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEnrollments(
    @Res() res: Response,
    @Req() req: Request
  ) {
    const userId = req.user.id;
    const response = await this.enrollmentsService.getAllEnrollments(userId);
    return res.status(response.status).json(response);
  }

  @Get('program/:programId')
  @ApiOperation({ summary: 'Get all enrolled patients in a program' })
  @ApiResponse({ status: 200, description: 'Retrieved enrolled patients successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEnrolledPatientsInProgram(
    @Param('programId') programId: string,
    @Res() res: Response,
  ) {
    const response = await this.enrollmentsService.getEnrolledPatientsInProgram(programId);
    return res.status(response.status).json(response);
  }
}
