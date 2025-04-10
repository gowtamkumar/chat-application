import { Expose } from 'class-transformer';
import { StatusEnum, RoleEnum, GenderEnum, UserTypeEnum } from '../enums';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  // @Expose()
  // password: string;

  @Expose()
  type: UserTypeEnum;

  @Expose()
  phone: string;

  @Expose()
  dob: string;

  @Expose()
  gender: GenderEnum;

  @Expose()
  point: string;

  @Expose()
  address: string;

  @Expose()
  image: string;

  @Expose()
  lastLogin: string;

  @Expose()
  lastLogout: string;

  @Expose()
  ipAddress: string;

  @Expose()
  diviceId: string;

  @Expose()
  resetToken: string;

  @Expose()
  roles: RoleEnum[];

  @Expose()
  status: StatusEnum;
}
