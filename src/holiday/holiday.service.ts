import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { UserRole, ValidRoles } from '../user/types/user.types';
import { Holiday } from './entities/holiday.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayService: Repository<Holiday>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto, user: User, role: UserRole) {
    if (!ValidRoles.includes(role)) {
      throw new HttpException(
        'You are not authorize to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { title, date, day, status } = createHolidayDto;
    const holiday = new Holiday();
    holiday.title = title;
    holiday.status = status;
    holiday.day = day;
    holiday.date = date;
    holiday.user = user;
    const data = await this.holidayService.save(holiday);
    delete data.user;
    return data;
  }

  async findAll(query) {
    const { page = 1, pageSize = 10 } = query;

    const [data, total] = await this.holidayService.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: false,
      },
      order: {
        date: 'ASC',
      },
    });

    return {
      data,
      meta: {
        total,
        page: +page,
        pageSize: +pageSize,
      },
    };
  }

  upcoming(query) {
    const startingDate = query?.startDate
      ? new Date(query?.startDate)
      : new Date(new Date().setUTCHours(0, 0, 0, 0));
    const endingDate = query?.endDate
      ? new Date(query?.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 30));
    return this.holidayService.find({
      relations: {
        user: false,
      },
      where: {
        date: Between(startingDate, endingDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  update(id: string, updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.save({ id, ...updateHolidayDto });
  }

  remove(id: string, role) {
    if (!ValidRoles.includes(role)) {
      throw new HttpException(
        'You are not authorize to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.holidayService.delete(id);
  }
}
