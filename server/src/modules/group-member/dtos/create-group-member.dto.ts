import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GroupMemberRoleEnum } from '../enum/group-member-role.enum';

export class CreateGroupMembersDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsDefined()
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
