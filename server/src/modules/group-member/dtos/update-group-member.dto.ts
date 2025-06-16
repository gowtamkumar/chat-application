import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GroupMemberRoleEnum } from '../enum/group-member-role.enum';

export class UpdateGroupMembersDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(GroupMemberRoleEnum)
  role: GroupMemberRoleEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  addedBy: string;
}
