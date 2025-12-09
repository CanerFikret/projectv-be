import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorType } from './error-type.enum';

export class ServiceException extends BaseException {
  constructor(
    error: ErrorType = ErrorType.GeneralError,
    message?: string,
    httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    if (!message) {
      message = ErrorType[error];
    }

    super(error, message, httpStatusCode);
  }
}
