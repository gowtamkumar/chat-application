import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from '@admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { OtherModule } from '@modules/other/other.module';
import { BannerModule } from '@modules/banner/banner.module';
import { BrandModule } from '@modules/brand/banner.module';
import { ColorModule } from '@modules/color/color.module';
import { CouponModule } from '@modules/coupon/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),

    AdminModule,
    DatabaseModule,
    OtherModule,
    BannerModule,
    BrandModule,
    ColorModule,
    CouponModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
