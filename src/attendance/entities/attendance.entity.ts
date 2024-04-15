import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IActivity } from '../dto/create-attendance.dto';
import { BaseEntity } from '../../base/base.entity';

@Entity()
@Unique(['date', 'userId'])
export class Attendance extends BaseEntity {
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ type: 'jsonb' })
  activity: IActivity[];

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
