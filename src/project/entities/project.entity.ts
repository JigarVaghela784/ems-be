import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProjectEmployee } from '../ProjectEmployee/entities/project-employee.entity';
import { BaseEntity } from '../../base/base.entity';

@Entity()
export class Project extends BaseEntity {
  @Column('citext', { nullable: false })
  name: string;

  @Column('citext', { nullable: true })
  weeklyHours: string;

  @Column('date', { nullable: true })
  createdDate: Date;

  @Column('date', { nullable: true })
  deadlineDate: Date;

  @Column('citext', { nullable: true })
  priority: string;

  @Column('citext', { nullable: true })
  status: string;

  @Column('citext', { nullable: true })
  description: string;

  @Column('boolean', { default: false, nullable: false })
  delete: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => ProjectEmployee,
    (projectEmployee) => projectEmployee.project,
    {
      eager: true,
      cascade: ['insert', 'update', 'remove'],
    },
  )
  employees: ProjectEmployee[];
}
