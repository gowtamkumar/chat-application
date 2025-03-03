import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum, RoleEnum, StatusEnum } from '../enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  @IsDefined()
  username: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value || null)
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @IsDefined()
  password: string;

  @IsString()
  @IsOptional()
  dob: string;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender: GenderEnum;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  resetToken: string;

  @IsEnum(RoleEnum, { each: true })
  @IsOptional()
  roles: RoleEnum[];

  @IsEnum(StatusEnum, { each: true })
  @IsOptional()
  status: StatusEnum;
}
