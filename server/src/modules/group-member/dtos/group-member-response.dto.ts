import { Expose } from 'class-transformer';
import { GroupMemberRoleEnum } from '../enum/group-member-role.enum';

export class GroupMembersResponseDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  userId: string;

  @Expose()
  role: GroupMemberRoleEnum;

  @Expose()
  addedBy: string;
}
