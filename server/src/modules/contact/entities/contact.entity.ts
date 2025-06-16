import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactStatusEnum } from '../enums/status.enum';

@Entity('contacts')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  @Column({ type: 'uuid', name: 'receiver_id' })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: ContactStatusEnum,
    default: ContactStatusEnum.Pending,
  })
  status: ContactStatusEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: string;

  // Relation
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: string;
}
