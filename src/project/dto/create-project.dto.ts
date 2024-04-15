import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProjectEmployee } from '../ProjectEmployee/entities/project-employee.entity';
import { User } from '../../user/entities/user.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  delete: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  weeklyHours: string;

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @IsDate()
  @IsNotEmpty()
  deadlineDate: Date;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  employees: ProjectEmployee[];

  @IsNotEmpty()
  user: User;
}
