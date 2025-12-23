import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseStatus } from '@common/enums/response-status.enum';

export class StatusResponse {
  @Expose()
  @ApiProperty()
  status: ResponseStatus;
}
