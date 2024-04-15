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
import { LeaveService } from './leave.service';
import { CreateLeavDto } from './dto/create-leav.dto';
import { UpdateLeavDto } from './dto/update-leav.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { UserService } from '../user/user.service';

@Controller('leave')
export class LeaveController {
  constructor(
    private readonly leavesService: LeaveService,
    private readonly userService: UserService,
  ) {}

  @Post('add')
  @UseGuards(UserAuthGuard)
  async create(@Body() createLeafDto: CreateLeavDto) {
    const user = await this.userService.findOne(createLeafDto.empId);
    return this.leavesService.create(
      {
        ...createLeafDto,
      },
      user,
    );
  }

  @Get()
  @UseGuards(UserAuthGuard)
  findAll(@Request() req) {
    return this.leavesService.findAll(req.user.id, req.query);
  }

  @Get('allUser')
  @UseGuards(UserAuthGuard)
  findAllUserLeaves(@Request() req) {
    return this.leavesService.findAllUserLeaves(req.user.role, req.query);
  }

  @Get('teams')
  @UseGuards(UserAuthGuard)
  findTeamUser(@Request() req) {
    return this.leavesService.findTeamUser(req.user, req.query);
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  findOneUser(@Request() req, @Param('id') id: string) {
    return this.leavesService.findOne(id, req.user.role);
  }

  @Patch('update')
  @UseGuards(UserAuthGuard)
  async update(@Body() updateLeafDto: UpdateLeavDto) {
    return this.leavesService.update(updateLeafDto.id, updateLeafDto);
  }

  @Delete('delete/:id')
  @UseGuards(UserAuthGuard)
  remove(@Param('id') id: string) {
    return this.leavesService.remove(id);
  }
}
