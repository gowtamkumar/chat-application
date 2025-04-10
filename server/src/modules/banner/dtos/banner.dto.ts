import { Expose } from 'class-transformer';
import { BannerType } from '../enums';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  type: BannerType;

  @Expose()
  url: string;

  @Expose()
  image: string;

  @Expose()
  description: string;
}
