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
  CreateCallParticipantsDto,
  FilterCallParticipantsDto,
  UpdateCallParticipantsDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { CallParticipantService } from '../services/call-participant.service';

@UseGuards(JwtAuthGuard)
@Controller('CallParticipants')
export class CallParticipantController {
  private logger = new Logger(CallParticipantController.name);

  constructor(
    private readonly CallParticipantService: CallParticipantService,
  ) {}

  @Get('/')
  async getCallParticipantss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterCallParticipantsDto: FilterCallParticipantsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving CallParticipantss.`);

    console.log('ctx', ctx);

    const CallParticipantss =
      await this.CallParticipantService.getCallParticipants(
        ctx,
        filterCallParticipantsDto,
      );

    return {
      success: true,
      statusCode: 200,
      CallParticipant: `List of CallParticipantss`,
      totalRecords: CallParticipantss.length,
      data: CallParticipantss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getCallParticipants(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const CallParticipants =
      await this.CallParticipantService.getCallParticipant(ctx, id);

    return {
      success: true,
      statusCode: 200,
      CallParticipant: `Details of CallParticipants of id: ${id}`,
      data: CallParticipants,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createCallParticipants(
    @RequestContext() ctx: RequestContextDto,
    @Body() createCallParticipantsDto: CreateCallParticipantsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new CallParticipants`);

    const CallParticipants =
      await this.CallParticipantService.createCallParticipant(
        ctx,
        createCallParticipantsDto,
      );

    return {
      success: true,
      statusCode: 201,
      CallParticipant: `New CallParticipants Created`,
      data: CallParticipants,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateCallParticipants(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCallParticipantsDto: UpdateCallParticipantsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating CallParticipants  of id ${id}`,
    // );

    const CallParticipants =
      await this.CallParticipantService.updateCallParticipant(
        ctx,
        id,
        updateCallParticipantsDto,
      );

    return {
      success: true,
      statusCode: 200,
      CallParticipant: `CallParticipants of id: ${id} updated`,
      data: CallParticipants,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteCallParticipant(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a CallParticipants  of id ${id}.`,
    // );

    const CallParticipants =
      await this.CallParticipantService.deleteCallParticipant(ctx, id);

    return {
      success: true,
      statusCode: 200,
      CallParticipant: `CallParticipants of id: ${id} deleted`,
      data: CallParticipants,
    };
  }
}
