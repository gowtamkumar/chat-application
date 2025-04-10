import { StatusEnum } from '@admin/user/enums';
import { IsEnum, IsString } from 'class-validator';

export class FilterBrandDto {
  @IsString()
  name: string;

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
