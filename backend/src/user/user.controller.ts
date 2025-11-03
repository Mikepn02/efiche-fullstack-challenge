import { Controller, Get, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import type { Response } from 'express'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(@Res() res:Response ){
     const response = await this.userService.getAllUsers();
     return res.status(response.status).json(response);
  }
}
