import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/services/user.service'; // Assuming this is the path
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '../../user/dtos/user.dto'; // Assuming this is the path
import { AccessTokenPayload } from '../dtos'; // Assuming this is the path to your payload type
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        // First, try to extract JWT token from Authorization header (Bearer token)
        const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        if (tokenFromHeader) {
          return tokenFromHeader; // If token is found in Authorization header, use it
        }

        // If no token in header, try to extract it from cookies
        const cookies = req.cookies || {};
        const cookieName = configService.get<string>(
          'COOKIE_NAME',
          'auth_token',
        ); // Get cookie name from env
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return cookies[cookieName] || null; // Look for 'access_token' in cookies
      },
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT token from the Authorization header
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret'), // Secret key to validate the JWT
      ignoreExpiration: false, // Set to false to ensure the JWT expiration is checked
    });
  }

  async validate(payload: AccessTokenPayload): Promise<UserDto> {
    const { sub: userId } = payload; // Extract the user ID from the token's payload
    const user = await this.userService.getUser(userId); // Fetch the user from the database

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    // Check if the user's status is inactive or blocked
    // if (user.status === StatusEnum.Inactive) {
    //   throw new UnauthorizedException('User account is inactive');
    // }

    // if (user.status === StatusEnum.Block) {
    //   throw new UnauthorizedException('User account is blocked');
    // }

    return user; // Return the user object if everything is valid
  }
}
