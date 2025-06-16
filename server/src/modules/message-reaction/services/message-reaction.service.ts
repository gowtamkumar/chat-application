/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateMessageReactionsDto,
  FilterMessageReactionsDto,
  UpdateMessageReactionsDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { MessageReactionsEntity } from '../entities/message-reaction.entity';

@Injectable()
export class MessageReactionsService {
  private logger = new Logger(MessageReactionsService.name);

  constructor(
    @InjectRepository(MessageReactionsEntity)
    private readonly MessageReactionsRepo: Repository<MessageReactionsEntity>,
  ) {}

  getMessageReactionss(
    ctx: RequestContextDto,
    filterMessageReactionsDto: FilterMessageReactionsDto,
  ): Promise<MessageReactionsEntity[]> {
    this.logger.log(`${this.getMessageReactionss.name} called`);

    const reqQuery: any = {};

    return this.MessageReactionsRepo.find({ where: reqQuery });
  }

  async getMessageReactionssNested(
    ctx: RequestContextDto,
  ): Promise<MessageReactionsEntity[]> {
    this.logger.log(`${this.getMessageReactionss.name} called`);
    const start = process.hrtime();

    const qb = this.MessageReactionsRepo.createQueryBuilder('MessageReactions')
      .select([
        'MessageReactions.id',
        'MessageReactions.name',
        'upazilas.id',
        'upazilas.name',
        'unions.id',
        'unions.name',
      ])

      .leftJoin('MessageReactions.upazilas', 'upazilas')
      .leftJoin('upazilas.unions', 'unions');

    const result = await qb.getMany();

    const stop = process.hrtime(start);
    this.logger.log(
      `Getting nested MessageReactions took ${(stop[0] * 1e9 + stop[1]) / 1e6} ms`,
    );

    return result;
  }

  getMessageReactionssWithRelation(
    ctx: RequestContextDto,
    filterMessageReactionsDto: FilterMessageReactionsDto,
  ): Promise<MessageReactionsEntity[]> {
    this.logger.log(`${this.getMessageReactionss.name} called`);

    const reqQuery: any = {};

    return this.MessageReactionsRepo.find({
      where: reqQuery,
    });
  }

  async getMessageReactions(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessageReactionsEntity> {
    this.logger.log(`${this.getMessageReactions.name} called`);

    const MessageReactions = await this.MessageReactionsRepo.findOne({
      where: { id },
    });
    if (!MessageReactions) {
      throw new NotFoundException(`MessageReactions of id ${id} not found.`);
    }

    return MessageReactions;
  }

  async createMessageReactions(
    ctx: RequestContextDto,
    createMessageReactionsDto: CreateMessageReactionsDto,
  ): Promise<MessageReactionsEntity> {
    this.logger.log(`${this.createMessageReactions.name} called`);

    const MessageReactions = this.MessageReactionsRepo.create(
      createMessageReactionsDto,
    );

    await this.MessageReactionsRepo.save(MessageReactions);

    // const logDto = { actionType: LogActionType.Create,  MessageReactionsId: MessageReactions.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReactions;
  }

  async updateMessageReactions(
    ctx: RequestContextDto,
    id: string,
    updateMessageReactionsDto: UpdateMessageReactionsDto,
  ): Promise<MessageReactionsEntity> {
    this.logger.log(`${this.updateMessageReactions.name} called`);

    const MessageReactions = await this.getMessageReactions(ctx, id);
    this.MessageReactionsRepo.merge(
      MessageReactions,
      updateMessageReactionsDto,
    );

    await this.MessageReactionsRepo.save(MessageReactions);

    // const logDto = { actionType: LogActionType.Update,  MessageReactionsId: MessageReactions.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReactions;
  }

  async deleteMessageReactions(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessageReactionsEntity> {
    this.logger.log(`${this.deleteMessageReactions.name} called`);

    const MessageReactions = await this.getMessageReactions(ctx, id);
    await this.MessageReactionsRepo.remove(MessageReactions);

    // const logDto = { actionType: LogActionType.Delete,  MessageReactionsId: MessageReactions.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return MessageReactions;
  }

  clearMessageReactionsData() {
    this.logger.log(`${this.clearMessageReactionsData.name} called`);
    return this.MessageReactionsRepo.clear();
  }
}
