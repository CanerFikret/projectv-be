import { JwtService } from '@common/global-services/jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import { AccessTokenPayloadDto } from './dto/auth-access-token-payload.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAlgorithm, JwtKeyId } from '@common/global-services/jwt/jwt.type';
import { instanceToPlain } from 'class-transformer';
import { LoggerService } from '@common/global-services/logger/logger.service';
import { ServiceException } from '@common/exceptions/service.exception';
import { ErrorType } from '@common/exceptions/error-type.enum';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async generateAccessToken(
    tokenPayloadDto: AccessTokenPayloadDto,
  ): Promise<string> {
    const token = this.jwtService.signAsync(instanceToPlain(tokenPayloadDto), {
      secret: this.configService.getOrThrow<string>('JWT_KEY'),
      algorithm: JwtAlgorithm.HS256,
      keyid: JwtKeyId.V1,
      issuer: this.configService.getOrThrow<string>('API_CODE'),
      audience: [this.configService.getOrThrow<string>('API_CODE')],
      expiresIn: Number(
        this.configService.getOrThrow<number>('ACCESS_TOKEN_TTL'),
      ),
    });

    return token;
  }

  async validateAccessToken(
    accessToken: string,
  ): Promise<AccessTokenPayloadDto> {
    const accessTokenData = await this.jwtService
      .verifyAsync<AccessTokenPayloadDto>(accessToken, {
        secret: this.configService.getOrThrow<string>('JWT_KEY'),
        algorithms: [JwtAlgorithm.HS256],
        issuer: this.configService.getOrThrow<string>('API_CODE'),
        audience: [this.configService.getOrThrow<string>('API_CODE')],
      })
      .catch((err) => {
        this.logger.error(
          {
            accessToken,
            message: `Access Token Error, Token Validation Failed, ${err}`,
          },
          AccessTokenService.name,
        );
        throw new ServiceException(ErrorType.JwtVerificationError);
      });

    return accessTokenData;
  }
}
