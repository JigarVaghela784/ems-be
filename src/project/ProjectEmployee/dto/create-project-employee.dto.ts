import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectEmployeeDto {
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
