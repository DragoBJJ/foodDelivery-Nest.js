import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshAuthGuard } from './refresh.guard';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() { email, password }: CreateUserDto,
    @Res() res,
  ): Promise<User> {
    const user = await this.authService.register({ email, password });
    await this.authService.setAuthTokens(res, user.id);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginUserDto, @Res() res) {
    const user = await this.authService.login({ email, password });
    await this.authService.setAuthTokens(res, user.id);
    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res() res) {
    await this.authService.tokenIsActive(
      req?.cookies?.['refresh_token'],
      req.user.refreshToken,
    );
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res) {
    await this.authService.clearAuthTokens(res, req.user.id);
    res.json({
      message: 'Logged out',
    });
  }
}
