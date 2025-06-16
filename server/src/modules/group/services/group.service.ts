/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupsDto, FilterGroupsDto, UpdateGroupsDto } from '../dtos';
import { Repository } from 'typeorm';
import { GroupEntity } from '../entities/group.entity';

@Injectable()
export class GroupService {
  private logger = new Logger(GroupService.name);

  constructor(
    @InjectRepository(GroupEntity)
    private readonly GroupRepo: Repository<GroupEntity>,
  ) {}

  getGroups(
    ctx: RequestContextDto,
    filterGroupsDto: FilterGroupsDto,
  ): Promise<GroupEntity[]> {
    this.logger.log(`${this.getGroups.name} called`);

    const reqQuery: any = {};

    return this.GroupRepo.find({ where: reqQuery });
  }

  async getGroup(ctx: RequestContextDto, id: string): Promise<GroupEntity> {
    this.logger.log(`${this.getGroups.name} called`);

    const Group = await this.GroupRepo.findOne({ where: { id } });
    if (!Group) {
      throw new NotFoundException(`Groups of id ${id} not found.`);
    }

    return Group;
  }

  async createGroup(
    ctx: RequestContextDto,
    createGroupsDto: CreateGroupsDto,
  ): Promise<GroupEntity> {
    this.logger.log(`${this.createGroup.name} called`);

    const Group = this.GroupRepo.create(createGroupsDto);

    await this.GroupRepo.save(Group);

    return Group;
  }

  async updateGroup(
    ctx: RequestContextDto,
    id: string,
    updateGroupsDto: UpdateGroupsDto,
  ): Promise<GroupEntity> {
    this.logger.log(`${this.updateGroup.name} called`);

    const Group = await this.getGroup(ctx, id);
    this.GroupRepo.merge(Group, updateGroupsDto);

    await this.GroupRepo.save(Group);

    return Group;
  }

  async deleteGroup(ctx: RequestContextDto, id: string): Promise<GroupEntity> {
    this.logger.log(`${this.deleteGroup.name} called`);

    const Group = await this.getGroup(ctx, id);
    await this.GroupRepo.remove(Group);

    // const logDto = { actionType: LogActionType.Delete,  GroupId: Group.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Group;
  }
}
