import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserDto } from '../../user/dtos/user.dto';
import { RequestContext } from '../../../../common/decorators/current-user.decorator';
import { LoginCredentialDto, RegisterCredentialDto } from '../dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto } from '../../user/dtos';
import { ForgotPasswordDto } from '../../user/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../../user/dtos/reset-password.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/register')
  async register(
    @Body() registerCredentialDto: RegisterCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authPayload = await this.authService.register(registerCredentialDto);
    // set cookies token

    this.authService.sendCookiesResponse(authPayload.token, res);

    return {
      success: true,
      statusCode: 200,
      message: `Registration successfull`,
      data: authPayload,
    };
  }

  @Post('/login')
  async login(
    @Body() loginCredentialDto: LoginCredentialDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const authPayload = await this.authService.login(loginCredentialDto, req);
    // set cookies token
    this.authService.sendCookiesResponse(authPayload.token, res);
    // this.sendCookiesResponse(res, authPayload.token);

    return {
      success: true,
      statusCode: 200,
      message: `Login successfull`,
      data: authPayload,
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete('/logout')
  // logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  //   //revoke token
  //   Object.entries(req.cookies).forEach(([key]) => res.clearCookie(key));

  //   return {
  //     success: true,
  //     statusCode: 200,
  //     message: `Logout successfull`,
  //     data: null,
  //   };
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieName =
      this.configService.get<string>('COOKIE_NAME') || 'auth_token';

    if (req.cookies && req.cookies[cookieName]) {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
      });
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Logout successful',
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-password/:id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.authService.updatePassword(
      userId,
      updatePasswordDto,
    );
    return {
      success: true,
      statusCode: 200,
      message: `User password update successfully`,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    await this.authService.forgotPassword(req, forgotPasswordDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Mail send successful. Please check your email address',
      data: {},
    };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.authService.verifyResetToken(token);

    const user = await this.authService.resetPassword(token, resetPasswordDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Forget password successful. Please check your email address',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@RequestContext() user: UserDto) {
    return user;
  }
}
