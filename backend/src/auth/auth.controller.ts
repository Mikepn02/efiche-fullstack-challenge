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
import config from 'src/config';


const getCookieOptions = () => {
  // Cookie auth deprecated in favor of Authorization headers
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    path: '/',
  };
};

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const response = await this.authService.loginUser(dto);
    return res.status(response.status).json(response);
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() req: Request, @Res() res: Response) {
    let refreshToken: string | undefined;
 
    if (!refreshToken) {
      const headerToken = (req.headers['x-refresh-token'] || req.headers['authorization']) as string | undefined;
      if (headerToken?.toLowerCase().startsWith('bearer ')) {
        refreshToken = headerToken.slice(7);
      } else if (headerToken) {
        refreshToken = headerToken;
      }
    }
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token found' });

    const result = await this.authService.refreshAccessToken(refreshToken);
    if (result.status !== 200)
      return res.status(result.status).json(result);

    const { accessToken, refreshToken: newRefreshToken } = result.data;
    return res.status(200).json({ message: 'Token refreshed successfully', data: { accessToken, refreshToken: newRefreshToken } });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const userId = req.user?.id;
    if (userId) await this.authService.logout(userId);

    return res.status(200).json({ message: 'Logged out successfully' });
  }


  @Post('staff/create')
  @Roles(Role.ADMIN)
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.registerUser(dto);
    return res.status(response.status).json(response);
  }

  @Post('admin/create')
  @Public()
  async createAdmin(@Body() dto: CreateAdminDto, @Res() res: Response) {
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
