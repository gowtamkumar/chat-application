import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '@admin/user/enums';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;
}
