import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { EmployeeStatus, EXPERINCES, UserRole } from '../types/user.types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email?: string;
  name?: string;
  password?: string;
  currentPassword?: string;
  phone?: string;
  age?: string;
  joiningDate?: Date;
  department?: string;
  designation?: string;
  gender?: string;
  state?: string;
  country?: string;
  address?: string;
  dob?: Date;
  experiences?: EXPERINCES[];
  role: UserRole;
  employeeStatus?: EmployeeStatus;
  bankName?: string;
  ACNumber?: string;
  ifsc?: string;
  panNo?: string;
  profile?: string;
  id?: string;
  workingHours: number;
  workingDays: string[];
  contractStart: Date;
  contractEnd: Date;
}
