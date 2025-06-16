import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CallParticipantEnum } from '../enum/call-participant-status.enum';

@Entity('call_participants')
export class CallParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'call_id' })
  callId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: CallParticipantEnum })
  status: CallParticipantEnum;

  @Column({ name: 'joined_at', nullable: true })
  joinedAt: string;

  @Column({ name: 'left_at', nullable: true })
  leftAt: string;
}
