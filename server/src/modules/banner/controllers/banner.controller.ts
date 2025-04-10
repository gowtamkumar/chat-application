import { FilterBannerDto } from '../dtos/filter-bannerdto';
import { CreateBannerDto } from '../dtos/create-banner.dto';
import { BannerService } from '../services/banner.service';
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
import { UpdateBannerDto } from '../dtos';

@UseGuards(JwtAuthGuard)
@Controller('banners')
export class BannerController {
  private readonly logger = new Logger(BannerController.name);

  constructor(private readonly BannerService: BannerService) {}

  @Post('/')
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    const Banner = await this.BannerService.createBanner(createBannerDto);

    return {
      success: true,
      statusCode: 201,
      message: `New Banner created`,
      data: Banner,
    };
  }

  @Get('/')
  async getBanners(@Query() filterBannerDto: FilterBannerDto) {
    const Banners = await this.BannerService.getBanners(filterBannerDto);

    return {
      success: true,
      statusCode: 200,
      message: `List of Banner`,
      data: Banners,
    };
  }

  @Get('/:id')
  async getBanner(@Param('id', ParseUUIDPipe) id: string) {
    const Banner = await this.BannerService.getBanner(id);

    return {
      success: true,
      statusCode: 200,
      message: `Banner of ID: ${id}`,
      data: Banner,
    };
  }

  @Put('/:id')
  async updateBanner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    const Banner = await this.BannerService.updateBanner(id, updateBannerDto);

    return {
      success: true,
      statusCode: 200,
      message: `Banner of ID ${Banner.id} updated`,
      data: Banner,
    };
  }

  @Delete('/:id')
  async deleteBanner(@Param('id', ParseUUIDPipe) id: string) {
    const Banner = await this.BannerService.deleteBanner(id);

    return {
      success: true,
      statusCode: 200,
      message: `Banner of ${Banner.id} deleted`,
      data: Banner,
    };
  }
}
