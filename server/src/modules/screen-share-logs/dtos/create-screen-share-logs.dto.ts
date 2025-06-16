import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateScreenShareLogsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  sharerUserId: string;
}
