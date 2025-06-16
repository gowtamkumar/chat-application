import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallParticipantEntity } from './entities/call-participant.entity';
import { CallParticipantController } from './controllers/call-participant.controller';
import { CallParticipantService } from './services/call-participant.service';

@Module({
  imports: [TypeOrmModule.forFeature([CallParticipantEntity])],
  controllers: [CallParticipantController],
  providers: [CallParticipantService],
  exports: [CallParticipantService],
})
export class CallParticipantModule {}
