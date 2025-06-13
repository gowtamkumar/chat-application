import { IsString } from 'class-validator';

export class FilterMessagesDto {
  @IsString()
  content: string;

  @IsString()
  sender: any;
}
