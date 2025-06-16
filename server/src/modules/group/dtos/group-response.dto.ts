import { Expose } from 'class-transformer';

export class GroupsResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  conversationId: string;

  @Expose()
  creatorId: string;

  @Expose()
  groupIconUrl: string;

  @Expose()
  description: string;
}
