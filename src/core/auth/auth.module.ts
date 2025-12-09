import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password/password.service';
import { UserService } from '@core/user/user.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AccessTokenService } from './access-token/access-token.service';

@Module({
  providers: [
    AuthService,
    PasswordService,
    UserService,
    RefreshTokenService,
    AccessTokenService,
  ],
  controllers: [AuthController],
  exports: [
    PasswordService,
    UserService,
    RefreshTokenService,
    AccessTokenService,
  ],
})
export class AuthModule {}
