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
  CreateMessageReceiptsDto,
  FilterMessageReceiptsDto,
  UpdateMessageReceiptsDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { MessageReceiptsService } from '../services/message-receipt.service';

@UseGuards(JwtAuthGuard)
@Controller('message-receipts')
export class MessageReceiptsController {
  private logger = new Logger(MessageReceiptsController.name);

  constructor(
    private readonly MessageReceiptsService: MessageReceiptsService,
  ) {}

  @Get('/')
  async getMessageReceiptss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterMessageReceiptsDto: FilterMessageReceiptsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving MessageReceiptss.`);

    const MessageReceiptss =
      await this.MessageReceiptsService.getMessageReceiptss(
        ctx,
        filterMessageReceiptsDto,
      );

    return {
      success: true,
      statusCode: 200,
      MessageReceipt: `List of MessageReceiptss`,
      totalRecords: MessageReceiptss.length,
      data: MessageReceiptss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getMessageReceipts(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const MessageReceipts =
      await this.MessageReceiptsService.getMessageReceipts(ctx, id);

    return {
      success: true,
      statusCode: 200,
      MessageReceipt: `Details of MessageReceipts of id: ${id}`,
      data: MessageReceipts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createMessageReceipts(
    @RequestContext() ctx: RequestContextDto,
    @Body() createMessageReceiptsDto: CreateMessageReceiptsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new MessageReceipts`);

    const MessageReceipts =
      await this.MessageReceiptsService.createMessageReceipts(
        ctx,
        createMessageReceiptsDto,
      );

    return {
      success: true,
      statusCode: 201,
      MessageReceipt: `New MessageReceipts Created`,
      data: MessageReceipts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateMessageReceipts(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMessageReceiptsDto: UpdateMessageReceiptsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating MessageReceipts  of id ${id}`,
    // );

    const MessageReceipts =
      await this.MessageReceiptsService.updateMessageReceipts(
        ctx,
        id,
        updateMessageReceiptsDto,
      );

    return {
      success: true,
      statusCode: 200,
      MessageReceipt: `MessageReceipts of id: ${id} updated`,
      data: MessageReceipts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMessageReceipts(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a MessageReceipts  of id ${id}.`,
    // );

    const MessageReceipts =
      await this.MessageReceiptsService.deleteMessageReceipts(ctx, id);

    return {
      success: true,
      statusCode: 200,
      MessageReceipt: `MessageReceipts of id: ${id} deleted`,
      data: MessageReceipts,
    };
  }
}
