/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateConversationParticipantDto,
  FilterConversationParticipantDto,
  UpdateConversationParticipantDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { ConversationParticipantEntity } from '../entities/conversation-participant.entity';

@Injectable()
export class ConversationParticipantService {
  private logger = new Logger(ConversationParticipantService.name);

  constructor(
    @InjectRepository(ConversationParticipantEntity)
    private readonly ConversationParticipantRepo: Repository<ConversationParticipantEntity>,
  ) {}

  getConversationParticipants(
    ctx: RequestContextDto,
    filterConversationParticipantDto: FilterConversationParticipantDto,
  ): Promise<ConversationParticipantEntity[]> {
    this.logger.log(`${this.getConversationParticipants.name} called`);

    const reqQuery: any = {};

    return this.ConversationParticipantRepo.find({ where: reqQuery });
  }

  async getConversationParticipant(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ConversationParticipantEntity> {
    this.logger.log(`${this.getConversationParticipant.name} called`);

    const ConversationParticipant =
      await this.ConversationParticipantRepo.findOne({ where: { id } });
    if (!ConversationParticipant) {
      throw new NotFoundException(
        `ConversationParticipant of id ${id} not found.`,
      );
    }

    return ConversationParticipant;
  }

  async createConversationParticipant(
    ctx: RequestContextDto,
    createConversationParticipantDto: CreateConversationParticipantDto,
  ): Promise<ConversationParticipantEntity> {
    this.logger.log(`${this.createConversationParticipant.name} called`);

    const ConversationParticipant = this.ConversationParticipantRepo.create(
      createConversationParticipantDto,
    );

    await this.ConversationParticipantRepo.save(ConversationParticipant);

    // const logDto = { actionType: LogActionType.Create,  ConversationParticipantId: ConversationParticipant.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return ConversationParticipant;
  }

  async updateConversationParticipant(
    ctx: RequestContextDto,
    id: string,
    updateConversationParticipantDto: UpdateConversationParticipantDto,
  ) {
    this.logger.log(`${this.updateConversationParticipant.name} called`);

    const ConversationParticipant = await this.getConversationParticipant(
      ctx,
      id,
    );
    this.ConversationParticipantRepo.merge(
      ConversationParticipant,
      updateConversationParticipantDto,
    );
    await this.ConversationParticipantRepo.save(ConversationParticipant);
    return ConversationParticipant;
  }

  async deleteConversationParticipant(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ConversationParticipantEntity> {
    this.logger.log(`${this.deleteConversationParticipant.name} called`);

    const ConversationParticipant = await this.getConversationParticipant(
      ctx,
      id,
    );
    await this.ConversationParticipantRepo.remove(ConversationParticipant);

    return ConversationParticipant;
  }
}
