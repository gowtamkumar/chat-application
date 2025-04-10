import { CouponType } from '@enums/common.enum';
import { IsEnum, IsString } from 'class-validator';

export class FilterCouponDto {
  @IsString()
  name: string;

  @IsEnum(CouponType)
  type: CouponType;
}
