import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContactStatusEnum } from '../enums/status.enum';

export class UpdateContactDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsEnum(ContactStatusEnum)
  @IsOptional()
  status: ContactStatusEnum;
}
