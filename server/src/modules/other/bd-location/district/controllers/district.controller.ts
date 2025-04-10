/* eslint-disable @typescript-eslint/no-unsafe-call */
import { JwtAuthGuard } from '@admin/auth/guards/jwt-auth.guard';
import { RequestContextDto } from '@common/dtos/request-context.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateDistrictDto,
  FilterDistrictDto,
  UpdateDistrictDto,
} from '../dtos';
import { DistrictService } from '../services/district.service';
import { RequestContext } from '@common/decorators/current-user.decorator';

@Controller('districts')
export class DistrictController {
  private logger = new Logger(DistrictController.name);

  constructor(private readonly districtService: DistrictService) {}

  @Get('/')
  async getDistricts(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterDistrictDto: FilterDistrictDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Districts.`);

    const districts = await this.districtService.getDistricts(
      ctx,
      filterDistrictDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Districts`,
      totalRecords: districts.length,
      data: districts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getDistrict(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" retieving District of id: ${id}`,
    // );

    const district = await this.districtService.getDistrict(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Details of District of id: ${id}`,
      data: district,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createDistrict(
    @RequestContext() ctx: RequestContextDto,
    @Body() createDistrictDto: CreateDistrictDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new District`);

    const district = await this.districtService.createDistrict(
      ctx,
      createDistrictDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New District Created`,
      data: district,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateDistrict(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating District  of id ${id}`,
    // );

    const district = await this.districtService.updateDistrict(
      ctx,
      id,
      updateDistrictDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `District of id: ${id} updated`,
      data: district,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteDistrict(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a District  of id ${id}.`,
    // );

    const district = await this.districtService.deleteDistrict(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `District of id: ${id} deleted`,
      data: district,
    };
  }
  // : Promise<BaseApiSuccessResponse<DistrictEntity[]>>

  @UseGuards(JwtAuthGuard)
  @Post('/initiate')
  async initiateDistrictData(@RequestContext() ctx: RequestContextDto) {
    this.logger.verbose(`User "${ctx.user?.username}" initiate district data.`);

    const districts = await this.districtService.initiateDistrictData();

    return {
      success: true,
      statusCode: 200,
      message: `List of  districts`,
      totalRecords: districts.length,
      data: districts,
    };
  }
}
