import { PartialType } from '@nestjs/mapped-types';
import { CreateLeavDto } from './create-leav.dto';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { LeaveTypeList, LeavesStatus } from '../types/leave.types';

export class UpdateLeavDto extends PartialType(CreateLeavDto) {
  @IsEnum(LeaveTypeList)
  @IsString()
  leaveType: string;

  @IsEnum(LeavesStatus)
  @IsString()
  status: string;

  @IsDate()
  from: string;

  @IsDate()
  to: string;

  @IsString()
  noOfDay: string;

  @IsString()
  reason: string;

  @IsString()
  id: string;
}
