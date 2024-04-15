import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HolidayStatus } from '../types/holiday.types';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../base/base.entity';

@Entity()
export class Holiday extends BaseEntity {
  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: HolidayStatus,
    default: HolidayStatus.ACTIVE,
  })
  status: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  day: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
