import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { HolidayStatus } from '../types/holiday.types';

export class CreateHolidayDto {
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
}
