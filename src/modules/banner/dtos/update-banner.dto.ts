import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BannerType } from '../enums';

export class UpdateBannerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(BannerType)
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
