import { IsEnum, IsString } from 'class-validator';
import { ContactStatusEnum } from '../enums/status.enum';

export class FilterContactDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsEnum(ContactStatusEnum)
  status: ContactStatusEnum;
}
