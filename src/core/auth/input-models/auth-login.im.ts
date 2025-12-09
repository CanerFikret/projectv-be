import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthLoginInput {
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
}
