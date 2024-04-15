import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { UserService } from '../user/user.service';
import { areArraysOfObjectsEqual, formatCustomDate } from '../helper';
import { ValidRoles } from '../user/types/user.types';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceService: Repository<Attendance>,
    private readonly userService: UserService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, loginUser: User) {
    try {
      const { date, activity, userId } = createAttendanceDto;
      const { id: loginUserId, role: loginRole } = loginUser;
      const userIdValue = userId || loginUserId;
      const user = await this.userService.findOne(userIdValue);
      const attendance = new Attendance();
      attendance.date = date;
      attendance.activity = activity;
      attendance.user = user;
      attendance.userId = userIdValue;

      const isSame =
        formatCustomDate(new Date(activity[0].time)) ===
        formatCustomDate(new Date());

      if (ValidRoles.includes(loginRole)) {
        return await this.attendanceService.save(attendance);
      }

      if (!activity) {
        throw new HttpException(
          'Incorrect query params value. activity key missing.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (activity && activity.length > 1) {
        throw new HttpException(
          'Incorrect activity value. Only one entry valid.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!isSame) {
        throw new HttpException(
          'Activity time not valid',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.attendanceService.save(attendance);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Entry already exist', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Something went wrong please try again',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findByUser(query) {
    const { userId, startDate, endDate } = query;
    const date = new Date();
    const dateStart = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), 1),
    );
    try {
      const startingDate = startDate
        ? new Date(startDate.replace(' ', '+'))
        : new Date(dateStart);
      const endingDate = endDate
        ? new Date(endDate.replace(' ', '+'))
        : new Date();
      const sortData = await this.attendanceService.find({
        where: {
          userId,
          date: Between(startingDate, endingDate),
        },
        relations: {
          user: !userId,
        },
        order: {
          date: 'DESC',
        },
      });

      if (userId) {
        return sortData;
      } else {
        const attendanceUserList = {
          startDate: startingDate,
          endDate: endingDate,
        };
        sortData.forEach((data) => {
          const objectVal = {
            id: data.id,
            date: data.date,
            activity: data.activity,
          };
          if (attendanceUserList[data.userId]) {
            attendanceUserList[data.userId] = {
              ...attendanceUserList[data.userId],
              attendance: [
                ...attendanceUserList[data.userId].attendance,
                objectVal,
              ],
            };
          } else {
            attendanceUserList[data.userId] = {
              userId: data.userId,
              user: data.user,
              attendance: [objectVal],
            };
          }
        });
        return {
          userList: attendanceUserList,
          startDate: startingDate,
          endDate: endingDate,
        };
      }
    } catch (e) {
      throw new HttpException(
        'Incorrect query params value.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query) {
    const { id } = query;
    return await this.attendanceService.find({
      where: {
        userId: id,
      },
    });
  }

  async findOne(id) {
    return await this.attendanceService.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateAttendanceDto: Attendance, user) {
    const dbAttendance = await this.findOne(id);
    if (ValidRoles.includes(user.role)) {
      return await this.attendanceService.save({
        id,
        ...updateAttendanceDto,
      });
    }

    const activity = updateAttendanceDto.activity;
    if (!activity) {
      throw new HttpException(
        'Incorrect query params value. activity key missing.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const copyActivity = [...activity];
    copyActivity.pop();
    const isPrevObjSame = areArraysOfObjectsEqual(
      copyActivity,
      dbAttendance.activity,
    );
    if (!isPrevObjSame) {
      throw new HttpException(
        "Incorrect previous 'PUNCH IN' and 'PUNCH OUT' activity.",
        HttpStatus.BAD_REQUEST,
      );
    }
    const isSame =
      formatCustomDate(new Date(activity[activity.length - 1].time)) ===
      formatCustomDate(new Date());
    if (!isSame) {
      throw new HttpException(
        'Your last activity time not valid. Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.attendanceService.save({
      id,
      ...updateAttendanceDto,
    });
  }

  async remove(id: string) {
    return await this.attendanceService.delete(id);
  }
}
