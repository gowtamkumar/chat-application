import { IsOptional, IsString } from 'class-validator';

export class CreateMessagesDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  sender: any;
}
