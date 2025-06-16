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
  CreateScreenShareLogsDto,
  FilterScreenShareLogsDto,
  UpdateScreenShareLogsDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { ScreenShareLogService } from '../services/screen-share-logs.service';

@UseGuards(JwtAuthGuard)
@Controller('ScreenShareLogs')
export class ScreenShareLogController {
  private logger = new Logger(ScreenShareLogController.name);

  constructor(private readonly ScreenShareLogService: ScreenShareLogService) {}

  @Get('/')
  async getScreenShareLogss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterScreenShareLogsDto: FilterScreenShareLogsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving ScreenShareLogss.`);

    console.log('ctx', ctx);

    const ScreenShareLogss =
      await this.ScreenShareLogService.getScreenShareLogs(
        ctx,
        filterScreenShareLogsDto,
      );

    return {
      success: true,
      statusCode: 200,
      ScreenShareLog: `List of ScreenShareLogss`,
      totalRecords: ScreenShareLogss.length,
      data: ScreenShareLogss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getScreenShareLogs(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const ScreenShareLogs = await this.ScreenShareLogService.getScreenShareLog(
      ctx,
      id,
    );

    return {
      success: true,
      statusCode: 200,
      ScreenShareLog: `Details of ScreenShareLogs of id: ${id}`,
      data: ScreenShareLogs,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createScreenShareLogs(
    @RequestContext() ctx: RequestContextDto,
    @Body() createScreenShareLogsDto: CreateScreenShareLogsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new ScreenShareLogs`);

    const ScreenShareLogs =
      await this.ScreenShareLogService.createScreenShareLog(
        ctx,
        createScreenShareLogsDto,
      );

    return {
      success: true,
      statusCode: 201,
      ScreenShareLog: `New ScreenShareLogs Created`,
      data: ScreenShareLogs,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateScreenShareLogs(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateScreenShareLogsDto: UpdateScreenShareLogsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating ScreenShareLogs  of id ${id}`,
    // );

    const ScreenShareLogs =
      await this.ScreenShareLogService.updateScreenShareLog(
        ctx,
        id,
        updateScreenShareLogsDto,
      );

    return {
      success: true,
      statusCode: 200,
      ScreenShareLog: `ScreenShareLogs of id: ${id} updated`,
      data: ScreenShareLogs,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteScreenShareLog(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a ScreenShareLogs  of id ${id}.`,
    // );

    const ScreenShareLogs =
      await this.ScreenShareLogService.deleteScreenShareLog(ctx, id);

    return {
      success: true,
      statusCode: 200,
      ScreenShareLog: `ScreenShareLogs of id: ${id} deleted`,
      data: ScreenShareLogs,
    };
  }
}
