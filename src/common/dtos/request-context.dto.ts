import { UserDto } from 'src/modules/admin/user/dtos';

export class RequestContextDto {
  public requestId: string;

  public ip: string;
  // public clientIp: string;

  public protocol: string;
  public host: string;
  public url: string;

  // public userId: string;
  public user: UserDto;
}
