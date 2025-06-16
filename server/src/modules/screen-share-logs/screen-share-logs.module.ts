import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenShareLogEntity } from './entities/screen-share-logs.entity';
import { ScreenShareLogService } from './services/screen-share-logs.service';
import { ScreenShareLogController } from './controllers/screen-share-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenShareLogEntity])],
  controllers: [ScreenShareLogController],
  providers: [ScreenShareLogService],
  exports: [ScreenShareLogService],
})
export class ScreenShareLogModule {}
