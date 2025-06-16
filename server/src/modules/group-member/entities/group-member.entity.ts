import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupMemberRoleEnum } from '../enum/group-member-role.enum';

@Entity('group-members')
export class GroupMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'conversation_id' })
  conversationId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: GroupMemberRoleEnum,
    default: GroupMemberRoleEnum.Member,
  })
  role: GroupMemberRoleEnum;

  @Column({ type: 'uuid', name: 'added_by', nullable: true })
  addedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: string;
}
