import { IsDefined, IsEnum } from 'class-validator';
import { ConversationTypeEnum } from '../enums/type.enum';

export class CreateConversationDto {
  @IsDefined()
  @IsEnum(ConversationTypeEnum)
  type: ConversationTypeEnum;
}
