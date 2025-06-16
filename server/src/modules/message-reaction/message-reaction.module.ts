import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageReactionsEntity } from './entities/message-reaction.entity';
import { MessageReactionsController } from './controllers/message-reaction.controller';
import { MessageReactionsService } from './services/message-reaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageReactionsEntity])],
  controllers: [MessageReactionsController],
  providers: [MessageReactionsService],
  exports: [MessageReactionsService],
})
export class MessageReactionsModule {}
