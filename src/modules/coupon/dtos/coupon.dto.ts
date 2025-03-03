import { Expose } from 'class-transformer';
import { CouponType, DiscountType } from '@enums/common.enum';

export class CouponDto {
  @Expose()
  id: string;

  @Expose()
  type: CouponType;

  @Expose()
  code: string;

  @Expose()
  discountType: DiscountType;

  @Expose()
  value: number;

  @Expose()
  startDate: string;

  @Expose()
  expiryDate: string;

  @Expose()
  minOrderAmount: number;

  @Expose()
  mincartValue: number;

  @Expose()
  maxUser: number;

  @Expose()
  maxDiscountValue: number;

  @Expose()
  usageCount: number;

  @Expose()
  usageLimit: number;

  @Expose()
  usagePerUser: number;

  @Expose()
  image: number;

  @Expose()
  active: boolean;
}
