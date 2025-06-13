import { IsOptional, IsString } from 'class-validator';

export class UpdateMessagesDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  sender: any;
}
