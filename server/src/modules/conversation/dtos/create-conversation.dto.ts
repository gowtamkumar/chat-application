import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';

export class CreateConversationDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsEnum(ConversationTypeEnum)
  type: ConversationTypeEnum;
}
