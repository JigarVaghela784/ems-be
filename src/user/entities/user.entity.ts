import { Column, Entity, OneToMany } from 'typeorm';
import {
  DEPARTMENT_LIST,
  EmployeeStatus,
  EXPERINCES,
  UserRole,
  WorkingDays,
} from '../types/user.types';
import { ProjectEmployee } from '../../project/ProjectEmployee/entities/project-employee.entity';
import { BaseEntity } from '../../base/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  age: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  joiningDate: Date;

  @Column({
    type: 'enum',
    enum: DEPARTMENT_LIST,
    default: null,
    nullable: true,
  })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'simple-json', nullable: true })
  experiences: EXPERINCES[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.PENDING,
  })
  employeeStatus: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  ACNumber: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  contractStart: Date;

  @Column({ type: 'date', default: null })
  contractEnd: Date;

  @Column({ nullable: true })
  ifsc: string;

  @Column({ nullable: true })
  panNo: string;

  @Column({ nullable: true, type: 'text' })
  profile: string;

  @Column({ type: 'float', nullable: true, default: 8.5 })
  workingHours: number;

  @Column({ type: 'float', nullable: true, default: 0.5 })
  break: number;

  @Column({ type: 'jsonb', nullable: true, default: WorkingDays })
  workingDays: string[];

  // @OneToMany(() => Attendance, (attendance) => attendance.user,{
  //   eager:true
  // })
  // userAttendance:Attendance[]

  @OneToMany(() => ProjectEmployee, (project) => project.employee, {
    eager: true,
  })
  projects: ProjectEmployee[];
}
