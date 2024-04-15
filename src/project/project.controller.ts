import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { UserService } from '../user/user.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('add')
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
    return this.projectService.create(
      {
        ...createProjectDto,
      },
      user,
    );
  }

  @UseGuards(UserAuthGuard)
  @Get()
  findAll(@Request() req, @Query() query) {
    const user = req?.user;
    const userId = query.userId ?? req.user.id;
    return this.projectService.findAll(userId, user.role, !!query.userId);
  }

  @UseGuards(UserAuthGuard)
  @Get('/:id')
  findByIdAll(@Param('id') projectId: string) {
    return this.projectService.findByIdAll(projectId);
  }

  @UseGuards(UserAuthGuard)
  @Patch('edit')
  update(@Request() req, @Body() updateProjectDto: CreateProjectDto) {
    return this.projectService.update(updateProjectDto.id, updateProjectDto);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Param('id') projectId: string) {
    return this.projectService.remove(projectId);
  }
}
