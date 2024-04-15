import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserAuthGuard } from './user-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserAuthGuard)
  @Get()
  getUser(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(UserAuthGuard)
  @Get('all')
  allUser(@Request() req) {
    const role = req.user.role;
    return this.userService.allUser(role, req.query);
  }

  @UseGuards(UserAuthGuard)
  @Get(':id')
  getSingleUser(@Request() req, @Param('id') id: string) {
    return this.userService.findSingleUser(id);
  }

  @UseGuards(UserAuthGuard)
  @Patch('edit')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto, req.user.id, req.user.role);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') userId: string) {
    const role = req.user.role;
    return this.userService.remove(userId, role);
  }
}
