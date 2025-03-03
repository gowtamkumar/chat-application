import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBrandDto, FilterBrandDto, UpdateBrandDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from '../entities/brand.entity';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(
    @InjectRepository(BrandEntity)
    private readonly BrandRepo: Repository<BrandEntity>,
  ) {}

  getBrands(filterBrandDto: FilterBrandDto): Promise<BrandEntity[]> {
    this.logger.log(`${this.getBrands.name} Service Called`);
    const { name } = filterBrandDto;

    const newQuery: { name: any } = {
      name: undefined,
    };

    if (name) newQuery.name = name;

    // logic for filter
    return this.BrandRepo.find({
      where: newQuery,
    });
  }

  async getBrand(id: string): Promise<BrandEntity> {
    this.logger.log(`${this.getBrand.name} Service Called`);

    const Brand = await this.BrandRepo.findOne({ where: { id } });
    if (!Brand) {
      throw new NotFoundException(`Brand of id ${id} not found`);
    }
    return Brand;
  }

  async createBrand(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    this.logger.log(`${this.createBrand.name} Service Called`);

    const Brand = this.BrandRepo.create(createBrandDto);
    await this.BrandRepo.save(Brand);
    return Brand;
  }

  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandEntity> {
    this.logger.log(`${this.updateBrand.name} Service Called`);

    const Brand = await this.getBrand(id);

    if (!Brand) {
      throw new NotFoundException(`Brand of id ${id} not found`);
    }
    this.BrandRepo.merge(Brand, updateBrandDto);
    return this.BrandRepo.save(Brand);
  }

  async deleteBrand(id: string): Promise<BrandEntity> {
    this.logger.log(`${this.deleteBrand.name} Service Called`);

    // if (result.image) {
    //   const repository = connection.getRepository(FileEntity);
    //   const directory = join(process.cwd(), "/public/uploads");
    //   const filePath = `${directory}/${result.image}`;
    //   const [deleteFile] = await Promise.all([
    //     repository.findOne({ where: { filename: result.image } }),
    //     fs.promises.unlink(filePath),
    //   ]);
    //   await repository.remove(deleteFile);
    // }

    const Brand = await this.getBrand(id);
    if (!Brand) {
      throw new NotFoundException(`Brand of id ${id} not found`);
    }
    return this.BrandRepo.remove(Brand);
  }
}
