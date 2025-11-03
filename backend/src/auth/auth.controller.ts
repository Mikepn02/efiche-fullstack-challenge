import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-dto';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordDto } from './dto/forgot-password.dto';
import { ResetForgotPasswordDto } from './dto/reset-password';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { Public } from 'src/decorators/public.decorator';
import CreateAdminDto from './dto/create-admin.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const response = await this.authService.loginUser(dto);
    // If login successful and token present, set HttpOnly cookie for access token
    if (response?.status === 200 && response?.data?.token) {
      const token = response.data.token;
      const oneDayMs = 24 * 60 * 60 * 1000;
      const isProd = process.env.NODE_ENV !== 'development';
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/',
        maxAge: oneDayMs,
      });
      // Optionally avoid returning the raw token in the body
      response.data.token = undefined;
    }
    return res.status(response.status).json(response);
  }

  @Post('staff/create')
  @Roles(Role.ADMIN)
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.registerUser(dto);
    return res.status(response.status).json(response);
  }

  @Post('admin/create')
  @Public()
  async createAdmin(@Body() dto:CreateAdminDto, @Res() res: Response) {
    const response = await this.authService.createAdmin(dto);
    return res.status(response.status).json(response);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getMe(@Req() req: Request) {
    const userId = req?.user.id;
    const response = await this.authService.getLoggedInUser(userId);
    return response;
  }

  @Post('forgot-password')
  @Public()
  async initiateForgotPassword(
    @Body() dto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.forgotPassword(dto.email);
    return res.status(response.status).json(response);
  }

  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body() dto: ResetForgotPasswordDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.resetPassword(
      dto.token,
      dto.newPassword,
    );
    return res.status(response.status).json(response);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    const response = await this.authService.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
    return res.status(response.status).json(response);
  }
}
