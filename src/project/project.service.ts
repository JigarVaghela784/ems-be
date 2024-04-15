import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserRole } from '../user/types/user.types';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectService: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    createProjectDto.user = user;
    return await this.projectService.save(createProjectDto);
  }

  async findAll(userId, role, isQueryUserId = false) {
    const projects = await this.projectService.find({
      order: {
        name: 'ASC',
      },
      relations: {
        user: false,
        employees: {
          employee: {
            projects: {},
          },
        },
      },
      select: {
        employees: {
          employee: {
            id: true,
            name: true,
            role: true,
            profile: true,
            email: true,
            designation: true,
            workingHours: true,
            projects: true,
            employeeStatus: true,
          },
        },
      },
      where: {
        delete: false,
      },
    });

    // return project
    return projects.filter((project) => {
      return [UserRole.ADMIN, UserRole.HR].includes(role) && !isQueryUserId
        ? true
        : project.employees.find((u) => u.employeeId === userId);
    });
  }

  async findByIdAll(id) {
    return this.projectService.findOne({
      relations: {
        user: true,
        employees: {
          employee: {
            projects: {},
          },
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          role: true,
          profile: true,
          email: true,
          designation: true,
          employeeStatus: true,
        },
        employees: {
          employee: {
            id: true,
            name: true,
            role: true,
            profile: true,
            email: true,
            designation: true,
            workingHours: true,
            projects: true,
            employeeStatus: true,
          },
        },
      },
      where: {
        id,
        delete: false,
      },
    });
  }

  async update(id: string, updateProjectDto: CreateProjectDto) {
    await this.projectService.save(updateProjectDto);
    return this.findByIdAll(id);
  }

  async remove(id: string) {
    await this.projectService.save({ id, delete: true });
    return 'Delete project successfully';
  }
}
