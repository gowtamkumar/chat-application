import { Expose } from 'class-transformer';
import { StatusEnum } from '@admin/user/enums';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  status: StatusEnum;
}
