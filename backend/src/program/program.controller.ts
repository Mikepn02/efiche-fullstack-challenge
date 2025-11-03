import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ProgramService } from './program.service';
import type { Request, Response } from 'express'
import { CreateProgramDto } from './dto/create-program.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('program')
@ApiTags('Program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) { }


  @Post()
  @Roles(Role.ADMIN)
  async createProgram(@Body() dto: CreateProgramDto, @Res() res: Response) {
    const response = await this.programService.createProgram(dto);
    return res.status(response.status).json(response);
  }


  @Patch(":id")
  async updateProgram(@Param('id') id: string, @Body() dto: UpdateProgramDto, @Res() res: Response) {
    const response = await this.programService.updateProgram(id, dto);
    return res.status(response.status).json(response);
  }

  @Get("/upcoming")
  @Public()
  async getAllUpcomingPrograms(@Res() res: Response) {
    const response = await this.programService.getUpcomingPrograms();
    return res.status(response.status).json(response);
  }


  @Get(":id")
  async getProgramById(@Param('id') id: string, @Res() res: Response) {
    const response = await this.programService.getProgramById(id);
    return res.status(response.status).json(response);
  }


  @Get()
  @Public()
  async getAllPrograms(@Res() res: Response) {
    const response = await this.programService.getAllPrograms();
    return res.status(response.status).json(response);
  }



}
