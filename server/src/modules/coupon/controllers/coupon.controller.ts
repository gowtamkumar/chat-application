import { FilterCouponDto } from '../dtos/filter-coupon.dto';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@admin/auth/guards/jwt-auth.guard';
import { UpdateCouponDto } from '../dtos';
import { CouponService } from '../services/coupon.service';
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { RequestContext } from '@common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('Coupons')
export class CouponController {
  private readonly logger = new Logger(CouponController.name);

  constructor(private readonly CouponService: CouponService) {}

  @Post('/')
  async createCoupon(
    @RequestContext() ctx: RequestContextDto,
    @Body() createCouponDto: CreateCouponDto,
  ) {
    const Coupon = await this.CouponService.createCoupon(ctx, createCouponDto);

    return {
      success: true,
      statusCode: 201,
      message: `New Coupon created`,
      data: Coupon,
    };
  }

  @Get('/')
  async getCoupons(@Query() filterCouponDto: FilterCouponDto) {
    const Coupons = await this.CouponService.getCoupons(filterCouponDto);

    return {
      success: true,
      statusCode: 200,
      message: `List of Coupon`,
      data: Coupons,
    };
  }

  @Get('/:id')
  async getCoupon(@Param('id', ParseUUIDPipe) id: string) {
    const Coupon = await this.CouponService.getCoupon(id);

    return {
      success: true,
      statusCode: 200,
      message: `Coupon of ID: ${id}`,
      data: Coupon,
    };
  }

  @Put('/:id')
  async updateCoupon(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const Coupon = await this.CouponService.updateCoupon(id, updateCouponDto);

    return {
      success: true,
      statusCode: 200,
      message: `Coupon of ID ${Coupon.id} updated`,
      data: Coupon,
    };
  }

  @Delete('/:id')
  async deleteCoupon(@Param('id', ParseUUIDPipe) id: string) {
    const Coupon = await this.CouponService.deleteCoupon(id);

    return {
      success: true,
      statusCode: 200,
      message: `Coupon of ${Coupon.id} deleted`,
      data: Coupon,
    };
  }
}
