/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMessagesDto,
  FilterMessagesDto,
  UpdateMessagesDto,
} from '../dtos';
import { MessagesEntity } from '../entities/message.entity';

@Injectable()
export class MessagesService {
  private logger = new Logger(MessagesService.name);

  constructor(
    @InjectRepository(MessagesEntity)
    private readonly MessagesRepo: Repository<MessagesEntity>,
  ) {}

  getMessagess(
    ctx: RequestContextDto,
    filterMessagesDto: FilterMessagesDto,
  ): Promise<MessagesEntity[]> {
    this.logger.log(`${this.getMessagess.name} called`);

    const { senderId, receiverId } = filterMessagesDto;

    // const reqQuery: { senderId: string; receiverId: string } = {} as {
    //   senderId: string;
    //   receiverId: string;
    // };
    // if (senderId) {
    //   reqQuery.senderId = senderId;
    // }

    // if (receiverId) {
    //   reqQuery.receiverId = receiverId;
    // }

    // console.log('reqQuery', reqQuery);

    return this.MessagesRepo.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: { createdAt: 'ASC' }, // optional: order by timestamp
    });
  }

  async getMessagessNested(ctx: RequestContextDto): Promise<MessagesEntity[]> {
    this.logger.log(`${this.getMessagessNested.name} called`);
    const start = process.hrtime();

    const qb = this.MessagesRepo.createQueryBuilder('Messages')
      .select([
        'Messages.id',
        'Messages.name',
        'upazilas.id',
        'upazilas.name',
        'unions.id',
        'unions.name',
      ])

      .leftJoin('Messages.upazilas', 'upazilas')
      .leftJoin('upazilas.unions', 'unions');

    const result = await qb.getMany();

    const stop = process.hrtime(start);
    this.logger.log(
      `Getting nested Messages took ${(stop[0] * 1e9 + stop[1]) / 1e6} ms`,
    );

    return result;
  }

  getMessagessWithRelation(
    ctx: RequestContextDto,
    filterMessagesDto: FilterMessagesDto,
  ): Promise<MessagesEntity[]> {
    this.logger.log(`${this.getMessagessWithRelation.name} called`);

    const reqQuery: any = {};

    return this.MessagesRepo.find({
      where: reqQuery,
    });
  }

  async getMessages(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessagesEntity> {
    this.logger.log(`${this.getMessages.name} called`);

    const Messages = await this.MessagesRepo.findOne({ where: { id } });
    if (!Messages) {
      throw new NotFoundException(`Messages of id ${id} not found.`);
    }

    return Messages;
  }

  async createMessages(
    ctx: RequestContextDto,
    createMessagesDto: CreateMessagesDto,
  ): Promise<MessagesEntity> {
    this.logger.log(`${this.createMessages.name} called`);

    const Messages = this.MessagesRepo.create(createMessagesDto);

    await this.MessagesRepo.save(Messages);

    // const logDto = { actionType: LogActionType.Create,  MessagesId: Messages.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Messages;
  }

  async updateMessages(
    ctx: RequestContextDto,
    id: string,
    updateMessagesDto: UpdateMessagesDto,
  ): Promise<MessagesEntity> {
    this.logger.log(`${this.updateMessages.name} called`);

    const Messages = await this.getMessages(ctx, id);
    this.MessagesRepo.merge(Messages, updateMessagesDto);

    await this.MessagesRepo.save(Messages);

    // const logDto = { actionType: LogActionType.Update,  MessagesId: Messages.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Messages;
  }

  async deleteMessages(
    ctx: RequestContextDto,
    id: string,
  ): Promise<MessagesEntity> {
    this.logger.log(`${this.deleteMessages.name} called`);

    const Messages = await this.getMessages(ctx, id);
    await this.MessagesRepo.remove(Messages);

    // const logDto = { actionType: LogActionType.Delete,  MessagesId: Messages.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Messages;
  }

  clearMessagesData() {
    this.logger.log(`${this.clearMessagesData.name} called`);
    return this.MessagesRepo.clear();
  }
}
