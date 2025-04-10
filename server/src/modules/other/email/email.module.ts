import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';

@Module({
  imports: [ConfigModule], // Enable environment variables
  providers: [EmailService],
  exports: [EmailService], // Make available for other modules
})
export class EmailModule {}
