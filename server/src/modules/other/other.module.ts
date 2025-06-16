import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [FileModule, EmailModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtherModule {}
