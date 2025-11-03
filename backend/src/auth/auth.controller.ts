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

    if (response?.status === 200 && response?.data?.accessToken) {
      const { accessToken, refreshToken } = response.data;

      const isProd = config().app.node_env === 'production';
      const cookieDomain = isProd ? '.vercel.app' : 'localhost';

       console.log(isProd);
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
        path: '/',
        domain: cookieDomain,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
        path: '/',
        domain: cookieDomain,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });



      delete response.data.accessToken;
      delete response.data.refreshToken;
    }

    return res.status(response.status).json(response);
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token found' });

    const result = await this.authService.refreshAccessToken(refreshToken);
    if (result.status !== 200)
      return res.status(result.status).json(result);

    const { accessToken, refreshToken: newRefreshToken } = result.data;


    const isProd = config().app.node_env === 'production';
    const cookieDomain = isProd ? '.efiche-fullstack-challenge.vercel.app/auth/sign-in' : 'localhost';

    console.log(config().app.node_env);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'none',
      path: '/',
      domain: cookieDomain,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'none',
      path: '/',
      domain: cookieDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(200).json({ message: 'Token refreshed successfully' });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const userId = req.user?.id;
    if (userId) await this.authService.logout(userId);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
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
