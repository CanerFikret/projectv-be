import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ServerRaw {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description?: string | null;
}
