import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // What is require role?
    const publicRole = this.reflector.getAllAndOverride('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    const othereRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Extracting user object from request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Does the current user making the request have those required roles?
    if (publicRole) return true;

    const decodedToken = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (!(othereRoles || []).includes(decodedToken.role)) {
      throw new UnauthorizedException('You dont have access to this route');
    }

    if (decodedToken === 'admin' || 'student')
      return othereRoles.some((role) => decodedToken.role.includes(role));
  }
}
