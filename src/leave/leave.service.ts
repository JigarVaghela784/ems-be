import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateLeavDto } from './dto/create-leav.dto';
import { UpdateLeavDto } from './dto/update-leav.dto';
import { Leave } from './entities/leave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { format } from 'date-fns';
import { UserService } from '../user/user.service';
import { UserRole, ValidRoles } from '../user/types/user.types';
import { User } from '../user/entities/user.entity';
import { ProjectService } from '../project/project.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { editAccessRoles } from './helper';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { LeavesStatus } from './types/leave.types';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private readonly leavesService: Repository<Leave>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async create(createLeafDto: CreateLeavDto, user: User) {
    const leaves: Leave = new Leave();

    const { leaveType, status, from, to, noOfDay, reason } = createLeafDto;
    leaves.leaveType = leaveType;
    leaves.status = status;
    leaves.from = from;
    leaves.to = to;
    leaves.noOfDay = noOfDay;
    leaves.reason = reason;
    try {
      leaves.user = user;
      return this.leavesService.save(leaves);
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  async findTeamUser(loginUser: UpdateUserDto, query) {
    const { startDate: startingDate, endDate: endingDate } = query;
    const loginRole = loginUser.role as UserRole;
    const allLeaves = await this.leavesService.find({
      relations: {
        user: true,
      },
      order: {
        from: 'DESC',
      },
      where: [
        {
          to: Between(startingDate, endingDate),
        },
        {
          from: Between(startingDate, endingDate),
        },
      ],
    });

    const projects = await this.projectService.findAll(loginUser.id, loginRole);

    const userEditable = [];
    projects.forEach((d) => {
      const loginUserData = d.employees.find(
        (e) => e.employeeId === loginUser.id,
      ) || { role: '' };
      const editableRoles = editAccessRoles(loginUserData?.role || '');
      d.employees.forEach((emp) => {
        if (editableRoles.includes(<any>emp.role)) {
          if (
            !userEditable.includes(emp.employeeId) &&
            emp.employeeId !== loginUser.id
          ) {
            userEditable.push(emp.employeeId);
          }
        }
      });
    });

    return allLeaves.map((leave) => {
      if (
        userEditable.includes(leave.user.id) ||
        ([UserRole.ADMIN, UserRole.HR] as UserRole[]).includes(loginRole)
      ) {
        return { ...leave, isEditable: true };
      }
      return leave;
    });
  }

  async findAllUserLeaves(role: UserRole, query) {
    const {
      page = 1,
      pageSize = 10,
      status = 'active' as LeavesStatus,
      leaveType,
      from,
      to,
      employeeName,
    } = query;

    const MoreThanOrEqualDate = (date: Date) =>
      MoreThanOrEqual(format(new Date(date), 'yyyy-MM-dd'));
    const LessThanOrEqualDate = (date: Date) =>
      LessThanOrEqual(format(new Date(date), 'yyyy-MM-dd'));

    if (ValidRoles.includes(role)) {
      const where: FindOptionsWhere<Leave>[] | FindOptionsWhere<Leave> = [];
      const defaultObj: FindOptionsWhere<Leave> = { status };
      if (leaveType) {
        defaultObj.leaveType = leaveType;
      }
      if (employeeName) {
        defaultObj.user = {
          name: ILike(`%${employeeName}%`),
        };
      }
      if (from) {
        const obj = {
          from: LessThanOrEqualDate(from),
          to: MoreThanOrEqualDate(from),
          ...defaultObj,
        };
        where.push(obj);
      }
      if (to) {
        const obj = {
          from: MoreThanOrEqualDate(to),
          to: LessThanOrEqualDate(to),
          ...defaultObj,
        };
        where.push(obj);
      }

      if (!from && !to) {
        where.push({ ...defaultObj });
      }

      const [data, totalCount] = await this.leavesService.findAndCount({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        relations: {
          user: true,
        },
        order: {
          from: 'DESC',
        },
      });
      return {
        data: data,
        meta: {
          total: totalCount,
          page: +page,
          pageSize,
        },
      };
    } else {
      throw new ServiceUnavailableException('Permission access denied');
    }
  }

  async findAll(userId: string, query) {
    const {
      page = 1,
      pageSize = 10,
      status = 'active',
      leaveType,
      from: fromDate,
      to: toDate,
      startDate,
      endDate,
      userId: urlUserId,
    } = query;

    const MoreThanOrEqualDate = (date: Date) =>
      MoreThanOrEqual(format(new Date(date), 'yyyy-MM-dd'));
    const LessThanOrEqualDate = (date: Date) =>
      LessThanOrEqual(format(new Date(date), 'yyyy-MM-dd'));

    const id = urlUserId || userId;

    const from = fromDate || startDate;
    const to = toDate || endDate;

    const where: FindOptionsWhere<Leave>[] | FindOptionsWhere<Leave> = [];
    const defaultObj: FindOptionsWhere<Leave> = {
      user: {
        id,
      },
      status,
    };

    if (leaveType) {
      defaultObj.leaveType = leaveType;
    }

    if (from) {
      const obj = {
        from: LessThanOrEqualDate(from),
        to: MoreThanOrEqualDate(from),
        ...defaultObj,
      };
      where.push(obj);
    }
    if (to) {
      const obj = {
        from: MoreThanOrEqualDate(to),
        to: LessThanOrEqualDate(to),
        ...defaultObj,
      };
      where.push(obj);
    }

    if (!from && !to) {
      where.push({ ...defaultObj });
    }

    const [data, total] = await this.leavesService.findAndCount({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: true,
      },
      order: {
        from: 'DESC',
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
      },
    };
  }

  async findOne(userId: string, role: UserRole) {
    if (ValidRoles.includes(role)) {
      return this.leavesService.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });
    } else {
      return [];
    }
  }

  async update(id: string, updateLeafDto: UpdateLeavDto) {
    const leaves: Leave = new Leave();
    try {
      delete updateLeafDto.empId;
      return this.leavesService.save({ id, ...updateLeafDto, ...leaves });
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  remove(id: string) {
    return this.leavesService.delete(id);
  }
}
