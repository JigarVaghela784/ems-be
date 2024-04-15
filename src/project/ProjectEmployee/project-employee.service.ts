import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectEmployeeDto } from './dto/create-project-employee.dto';
import { UpdateProjectEmployeeDto } from './dto/update-project-employee.dto';
import { UserRole, ValidRoles } from '../../user/types/user.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Project } from '../entities/project.entity';
import { ProjectEmployee } from './entities/project-employee.entity';

@Injectable()
export class ProjectEmployeeService {
  constructor(
    @InjectRepository(ProjectEmployee)
    private readonly projectEmployeeService: Repository<ProjectEmployee>,
  ) {}

  async create(createProjectDto: CreateProjectEmployeeDto, user: User) {
    const { name } = createProjectDto;
    const project = new Project();
    project.name = name;
    project.user = user;
    const data = await this.projectEmployeeService.save({
      ...createProjectDto,
      project,
    });
    return data;
  }

  findAll() {
    return this.projectEmployeeService.find();
  }

  update(
    id: string,
    updateProjectDto: UpdateProjectEmployeeDto,
    role: UserRole,
  ) {
    if (!ValidRoles.includes(role)) {
      throw new HttpException(
        'You are not authorize to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.projectEmployeeService.save({ id, ...updateProjectDto });
  }

  remove(id: string, role) {
    if (!ValidRoles.includes(role)) {
      throw new HttpException(
        'You are not authorize to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.projectEmployeeService.delete(id);
  }
}
