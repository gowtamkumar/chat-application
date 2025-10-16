import { IsString } from 'class-validator';

export class FilterNotificationDto {
  @IsString()
  userId: string;
}
