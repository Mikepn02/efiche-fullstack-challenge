import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    // Try Authorization header first; fallback to cookie named access_token
    let token: string | undefined;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader: string | undefined = request.headers?.cookie;
      if (cookieHeader) {
        // Minimal cookie parsing to find access_token
        const cookies = cookieHeader.split(';').map((c) => c.trim());
        for (const c of cookies) {
          if (c.startsWith('access_token=')) {
            token = decodeURIComponent(c.substring('access_token='.length));
            break;
          }
        }
      }
    }

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request.user = decoded;

      // const user = await this.authService.validateUserById(decoded.id);
      // if (!user) throw new UnauthorizedException('User not found or inactive');

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
