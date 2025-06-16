import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallEntity } from './entities/call.entity';
import { CallService } from './services/call.service';
import { CallController } from './controllers/call.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CallEntity])],
  controllers: [CallController],
  providers: [CallService],
  exports: [CallService],
})
export class CallModule {}
