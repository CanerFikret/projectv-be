import { ApiProperty } from '@nestjs/swagger';

export class ServerGenerateInput {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string | null;
}
