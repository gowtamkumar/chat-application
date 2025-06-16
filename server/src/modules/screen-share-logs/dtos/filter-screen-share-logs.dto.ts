import { IsString } from 'class-validator';

export class FilterScreenShareLogsDto {
  @IsString()
  callId: string;

  @IsString()
  shareUserId: string;
}
