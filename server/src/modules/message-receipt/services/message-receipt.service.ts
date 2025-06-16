/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateMessageReceiptsDto,
  FilterMessageReceiptsDto,
  UpdateMessageReceiptsDto,
} from '../dtos';
import fs from 'fs';
import { Repository } from 'typeorm';
import { MessageReceiptsEntity } from '../entities/message-receipt.entity';

@Injectable()
export class MessageReceiptsService {
  private logger = new Logger(MessageReceiptsService.name);

  constructor(
    @InjectRepository(MessageReceiptsEntity)
    private readonly MessageReceiptsRepo: Repository<MessageReceiptsEntity>,
  ) {}

  getMessageReceiptss(
    ctx: RequestContextDto,
    filterMessageReceiptsDto: FilterMessageReceiptsDto,
  ): Promise<MessageReceiptsEntity[]> {
    this.logger.log(`${this.getMessageReceiptss.name} called`);

    const reqQuery: any = {};

    return this.MessageReceiptsRepo.find({ where: reqQuery });
  }

  async getMessageReceipts(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessageReceiptsEntity> {
    this.logger.log(`${this.getMessageReceipts.name} called`);

    const MessageReceipts = await this.MessageReceiptsRepo.findOne({
      where: { id },
    });
    if (!MessageReceipts) {
      throw new NotFoundException(`MessageReceipts of id ${id} not found.`);
    }

    return MessageReceipts;
  }

  async createMessageReceipts(
    ctx: RequestContextDto,
    createMessageReceiptsDto: CreateMessageReceiptsDto,
  ): Promise<MessageReceiptsEntity> {
    this.logger.log(`${this.createMessageReceipts.name} called`);

    const MessageReceipts = this.MessageReceiptsRepo.create(
      createMessageReceiptsDto,
    );

    await this.MessageReceiptsRepo.save(MessageReceipts);

    // const logDto = { actionType: LogActionType.Create,  MessageReceiptsId: MessageReceipts.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReceipts;
  }

  async updateMessageReceipts(
    ctx: RequestContextDto,
    id: string,
    updateMessageReceiptsDto: UpdateMessageReceiptsDto,
  ): Promise<MessageReceiptsEntity> {
    this.logger.log(`${this.updateMessageReceipts.name} called`);

    const MessageReceipts = await this.getMessageReceipts(ctx, id);
    this.MessageReceiptsRepo.merge(MessageReceipts, updateMessageReceiptsDto);

    await this.MessageReceiptsRepo.save(MessageReceipts);

    // const logDto = { actionType: LogActionType.Update,  MessageReceiptsId: MessageReceipts.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReceipts;
  }

  async deleteMessageReceipts(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessageReceiptsEntity> {
    this.logger.log(`${this.deleteMessageReceipts.name} called`);

    const MessageReceipts = await this.getMessageReceipts(ctx, id);
    await this.MessageReceiptsRepo.remove(MessageReceipts);

    // const logDto = { actionType: LogActionType.Delete,  MessageReceiptsId: MessageReceipts.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReceipts;
  }
}
