import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/create-user.dto';
import ApiResponse from 'src/utils/api.response';
import { hash, compare } from 'bcryptjs';
import { LoginDto } from './dto/login-dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import config from 'src/config';
import { emailUtil } from 'src/utils/email';
import CreateAdminDto from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }


  private getAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  private getRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashed = await hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashed },
    });
  }

  private async removeRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async loginUser(dto: LoginDto) {
    try {
      const user = await this.userService.getUserByEmail(dto.email);

      if (!user) {
        return ApiResponse.fail('User not found', null, 404);
      }

      const isPasswordValid = await compare(dto.password, user.password);
      if (!isPasswordValid) {
        return ApiResponse.fail('Invalid credentials', null, 401);
      }

      const token = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '1d' },
      );

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = this.getAccessToken(payload);
      const refreshToken = this.getRefreshToken(payload);

      await this.updateRefreshTokenHash(user.id, refreshToken);

      const sanitizedUser = {
        ...user,
        password: undefined,
        resetToken: undefined,
        resetTokenExpiry: undefined,
        hashedRefreshToken: undefined,
      };

      return ApiResponse.success(
        'Login successful',
        { accessToken, refreshToken, user: sanitizedUser },
        200,
      );
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }

async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.getUserById(decoded.id);
      if (!user || !user.hashedRefreshToken)
        return ApiResponse.fail('Unauthorized', null, 401);

      const isValid = await compare(refreshToken, user.hashedRefreshToken);
      if (!isValid) return ApiResponse.fail('Invalid refresh token', null, 403);

      const newAccessToken = this.getAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = this.getRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      await this.updateRefreshTokenHash(user.id, newRefreshToken);

      return ApiResponse.success('Token refreshed', {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return ApiResponse.fail('Invalid or expired refresh token', null, 403);
    }
  }

  async logout(userId: string) {
    await this.removeRefreshToken(userId);
    return ApiResponse.success('Logged out successfully', null);
  }


  async registerUser(dto: RegisterDto) {
    try {
      const hashedPassword = await hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: { ...dto, password: hashedPassword, role: 'STAFF' },
      });
      return ApiResponse.success('User registered successfully', user, 201);
    } catch (error: any) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    try {
      if (dto.adminCreateCode !== config().app.adminCreationCode)
        return ApiResponse.fail('Unauthorized action', 401);

      const hashedPassword = await hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: { ...dto, password: hashedPassword, role: 'ADMIN' },
      });
      return ApiResponse.success('Admin created', user, 201);
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }


  async getLoggedInUser(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return ApiResponse.fail('User not found', null, 404);
      }
      return ApiResponse.success('User retrieved successfully', user);
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) return ApiResponse.fail('User not found!', null, 404);

      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600 * 1000);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      const resetLink = `${config().app.url}/auth/reset-password?token=${resetToken}`;
      const emailSent = emailUtil.sendPasswordResetEmail(user.email, resetLink);

      if (!emailSent)
        return ApiResponse.fail('Failed to send reset email', null, 500);
      return ApiResponse.success(
        'Password reset email sent. Check your inbox.',
        null,
      );
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
      });

      console.log('Here is the user found: ', user);
      if (!user)
        return ApiResponse.fail('Invalid or expired reset token', null, 400);
      const hashedPassword = await hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
          password: hashedPassword,
        },
      });

      return ApiResponse.success('Password reset successfully', null);
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) return ApiResponse.fail('User not found', null, 404);

      const isOldPasswordValid = await compare(oldPassword, user.password);
      if (!isOldPasswordValid)
        return ApiResponse.fail('Old Password Incorrect', null, 401);

      const hashedPassword = await hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return ApiResponse.success('Password Changed Successfully', null, 200);
    } catch (error) {
      return ApiResponse.fail('Internal server error', error.message || error);
    }
  }
}
