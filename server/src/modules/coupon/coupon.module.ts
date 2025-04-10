import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';
import { CouponController } from './controllers/coupon.controller';
import { CouponService } from './services/coupon.service';
import { CouponProductEntity } from './entities/coupon-product.entity';
import { AppliedCouponEntity } from './entities/applied-coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponEntity,
      CouponProductEntity,
      AppliedCouponEntity,
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
