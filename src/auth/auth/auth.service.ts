import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(
    user: Pick<CreateUserDto, 'email' | 'password'>,
  ): Promise<User> {
    return this.userService.create(user);
  }

  async login({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new BadRequestException(`User does not exist.`);
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestException(`Wrong password.`);
    }
    return user;
  }

  async validateUser({ user_id }: { user_id: number }): Promise<User> {
    return this.userService.findOne({ id: user_id });
  }

  generateTokens(payload: string): [accessToken: string, refreshToken: string] {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get<string>(
        `JWT_EXPIRATION_REFRESH_SECRET`,
      )}s`,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_TOKEN'),
    });
    return [accessToken, refreshToken];
  }

  async tokenIsActive(token: string, hash: string): Promise<boolean> {
    const tokenIsActive = await bcrypt.compare(token, hash || '');

    if (!tokenIsActive) throw new ForbiddenException();
    return tokenIsActive;
  }

  async setAuthTokens(
    res,
    payload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = this.generateTokens(payload);

    await this.userService.update(payload.user_id, {
      refreshToken: bcrypt.hasSync(refreshToken, 8),
    });
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
        expires: new Date(
          Date.now() + this.configService.get('JWT_EXPIRATION_SECRET') * 1000,
        ),
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
        expires: new Date(
          Date.now() +
            this.configService.get('JWT_EXPIRATION_REFRESH_TOKEN_SECRET') *
              1000,
        ),
      });
    return { accessToken, refreshToken };
  }
  async clearAuthTokens(res, userID) {
    await this.userService.update(userID, {
      refreshToken: null,
    });
    res.clearCookie('access_token', {
      domain: this.configService.get('DOMAIN'),
      httpOnly: true,
    });
    res.clearCookie('refresh_token', {
      domain: this.configService.get('DOMAIN'),
      httpOnly: true,
    });
  }
}
