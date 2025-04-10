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
  CreateDivisionDto,
  FilterDivisionDto,
  UpdateDivisionDto,
} from '../dtos';
import { DivisionService } from '../services/division.service';
import { RequestContext } from '@common/decorators/current-user.decorator';

@Controller('divisions')
export class DivisionController {
  private logger = new Logger(DivisionController.name);

  constructor(private readonly divisionService: DivisionService) {}

  @Get('/')
  async getDivisions(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterDivisionDto: FilterDivisionDto,
  ) {
    this.logger.verbose(`User "${ctx.user?.username}" retieving Divisions.`);

    const divisions = await this.divisionService.getDivisions(
      ctx,
      filterDivisionDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Divisions`,
      totalRecords: divisions.length,
      data: divisions,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getDivision(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" retieving Division of id: ${id}`,
    );

    const division = await this.divisionService.getDivision(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Details of Division of id: ${id}`,
      data: division,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createDivision(
    @RequestContext() ctx: RequestContextDto,
    @Body() createDivisionDto: CreateDivisionDto,
  ) {
    this.logger.verbose(`User "${ctx.user?.username}" retieving Division`);

    const division = await this.divisionService.createDivision(
      ctx,
      createDivisionDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New Division Created`,
      data: division,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateDivision(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" retieving Division of id: ${id}`,
    );

    const division = await this.divisionService.updateDivision(
      ctx,
      id,
      updateDivisionDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Division of id: ${id} updated`,
      data: division,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteDivision(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.verbose(
      `User "${ctx.user?.username}" deleting a Division  of id ${id}.`,
    );

    const division = await this.divisionService.deleteDivision(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Division of id: ${id} deleted`,
      data: division,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/initiate')
  async initiateDivisionData(@RequestContext() ctx: RequestContextDto) {
    this.logger.verbose(`User "${ctx.user?.username}" initiate division data.`);

    const divisions = await this.divisionService.initiateDivisionData();

    return {
      success: true,
      statusCode: 200,
      message: `List of divisions`,
      totalRecords: divisions.length,
      data: divisions,
    };
  }
}
