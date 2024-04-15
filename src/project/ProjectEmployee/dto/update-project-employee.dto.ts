import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectEmployeeDto } from './create-project-employee.dto';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProjectEmployeeDto extends PartialType(
  CreateProjectEmployeeDto,
) {
  @IsString()
  @IsNotEmpty()
  id: string;

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
}
