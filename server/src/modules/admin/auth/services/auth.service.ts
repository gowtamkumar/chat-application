/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { UserService } from '../../user/services/user.service';
import { LoginCredentialDto, RegisterCredentialDto } from '../dtos';
import { ConfigService } from '@nestjs/config';
import { Response as ExpressResponse, Request } from 'express';
import { UpdatePasswordDto, UpdateUserDto } from '../../user/dtos';
import { ForgotPasswordDto } from '../../user/dtos/forgot-password.dto';
import { EmailService } from '../../../other/email/services/email.service';
import { ResetPasswordDto } from '../../user/dtos/reset-password.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerCredentialDto: RegisterCredentialDto) {
    this.logger.log(`${this.register.name} Service Called`);

    const { username } = registerCredentialDto;

    const find = await this.userService.findUserByUsername(username);

    if (find) {
      throw new ConflictException('Username already exist');
    }

    const user = await this.userService.createUser(
      registerCredentialDto as CreateUserDto,
    );

    const token = this.generateSignedJwt(user);

    return { token, user };
  }

  async login(loginCredentialsDto: LoginCredentialDto, req: Request) {
    this.logger.log(`${this.login.name} Service Called`);

    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '0.0.0.0'; // or use an empty string, depending on your use case

    const { username, password } = loginCredentialsDto;

    const user = await this.userService.findUserByUsername(username);

    const valid = user
      ? await this.userService.validateUser(user, password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('Invalid Login Credentials');
    }

    const accessToken = this.generateSignedJwt(user as UserDto);

    // user.lastLogin = new Date().toDateString();
    // user.ipAddress = ip;

    await this.userService.updateUserOther({
      ...user,
      lastLogin: new Date().toDateString(),
      ipAddress: ip,
    } as UpdateUserDto);

    return {
      user: { ...user, password: null },
      accessToken,
    };
  }

  getMe(user: UserDto) {
    this.logger.log(`${this.getMe.name} Service Called`);
    return user;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`${this.updatePassword.name} auth Service Called`);

    const user = await this.userService.updatePassword(
      userId,
      updatePasswordDto,
    );

    return user;
  }

  async forgotPassword(req: Request, updatePasswordDto: ForgotPasswordDto) {
    this.logger.log(`${this.forgotPassword.name} auth Service Called`);

    const user = await this.userService.forgotPassword(updatePasswordDto);

    const resetToken = this.getResetSignJwtToken(user);

    if (!resetToken) {
      throw new Error('Reset token not Generated');
    }

    await this.userService.updateUserOther({
      ...user,
      resetToken: resetToken,
    } as UpdateUserDto);

    const resetUrl = `${req.protocol}://${req.headers.origin}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it: ${resetUrl}`,
    };

    await this.emailService.sendEmail(mailOptions);

    return user;
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    this.logger.log(`${this.resetPassword.name} auth Service Called`);

    const user = await this.userService.resetPassword(token, resetPasswordDto);

    return user;
  }

  private generateSignedJwt(user: UserDto): string {
    const expiresIn = Number(this.configService.get<string>('JWT_EXPIRES_IN')); // Read expiration in hours

    const jwtSignOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'), // Securely fetch secret
      subject: user.id.toString(),
      expiresIn: `${expiresIn}h`, // Set expiration in hours
    };

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles,
      email: user.email,
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }

  private getResetSignJwtToken(user: UserDto): string {
    const expiresIn = Number(this.configService.get<string>('REST_EXPIRESIN')); // Read expiration in hours

    const jwtSignOptions: JwtSignOptions = {
      secret: this.configService.get<string>('RESET_SECRET'), // Securely fetch secret
      subject: user.id.toString(),
      expiresIn: `${expiresIn}m`, // Set expiration in hours
    };

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    return this.jwtService.sign(payload, jwtSignOptions);
  }

  sendCookiesResponse(token: string, res: ExpressResponse): void {
    const expiresInHours = Number(
      this.configService.get<string>('JWT_EXPIRES_IN'),
    ); // Read expiration in hours
    const maxAge = expiresInHours * 60 * 60 * 1000; // Convert to milliseconds

    const cookieOptions = {
      maxAge,
      httpOnly: true, // Prevents client-side JS access
      secure: this.configService.get<string>('NODE_ENV') === 'production', // Use secure cookies in production
      // sameSite: 'Strict', // Or 'Lax', depending on your needs
    };

    const cookieName =
      this.configService.get<string>('COOKIE_NAME') || 'auth_token';

    res.cookie(cookieName, token, cookieOptions);
  }

  verifyResetToken(token: string) {
    const secret = this.configService.get<string>('RESET_SECRET');
    if (!secret) {
      throw new Error('RESET_SECRET is not defined in environment variables');
    }

    const jwtSignOptions: JwtSignOptions = {
      secret, // Securely fetch secret
    };

    try {
      this.jwtService.verify(token, jwtSignOptions);
    } catch (error: any) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
