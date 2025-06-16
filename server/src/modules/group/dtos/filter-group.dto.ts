import { IsString } from 'class-validator';

export class FilterGroupsDto {
  @IsString()
  name: string;

  @IsString()
  conversationId: string;

  @IsString()
  creatorId: string;
}
