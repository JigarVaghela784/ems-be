import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeStatus } from 'src/user/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateUserDto) {
    const userExist = await this.userService.findByEmail(createAuthDto.email);
    if (userExist)
      throw new HttpException(`User already exist`, HttpStatus.BAD_REQUEST);
    await this.userService.create(createAuthDto);
    return 'Register success';
  }

  async login(createAuthDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createAuthDto.email);
    if (!user)
      throw new HttpException(`User dose not exist`, HttpStatus.BAD_REQUEST);
    const isPasswordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        `Email and Password do not match`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.employeeStatus !== EmployeeStatus.ACTIVE) {
      throw new HttpException(
        `Your account is not active`,
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      employeeStatus: user.employeeStatus,
    };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
