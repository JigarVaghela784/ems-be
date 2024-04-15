import { PartialType } from '@nestjs/mapped-types';
import { CreateHolidayDto } from './create-holiday.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { HolidayStatus } from '../types/holiday.types';

export class UpdateHolidayDto extends PartialType(CreateHolidayDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  status: HolidayStatus;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  day: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
