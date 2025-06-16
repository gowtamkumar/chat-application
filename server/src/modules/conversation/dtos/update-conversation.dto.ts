import { IsEnum, IsOptional } from 'class-validator';
import { ConversationTypeEnum } from '../enums/type.enum';

export class UpdateConversationDto {
  @IsOptional()
  @IsEnum(ConversationTypeEnum)
  type: ConversationTypeEnum;
}
