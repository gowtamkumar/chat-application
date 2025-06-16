import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateScreenShareLogsDto {
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsString()
  @IsNotEmpty()
  sharerUserId: string;
}
