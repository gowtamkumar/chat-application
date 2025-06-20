import { Expose } from 'class-transformer';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';

export class ConversationResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  Type: ConversationTypeEnum;
}
