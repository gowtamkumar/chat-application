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
  CreateMessageReactionsDto,
  FilterMessageReactionsDto,
  UpdateMessageReactionsDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { MessageReactionsService } from '../services/message-reaction.service';

@UseGuards(JwtAuthGuard)
@Controller('message-reactions')
export class MessageReactionsController {
  private logger = new Logger(MessageReactionsController.name);

  constructor(
    private readonly MessageReactionsService: MessageReactionsService,
  ) {}

  @Get('/')
  async getMessageReactionss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterMessageReactionsDto: FilterMessageReactionsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving MessageReactionss.`);

    console.log('ctx', ctx);

    const MessageReactionss =
      await this.MessageReactionsService.getMessageReactionss(
        ctx,
        filterMessageReactionsDto,
      );

    return {
      success: true,
      statusCode: 200,
      MessageReaction: `List of MessageReactionss`,
      totalRecords: MessageReactionss.length,
      data: MessageReactionss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getMessageReactions(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const MessageReactions =
      await this.MessageReactionsService.getMessageReactions(ctx, id);

    return {
      success: true,
      statusCode: 200,
      MessageReaction: `Details of MessageReactions of id: ${id}`,
      data: MessageReactions,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createMessageReactions(
    @RequestContext() ctx: RequestContextDto,
    @Body() createMessageReactionsDto: CreateMessageReactionsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new MessageReactions`);

    const MessageReactions =
      await this.MessageReactionsService.createMessageReactions(
        ctx,
        createMessageReactionsDto,
      );

    return {
      success: true,
      statusCode: 201,
      MessageReaction: `New MessageReactions Created`,
      data: MessageReactions,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateMessageReactions(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMessageReactionsDto: UpdateMessageReactionsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating MessageReactions  of id ${id}`,
    // );

    const MessageReactions =
      await this.MessageReactionsService.updateMessageReactions(
        ctx,
        id,
        updateMessageReactionsDto,
      );

    return {
      success: true,
      statusCode: 200,
      MessageReaction: `MessageReactions of id: ${id} updated`,
      data: MessageReactions,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMessageReactions(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a MessageReactions  of id ${id}.`,
    // );

    const MessageReactions =
      await this.MessageReactionsService.deleteMessageReactions(ctx, id);

    return {
      success: true,
      statusCode: 200,
      MessageReaction: `MessageReactions of id: ${id} deleted`,
      data: MessageReactions,
    };
  }
}
