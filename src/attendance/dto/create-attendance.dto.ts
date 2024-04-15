import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsOptional()
  activity: IActivity[];

  @IsString()
  @IsNotEmpty()
  user: User;

  @IsString()
  userId: string;
}

export class AttendanceList {
  @IsString()
  @IsNotEmpty()
  id: Date;

  @IsString()
  name: string;

  @IsArray()
  days: CreateAttendanceDto[];
}

export class CreateAttendanceCSVDto {
  @IsArray()
  @IsNotEmpty()
  list: AttendanceList[];
}

export interface IActivity {
  status: string;
  time: Date;
}
