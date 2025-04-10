import { Expose } from 'class-transformer';
import { StatusEnum } from '@admin/user/enums';

export class ColorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  status: StatusEnum;
}
