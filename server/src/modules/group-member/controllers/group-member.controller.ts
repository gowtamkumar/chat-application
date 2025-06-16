import { JwtAuthGuard } from '@admin/auth/guards/jwt-auth.guard';
import { RequestContextDto } from '@common/dtos/request-context.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateGroupMembersDto,
  FilterGroupMembersDto,
  UpdateGroupMembersDto,
} from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { GroupMemberService } from '../services/group-member.service';

@UseGuards(JwtAuthGuard)
@Controller('GroupMembers')
export class GroupMemberController {
  private logger = new Logger(GroupMemberController.name);

  constructor(private readonly GroupMemberService: GroupMemberService) {}

  @Get('/')
  async getGroupMemberss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterGroupMembersDto: FilterGroupMembersDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving GroupMemberss.`);

    console.log('ctx', ctx);

    const GroupMemberss = await this.GroupMemberService.getGroupMembers(
      ctx,
      filterGroupMembersDto,
    );

    return {
      success: true,
      statusCode: 200,
      GroupMember: `List of GroupMemberss`,
      totalRecords: GroupMemberss.length,
      data: GroupMemberss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getGroupMembers(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const GroupMembers = await this.GroupMemberService.getGroupMember(ctx, id);

    return {
      success: true,
      statusCode: 200,
      GroupMember: `Details of GroupMembers of id: ${id}`,
      data: GroupMembers,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createGroupMembers(
    @RequestContext() ctx: RequestContextDto,
    @Body() createGroupMembersDto: CreateGroupMembersDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new GroupMembers`);

    const GroupMembers = await this.GroupMemberService.createGroupMember(
      ctx,
      createGroupMembersDto,
    );

    return {
      success: true,
      statusCode: 201,
      GroupMember: `New GroupMembers Created`,
      data: GroupMembers,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateGroupMembers(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateGroupMembersDto: UpdateGroupMembersDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating GroupMembers  of id ${id}`,
    // );

    const GroupMembers = await this.GroupMemberService.updateGroupMember(
      ctx,
      id,
      updateGroupMembersDto,
    );

    return {
      success: true,
      statusCode: 200,
      GroupMember: `GroupMembers of id: ${id} updated`,
      data: GroupMembers,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteGroupMember(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a GroupMembers  of id ${id}.`,
    // );

    const GroupMembers = await this.GroupMemberService.deleteGroupMember(
      ctx,
      id,
    );

    return {
      success: true,
      statusCode: 200,
      GroupMember: `GroupMembers of id: ${id} deleted`,
      data: GroupMembers,
    };
  }
}
