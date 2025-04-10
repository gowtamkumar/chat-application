import { FilterBrandDto } from '../dtos/filter-brand.dto';
import { CreateBrandDto } from '../dtos/create-brand.dto';
import { BrandService } from '../services/brand.service';
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
import { UpdateBrandDto } from '../dtos';

@UseGuards(JwtAuthGuard)
@Controller('Brands')
export class BrandController {
  private readonly logger = new Logger(BrandController.name);

  constructor(private readonly BrandService: BrandService) {}

  @Post('/')
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const Brand = await this.BrandService.createBrand(createBrandDto);

    return {
      success: true,
      statusCode: 201,
      message: `New Brand created`,
      data: Brand,
    };
  }

  @Get('/')
  async getBrands(@Query() filterBrandDto: FilterBrandDto) {
    const Brands = await this.BrandService.getBrands(filterBrandDto);

    return {
      success: true,
      statusCode: 200,
      message: `List of Brand`,
      data: Brands,
    };
  }

  @Get('/:id')
  async getBrand(@Param('id', ParseUUIDPipe) id: string) {
    const Brand = await this.BrandService.getBrand(id);

    return {
      success: true,
      statusCode: 200,
      message: `Brand of ID: ${id}`,
      data: Brand,
    };
  }

  @Put('/:id')
  async updateBrand(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    const Brand = await this.BrandService.updateBrand(id, updateBrandDto);

    return {
      success: true,
      statusCode: 200,
      message: `Brand of ID ${Brand.id} updated`,
      data: Brand,
    };
  }

  @Delete('/:id')
  async deleteBrand(@Param('id', ParseUUIDPipe) id: string) {
    const Brand = await this.BrandService.deleteBrand(id);

    return {
      success: true,
      statusCode: 200,
      message: `Brand of ${Brand.id} deleted`,
      data: Brand,
    };
  }
}
