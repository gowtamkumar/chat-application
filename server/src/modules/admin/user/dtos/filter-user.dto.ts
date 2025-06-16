import { IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from '../enums';

export class FilterUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  // @IsEnum(RoleEnum)
  // @IsOptional()
  // roles: RoleEnum;

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;
}
