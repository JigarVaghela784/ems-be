import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ProjectEmployeeModule } from './ProjectEmployee/project-employee.module';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ProjectEmployeeModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, JwtService],
  exports: [ProjectService],
})
export class ProjectModule {}
