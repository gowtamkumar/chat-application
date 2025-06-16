import { Expose } from 'class-transformer';
import { ContactStatusEnum } from '../enums/status.enum';

export class ContactResponseDto {
  @Expose()
  id: string;

  @Expose()
  senderId: string;

  @Expose()
  receiverId: string;

  @Expose()
  status: ContactStatusEnum;
}
