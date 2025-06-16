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
import { CreateGroupsDto, FilterGroupsDto, UpdateGroupsDto } from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { GroupService } from '../services/group.service';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupController {
  private logger = new Logger(GroupController.name);

  constructor(private readonly GroupService: GroupService) {}

  @Get('/')
  async getGroupss(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterGroupsDto: FilterGroupsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Groupss.`);

    console.log('ctx', ctx);

    const Groupss = await this.GroupService.getGroups(ctx, filterGroupsDto);

    return {
      success: true,
      statusCode: 200,
      Group: `List of Groupss`,
      totalRecords: Groupss.length,
      data: Groupss,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getGroups(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const Groups = await this.GroupService.getGroup(ctx, id);

    return {
      success: true,
      statusCode: 200,
      Group: `Details of Groups of id: ${id}`,
      data: Groups,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createGroups(
    @RequestContext() ctx: RequestContextDto,
    @Body() createGroupsDto: CreateGroupsDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new Groups`);

    const Groups = await this.GroupService.createGroup(ctx, createGroupsDto);

    return {
      success: true,
      statusCode: 201,
      Group: `New Groups Created`,
      data: Groups,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateGroups(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateGroupsDto: UpdateGroupsDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating Groups  of id ${id}`,
    // );

    const Groups = await this.GroupService.updateGroup(
      ctx,
      id,
      updateGroupsDto,
    );

    return {
      success: true,
      statusCode: 200,
      Group: `Groups of id: ${id} updated`,
      data: Groups,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteGroup(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a Groups  of id ${id}.`,
    // );

    const Groups = await this.GroupService.deleteGroup(ctx, id);

    return {
      success: true,
      statusCode: 200,
      Group: `Groups of id: ${id} deleted`,
      data: Groups,
    };
  }
}
