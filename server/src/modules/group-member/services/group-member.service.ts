/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateGroupMembersDto,
  FilterGroupMembersDto,
  UpdateGroupMembersDto,
} from '../dtos';
import { Repository } from 'typeorm';
import { GroupMemberEntity } from '../entities/group-member.entity';

@Injectable()
export class GroupMemberService {
  private logger = new Logger(GroupMemberService.name);

  constructor(
    @InjectRepository(GroupMemberEntity)
    private readonly GroupMemberRepo: Repository<GroupMemberEntity>,
  ) {}

  getGroupMembers(
    ctx: RequestContextDto,
    filterGroupMembersDto: FilterGroupMembersDto,
  ): Promise<GroupMemberEntity[]> {
    this.logger.log(`${this.getGroupMembers.name} called`);

    const reqQuery: any = {};

    return this.GroupMemberRepo.find({ where: reqQuery });
  }

  async getGroupMember(
    ctx: RequestContextDto,
    id: string,
  ): Promise<GroupMemberEntity> {
    this.logger.log(`${this.getGroupMembers.name} called`);

    const GroupMember = await this.GroupMemberRepo.findOne({ where: { id } });
    if (!GroupMember) {
      throw new NotFoundException(`GroupMembers of id ${id} not found.`);
    }

    return GroupMember;
  }

  async createGroupMember(
    ctx: RequestContextDto,
    createGroupMembersDto: CreateGroupMembersDto,
  ): Promise<GroupMemberEntity> {
    this.logger.log(`${this.createGroupMember.name} called`);

    const GroupMember = this.GroupMemberRepo.create(createGroupMembersDto);

    await this.GroupMemberRepo.save(GroupMember);

    return GroupMember;
  }

  async updateGroupMember(
    ctx: RequestContextDto,
    id: string,
    updateGroupMembersDto: UpdateGroupMembersDto,
  ): Promise<GroupMemberEntity> {
    this.logger.log(`${this.updateGroupMember.name} called`);

    const GroupMember = await this.getGroupMember(ctx, id);
    this.GroupMemberRepo.merge(GroupMember, updateGroupMembersDto);

    await this.GroupMemberRepo.save(GroupMember);

    return GroupMember;
  }

  async deleteGroupMember(
    ctx: RequestContextDto,
    id: string,
  ): Promise<GroupMemberEntity> {
    this.logger.log(`${this.deleteGroupMember.name} called`);

    const GroupMember = await this.getGroupMember(ctx, id);
    await this.GroupMemberRepo.remove(GroupMember);

    // const logDto = { actionType: LogActionType.Delete,  GroupMemberId: GroupMember.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return GroupMember;
  }
}
