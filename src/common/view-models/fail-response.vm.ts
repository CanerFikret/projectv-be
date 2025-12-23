import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Error } from '@common/view-models/error.vm';
import { ResponseStatus } from '@common/enums/response-status.enum';
import { StatusResponse } from '../view-models/status-response.vm';

export class FailResponse extends StatusResponse {
  @Expose()
  @ApiProperty()
  status = ResponseStatus.Fail;

  @Expose()
  @ApiProperty({
    required: false,
    type: Error,
    isArray: true,
  })
  error?: Error;
}
