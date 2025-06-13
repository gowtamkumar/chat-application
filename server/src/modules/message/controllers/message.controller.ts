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
  CreateMessagesDto,
  FilterMessagesDto,
  UpdateMessagesDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { MessagesService } from '../services/message.service';

// @UseGuards(JwtAuthGuard)
@Controller('messagess')
export class MessagesController {
  private logger = new Logger(MessagesController.name);

  constructor(private readonly MessagesService: MessagesService) {}

  @Get('/')
  async getMessagess(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterMessagesDto: FilterMessagesDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Messagess.`);

    console.log('ctx', ctx);

    const Messagess = await this.MessagesService.getMessagess(
      ctx,
      filterMessagesDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Messagess`,
      totalRecords: Messagess.length,
      data: Messagess,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getMessages(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const Messages = await this.MessagesService.getMessages(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Details of Messages of id: ${id}`,
      data: Messages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createMessages(
    @RequestContext() ctx: RequestContextDto,
    @Body() createMessagesDto: CreateMessagesDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new Messages`);

    const Messages = await this.MessagesService.createMessages(
      ctx,
      createMessagesDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New Messages Created`,
      data: Messages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateMessages(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMessagesDto: UpdateMessagesDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating Messages  of id ${id}`,
    // );

    const Messages = await this.MessagesService.updateMessages(
      ctx,
      id,
      updateMessagesDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Messages of id: ${id} updated`,
      data: Messages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMessages(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a Messages  of id ${id}.`,
    // );

    const Messages = await this.MessagesService.deleteMessages(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Messages of id: ${id} deleted`,
      data: Messages,
    };
  }
  // : Promise<BaseApiSuccessResponse<MessagesEntity[]>>

  @UseGuards(JwtAuthGuard)
  @Post('/initiate')
  async initiateMessagesData(@RequestContext() ctx: RequestContextDto) {
    this.logger.verbose(`User "${ctx.user?.username}" initiate Messages data.`);

    const Messagess = await this.MessagesService.initiateMessagesData();

    return {
      success: true,
      statusCode: 200,
      message: `List of  Messagess`,
      totalRecords: Messagess.length,
      data: Messagess,
    };
  }
}
