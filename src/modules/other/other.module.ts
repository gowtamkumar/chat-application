import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { BdLocationModule } from './bd-location/bd-location.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [FileModule, BdLocationModule, EmailModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtherModule {}
