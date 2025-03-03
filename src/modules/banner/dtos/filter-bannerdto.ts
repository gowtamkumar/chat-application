import { IsEnum, IsString } from 'class-validator';
import { BannerType } from '../enums';

export class FilterBannerDto {
  @IsString()
  title: string;

  @IsEnum(BannerType)
  type: BannerType;

  @IsString()
  url: string;

  @IsString()
  image: string;

  @IsString()
  description: string;
}
