import { CouponType, DiscountType } from '@enums/common.enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCouponDto {
  @IsEnum(CouponType)
  @IsOptional()
  type: CouponType;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType: DiscountType;

  @IsString()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  expiryDate: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  minOrderAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  mincartValue: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  maxUser: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  maxDiscountValue: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  usageCount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  usageLimit: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  usagePerUser: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;
}
