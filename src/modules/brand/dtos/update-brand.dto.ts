import { StatusEnum } from '@admin/user/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
