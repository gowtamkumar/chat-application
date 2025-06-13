import { Expose } from 'class-transformer';

export class MessagesResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  sender: any;
}
