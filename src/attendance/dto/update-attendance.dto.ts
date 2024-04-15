import { PartialType } from '@nestjs/mapped-types';
import { IActivity, CreateAttendanceDto } from './create-attendance.dto';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsOptional()
  activity: IActivity[];

  @IsString()
  @IsNotEmpty()
  user: User;
}
