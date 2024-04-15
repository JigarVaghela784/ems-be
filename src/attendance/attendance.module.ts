import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { Attendance } from './entities/attendance.entity';
import { HolidayModule } from '../holiday/holiday.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    UserModule,
    HolidayModule,
    LeaveModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtService],
})
export class AttendanceModule {}
