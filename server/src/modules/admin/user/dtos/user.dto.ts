import { Expose } from 'class-transformer';
import { GenderEnum, StatusEnum, UserTypeEnum } from '../enums';

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
  address: string;

  @Expose()
  file: string;

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

  // @Expose()
  // roles: RoleEnum[];

  @Expose()
  status: StatusEnum;
}
