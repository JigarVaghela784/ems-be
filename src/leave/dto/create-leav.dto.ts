import { IsDate, IsEnum, IsString } from 'class-validator';
import { LeaveTypeList, LeavesStatus } from '../types/leave.types';

export class CreateLeavDto {
  @IsString()
  empId: string;

  @IsEnum(LeaveTypeList)
  // @IsString()
  leaveType: string;

  @IsEnum(LeavesStatus)
  // @IsString()
  status: string;

  @IsDate()
  from: string;

  @IsDate()
  to: string;

  @IsString()
  noOfDay: string;

  @IsString()
  reason: string;
}
