import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from '../entities/banner.entity';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(BannerEntity)
    private readonly BannerRepo: Repository<BannerEntity>,
  ) {}

  getBanners(filterBannerDto: FilterBannerDto): Promise<BannerEntity[]> {
    this.logger.log(`${this.getBanners.name} Service Called`);
    const { type } = filterBannerDto;

    const newQuery: { type: any } = {
      type: undefined,
    };

    if (type) newQuery.type = type;

    // logic for filter
    return this.BannerRepo.find({
      where: newQuery,
    });
  }

  async getBanner(id: string): Promise<BannerEntity> {
    this.logger.log(`${this.getBanner.name} Service Called`);

    const Banner = await this.BannerRepo.findOne({ where: { id } });
    if (!Banner) {
      throw new NotFoundException(`Banner of id ${id} not found`);
    }
    return Banner;
  }

  async createBanner(createBannerDto: CreateBannerDto): Promise<BannerEntity> {
    this.logger.log(`${this.createBanner.name} Service Called`);

    const Banner = this.BannerRepo.create(createBannerDto);
    await this.BannerRepo.save(Banner);
    return Banner;
  }

  async updateBanner(
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<BannerEntity> {
    this.logger.log(`${this.updateBanner.name} Service Called`);

    const Banner = await this.getBanner(id);

    if (!Banner) {
      throw new NotFoundException(`Banner of id ${id} not found`);
    }
    this.BannerRepo.merge(Banner, updateBannerDto);
    return this.BannerRepo.save(Banner);
  }

  async deleteBanner(id: string): Promise<BannerEntity> {
    this.logger.log(`${this.deleteBanner.name} Service Called`);

    const Banner = await this.getBanner(id);
    if (!Banner) {
      throw new NotFoundException(`Banner of id ${id} not found`);
    }
    return this.BannerRepo.remove(Banner);
  }
}
