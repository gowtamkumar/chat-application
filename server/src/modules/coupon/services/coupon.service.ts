/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateCouponDto, FilterCouponDto, UpdateCouponDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponProductEntity } from '../entities/coupon-product.entity';
import { RequestContextDto } from '@common/dtos/request-context.dto';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);

  constructor(
    @InjectRepository(CouponEntity)
    private readonly CouponRepo: Repository<CouponEntity>,
    @InjectRepository(CouponProductEntity)
    private readonly couponProductRepo: Repository<CouponProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  getCoupons(filterCouponDto: FilterCouponDto): Promise<CouponEntity[]> {
    this.logger.log(`${this.getCoupons.name} Service Called`);
    const { name } = filterCouponDto;

    const newQuery: { name: any } = {
      name: undefined,
    };

    if (name) newQuery.name = name;

    // logic for filter
    return this.CouponRepo.find({ relations: ['products'] });
  }

  async getCoupon(id: string): Promise<CouponEntity> {
    this.logger.log(`${this.getCoupon.name} Service Called`);

    const Coupon = await this.CouponRepo.findOne({ where: { id } });
    if (!Coupon) {
      throw new NotFoundException(`Coupon of id ${id} not found`);
    }
    return Coupon;
  }

  async createCoupon(
    ctx: RequestContextDto,
    createCouponDto: CreateCouponDto,
  ): Promise<CouponEntity> {
    this.logger.log(`${this.createCoupon.name} Service Called`);

    return await this.dataSource.transaction(async (transactionManager) => {
      const couponRepository = transactionManager.getRepository(CouponEntity);
      const couponProductRepository =
        transactionManager.getRepository(CouponProductEntity);

      // Create and save the coupon
      const newCoupon = couponRepository.create({
        ...createCouponDto,
        userId: ctx.user.id,
      });
      const savedCoupon = await couponRepository.save(newCoupon);

      // Handle coupon-product associations
      if (
        createCouponDto.couponProducts &&
        Array.isArray(createCouponDto.couponProducts)
      ) {
        const couponProducts = createCouponDto.couponProducts.map(
          (productId) => ({
            productId,
            couponId: savedCoupon.id,
          }),
        );

        const newCouponProducts =
          couponProductRepository.create(couponProducts);
        await couponProductRepository.save(newCouponProducts);
      }

      return savedCoupon;
    });
  }

  async updateCoupon(
    id: string,
    updateCouponDto: UpdateCouponDto,
  ): Promise<CouponEntity> {
    this.logger.log(`${this.updateCoupon.name} Service Called`);

    const Coupon = await this.getCoupon(id);

    if (!Coupon) {
      throw new NotFoundException(`Coupon of id ${id} not found`);
    }
    this.CouponRepo.merge(Coupon, updateCouponDto);
    return this.CouponRepo.save(Coupon);
  }

  async deleteCoupon(id: string): Promise<CouponEntity> {
    this.logger.log(`${this.deleteCoupon.name} Service Called`);

    const Coupon = await this.getCoupon(id);
    if (!Coupon) {
      throw new NotFoundException(`Coupon of id ${id} not found`);
    }
    return this.CouponRepo.remove(Coupon);
  }
}
