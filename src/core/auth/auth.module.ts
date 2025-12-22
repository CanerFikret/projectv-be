import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password/password.service';
import { UserService } from '@core/user/user.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AccessTokenService } from './access-token/access-token.service';
import { AuthContext } from './auth.context';

@Global()
@Module({
  providers: [
    AuthService,
    PasswordService,
    RefreshTokenService,
    AccessTokenService,
    AuthContext,
  ],
  controllers: [AuthController],
  exports: [
    PasswordService,
    RefreshTokenService,
    AccessTokenService,
    AuthContext,
  ],
})
export class AuthModule {}
