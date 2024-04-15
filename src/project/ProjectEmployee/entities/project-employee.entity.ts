import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { Project } from '../../entities/project.entity';
import { User } from '../../../user/entities/user.entity';
@Entity()
export class ProjectEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  projectId: string;

  @ManyToOne(() => Project, (projects) => projects.employees, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column('uuid', { nullable: false })
  employeeId: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column('citext', { nullable: false })
  role: string;

  @Column('citext', { nullable: false })
  hours: string;

  @VirtualColumn({
    query: (alias) =>
      `SELECT "name" FROM "project" WHERE "id" = ${alias}.project_id`,
  })
  name: string;

  @VirtualColumn({
    query: (alias) =>
      `SELECT "delete" FROM "project" WHERE "id" = ${alias}.project_id`,
  })
  delete: string;
}
