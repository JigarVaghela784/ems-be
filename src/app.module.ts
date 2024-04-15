import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { Leave } from './leave/entities/leave.entity';
import { Holiday } from './holiday/entities/holiday.entity';
import { ProjectEmployee } from './project/ProjectEmployee/entities/project-employee.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { HolidayModule } from './holiday/holiday.module';
import { ProjectEmployeeModule } from './project/ProjectEmployee/project-employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      entities: [User, Project, Attendance, Leave, Holiday, ProjectEmployee],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ProjectEmployeeModule,
    HolidayModule,
    LeaveModule,
    AttendanceModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
