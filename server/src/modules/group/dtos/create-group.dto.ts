import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsDefined()
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
