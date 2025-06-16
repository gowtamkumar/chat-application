import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum, StatusEnum, UserTypeEnum } from '../enums';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value || null)
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  dob: string;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender: GenderEnum;

  @IsEnum(UserTypeEnum)
  @IsOptional()
  type: UserTypeEnum;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  phone: string;

  // @IsEnum(RoleEnum, { each: true })
  // @IsOptional()
  // roles: RoleEnum[];

  @IsString()
  @IsOptional()
  lastLogin: string;

  @IsString()
  @IsOptional()
  lastLogout: string;

  @IsString()
  @IsOptional()
  ipAddress: string;

  @IsString()
  @IsOptional()
  diviceId: string;

  @IsString()
  @IsOptional()
  resetToken: string;

  @IsEnum(StatusEnum, { each: true })
  @IsOptional()
  status: StatusEnum;
}
