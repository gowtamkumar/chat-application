/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCallParticipantsDto,
  FilterCallParticipantsDto,
  UpdateCallParticipantsDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { CallParticipantEntity } from '../entities/call-participant.entity';

@Injectable()
export class CallParticipantService {
  private logger = new Logger(CallParticipantService.name);

  constructor(
    @InjectRepository(CallParticipantEntity)
    private readonly CallParticipantRepo: Repository<CallParticipantEntity>,
  ) {}

  getCallParticipants(
    ctx: RequestContextDto,
    filterCallParticipantsDto: FilterCallParticipantsDto,
  ): Promise<CallParticipantEntity[]> {
    this.logger.log(`${this.getCallParticipants.name} CallParticipanted`);

    const reqQuery: any = {};

    return this.CallParticipantRepo.find({ where: reqQuery });
  }

  async getCallParticipant(
    ctx: RequestContextDto,
    id: string,
  ): Promise<CallParticipantEntity> {
    this.logger.log(`${this.getCallParticipants.name} CallParticipanted`);

    const CallParticipant = await this.CallParticipantRepo.findOne({
      where: { id },
    });
    if (!CallParticipant) {
      throw new NotFoundException(`CallParticipants of id ${id} not found.`);
    }

    return CallParticipant;
  }

  async createCallParticipant(
    ctx: RequestContextDto,
    createCallParticipantsDto: CreateCallParticipantsDto,
  ): Promise<CallParticipantEntity> {
    this.logger.log(`${this.createCallParticipant.name} CallParticipanted`);

    const CallParticipant = this.CallParticipantRepo.create(
      createCallParticipantsDto,
    );

    await this.CallParticipantRepo.save(CallParticipant);

    return CallParticipant;
  }

  async updateCallParticipant(
    ctx: RequestContextDto,
    id: string,
    updateCallParticipantsDto: UpdateCallParticipantsDto,
  ): Promise<CallParticipantEntity> {
    this.logger.log(`${this.updateCallParticipant.name} CallParticipanted`);

    const CallParticipant = await this.getCallParticipant(ctx, id);
    this.CallParticipantRepo.merge(CallParticipant, updateCallParticipantsDto);

    await this.CallParticipantRepo.save(CallParticipant);

    return CallParticipant;
  }

  async deleteCallParticipant(
    ctx: RequestContextDto,
    id: string,
  ): Promise<CallParticipantEntity> {
    this.logger.log(`${this.deleteCallParticipant.name} CallParticipanted`);

    const CallParticipant = await this.getCallParticipant(ctx, id);
    await this.CallParticipantRepo.remove(CallParticipant);

    // const logDto = { actionType: LogActionType.Delete,  CallParticipantId: CallParticipant.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return CallParticipant;
  }
}
