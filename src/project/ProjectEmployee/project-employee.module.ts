import { forwardRef, Module } from '@nestjs/common';
import { ProjectEmployeeService } from './project-employee.service';
import { JwtService } from '@nestjs/jwt';
import { ProjectEmployeeController } from './project-employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEmployee } from './entities/project-employee.entity';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEmployee]),
    forwardRef(() => UserModule),
  ],
  controllers: [ProjectEmployeeController],
  providers: [ProjectEmployeeService, JwtService],
})
export class ProjectEmployeeModule {}
