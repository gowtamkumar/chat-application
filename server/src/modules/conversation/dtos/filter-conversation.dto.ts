import { IsEnum } from 'class-validator';
import { ConversationTypeEnum } from '../enums/type.enum';

export class FilterConversationDto {
  @IsEnum(ConversationTypeEnum)
  Type: ConversationTypeEnum;
}
