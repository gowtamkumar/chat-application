import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '@admin/user/enums';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
