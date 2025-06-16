import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageReceiptsEntity } from './entities/message-receipt.entity';
import { MessageReceiptsController } from './controllers/message-receipt.controller';
import { MessageReceiptsService } from './services/message-receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageReceiptsEntity])],
  controllers: [MessageReceiptsController],
  providers: [MessageReceiptsService],
  exports: [MessageReceiptsService],
})
export class MessageReceiptsModule {}
