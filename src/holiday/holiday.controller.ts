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
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { UserService } from '../user/user.service';

@Controller('holidays')
export class HolidayController {
  constructor(
    private readonly userService: UserService,
    private readonly holidaysService: HolidayService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('add')
  async create(@Request() req, @Body() createHolidayDto: CreateHolidayDto) {
    const userId = req.user.id;
    const role = req.user.role;
    const user = await this.userService.findOne(userId);
    return this.holidaysService.create(
      {
        ...createHolidayDto,
        date: createHolidayDto.date ? new Date(createHolidayDto.date) : null,
      },
      user,
      role,
    );
  }

  @UseGuards(UserAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.holidaysService.findAll(req.query);
  }

  @UseGuards(UserAuthGuard)
  @Get('upcoming')
  upcoming(@Request() req) {
    return this.holidaysService.upcoming(req.query);
  }

  @UseGuards(UserAuthGuard)
  @Patch('edit')
  update(@Request() req, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidaysService.update(updateHolidayDto.id, updateHolidayDto);
  }

  @UseGuards(UserAuthGuard)
  @Delete('delete/:id')
  remove(@Request() req, @Param('id') id: string) {
    const role = req.user.role;
    return this.holidaysService.remove(id, role);
  }
}
