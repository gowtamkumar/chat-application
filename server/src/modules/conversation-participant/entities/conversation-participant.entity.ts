import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('conversation_participants')
export class ConversationParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'conversation_id' })
  conversationId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt: string;

  @Column({ type: 'enum', enum: ['admin', 'member'], default: 'member' })
  role: 'admin' | 'member';

  @Column({ type: 'uuid', nullable: true })
  added_by: string;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'added_by' })
  // addedByUser: User;
}
