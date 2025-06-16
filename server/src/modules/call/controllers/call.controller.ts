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
import { CreateCallsDto, FilterCallsDto, UpdateCallsDto } from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { CallService } from '../services/call.service';

@UseGuards(JwtAuthGuard)
@Controller('Calls')
export class CallController {
  private logger = new Logger(CallController.name);

  constructor(private readonly CallService: CallService) {}

  @Get('/')
  async getCallss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterCallsDto: FilterCallsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Callss.`);

    console.log('ctx', ctx);

    const Callss = await this.CallService.getCalls(ctx, filterCallsDto);

    return {
      success: true,
      statusCode: 200,
      Call: `List of Callss`,
      totalRecords: Callss.length,
      data: Callss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getCalls(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const Calls = await this.CallService.getCall(ctx, id);

    return {
      success: true,
      statusCode: 200,
      Call: `Details of Calls of id: ${id}`,
      data: Calls,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createCalls(
    @RequestContext() ctx: RequestContextDto,
    @Body() createCallsDto: CreateCallsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new Calls`);

    const Calls = await this.CallService.createCall(ctx, createCallsDto);

    return {
      success: true,
      statusCode: 201,
      Call: `New Calls Created`,
      data: Calls,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateCalls(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCallsDto: UpdateCallsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating Calls  of id ${id}`,
    // );

    const Calls = await this.CallService.updateCall(ctx, id, updateCallsDto);

    return {
      success: true,
      statusCode: 200,
      Call: `Calls of id: ${id} updated`,
      data: Calls,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteCall(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a Calls  of id ${id}.`,
    // );

    const Calls = await this.CallService.deleteCall(ctx, id);

    return {
      success: true,
      statusCode: 200,
      Call: `Calls of id: ${id} deleted`,
      data: Calls,
    };
  }
}
