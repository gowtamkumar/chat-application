import { Expose } from 'class-transformer';
import { ConversationTypeEnum } from '../enums/type.enum';

export class ConversationResponseDto {
  @Expose()
  id: string;

  @Expose()
  Type: ConversationTypeEnum;
}
