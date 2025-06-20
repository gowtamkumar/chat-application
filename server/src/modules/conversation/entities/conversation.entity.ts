import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ConversationTypeEnum,
  })
  type: ConversationTypeEnum;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  group_icon_url: string;

  @Column({ type: 'uuid', nullable: true })
  creator_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: string;
}
