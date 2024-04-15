import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectEmployeeService } from './project-employee.service';
import { CreateProjectEmployeeDto } from './dto/create-project-employee.dto';
import { UpdateProjectEmployeeDto } from './dto/update-project-employee.dto';
import { UserAuthGuard } from '../../user/user-auth.guard';
import { UserService } from '../../user/user.service';

@Controller('project')
export class ProjectEmployeeController {
  constructor(
    private readonly userService: UserService,
    private readonly projectEmployeeService: ProjectEmployeeService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('add')
  async create(
    @Request() req,
    @Body() createProjectDto: CreateProjectEmployeeDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
    return this.projectEmployeeService.create(
      {
        ...createProjectDto,
      },
      user,
    );
  }

  @UseGuards(UserAuthGuard)
  @Get()
  findAll() {
    return this.projectEmployeeService.findAll();
  }

  @UseGuards(UserAuthGuard)
  @Patch('edit')
  update(@Request() req, @Body() updateProjectDto: UpdateProjectEmployeeDto) {
    const role = req.user.role;
    return this.projectEmployeeService.update(
      updateProjectDto.id,
      updateProjectDto,
      role,
    );
  }
}
