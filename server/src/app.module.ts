import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from '@admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { OtherModule } from '@modules/other/other.module';
import { ChatModule } from '@modules/chat/chat.module';
import { MessagesModule } from '@modules/message/message.module';
import { ContactModule } from '@modules/contact/contact.module';
import { ConversationParticipantModule } from '@modules/conversation-participant/conversation-participant.module';
import { MessageReceiptsModule } from '@modules/message-receipt/message-receipt.module';
import { GroupModule } from '@modules/group/group.module';
import { CallModule } from '@modules/call/call.module';
import { CallParticipantModule } from '@modules/call-participant/call-participant.module';
import { MessageReactionsModule } from '@modules/message-reaction/message-reaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    ChatModule,
    AdminModule,
    CallModule,
    CallParticipantModule,
    MessageReactionsModule,
    DatabaseModule,
    OtherModule,
    MessagesModule,
    MessageReceiptsModule,
    GroupModule,
    ContactModule,
    ConversationParticipantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
