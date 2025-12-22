import { AuthenticationException } from '@common/exceptions/authentication.exception';
import { AccessTokenService } from '@core/auth/access-token/access-token.service';
import { AuthContext } from '@core/auth/auth.context';
import { UserService } from '@core/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly authContext: AuthContext,
    private readonly systemUserService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let accessToken: string | null = null;

    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const headers = request.headers;

      const authHeader = headers['authorization'];
      if (authHeader) {
        accessToken = authHeader.split(' ')[1];
      }
    }

    if (accessToken) {
      const accessTokenPayload =
        await this.accessTokenService.validateAccessToken(accessToken);

      this.authContext.user = await this.systemUserService.getByIdOrThrow(
        accessTokenPayload.userId,
      );
      return true;
    }
    throw new AuthenticationException();
  }
}
