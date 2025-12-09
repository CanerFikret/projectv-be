import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class User {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  nickName: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  lastName: string | null;
}
