import { ApiPropertyType } from '@common/decorators/api-property-type.decorator';
import { User } from '@core/user/view-models/user.vm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResult {
  @Expose()
  @ApiPropertyType(User)
  user: User;

  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;

  @Expose()
  @ApiProperty()
  accessTokenExpiresIn: number;

  @Expose()
  @ApiProperty()
  refreshTokenExpiresIn: number;
}
