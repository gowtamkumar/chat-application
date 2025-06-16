import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('screen_share_logs')
export class ScreenShareLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'call_id' })
  callId: string;

  @Column({ type: 'uuid', name: 'sharer_user_id' })
  sharerUserId: string;

  @CreateDateColumn({ name: 'started_at', type: 'timestamp with time zone' })
  startedAt: string;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: string;
}
