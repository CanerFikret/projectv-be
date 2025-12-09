import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthGenerateUser {
  @Expose()
  @ApiProperty({
    example: 'Caner',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Cakir',
  })
  lastName?: string | null;

  @Expose()
  @ApiProperty({
    example: 'caner@me.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'Abc123',
  })
  password: string;

  @Expose()
  @ApiProperty({
    example: 'caner29',
  })
  nickName?: string;
}
