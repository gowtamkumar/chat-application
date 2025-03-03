import { StatusEnum } from '@admin/user/enums';
import { IsEnum, IsString } from 'class-validator';

export class FilterColorDto {
  @IsString()
  name: string;

  @IsEnum(StatusEnum)
  status: StatusEnum;
}
