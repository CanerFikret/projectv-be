import { JwtService } from '@common/global-services/jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import { RefreshTokenPayloadDto } from './dto/refresh-token-payload.dto';
import { JwtAlgorithm, JwtKeyId } from '@common/global-services/jwt/jwt.type';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateRefreshToken(
    tokenPayloadDto: RefreshTokenPayloadDto,
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      instanceToPlain(tokenPayloadDto),
      {
        secret: this.configService.getOrThrow<string>('JWT_KEY'),
        algorithm: JwtAlgorithm.HS256,
        keyid: JwtKeyId.V1,
        issuer: this.configService.getOrThrow<string>('API_CODE'),
        audience: [this.configService.getOrThrow<string>('API_CODE')],
        expiresIn: Number(
          this.configService.getOrThrow<number>('REFRESH_TOKEN_TTL'),
        ),
      },
    );

    return refreshToken;
  }
}
