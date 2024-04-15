import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { LeavesStatus, LeaveTypeList } from '../types/leave.types';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../base/base.entity';

@Entity()
@Unique(['from', 'user'])
export class Leave extends BaseEntity {
  @Column({
    type: 'enum',
    enum: LeaveTypeList,
    default: LeaveTypeList.LOSS_OF_PAY,
  })
  leaveType: string;

  @Column({
    type: 'enum',
    enum: LeavesStatus,
    default: LeavesStatus.ACTIVE,
  })
  status: string;

  @Column({ type: 'date' })
  from: string;

  @Column({ type: 'date' })
  to: string;

  @Column()
  noOfDay: string;

  @Column()
  reason: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
