import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BannerType } from '../enums';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @IsEnum(BannerType)
  @IsDefined()
  type: BannerType;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  description: string;
}
