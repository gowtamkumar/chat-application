import { IsString } from 'class-validator';
import { GroupMemberRoleEnum } from '../enum/group-member-role.enum';

export class FilterGroupMembersDto {
  @IsString()
  conversationId: string;

  @IsString()
  userId: string;

  @IsString()
  role: GroupMemberRoleEnum;
}
