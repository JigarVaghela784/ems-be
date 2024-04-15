import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { UserService } from '../user/user.service';
import { Attendance } from './entities/attendance.entity';
import { HolidayService } from '../holiday/holiday.service';
import { LeaveService } from '../leave/leave.service';
import { LeavesStatus } from '../leave/types/leave.types';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly holidaysService: HolidayService,
    private readonly leaveService: LeaveService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.create(createAttendanceDto, req.user);
  }

  @UseGuards(UserAuthGuard)
  @Get()
  async findByUser(@Request() req) {
    const attendance = await this.attendanceService.findByUser(req.query);
    const holidays = await this.holidaysService.upcoming(req.query);
    if (req.query.userId) {
      const leave = await this.leaveService.findAll(
        req.query.userId,
        req.query,
      );
      let num = 0;
      /**
       * @TODO update with pagination
       * currently only 1st page data being fetched
       */
      const leaveList = leave.data.filter((l) => {
        if (l.status === LeavesStatus.ACTIVE) {
          num += +l.noOfDay;
        }
        return l.status === LeavesStatus.ACTIVE;
      });

      return {
        attendanceList: attendance,
        holidays,
        leave: leaveList,
        totalLeaves: num,
      };
    }
    return {
      ...attendance,
      holidays,
    };
  }

  @UseGuards(UserAuthGuard)
  @Get('all')
  findAll(@Request() req) {
    return this.attendanceService.findAll(req.query);
  }

  @UseGuards(UserAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: Attendance,
    @Request() req,
  ) {
    const user = req.user;
    return this.attendanceService.update(id, updateAttendanceDto, user);
  }

  @UseGuards(UserAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
