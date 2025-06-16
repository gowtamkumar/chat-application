/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateScreenShareLogsDto,
  FilterScreenShareLogsDto,
  UpdateScreenShareLogsDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { ScreenShareLogEntity } from '../entities/screen-share-logs.entity';

@Injectable()
export class ScreenShareLogService {
  private logger = new Logger(ScreenShareLogService.name);

  constructor(
    @InjectRepository(ScreenShareLogEntity)
    private readonly ScreenShareLogRepo: Repository<ScreenShareLogEntity>,
  ) {}

  getScreenShareLogs(
    ctx: RequestContextDto,
    filterScreenShareLogsDto: FilterScreenShareLogsDto,
  ): Promise<ScreenShareLogEntity[]> {
    this.logger.log(`${this.getScreenShareLogs.name} ScreenShareLoged`);

    const reqQuery: any = {};

    return this.ScreenShareLogRepo.find({ where: reqQuery });
  }

  async getScreenShareLog(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ScreenShareLogEntity> {
    this.logger.log(`${this.getScreenShareLogs.name} ScreenShareLoged`);

    const ScreenShareLog = await this.ScreenShareLogRepo.findOne({
      where: { id },
    });
    if (!ScreenShareLog) {
      throw new NotFoundException(`ScreenShareLogs of id ${id} not found.`);
    }

    return ScreenShareLog;
  }

  async createScreenShareLog(
    ctx: RequestContextDto,
    createScreenShareLogsDto: CreateScreenShareLogsDto,
  ): Promise<ScreenShareLogEntity> {
    this.logger.log(`${this.createScreenShareLog.name} ScreenShareLoged`);

    const ScreenShareLog = this.ScreenShareLogRepo.create(
      createScreenShareLogsDto,
    );

    await this.ScreenShareLogRepo.save(ScreenShareLog);

    return ScreenShareLog;
  }

  async updateScreenShareLog(
    ctx: RequestContextDto,
    id: string,
    updateScreenShareLogsDto: UpdateScreenShareLogsDto,
  ): Promise<ScreenShareLogEntity> {
    this.logger.log(`${this.updateScreenShareLog.name} ScreenShareLoged`);

    const ScreenShareLog = await this.getScreenShareLog(ctx, id);
    this.ScreenShareLogRepo.merge(ScreenShareLog, updateScreenShareLogsDto);

    await this.ScreenShareLogRepo.save(ScreenShareLog);

    return ScreenShareLog;
  }

  async deleteScreenShareLog(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ScreenShareLogEntity> {
    this.logger.log(`${this.deleteScreenShareLog.name} ScreenShareLoged`);

    const ScreenShareLog = await this.getScreenShareLog(ctx, id);
    await this.ScreenShareLogRepo.remove(ScreenShareLog);

    // const logDto = { actionType: LogActionType.Delete,  ScreenShareLogId: ScreenShareLog.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return ScreenShareLog;
  }
}
