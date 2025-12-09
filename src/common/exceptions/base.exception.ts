import { HttpException } from '@nestjs/common';
import { ErrorType } from './error-type.enum';

export class BaseException extends HttpException {
  code: number;

  constructor(
    error: ErrorType,
    message: string | Record<string, any>,
    httpStatusCode: number,
  ) {
    super(message, httpStatusCode);
    this.code = error;
  }
}
