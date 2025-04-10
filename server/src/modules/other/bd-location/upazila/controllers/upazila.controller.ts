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
import { CreateUpazilaDto, FilterUpazilaDto, UpdateUpazilaDto } from '../dtos';
import { UpazilaService } from '../services/upazila.service';
import { RequestContext } from '@common/decorators/current-user.decorator';

@Controller('upazilas')
export class UpazilaController {
  private logger = new Logger(UpazilaController.name);

  constructor(private readonly upazilaService: UpazilaService) {}

  @Get('/')
  async getUpazilas(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterUpazilaDto: FilterUpazilaDto,
  ) {
    this.logger.verbose(`User "${ctx.user?.username}" retriving all Upazilas`);

    const upazilas = await this.upazilaService.getUpazilas(
      ctx,
      filterUpazilaDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Upazilas`,
      totalRecords: upazilas.length,
      data: upazilas,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUpazila(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" retieving Upazila of id: ${id}`,
    );

    const upazila = await this.upazilaService.getUpazila(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Details of Upazila of id: ${id}`,
      data: upazila,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createUpazila(
    @RequestContext() ctx: RequestContextDto,
    @Body() createUpazilaDto: CreateUpazilaDto,
  ) {
    this.logger.verbose(`User "${ctx.user?.username}" creating new Upazila`);

    const upazila = await this.upazilaService.createUpazila(
      ctx,
      createUpazilaDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New Upazila Created`,
      data: upazila,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateUpazila(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUpazilaDto: UpdateUpazilaDto,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" updating Upazila  of id ${id}`,
    );

    const upazila = await this.upazilaService.updateUpazila(
      ctx,
      id,
      updateUpazilaDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Upazila of id: ${id} updated`,
      data: upazila,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUpazila(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" deleting a Upazila  of id ${id}.`,
    );

    const upazila = await this.upazilaService.deleteUpazila(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Upazila of id: ${id} deleted`,
      data: upazila,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/initiate')
  async initiateUpazilaData(@RequestContext() ctx: RequestContextDto) {
    this.logger.verbose(`User "${ctx.user?.username}" initiate upazila data.`);

    const upazilas = await this.upazilaService.initiateUpazilaData();

    return {
      success: true,
      statusCode: 200,
      message: `List of  upazilas`,
      totalRecords: upazilas.length,
      data: upazilas,
    };
  }
}
