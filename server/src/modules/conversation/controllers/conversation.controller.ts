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
  CreateConversationDto,
  FilterConversationDto,
  UpdateConversationDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { ConversationService } from '../services/conversation.service';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  private logger = new Logger(ConversationController.name);

  constructor(private readonly ConversationService: ConversationService) {}

  @Get('/')
  async getConversations(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterConversationDto: FilterConversationDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Conversations.`);

    const Conversations = await this.ConversationService.getConversations(
      ctx,
      filterConversationDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Conversations`,
      totalRecords: Conversations.length,
      data: Conversations,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getConversation(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const Conversation = await this.ConversationService.getConversation(
      ctx,
      id,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Details of Conversation of id: ${id}`,
      data: Conversation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createConversation(
    @RequestContext() ctx: RequestContextDto,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new Conversation`);

    const Conversation = await this.ConversationService.createConversation(
      ctx,
      createConversationDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New Conversation Created`,
      data: Conversation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateConversation(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating Conversation  of id ${id}`,
    // );

    const Conversation = await this.ConversationService.updateConversation(
      ctx,
      id,
      updateConversationDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Conversation of id: ${id} updated`,
      data: Conversation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteConversation(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a Conversation  of id ${id}.`,
    // );

    const Conversation = await this.ConversationService.deleteConversation(
      ctx,
      id,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Conversation of id: ${id} deleted`,
      data: Conversation,
    };
  }
}
