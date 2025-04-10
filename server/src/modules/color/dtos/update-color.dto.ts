import { StatusEnum } from '@admin/user/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateColorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;
}
