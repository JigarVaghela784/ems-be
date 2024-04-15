import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from './entities/leave.entity';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([Leave]), UserModule, ProjectModule],
  controllers: [LeaveController],
  providers: [LeaveService, JwtService],
  exports: [LeaveService],
})
export class LeaveModule {}
