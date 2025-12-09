import { UserDto } from '@core/user/dto/user.dto';

export class AuthLoginResultDto {
  user: UserDto;
  refreshToken: string;
  accessToken: string;
  refreshTokenExpiresIn: number;
  accessTokenExpiresIn: number;

  constructor(partial: Partial<AuthLoginResultDto>) {
    Object.assign(this, partial);
  }
}
