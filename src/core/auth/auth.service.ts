import { LoggerService } from '@common/global-services/logger/logger.service';
import {
  InjectPrisma,
  PrismaTransactionHost,
} from '@common/global-services/prisma/prisma-provider';
import { Injectable } from '@nestjs/common';
import { ServiceException } from '@common/exceptions/service.exception';
import { ErrorType } from '@common/exceptions/error-type.enum';
import { AuthGenerateUserDto } from './dto/auth-generate-user.dto';
import { PasswordService } from './password/password.service';
import { AuthLoginInputDto } from './dto/auth-login-input.dto';
import { PasswordCompareDto } from './password/dto/password-compare.dto';
import { UserService } from '@core/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '@core/user/dto/user.dto';
import { v7 as uuid7 } from 'uuid';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AuthTokenGenerateResultDto } from './dto/auth-token-generate-result.dto';
import { AccessTokenService } from './access-token/access-token.service';
import { AccessTokenPayloadDto } from './access-token/dto/auth-access-token-payload.dto';
import { RefreshTokenPayloadDto } from './refresh-token/dto/refresh-token-payload.dto';
import { AuthTokensGenerateResultDto } from './dto/auth-tokens-generate-result.dto';
import { AuthLoginResultDto } from './dto/auth-login-result.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectPrisma() private readonly txHost: PrismaTransactionHost,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  private getTokenDurations(): {
    refreshTokenDuration: number;
    accessTokenDuration: number;
  } {
    const refreshTokenDuration = Number(
      this.configService.getOrThrow('REFRESH_TOKEN_TTL'),
    );

    const accessTokenDuration = Number(
      this.configService.getOrThrow('ACCESS_TOKEN_TTL'),
    );

    return { refreshTokenDuration, accessTokenDuration };
  }

  async generateUser(generateUserDto: AuthGenerateUserDto): Promise<void> {
    const passwordStoreDto = await this.passwordService.prepareToStore(
      generateUserDto.password,
    );

    await this.txHost.tx.user
      .create({
        data: {
          name: generateUserDto.name,
          lastName: generateUserDto.lastName,
          email: generateUserDto.email,
          password: passwordStoreDto.hashedSaltedPassword,
          passwordSalt: passwordStoreDto.passwordSalt,
          nickName: generateUserDto.nickName ?? generateUserDto.name,
        },
      })
      .catch((err) => {
        this.loggerService.error(
          {
            message: 'Failed to generate address history',
            error: err,
          },
          AuthService.name,
        );
        throw new ServiceException(ErrorType.GenerateError);
      });
  }

  async login(loginInputDto: AuthLoginInputDto): Promise<AuthLoginResultDto> {
    const user = await this.userService.findUserByEmail(loginInputDto.email);

    const passwordCompareDto = new PasswordCompareDto({
      password: loginInputDto.password,
      hashedSaltedPassword: user.password,
      passwordSalt: user.passwordSalt,
    });

    const isPasswordMatch =
      await this.passwordService.compareWithStored(passwordCompareDto);
    if (!isPasswordMatch) {
      throw new ServiceException(ErrorType.ValidationError);
    }

    const { refreshTokenDuration, accessTokenDuration } =
      this.getTokenDurations();

    const generateTokensResult = await this.generateAuthTokens(user);

    const loginResultDto = new AuthLoginResultDto({
      user: user,
      accessToken: generateTokensResult.accessToken,
      accessTokenExpiresIn: accessTokenDuration,
      refreshToken: generateTokensResult.refreshToken,
      refreshTokenExpiresIn: refreshTokenDuration,
    });

    return loginResultDto;
  }

  async generateAuthTokens(
    userDto: UserDto,
  ): Promise<AuthTokensGenerateResultDto> {
    const refreshTokenResult = await this.generateRefreshToken(userDto);
    const accessTokenResult = await this.generateAccessToken(userDto);

    return new AuthTokensGenerateResultDto({
      refreshToken: refreshTokenResult.token,
      refreshTokenId: refreshTokenResult.tokenId,
      accessToken: accessTokenResult.token,
      accessTokenId: accessTokenResult.tokenId,
    });
  }

  private async generateRefreshToken(
    userDto: UserDto,
  ): Promise<AuthTokenGenerateResultDto> {
    const tokenId = uuid7();

    const tokenPayload = new RefreshTokenPayloadDto({
      tokenId: tokenId,
      userId: userDto.id,
    });
    const token =
      await this.refreshTokenService.generateRefreshToken(tokenPayload);

    return new AuthTokenGenerateResultDto({
      token: token,
      tokenId: tokenId,
    });
  }

  private async generateAccessToken(
    userDto: UserDto,
  ): Promise<AuthTokenGenerateResultDto> {
    const tokenId = uuid7();

    const tokenPayload = new AccessTokenPayloadDto({
      tokenId: tokenId,
      userId: userDto.id,
      name: userDto.name,
      nickName: userDto.nickName,
      lastName: userDto.lastName,
      email: userDto.email,
    });

    const token =
      await this.accessTokenService.generateAccessToken(tokenPayload);

    return new AuthTokenGenerateResultDto({
      token: token,
      tokenId: tokenId,
    });
  }
}
