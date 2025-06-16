import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CallTypeEnum } from '../enum/call-type.enum';
import { CallStatusEnum } from '../enum/call-status.enum';

@Entity('calls')
export class CallEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'conversation_id' })
  conversationId: string;

  @Column({ type: 'enum', enum: CallTypeEnum })
  type: CallTypeEnum;

  @Column({ type: 'enum', enum: CallStatusEnum })
  status: CallStatusEnum;

  @CreateDateColumn({ name: 'started_at', type: 'timestamp with time zone' })
  startedAt: string;

  @UpdateDateColumn({ name: 'ended_at', type: 'timestamp with time zone' })
  endedAt: string;
}
