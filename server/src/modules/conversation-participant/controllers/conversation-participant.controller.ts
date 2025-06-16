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
  CreateConversationParticipantDto,
  FilterConversationParticipantDto,
  UpdateConversationParticipantDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { ConversationParticipantService } from '../services/conversation-participant.service';

@UseGuards(JwtAuthGuard)
@Controller('conversation-participants')
export class ConversationParticipantController {
  private logger = new Logger(ConversationParticipantController.name);

  constructor(
    private readonly ConversationParticipantService: ConversationParticipantService,
  ) {}

  @Get('/')
  async getConversationParticipants(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterConversationParticipantDto: FilterConversationParticipantDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving ConversationParticipants.`);

    const ConversationParticipants =
      await this.ConversationParticipantService.getConversationParticipants(
        ctx,
        filterConversationParticipantDto,
      );

    return {
      success: true,
      statusCode: 200,
      message: `List of ConversationParticipants`,
      totalRecords: ConversationParticipants.length,
      data: ConversationParticipants,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getConversationParticipant(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const ConversationParticipant =
      await this.ConversationParticipantService.getConversationParticipant(
        ctx,
        id,
      );

    return {
      success: true,
      statusCode: 200,
      message: `Details of ConversationParticipant of id: ${id}`,
      data: ConversationParticipant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createConversationParticipant(
    @RequestContext() ctx: RequestContextDto,
    @Body() createConversationParticipantDto: CreateConversationParticipantDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new ConversationParticipant`);

    const ConversationParticipant =
      await this.ConversationParticipantService.createConversationParticipant(
        ctx,
        createConversationParticipantDto,
      );

    return {
      success: true,
      statusCode: 201,
      message: `New ConversationParticipant Created`,
      data: ConversationParticipant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateConversationParticipant(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateConversationParticipantDto: UpdateConversationParticipantDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating ConversationParticipant  of id ${id}`,
    // );

    const ConversationParticipant =
      await this.ConversationParticipantService.updateConversationParticipant(
        ctx,
        id,
        updateConversationParticipantDto,
      );

    return {
      success: true,
      statusCode: 200,
      message: `ConversationParticipant of id: ${id} updated`,
      data: ConversationParticipant,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteConversationParticipant(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a ConversationParticipant  of id ${id}.`,
    // );

    const ConversationParticipant =
      await this.ConversationParticipantService.deleteConversationParticipant(
        ctx,
        id,
      );

    return {
      success: true,
      statusCode: 200,
      message: `ConversationParticipant of id: ${id} deleted`,
      data: ConversationParticipant,
    };
  }
}
