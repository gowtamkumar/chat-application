import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  groupIconUrl: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description: string;
}
