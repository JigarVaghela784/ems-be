import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmployeeStatus, ValidRoles, WorkingDays } from './types/user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.profile = createUserDto.profile;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.joiningDate = new Date();
    return this.userService.save(user);
  }

  async findOne(id: string) {
    try {
      const user = await this.userService.findOne({ where: { id } });
      delete user.password;
      user.workingDays = user.workingDays || WorkingDays;
      return user;
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  async findUserEvent(data) {
    try {
      const today = new Date(data);
      const day = today.getDate();
      const month = today.getMonth() + 1;

      return this.userService
        .createQueryBuilder('user')
        .select([
          'user.email',
          'user.name',
          'user.phone',
          'user.joiningDate',
          'user.department',
          'user.designation',
          'user.dob',
          'user.role',
          'user.profile',
          'user.id',
        ])
        .where(
          `EXTRACT(DAY FROM user.dob) = :day AND EXTRACT(MONTH FROM user.dob) = :month`,
          { day, month },
        )
        .orWhere(
          `EXTRACT(DAY FROM user.joining_date) = :day AND EXTRACT(MONTH FROM user.joining_date) = :month`,
          { day, month },
        )
        .andWhere(`user.employeeStatus = :status`, { status: 'active' })
        .getMany();
    } catch (err) {
      console.log(err, 'err*-*****');
      throw new NotFoundException('User Not Found');
    }
  }

  async findSingleUser(id) {
    try {
      const user = (await this.userService.findOne({
        where: {
          id: id,
        },
      })) as UpdateUserDto;
      delete user.password;
      return user;
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  async allUser(role, query) {
    const {
      page = 1,
      pageSize = 10,
      employeeStatus = 'active',
      employeeName = '',
      department = '',
    } = query;
    let data = [];
    let totalData = 0;
    const where = {
      employeeStatus,
      name: undefined,
      department: undefined,
    };
    if (employeeName) {
      where.name = ILike(`%${employeeName}%`);
    }
    if (department) {
      where.department = department;
    }
    if (!ValidRoles.includes(role)) {
      try {
        const [user, total] = await this.userService.findAndCount({
          where,
          take: pageSize,
          skip: (page - 1) * pageSize,
          select: {
            projects: {
              project: {
                name: true,
                id: true,
              },
            },
          },
          order: {
            name: 'ASC',
          },
          relations: {
            projects: true,
          },
        });
        totalData = total;
        data = user.map((d) => {
          return {
            id: d.id,
            email: d.email,
            name: d.name,
            joiningDate: d.joiningDate,
            department: d.department,
            designation: d.designation,
            role: d.role,
            employeeStatus: d.employeeStatus,
            profile: d.profile,
            workingHours: d.workingHours,
            workingDays: d.workingDays || WorkingDays,
            phone: d.phone,
            dob: d.dob,
          };
        });
      } catch {
        throw new NotFoundException('User Not Found');
      }
    }

    try {
      if (ValidRoles.includes(role)) {
        const [user, total] = await this.userService.findAndCount({
          take: pageSize,
          skip: (page - 1) * pageSize,
          where,
          select: {
            projects: {
              project: {
                name: true,
                id: true,
              },
            },
          },
          order: {
            name: 'ASC',
          },
          relations: {
            projects: true,
          },
        });
        totalData = total;
        data = user.map((d) => {
          delete d.password;
          d.workingDays = d.workingDays || WorkingDays;
          return d;
        });
      }
      return {
        data: data,
        meta: {
          total: totalData,
          page: +page,
          pageSize,
        },
        employeeStatus,
      };
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  findByEmail(email: string) {
    return this.userService.findOne({ where: { email } });
  }

  async update(updateUserDto: UpdateUserDto, updateUserId: string, role: any) {
    let id = updateUserId;
    if (ValidRoles.includes(role)) {
      id = updateUserDto.id;
    }
    const user: User = await this.userService.findOne({ where: { id } });
    if (updateUserDto?.password) {
      const isPasswordMatch = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new HttpException(
          `Current password is Incorrect`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        delete updateUserDto?.currentPassword;
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
    }

    if (user.role !== updateUserDto.role && !ValidRoles.includes(role)) {
      updateUserDto.role = user.role;
    }

    return this.userService.save({
      id,
      ...updateUserDto,
    });
  }

  async remove(id: string, role) {
    const user = await this.userService.findOne({ where: { id } });

    if (!user && role) {
      throw new NotFoundException('User Not Found');
    }
    user.employeeStatus = EmployeeStatus.DEACTIVATED;
    return this.userService.save(user);
  }
}
