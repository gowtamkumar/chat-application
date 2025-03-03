import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColorDto, FilterColorDto, UpdateColorDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorEntity } from '../entities/color.entity';

@Injectable()
export class ColorService {
  private readonly logger = new Logger(ColorService.name);

  constructor(
    @InjectRepository(ColorEntity)
    private readonly ColorRepo: Repository<ColorEntity>,
  ) {}

  getColors(filterColorDto: FilterColorDto): Promise<ColorEntity[]> {
    this.logger.log(`${this.getColors.name} Service Called`);
    const { name } = filterColorDto;

    const newQuery: { name: any } = {
      name: undefined,
    };

    if (name) newQuery.name = name;

    // logic for filter
    return this.ColorRepo.find({
      where: newQuery,
    });
  }

  async getColor(id: string): Promise<ColorEntity> {
    this.logger.log(`${this.getColor.name} Service Called`);

    const Color = await this.ColorRepo.findOne({ where: { id } });
    if (!Color) {
      throw new NotFoundException(`Color of id ${id} not found`);
    }
    return Color;
  }

  async createColor(createColorDto: CreateColorDto): Promise<ColorEntity> {
    this.logger.log(`${this.createColor.name} Service Called`);

    const Color = this.ColorRepo.create(createColorDto);
    await this.ColorRepo.save(Color);
    return Color;
  }

  async updateColor(
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<ColorEntity> {
    this.logger.log(`${this.updateColor.name} Service Called`);

    const Color = await this.getColor(id);

    if (!Color) {
      throw new NotFoundException(`Color of id ${id} not found`);
    }
    this.ColorRepo.merge(Color, updateColorDto);
    return this.ColorRepo.save(Color);
  }

  async deleteColor(id: string): Promise<ColorEntity> {
    this.logger.log(`${this.deleteColor.name} Service Called`);

    const Color = await this.getColor(id);
    if (!Color) {
      throw new NotFoundException(`Color of id ${id} not found`);
    }
    return this.ColorRepo.remove(Color);
  }
}
