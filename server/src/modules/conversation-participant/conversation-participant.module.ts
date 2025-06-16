import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationParticipantController } from './controllers/conversation-participant.controller';
import { ConversationParticipantEntity } from './entities/conversation-participant.entity';
import { ConversationParticipantService } from './services/conversation-participant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationParticipantEntity])],
  controllers: [ConversationParticipantController],
  providers: [ConversationParticipantService],
  exports: [ConversationParticipantService],
})
export class ConversationParticipantModule {}
