import { IsEnum, IsString } from 'class-validator';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';

export class FilterConversationDto {
  @IsString()
  name: string;

  @IsEnum(ConversationTypeEnum)
  Type: ConversationTypeEnum;
}
