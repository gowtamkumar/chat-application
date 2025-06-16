/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCallsDto, FilterCallsDto, UpdateCallsDto } from '../dtos';
import { Repository } from 'typeorm';
import { CallEntity } from '../entities/call.entity';

@Injectable()
export class CallService {
  private logger = new Logger(CallService.name);

  constructor(
    @InjectRepository(CallEntity)
    private readonly CallRepo: Repository<CallEntity>,
  ) {}

  getCalls(
    ctx: RequestContextDto,
    filterCallsDto: FilterCallsDto,
  ): Promise<CallEntity[]> {
    this.logger.log(`${this.getCalls.name} called`);

    const reqQuery: any = {};

    return this.CallRepo.find({ where: reqQuery });
  }

  async getCall(ctx: RequestContextDto, id: string): Promise<CallEntity> {
    this.logger.log(`${this.getCalls.name} called`);

    const Call = await this.CallRepo.findOne({ where: { id } });
    if (!Call) {
      throw new NotFoundException(`Calls of id ${id} not found.`);
    }

    return Call;
  }

  async createCall(
    ctx: RequestContextDto,
    createCallsDto: CreateCallsDto,
  ): Promise<CallEntity> {
    this.logger.log(`${this.createCall.name} called`);

    const Call = this.CallRepo.create(createCallsDto);

    await this.CallRepo.save(Call);

    return Call;
  }

  async updateCall(
    ctx: RequestContextDto,
    id: string,
    updateCallsDto: UpdateCallsDto,
  ): Promise<CallEntity> {
    this.logger.log(`${this.updateCall.name} called`);

    const Call = await this.getCall(ctx, id);
    this.CallRepo.merge(Call, updateCallsDto);

    await this.CallRepo.save(Call);

    return Call;
  }

  async deleteCall(ctx: RequestContextDto, id: string): Promise<CallEntity> {
    this.logger.log(`${this.deleteCall.name} called`);

    const Call = await this.getCall(ctx, id);
    await this.CallRepo.remove(Call);

    // const logDto = { actionType: LogActionType.Delete,  CallId: Call.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Call;
  }
}
