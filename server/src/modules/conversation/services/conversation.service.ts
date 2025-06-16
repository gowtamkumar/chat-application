/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateConversationDto,
  FilterConversationDto,
  UpdateConversationDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';

@Injectable()
export class ConversationService {
  private logger = new Logger(ConversationService.name);

  constructor(
    @InjectRepository(ConversationEntity)
    private readonly ConversationRepo: Repository<ConversationEntity>,
  ) {}

  getConversations(
    ctx: RequestContextDto,
    filterConversationDto: FilterConversationDto,
  ): Promise<ConversationEntity[]> {
    this.logger.log(`${this.getConversations.name} called`);

    const reqQuery: any = {};

    return this.ConversationRepo.find({ where: reqQuery });
  }

  async getConversation(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ConversationEntity> {
    this.logger.log(`${this.getConversation.name} called`);

    const Conversation = await this.ConversationRepo.findOne({ where: { id } });
    if (!Conversation) {
      throw new NotFoundException(`Conversation of id ${id} not found.`);
    }

    return Conversation;
  }

  async createConversation(
    ctx: RequestContextDto,
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    this.logger.log(`${this.createConversation.name} called`);

    const Conversation = this.ConversationRepo.create(createConversationDto);

    await this.ConversationRepo.save(Conversation);

    // const logDto = { actionType: LogActionType.Create,  ConversationId: Conversation.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Conversation;
  }

  async updateConversation(
    ctx: RequestContextDto,
    id: string,
    updateConversationDto: UpdateConversationDto,
  ) {
    this.logger.log(`${this.updateConversation.name} called`);

    const Conversation = await this.getConversation(ctx, id);
    this.ConversationRepo.merge(Conversation, updateConversationDto);
    await this.ConversationRepo.save(Conversation);
    return Conversation;
  }

  async deleteConversation(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ConversationEntity> {
    this.logger.log(`${this.deleteConversation.name} called`);

    const Conversation = await this.getConversation(ctx, id);
    await this.ConversationRepo.remove(Conversation);

    return Conversation;
  }
}
