🧑‍💼 users: 
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hashed password
    profile_picture TEXT,
    status TEXT CHECK (status IN ('online', 'offline', 'busy', 'away')) DEFAULT 'offline',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

🤝 contacts
CREATE TABLE contacts (
    user_id_1 UUID NOT NULL,
    user_id_2 UUID NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id_1, user_id_2),
    CONSTRAINT fk_user1 FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_order CHECK (user_id_1 < user_id_2)
);

💬 conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT CHECK (type IN ('one_to_one', 'group')) NOT NULL,
    conversation_name VARCHAR(255), -- Optional for group chats
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

👥 conversation_participants

CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL,
    user_id UUID NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

📨 messages

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

📥 message_receipts
CREATE TABLE message_receipts (
    message_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    status TEXT CHECK (status IN ('sent', 'delivered', 'read')) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

📎 message_attachments
CREATE TABLE message_attachments (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

😄 message_reactions
CREATE TABLE message_reactions (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (message_id, user_id, reaction_type),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

👨‍👩‍👧 groups
CREATE TABLE groups (
    conversation_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_icon_url TEXT,
    creator_id UUID NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

👤 group_members
CREATE TABLE group_members (
    conversation_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    added_by UUID,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES groups(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL
);

📞 calls

CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    type TEXT CHECK (type IN ('voice', 'video')) NOT NULL,
    status TEXT CHECK (status IN ('initiated', 'ongoing', 'completed', 'missed')) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

🙋‍♂️ call_participants
CREATE TABLE call_participants (
    call_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status TEXT CHECK (status IN ('ringing', 'connected', 'declined', 'left')) NOT NULL,
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    PRIMARY KEY (call_id, user_id),
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

🖥️ screen_share_logs
CREATE TABLE screen_share_logs (
    id BIGSERIAL PRIMARY KEY,
    call_id UUID NOT NULL,
    sharer_user_id UUID NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE CASCADE,
    FOREIGN KEY (sharer_user_id) REFERENCES users(id) ON DELETE CASCADE
);






// TypeORM Entities for WhatsApp-style Chat Application

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
  OneToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ type: 'enum', enum: ['online', 'offline', 'busy', 'away'], default: 'offline' })
  status: 'online' | 'offline' | 'busy' | 'away';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('contacts')
export class Contact {
  @PrimaryColumn('uuid')
  user_id_1: string;

  @PrimaryColumn('uuid')
  user_id_2: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'blocked'] })
  status: 'pending' | 'accepted' | 'blocked';

  @CreateDateColumn()
  created_at: Date;
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['one_to_one', 'group'] })
  type: 'one_to_one' | 'group';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('conversation_participants')
export class ConversationParticipant {
  @PrimaryColumn('uuid')
  conversation_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @CreateDateColumn()
  joined_at: Date;
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid')
  conversation_id: string;

  @Column('uuid')
  sender_id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('message_receipts')
export class MessageReceipt {
  @PrimaryColumn('bigint')
  message_id: number;

  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'enum', enum: ['sent', 'delivered', 'read'] })
  status: 'sent' | 'delivered' | 'read';

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('message_attachments')
export class MessageAttachment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  message_id: number;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('message_reactions')
export class MessageReaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  message_id: number;

  @Column('uuid')
  user_id: string;

  @Column()
  reaction_type: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('groups')
export class Group {
  @PrimaryColumn('uuid')
  conversation_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  group_icon_url: string;

  @Column('uuid')
  creator_id: string;
}

@Entity('group_members')
export class GroupMember {
  @PrimaryColumn('uuid')
  conversation_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'enum', enum: ['admin', 'member'], default: 'member' })
  role: 'admin' | 'member';

  @Column('uuid', { nullable: true })
  added_by: string;
}

@Entity('calls')
export class Call {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  conversation_id: string;

  @Column({ type: 'enum', enum: ['voice', 'video'] })
  type: 'voice' | 'video';

  @Column({ type: 'enum', enum: ['initiated', 'ongoing', 'completed', 'missed'] })
  status: 'initiated' | 'ongoing' | 'completed' | 'missed';

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  ended_at: Date;
}

@Entity('call_participants')
export class CallParticipant {
  @PrimaryColumn('uuid')
  call_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ type: 'enum', enum: ['ringing', 'connected', 'declined', 'left'] })
  status: 'ringing' | 'connected' | 'declined' | 'left';

  @Column({ nullable: true })
  joined_at: Date;

  @Column({ nullable: true })
  left_at: Date;
}

@Entity('screen_share_logs')
export class ScreenShareLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid')
  call_id: string;

  @Column('uuid')
  sharer_user_id: string;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  ended_at: Date;
}
