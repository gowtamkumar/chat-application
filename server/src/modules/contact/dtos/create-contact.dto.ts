import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactStatusEnum } from '../enums/status.enum';

export class CreateContactDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsEnum(ContactStatusEnum)
  @IsOptional()
  status: ContactStatusEnum;
}
