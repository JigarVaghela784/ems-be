import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EmployeeStatus } from './types/user.types';
import { UserService } from './user.service';
import { CurrentUserService } from '../helper/current-user.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const userInfo = await this.jwtService.verifyAsync(token, {
        secret: 'test@123',
      });

      if (!request.route.methods.get) {
        const loginUser = await this.userService.findOne(userInfo.id);
        if (loginUser.employeeStatus === EmployeeStatus.ACTIVE) {
          if (userInfo.role === loginUser.role) {
            request['user'] = loginUser;
            CurrentUserService.setUser(loginUser);
          } else {
            throw new UnauthorizedException();
          }
        } else {
          throw new UnauthorizedException();
        }
      } else {
        request['user'] = userInfo;
      }
    } catch (err) {
      console.log('@@@@@@', err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
