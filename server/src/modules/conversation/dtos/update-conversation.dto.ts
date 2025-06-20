import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConversationTypeEnum } from '../enums/conversation-type.enum';

export class UpdateConversationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ConversationTypeEnum)
  type: ConversationTypeEnum;
}
